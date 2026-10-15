import { spawn, execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { evaluateReport, markdownReport } from './verification-report.mjs';

const git = (cwd, ...args) => execFileSync('git', ['-C', cwd, ...args], { encoding: 'utf8', timeout: 30_000, stdio: ['ignore', 'pipe', 'pipe'] }).trim();
export function snapshot(cwd) {
  return { commit: git(cwd, 'rev-parse', 'HEAD'), tree: git(cwd, 'rev-parse', 'HEAD^{tree}'), dirty: !!git(cwd, 'status', '--porcelain', '--untracked-files=no') };
}

export function cleanEnvironment(home, temp) {
  // Do not forward provider tokens, NODE_OPTIONS, app secrets or personal npm configuration.
  return { PATH: process.env.PATH, HOME: home, TMPDIR: temp, TMP: temp, TEMP: temp,
    LANG: 'en_US.UTF-8', CI: 'true', NO_COLOR: '1', npm_config_userconfig: path.join(home, 'npmrc'),
    npm_config_globalconfig: path.join(home, 'global-npmrc'), npm_config_cache: path.join(home, 'npm-cache') };
}

export async function runCommand(argv, { cwd, env, logPath, timeoutMs = 600_000, signal } = {}) {
  const fd = fs.openSync(logPath, 'w', 0o600);
  const startedAt = new Date().toISOString();
  return new Promise(resolve => {
    let timedOut = false, aborted = false, spawnError;
    const child = spawn(argv[0], argv.slice(1), { cwd, env, detached: process.platform !== 'win32', stdio: ['ignore', fd, fd] });
    const stop = () => {
      if (!child.pid) return;
      try { if (process.platform === 'win32') child.kill('SIGKILL'); else process.kill(-child.pid, 'SIGKILL'); }
      catch (error) { if (error.code !== 'ESRCH') spawnError = error.message; }
    };
    const timer = setTimeout(() => { timedOut = true; stop(); }, timeoutMs);
    const abort = () => { aborted = true; stop(); };
    signal?.addEventListener('abort', abort, { once: true });
    if (signal?.aborted) abort();
    child.on('error', error => { spawnError = error.message; });
    child.on('close', (exitCode, exitSignal) => {
      clearTimeout(timer); signal?.removeEventListener('abort', abort); stop(); fs.closeSync(fd);
      resolve({ argv, startedAt, endedAt: new Date().toISOString(), exitCode, signal: exitSignal,
        status: timedOut ? 'timed-out' : aborted ? 'interrupted' : exitCode === 0 && !spawnError ? 'passed' : 'failed',
        ...(spawnError ? { error: spawnError } : {}), log: path.basename(logPath),
        logSha256: createHash('sha256').update(fs.readFileSync(logPath)).digest('hex') });
    });
  });
}

export async function verifyRepository(source, { timeoutMs = 600_000, signal, onStep = () => {} } = {}) {
  const root = fs.realpathSync(source);
  const report = { version: 1, node: process.version, startedAt: new Date().toISOString(), steps: [], sourceUnchanged: false, cleanupComplete: false };
  const output = path.join(root, '.artifacts', 'verification', `${Date.now()}-${process.pid}`);
  fs.mkdirSync(output, { recursive: true, mode: 0o700 });
  let initial, temporary, checkout, added = false;
  try {
    if (process.platform === 'win32') throw new Error('This verifier currently supports macOS and Linux only.');
    initial = snapshot(root);
    report.testedCommit = initial.commit; report.testedTree = initial.tree;
    if (initial.dirty) throw new Error('Commit tracked changes before verification. Untracked files are excluded.');
    temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'jtd-verify-'));
    checkout = path.join(temporary, 'checkout');
    const home = path.join(temporary, 'home'); fs.mkdirSync(home);
    fs.writeFileSync(path.join(home, 'npmrc'), ''); fs.writeFileSync(path.join(home, 'global-npmrc'), '');
    git(root, 'worktree', 'add', '--quiet', '--detach', checkout, initial.commit); added = true;
    const files = git(checkout, 'ls-files', '-z').split('\0').filter(Boolean);
    if (files.some(file => /(^|\/)\.env($|\.)/.test(file))) throw new Error('Tracked environment files are not permitted in the credential-free snapshot.');
    for (const file of files) {
      const absolute = path.join(checkout, file);
      if (fs.lstatSync(absolute).isSymbolicLink()) {
        const target = fs.realpathSync(absolute);
        if (!target.startsWith(checkout + path.sep)) throw new Error('Tracked symlink escapes the snapshot.');
      }
    }
    const pkg = JSON.parse(fs.readFileSync(path.join(checkout, 'package.json'), 'utf8'));
    for (const name of ['lint', 'typecheck', 'build', 'test:checks']) {
      if (typeof pkg.scripts?.[name] !== 'string' || !pkg.scripts[name].trim()) throw new Error(`Missing required npm script: ${name}`);
    }
    if (!fs.existsSync(path.join(checkout, 'package-lock.json'))) throw new Error('A committed package-lock.json is required.');
    const steps = [ ['install', ['npm', 'ci', '--no-audit', '--no-fund']], ['lint', ['npm', 'run', 'lint']],
      ['types', ['npm', 'run', 'typecheck']], ['build', ['npm', 'run', 'build']], ['tests', ['npm', 'run', 'test:checks']] ];
    for (const [id, argv] of steps) {
      if (signal?.aborted) throw new Error('Verification interrupted.');
      onStep(id);
      if (id !== 'install' && report.steps[0].status !== 'passed') {
        report.steps.push({ id, argv, status: 'blocked', exitCode: null }); continue;
      }
      const result = await runCommand(argv, { cwd: checkout, env: cleanEnvironment(home, temporary), logPath: path.join(output, `${id}.log`), timeoutMs, signal });
      report.steps.push({ id, ...result });
      // A failed lint/type check does not hide later diagnostics. A missing build is still a failure.
    }
  } catch (error) { report.error = error.message; }
  finally {
    try {
      if (added) git(root, 'worktree', 'remove', '--force', checkout);
      if (temporary) fs.rmSync(temporary, { recursive: true, force: true });
      report.cleanupComplete = true;
    } catch { report.error = `${report.error || ''} Temporary checkout cleanup failed; inspect git worktree list.`.trim(); }
    try {
      const end = snapshot(root);
      report.sourceUnchanged = !!initial && !initial.dirty && !end.dirty && end.commit === initial.commit && end.tree === initial.tree;
    } catch { report.sourceUnchanged = false; }
    report.endedAt = new Date().toISOString();
    Object.assign(report, evaluateReport(report));
    fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify(report, null, 2) + '\n', { mode: 0o600 });
    fs.writeFileSync(path.join(output, 'report.md'), markdownReport(report), { mode: 0o600 });
  }
  return { report, output };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.length > 2) { console.error('Usage: npm run verify (no overrides).'); process.exitCode = 1; }
  else {
    const controller = new AbortController();
    const abort = () => controller.abort();
    process.once('SIGINT', abort); process.once('SIGTERM', abort);
    const result = await verifyRepository(process.cwd(), { signal: controller.signal, onStep: id => console.log(`Verifying ${id}…`) });
    process.removeListener('SIGINT', abort); process.removeListener('SIGTERM', abort);
    console.log(`${result.report.passed ? 'PASS' : 'FAIL'}: ${path.join(result.output, 'report.md')}`);
    if (!result.report.passed) console.error(result.report.failures.join('\n'));
    process.exitCode = result.report.passed ? 0 : 1;
  }
}
