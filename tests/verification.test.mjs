import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { cleanEnvironment, runCommand, snapshot, verifyRepository } from '../scripts/verify.mjs';
import { evaluateReport, REQUIRED_STEPS } from '../scripts/verification-report.mjs';

function fixture(t, { fail = false, missing = false } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'jtd-verifier-test-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const git = (...args) => execFileSync('git', ['-C', root, '-c', 'user.name=Test', '-c', 'user.email=test@example.invalid', ...args], { stdio: 'pipe', encoding: 'utf8' });
  git('init', '-q');
  const scripts = { lint: 'node check.mjs', typecheck: 'node check.mjs', build: fail ? 'node -e "process.exit(7)"' : 'node check.mjs', 'test:checks': 'node check.mjs' };
  if (missing) delete scripts.lint;
  fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify({ name: 'verification-fixture', version: '1.0.0', scripts }));
  fs.writeFileSync(path.join(root, 'package-lock.json'), JSON.stringify({ name: 'verification-fixture', version: '1.0.0', lockfileVersion: 3, packages: { '': { name: 'verification-fixture', version: '1.0.0' } } }));
  fs.writeFileSync(path.join(root, '.gitignore'), '.artifacts/\nnode_modules/\n');
  fs.writeFileSync(path.join(root, 'check.mjs'), `import fs from 'node:fs'; if(fs.existsSync('untracked-source.txt') || fs.existsSync('.env') || process.env.JTD_TEST_SECRET) process.exit(9);`);
  git('add', '.'); git('commit', '-qm', 'fixture');
  return { root, git };
}

test('reports cannot pass with missing, duplicate, failed or timed-out checks', () => {
  const report = { testedCommit: 'abc', testedTree: 'def', sourceUnchanged: true, cleanupComplete: true, steps: REQUIRED_STEPS.map(id => ({ id, status: 'passed', exitCode: 0 })) };
  assert.equal(evaluateReport(report).passed, true);
  for (const status of ['failed', 'blocked', 'skipped', 'pending', 'not-run', 'timed-out']) {
    assert.equal(evaluateReport({ ...report, steps: report.steps.map(s => s.id === 'build' ? { ...s, status } : s) }).passed, false);
  }
  assert.equal(evaluateReport({ ...report, steps: report.steps.slice(1) }).passed, false);
  assert.equal(evaluateReport({ ...report, steps: [...report.steps, report.steps[0]] }).passed, false);
  assert.equal(evaluateReport({ ...report, sourceUnchanged: false }).passed, false);
  assert.equal(evaluateReport({ ...report, cleanupComplete: false }).passed, false);
});

test('command timeouts and missing executables fail and retain logs', async t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'jtd-command-test-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const result = await runCommand([process.execPath, '-e', 'console.log("started");setInterval(()=>{},1000)'], { cwd: root, env: cleanEnvironment(root, root), logPath: path.join(root, 'timeout.log'), timeoutMs: 250 });
  assert.equal(result.status, 'timed-out'); assert.notEqual(result.exitCode, 0);
  assert.match(fs.readFileSync(path.join(root, 'timeout.log'), 'utf8'), /started/);
  assert.equal(result.logSha256.length, 64);
  const absent = await runCommand(['/does-not-exist/jtd-command'], { cwd: root, logPath: path.join(root, 'missing.log'), timeoutMs: 250 });
  assert.equal(absent.status, 'failed');
});

test('verifies committed source, excludes local files and secrets, and cleans worktree', async t => {
  const { root, git } = fixture(t);
  const before = snapshot(root);
  fs.writeFileSync(path.join(root, 'untracked-source.txt'), 'not committed');
  fs.writeFileSync(path.join(root, '.env'), 'JTD_TEST_SECRET=local');
  const old = process.env.JTD_TEST_SECRET; process.env.JTD_TEST_SECRET = 'must-not-forward';
  t.after(() => { if (old === undefined) delete process.env.JTD_TEST_SECRET; else process.env.JTD_TEST_SECRET = old; });
  const { report, output } = await verifyRepository(root);
  assert.equal(report.passed, true, JSON.stringify(report.failures));
  assert.equal(report.testedCommit, before.commit);
  assert.deepEqual(snapshot(root), before);
  assert.equal(git('worktree', 'list', '--porcelain').match(/^worktree /gm).length, 1);
  assert.equal(JSON.parse(fs.readFileSync(path.join(output, 'report.json'))).passed, true);
  assert.equal(fs.readFileSync(path.join(root, '.env'), 'utf8'), 'JTD_TEST_SECRET=local');
});

test('required command failure remains failed even when later commands pass', async t => {
  const { root, git } = fixture(t, { fail: true });
  const { report } = await verifyRepository(root);
  assert.equal(report.passed, false);
  assert.equal(report.steps.find(s => s.id === 'build').exitCode, 7);
  assert.equal(report.steps.find(s => s.id === 'tests').status, 'passed');
  assert.equal(report.cleanupComplete, true);
  assert.equal(git('worktree', 'list', '--porcelain').match(/^worktree /gm).length, 1);
});

test('dirty source and absent named scripts cannot become green', async t => {
  const { root } = fixture(t);
  fs.appendFileSync(path.join(root, 'check.mjs'), '\n// changed');
  const dirty = await verifyRepository(root);
  assert.equal(dirty.report.passed, false); assert.match(dirty.report.error, /Commit tracked/);
  assert.equal(dirty.report.steps.length, 0);
  const absent = fixture(t, { missing: true });
  const missing = await verifyRepository(absent.root);
  assert.equal(missing.report.passed, false); assert.match(missing.report.error, /Missing required npm script/);
  assert.equal(missing.report.cleanupComplete, true);
});

test('changing HEAD during a run invalidates proof without undoing that change', async t => {
  const { root, git } = fixture(t);
  const before = snapshot(root);
  const { report } = await verifyRepository(root, { onStep(id) {
    if (id === 'types') { fs.writeFileSync(path.join(root, 'new.txt'), 'new commit'); git('add', 'new.txt'); git('commit', '-qm', 'source moved'); }
  } });
  assert.equal(report.testedCommit, before.commit);
  assert.equal(report.passed, false); assert.equal(report.sourceUnchanged, false);
  assert.notEqual(snapshot(root).commit, before.commit);
  assert.equal(report.cleanupComplete, true);
});

test('failed install blocks dependent stages and still cleans up', async t => {
  const { root, git } = fixture(t);
  fs.writeFileSync(path.join(root, 'package-lock.json'), '{invalid');
  git('add', 'package-lock.json'); git('commit', '-qm', 'invalid lock');
  const { report } = await verifyRepository(root);
  assert.equal(report.passed, false);
  assert.equal(report.steps[0].status, 'failed');
  assert.ok(report.steps.slice(1).every(s => s.status === 'blocked'));
  assert.equal(report.cleanupComplete, true);
});

test('interruption cannot pass and removes the owned checkout', async t => {
  const { root, git } = fixture(t);
  const controller = new AbortController();
  const { report } = await verifyRepository(root, { signal: controller.signal, onStep() { controller.abort(); } });
  assert.equal(report.passed, false);
  assert.equal(report.steps[0].status, 'interrupted');
  assert.equal(report.cleanupComplete, true);
  assert.equal(git('worktree', 'list', '--porcelain').match(/^worktree /gm).length, 1);
});
