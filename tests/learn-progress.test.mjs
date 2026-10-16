import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { progressApi } from '../app/learn/progress-api.ts';
import { ProgressSync } from '../app/learn/progress-sync.ts';
import { emptyProgress, STORAGE_KEY } from '../app/learn/model.ts';

const state = goal => ({ ...emptyProgress(), profile: { branch: 'family', goal, minutes: '30', format: 'text', diagnostic: 'start' } });
function database() {
  const sqlite = new DatabaseSync(':memory:');
  sqlite.exec(readFileSync(new URL('../drizzle/0000_nappy_wind_dancer.sql', import.meta.url), 'utf8'));
  return { prepare(sql) { return { bind(...args) { return { async first() { return sqlite.prepare(sql).get(...args) ?? null; }, async run() { const result = sqlite.prepare(sql).run(...args); return { meta: { changes: Number(result.changes) } }; } }; } }; } };
}
function request(method = 'GET', user = 'alice', body, headers = {}) {
  return new Request('https://course.test/api/learn/progress', { method, headers: { ...(user ? { 'oai-authenticated-user-id': user, 'oai-authenticated-user-email': `${user}@example.test` } : {}), ...(method !== 'GET' ? { origin: 'https://course.test', 'content-type': 'application/json' } : {}), ...headers }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
}
const body = (userId, revision, goal) => ({ userId, revision, state: state(goal) });
const memory = () => { const data = new Map(); return { data, getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value), removeItem: key => data.delete(key) }; };
function transport(db, user = 'alice') { return async (_url, init = {}) => progressApi(request(init.method || 'GET', user, init.body ? JSON.parse(init.body) : undefined), db); }

test('progress API denies anonymous, email-only, cross-origin and changed-account writes', async () => {
  const db = database();
  assert.equal((await progressApi(request('GET', null), db)).status, 401);
  assert.equal((await progressApi(request('GET', null, undefined, { 'oai-authenticated-user-email': 'a@test' }), db)).status, 401);
  assert.equal((await progressApi(request('PUT', 'alice', body('alice', 0, 'Test'), { origin: 'https://evil.test' }), db)).status, 403);
  assert.equal((await progressApi(request('PUT', 'alice', body('bob', 0, 'Test')), db)).status, 409);
});
test('two learners with independent records cannot select or overwrite each other', async () => {
  const db = database();
  assert.equal((await progressApi(request('PUT', 'alice', body('alice', 0, 'Alice project')), db)).status, 200);
  const bob = await (await progressApi(request('GET', 'bob'), db)).json();
  assert.equal(bob.state.profile, null);
  assert.equal((await progressApi(request('PUT', 'bob', body('bob', 0, 'Bob project')), db)).status, 200);
  const aliceResponse = await progressApi(request('GET', 'alice'), db);
  assert.equal(aliceResponse.headers.get('cache-control'), 'private, no-store');
  assert.equal((await aliceResponse.json()).state.profile.goal, 'Alice project');
});
test('stale writes and stale drafts after erasure cannot overwrite current progress', async () => {
  const db = database();
  await progressApi(request('PUT', 'alice', body('alice', 0, 'First')), db);
  assert.equal((await progressApi(request('PUT', 'alice', body('alice', 0, 'Stale')), db)).status, 409);
  assert.equal((await progressApi(request('DELETE', 'alice', { userId: 'alice', revision: 1 }), db)).status, 200);
  assert.equal((await progressApi(request('PUT', 'alice', body('alice', 1, 'Resurrect')), db)).status, 409);
  const saved = await (await progressApi(request('GET', 'alice'), db)).json();
  assert.equal(saved.state.profile, null); assert.equal(saved.revision, 2);
});
test('invalid and oversized progress is rejected without changing existing records', async () => {
  const db = database();
  assert.equal((await progressApi(request('PUT', 'alice', { userId: 'alice', revision: 0, state: {} }), db)).status, 400);
  assert.equal((await progressApi(request('PUT', 'alice', body('alice', -1, 'Bad')), db)).status, 400);
  assert.equal((await progressApi(request('PUT', 'alice', body('alice', 0, 'x'.repeat(260000))), db)).status, 413);
  assert.equal((await progressApi(request('GET', 'alice'))).status, 503);
  assert.equal((await (await progressApi(request('GET', 'alice'), db)).json()).revision, 0);
});
test('account saves restore without JSON on a second device; guest drafts require a choice', async () => {
  const db = database(), storage = memory(); storage.setItem(STORAGE_KEY, JSON.stringify(state('Guest work')));
  const one = new ProgressSync(storage, transport(db), () => {}); await one.start();
  assert.equal(one.view.state.profile, null); assert.equal(one.view.guest.profile.goal, 'Guest work');
  one.importGuest(); await one.flush();
  const two = new ProgressSync(memory(), transport(db), () => {}); await two.start();
  assert.equal(two.view.state.profile.goal, 'Guest work'); assert.equal(two.view.pending, false);
  one.stop(); two.stop();
});
test('offline draft survives reload and recovers when connection returns', async () => {
  const db = database(), storage = memory(); let offline = false;
  const fetcher = async (...args) => { if (offline) throw new Error('offline'); return transport(db)(...args); };
  const one = new ProgressSync(storage, fetcher, () => {}); await one.start(); offline = true;
  one.update(state('Offline draft')); await one.flush(); assert.equal(one.view.pending, true); one.stop();
  offline = false; const two = new ProgressSync(storage, fetcher, () => {}); await two.start();
  assert.equal(two.view.state.profile.goal, 'Offline draft'); assert.equal(two.view.pending, false); two.stop();
});
test('conflicts preserve both versions and require explicit resolution', async () => {
  const db = database(); const one = new ProgressSync(memory(), transport(db), () => {}); const two = new ProgressSync(memory(), transport(db), () => {});
  await one.start(); await two.start(); one.update(state('Newer account')); await one.flush();
  two.update(state('Device draft')); await two.flush();
  assert.equal(two.view.conflict.state.profile.goal, 'Newer account'); assert.equal(two.view.state.profile.goal, 'Device draft');
  two.resolve(false); assert.equal(two.view.state.profile.goal, 'Newer account'); assert.equal(two.view.pending, false);
  one.stop(); two.stop();
});
test('edits made during an in-flight save are eventually persisted', async () => {
  const db = database(); let release; let started;
  const began = new Promise(resolve => { started = resolve; }); let count = 0;
  const fetcher = async (...args) => { if (args[1]?.method === 'PUT' && count++ === 0) { started(); await new Promise(resolve => { release = resolve; }); } return transport(db)(...args); };
  const sync = new ProgressSync(memory(), fetcher, () => {}); await sync.start();
  sync.update(state('First')); const saving = sync.flush(); await began; sync.update(state('Latest')); release(); await saving;
  // Wait for the serialized second write, not the debounce clock.
  for (let i = 0; i < 20 && sync.view.pending; i++) await new Promise(resolve => setImmediate(resolve));
  assert.equal((await (await progressApi(request(), db)).json()).state.profile.goal, 'Latest'); sync.stop();
});
test('unreadable account draft and failed initial load never overwrite local data', async () => {
  const storage = memory(); const key = `${STORAGE_KEY}:account:alice`; storage.setItem(key, '{broken');
  const sync = new ProgressSync(storage, transport(database()), () => {}); await sync.start();
  assert.equal(sync.view.blocked, true); sync.update(state('Overwrite')); assert.equal(storage.getItem(key), '{broken'); sync.stop();
  const failed = new ProgressSync(storage, async () => { throw new Error(); }, () => {}); await failed.start();
  assert.equal(failed.view.ready, false); assert.equal(storage.getItem(key), '{broken'); failed.stop();
});
test('session expiry and account switching preserve drafts and block further writes', async () => {
  for (const changed of [false, true]) {
    const db = database(), storage = memory(); let expire = false;
    const fetcher = async (...args) => {
      if (expire && args[1]?.method === 'PUT') return Response.json(changed ? { accountChanged: true } : {}, { status: changed ? 409 : 401 });
      return transport(db)(...args);
    };
    const sync = new ProgressSync(storage, fetcher, () => {}); await sync.start(); expire = true;
    sync.update(state('Preserved after expiry')); await sync.flush();
    assert.equal(sync.view.blocked, true); assert.equal(sync.view.pending, true);
    assert.equal(JSON.parse(storage.getItem(`${STORAGE_KEY}:account:alice`)).state.profile.goal, 'Preserved after expiry');
    sync.update(state('Must not replace')); assert.equal(sync.view.state.profile.goal, 'Preserved after expiry'); sync.stop();
  }
});
test('account saving still works when the browser denies device storage', async () => {
  const storage = { getItem() { throw new Error('denied'); }, setItem() { throw new Error('denied'); }, removeItem() {} };
  const db = database(); const sync = new ProgressSync(storage, transport(db), () => {}); await sync.start();
  assert.equal(sync.view.blocked, false); sync.update(state('Account only')); await sync.flush();
  assert.equal(sync.view.pending, false); assert.equal((await (await progressApi(request(), db)).json()).state.profile.goal, 'Account only'); sync.stop();
});
