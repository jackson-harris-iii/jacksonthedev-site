'use client';

import { useEffect, useRef, useState } from 'react';
import { canCheck, catalog, coachingPrompt, emptyProgress, parseExport, project, STORAGE_KEY, type Branch, type Evidence, type Profile, type Progress } from './model';
import styles from './learn.module.css';

const defaultProfile: Profile = { branch: 'family', goal: '', minutes: '30', format: 'text', diagnostic: 'start' };

export default function LearningCompanion() {
  const [state, setState] = useState<Progress>(emptyProgress);
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [ready, setReady] = useState(false);
  const [storageFailed, setStorageFailed] = useState(false);
  const [message, setMessage] = useState('');
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const [portable, setPortable] = useState('');
  const [pending, setPending] = useState<{ state: Progress; label: string } | null>(null);
  const [copyMessage, setCopyMessage] = useState('');
  const projectTitle = useRef<HTMLHeadingElement>(null);
  const lessonTitle = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    let active = true;
    // Load after hydration; never overwrite unreadable saved data on mount.
    Promise.resolve().then(() => {
      if (!active) return;
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) { const restored = parseExport(saved); setState(restored); if (restored.profile) setProfile(restored.profile); }
      } catch { setStorageFailed(true); setMessage('Saved progress could not be read. It has not been overwritten. Restore a backup or erase local progress to start over.'); }
      setReady(true);
    });
    return () => { active = false; };
  }, []);

  function commit(next: Progress) {
    setState(next);
    if (storageFailed) { setMessage('Working in memory. Export before closing; existing browser data is preserved.'); return; }
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); setMessage('Saved in this browser. Export to keep a portable backup.'); }
    catch { setStorageFailed(true); setMessage('Browser storage is unavailable. Export before closing.'); }
  }
  function replace(next: Progress) {
    setStorageFailed(false);
    setState(next); setProfile(next.profile || defaultProfile); setCurrent(0); setAnswer(null); setFeedback(''); setPortable(''); setPending(null);
    try { if (!next.profile) localStorage.removeItem(STORAGE_KEY); else localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); setMessage(next.profile ? 'Progress restored or project updated.' : 'Local course progress erased.'); }
    catch { setStorageFailed(true); setMessage('Could not update browser storage. Export your work; clear this site’s browser data if you want to erase it.'); }
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
    try { setPending({ state: parseExport(text), label: 'Replace this browser’s course progress with the imported export? Export your current work first if needed.' }); }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Could not read that export.'); }
  }

  return <div id="learning">
    {pending && <section className={styles.confirmation} role="alertdialog" aria-label="Confirm progress replacement"><p>{pending.label}</p><button onClick={() => replace(pending.state)}>Confirm replacement or erase</button><button className={styles.secondary} onClick={() => setPending(null)}>Keep current progress</button></section>}
    <section className={styles.panel}><h2>Start with your world</h2><p>Use a fictional or low-stakes example. Your answers stay in this browser unless you choose to export or share them.</p>
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
    <section className={styles.panel}><h2>Keep your progress</h2><p>Browser data can be cleared. Export a backup to continue on another device or move from the earlier pilot. Imported checkpoints remain self-checked.</p><div className={styles.actions}><button onClick={exportProgress} disabled={!ready}>Export my progress</button><button className={styles.secondary} disabled={!ready} onClick={() => setPending({ state: emptyProgress(), label: 'Erase this browser’s course progress? Export it first if you want a backup.' })}>Erase local progress</button></div><p role="status">{message}</p>
      <details open={!!portable}><summary>Copy or paste a progress export</summary><label>Progress JSON<textarea className={styles.code} rows={7} value={portable} maxLength={1000000} onChange={e => setPortable(e.target.value)} /></label><button className={styles.secondary} onClick={() => restore(portable)}>Restore pasted progress</button></details>
      <label>Or restore a progress file<input type="file" accept=".json,application/json" onChange={async e => { const file = e.target.files?.[0]; if (!file) return; e.target.value = ''; if (file.size > 1000000) { setMessage('Choose a file under 1 MB.'); return; } try { restore(await file.text()); } catch { setMessage('Could not read that file.'); } }} /></label>
    </section>
    <noscript><p>The project companion needs JavaScript. You can still read the <a href="/learn/RESOURCES.md">resource guide</a> and download the <a href="/learn/learn-by-building.md">coaching skill</a>.</p></noscript>
  </div>;
}
