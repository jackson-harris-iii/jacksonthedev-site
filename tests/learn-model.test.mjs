import test from 'node:test';
import assert from 'node:assert/strict';
import { canCheck, catalog, coachingPrompt, emptyProgress, parseExport, parseProgress, project } from '../app/learn/model.ts';

const profile = {branch:'work',goal:'Find exceptions',minutes:'15',format:'try',diagnostic:'evidence'};
test('restores pilot v1 without upgrading self-checks to reviewed competence', () => {
  const old = {version:1,profile,progress:{context:{status:'self-checked',evidence:'Checked invented input',explanation:'Kept work data outside',date:'2026-10-02'}}};
  const result = parseProgress(old);
  assert.equal(result.version,2);
  assert.deepEqual(result.progress,old.progress);
  assert.deepEqual(parseExport(JSON.stringify(result)),result);
});
test('draft notes survive export before passing a quiz', () => {
  const state = {...emptyProgress(),profile,progress:{verify:{status:'attempted',evidence:'Still investigating',explanation:'',date:'2026-10-02'}}};
  assert.deepEqual(parseExport(JSON.stringify(state)),state);
  assert.deepEqual(parseExport(JSON.stringify(emptyProgress())),emptyProgress());
});
test('invalid imports cannot silently discard or invent evidence', () => {
  for (const value of [null,{version:3,progress:{}},{version:2,profile:{...profile,branch:'__proto__'},progress:{}},{version:2,profile,progress:{future:{status:'attempted',evidence:'',explanation:''}}},{version:2,profile,progress:{spec:{status:'certified',evidence:'claim',explanation:'claim'}}}]) assert.throws(()=>parseProgress(value));
  assert.throws(()=>parseExport('a'.repeat(1000001)));
});
test('completion needs the right answer and evidence; all branches have independent checks', () => {
  assert.equal(canCheck(0,null,'Long enough evidence','Long enough explanation'),false);
  assert.equal(canCheck(0,1,'',''),false);
  assert.equal(canCheck(0,1,'Long enough evidence','Long enough explanation'),true);
  assert.equal(canCheck(-1,1,'Long enough evidence','Long enough explanation'),false);
  assert.equal(new Set(Object.values(catalog.branches).map(b=>b.input)).size,4);
});
test('routing and coaching retain the learner goal and current evidence', () => {
  assert.match(project(profile).session,/specification/);
  assert.match(project(profile).delivery,/Attempt/);
  const prompt=coachingPrompt(profile,2,{status:'attempted',evidence:'Duplicate found',explanation:'Compared unique IDs',date:''});
  assert.match(prompt,/Find exceptions/);
  assert.match(prompt,/Duplicate found/);
  assert.match(prompt,/Catch a mistake/);
});
