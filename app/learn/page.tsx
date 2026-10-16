import type { Metadata } from 'next';
import Link from 'next/link';
import LearningCompanion from './LearningCompanion';
import styles from './learn.module.css';

export const metadata: Metadata = {
  title: 'Learn by building — JacksonTheDev',
  description: 'A free, project-based introduction to using AI: define a useful outcome, build a small version, and learn how to check it.',
  alternates: { canonical: '/learn' },
  openGraph: { title: 'Learn by building — JacksonTheDev', description: 'Build something you care about. Learn to use AI through small projects you can explain.', url: '/learn' },
};

export default function LearnPage() {
  return <main className={styles.root}>
    <a className={styles.skip} href="#learning">Skip to learning companion</a>
    <header className={styles.header}><Link href="/">JACKSONTHEDEV</Link><span>HUMAN IN THE LOOP</span><Link href="/">Back to the site</Link></header>
    <div className={styles.shell}>
      <section className={styles.hero}><p className={styles.eyebrow}>FREE COURSE / FIRST RELEASE</p><h1>Build something<br />you care about.</h1><p className={styles.lede}>A little context. A small project. A way to check it.<br />Learn to use AI by doing work you can explain.</p><p>Six lessons. Your own pace. No leaderboard.</p></section>
      <LearningCompanion />
      <section className={styles.panel}><h2>A shared trunk. Your own branch.</h2><p className={styles.trunk}>Context → Spec → Check → Reuse</p><div className={styles.columns}><p>Home & play<br /><small>Useful personal experiments</small></p><p>Work & products<br /><small>Reviewable drafts and prototypes</small></p><p>Engineering<br /><small>Tests, review, bounded automation</small></p></div><p>Start with something you care about. These are possible branches, not a ranking. Shared learning paths and conversational tutoring are planned features.</p></section>
      <footer className={styles.footer}><p><a href="/learn/learn-by-building.md" download>Download the coaching skill</a> · <a href="/learn/RESOURCES.md">Resource review notes</a> · <a href="https://salience.solutions/">Salience</a></p><p>The course is free. External AI tools may have their own account requirements and costs. Salience is a separate company reference.</p></footer>
    </div>
  </main>;
}
