'use client';

import { useRef, useState } from 'react';
import { canCheck, catalog, coachingPrompt, emptyProgress, parseExport, project, type Branch, type Evidence, type Profile, type Progress } from './model';
import styles from './learn.module.css';
import { useProgress } from './use-progress';

const defaultProfile: Profile = { branch: 'family', goal: '', minutes: '30', format: 'text', diagnostic: 'start' };

export default function LearningCompanion() {
  const sync = useProgress();
  const state = sync.state;
  const ready = sync.ready && !sync.blocked && !sync.conflict;
  const [profileDraft, setProfileDraft] = useState<{ base: Profile | null; value: Profile } | null>(null);
  const profile = profileDraft?.base === state.profile ? profileDraft.value : state.profile || defaultProfile;
  const setProfile = (value: Profile) => setProfileDraft({ base: state.profile, value });
  const [message, setMessage] = useState('');
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const [portable, setPortable] = useState('');
  const [pending, setPending] = useState<{ state: Progress; label: string } | null>(null);
  const [copyMessage, setCopyMessage] = useState('');
  const projectTitle = useRef<HTMLHeadingElement>(null);
  const lessonTitle = useRef<HTMLHeadingElement>(null);

  function commit(next: Progress) { sync.update(next); }
  function replace(next: Progress) {
    sync.update(next); sync.dismissGuest(); setProfile(next.profile || defaultProfile); setCurrent(0); setAnswer(null); setFeedback(''); setPortable(''); setPending(null);
  }
  function begin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextProfile = { ...profile, goal: profile.goal.trim() };
    if (!nextProfile.goal) return;
    if (state.profile && (state.profile.goal !== nextProfile.goal || state.profile.branch !== nextProfile.branch)) {
      setPending({ state: { ...emptyProgress(), profile: nextProfile }, label: 'Changing the project clears its current evidence. Export it first if you want to keep it.' }); return;
    }
    commit({ ...state, profile: nextProfile });
    requestAnimationFrame(() => projectTitle.current?.focus());
  }
  const lesson = catalog.lessons[current];
  const record = state.progress[lesson.id];
  const evidence = record?.evidence || '', explanation = record?.explanation || '';
  const p = state.profile ? project(state.profile) : null;
  const resource = catalog.resources[lesson.source as keyof typeof catalog.resources];
  const count = Object.values(state.progress).filter(item => item.status === 'self-checked').length;

  function note(field: 'evidence' | 'explanation', value: string) {
    const next: Evidence = { status: 'attempted', evidence, explanation, date: new Date().toISOString(), [field]: value };
    commit({ ...state, progress: { ...state.progress, [lesson.id]: next } });
  }
  function check() {
    if (!canCheck(current, answer, evidence, explanation)) { setFeedback('Answer the check correctly and add a concrete evidence note and explanation (at least 12 characters each). Length is not a measure of understanding.'); return; }
    commit({ ...state, progress: { ...state.progress, [lesson.id]: { status: 'self-checked', evidence, explanation, date: new Date().toISOString() } } });
    setFeedback('Saved as self-checked. Ask a reviewer to inspect your reasoning; this app has not graded it.');
  }
  function exportProgress() {
    const text = JSON.stringify(state, null, 2); setPortable(text);
    const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = 'my-learning-progress.json'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage('Export ready in the copy/paste box. A file download was also requested. Review before sharing.');
  }
  function restore(text: string) {
    try { setPending({ state: parseExport(text), label: 'Replace your current course progress with the imported export? Export your current work first if needed.' }); }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Could not read that export.'); }
  }

  return <div id="learning">
    <section className={styles.panel} aria-label="Account and saved progress"><h2>Pick up where you left off</h2>
      {sync.user ? <><p>Signed in as {sync.user.label}. Your project and evidence notes save privately to your account.</p><a href="/signout-with-chatgpt?return_to=%2Flearn" target="_top" onClick={e => { if (sync.pending) { e.preventDefault(); setMessage('Wait for your account save, or export your draft before signing out.'); } }}>Sign out</a></> : <><p>Try the course on this device, or sign in to keep your progress across devices.</p><a href="/signin-with-chatgpt?return_to=%2Flearn" target="_top">Continue with ChatGPT</a><p className={styles.subtle}>Use your Google/Gmail account by choosing “Continue with Google” in the ChatGPT sign-in flow. This uses a ChatGPT account.</p></>}
      <p role="status">{sync.message}</p>
      {(!sync.ready || sync.pending) && !sync.conflict && <button className={styles.secondary} onClick={() => void sync.retry()}>Retry connection / save</button>}
      {sync.blocked && <p><a href="/learn">Reload account</a> · <a href="/signin-with-chatgpt?return_to=%2Flearn" target="_top">Sign in again</a></p>}
      {sync.conflict && <div role="alert"><p>Both versions are preserved until you choose. Export your current draft first if you want to keep both. Choosing the draft replaces the account version; choosing the account replaces this device’s draft.</p><button onClick={() => sync.resolve(false)}>Use account progress</button><button className={styles.secondary} onClick={() => sync.resolve(true)}>Keep this device’s draft</button></div>}
      {sync.guest && ready && <div><p>This device also has earlier guest progress. You can copy it into this account, replacing the current project. Export first if needed.</p><button onClick={() => setPending({ state: sync.guest!, label: 'Copy this device’s guest progress into your account? This replaces your current account project and evidence.' })}>Use earlier guest progress</button><button className={styles.secondary} onClick={sync.dismissGuest}>Keep account progress</button></div>}
    </section>
    <fieldset disabled={!ready} className={styles.editor}>
    {pending && <section className={styles.confirmation} role="alertdialog" aria-label="Confirm progress replacement"><p>{pending.label}</p><button onClick={() => replace(pending.state)}>Confirm replacement or erase</button><button className={styles.secondary} onClick={() => setPending(null)}>Keep current progress</button></section>}
    <section className={styles.panel}><h2>Start with your world</h2><p>Use a fictional or low-stakes example. When signed in, your project and notes are stored in your private account. As a guest, they stay on this device. Nothing is sent to an AI model. Avoid sensitive information.</p>
      <form onSubmit={begin}><fieldset disabled={!ready} className={styles.intake}>
        <label>What interests you?<select value={profile.branch} onChange={e => setProfile({ ...profile, branch: e.target.value as Branch })}>{Object.entries(catalog.branches).map(([id, branch]) => <option key={id} value={id}>{branch.label}</option>)}</select></label>
        <label>What would you like to make or understand?<textarea required maxLength={500} value={profile.goal} onChange={e => setProfile({ ...profile, goal: e.target.value })} placeholder="For example: a small game with rules I can test." /></label>
        <div className={styles.columns}><label>Time for this session<select value={profile.minutes} onChange={e => setProfile({ ...profile, minutes: e.target.value })}><option value="15">15 minutes</option><option value="30">30 minutes</option><option value="60">60 minutes</option></select></label><label>How would you like to start?<select value={profile.format} onChange={e => setProfile({ ...profile, format: e.target.value })}><option value="text">Read a short explanation</option><option value="video">Watch a video segment</option><option value="try">Try it, then get help</option></select></label></div>
        <label>What can you already demonstrate?<select value={profile.diagnostic} onChange={e => setProfile({ ...profile, diagnostic: e.target.value })}><option value="start">I’m starting, or I’m not sure yet</option><option value="evidence">I can show an artifact and an independent check</option></select></label>
        <button type="submit">Make my project starter →</button>
      </fieldset></form><p className={styles.subtle}>This release uses project templates. It doesn’t call an AI model or grade written answers.</p>
    </section>
    {p && state.profile && <>
      <section className={styles.panel}><p className={styles.eyebrow}>YOUR PRACTICE PROJECT</p><h2 ref={projectTitle} tabIndex={-1}>{p.title}</h2><p>Your objective: {p.goal}</p><p>{p.input}</p><ul>{p.checks.map(item => <li key={item}>{item}</li>)}</ul><p>{p.session}</p><p>{p.delivery}</p><p>{p.route}</p>
        {state.profile.branch === 'work' && <p>Start with the invented <a href="/learn/examples/orders.csv" download>orders CSV</a> and <a href="/learn/examples/payments.csv" download>payments CSV</a>. <a href="/learn/examples/RECONCILIATION.md">Exercise and answer key</a>.</p>}
      </section>
      <div className={styles.workspace}><nav className={styles.panel} aria-label="Course lessons"><h2>Your path</h2><p>{count} of {catalog.lessons.length} checkpoints self-checked</p>{catalog.lessons.map((item, index) => <button key={item.id} className={styles.lessonButton} aria-current={current === index ? 'step' : undefined} onClick={() => { setCurrent(index); setAnswer(null); setFeedback(''); requestAnimationFrame(() => lessonTitle.current?.focus()); }}>{state.progress[item.id]?.status === 'self-checked' ? '✓ ' : ''}{index}. {item.title}</button>)}<p className={styles.subtle}>Evidence notes save as drafts while you type. Self-checked is not certification.</p></nav>
        <article className={styles.panel}><p className={styles.eyebrow}>LESSON {current} / {lesson.minutes} MINUTES</p><h2 ref={lessonTitle} tabIndex={-1}>{lesson.title}</h2><p>{lesson.idea}</p><p><a href={resource[1]} target="_blank" rel="noreferrer">{resource[0]} ↗</a></p><p className={styles.subtle}>{lesson.segment}</p><h3>Make one small attempt</h3><p>{lesson.task}</p>
          <fieldset className={styles.quiz}><legend>{lesson.question}</legend>{lesson.answers.map((text, index) => <label key={text}><input type="radio" name="answer" checked={answer === index} onChange={() => { setAnswer(index); setFeedback(''); }} />{text}</label>)}</fieldset>
          <button className={styles.secondary} onClick={() => setFeedback(answer === null ? 'Choose an answer first.' : `${answer === lesson.correct ? 'That’s right.' : 'Try again.'} ${lesson.feedback}`)}>Check my answer</button>
          <label>What did you make, and what evidence did you check?<textarea maxLength={10000} value={evidence} onChange={e => note('evidence', e.target.value)} placeholder="Describe the artifact and the actual result. Don’t include sensitive data." /></label>
          <label>{lesson.explain}<textarea maxLength={10000} value={explanation} onChange={e => note('explanation', e.target.value)} /></label><h3>Try a changed example</h3><p>{p.transfer}</p><p className={styles.subtle}>Include the changed example in your notes. Come back later and explain the idea without looking.</p><button onClick={check}>Save as self-checked</button><p role="status">{feedback}</p>
        </article>
      </div>
      <section className={styles.panel}><h2>Continue with your assistant</h2><p>Copy this prompt into your chosen assistant for back-and-forth coaching. Review what you share.</p><textarea className={styles.code} rows={12} readOnly aria-label="Coaching prompt" value={coachingPrompt(state.profile, current, record)} /><button className={styles.secondary} onClick={async () => { try { await navigator.clipboard.writeText(coachingPrompt(state.profile!, current, record)); setCopyMessage('Copied. Review before sharing.'); } catch { setCopyMessage('Select the prompt above and copy it with your keyboard.'); } }}>Copy coaching prompt</button><p role="status">{copyMessage}</p></section>
    </>}
    </fieldset>
    <section className={styles.panel}><h2>Keep your progress</h2><p>Sign in on another device to resume automatically. Exports are optional backups and still work with the earlier pilot. Imported checkpoints remain self-checked. Erasing progress clears the account project and notes when signed in; older drafts on other devices will require a choice before saving again.</p><div className={styles.actions}><button onClick={exportProgress} disabled={!sync.ready}>Export my progress</button><button className={styles.secondary} disabled={!ready} onClick={() => setPending({ state: emptyProgress(), label: sync.user ? 'Erase your account project and evidence notes? This clears saved progress across devices. Export first if you want a backup.' : 'Erase this device’s course progress? Export first if you want a backup.' })}>{sync.user ? 'Erase account progress' : 'Erase device progress'}</button></div><p role="status">{message}</p>
      <details open={!!portable}><summary>Copy or paste a progress export</summary><label>Progress JSON<textarea className={styles.code} rows={7} value={portable} maxLength={1000000} onChange={e => setPortable(e.target.value)} /></label><button className={styles.secondary} disabled={!ready} onClick={() => restore(portable)}>Restore pasted progress</button></details>
      <label>Or restore a progress file<input type="file" disabled={!ready} accept=".json,application/json" onChange={async e => { const file = e.target.files?.[0]; if (!file) return; e.target.value = ''; if (file.size > 1000000) { setMessage('Choose a file under 1 MB.'); return; } try { restore(await file.text()); } catch { setMessage('Could not read that file.'); } }} /></label>
    </section>
    <noscript><p>The project companion needs JavaScript. You can still read the <a href="/learn/RESOURCES.md">resource guide</a> and download the <a href="/learn/learn-by-building.md">coaching skill</a>.</p></noscript>
  </div>;
}
