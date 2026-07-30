"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./concepts.module.css";

type ConceptKey = "selfrow" | "peacock" | "california";

const concepts: Array<{ key: ConceptKey; number: string; name: string }> = [
  { key: "selfrow", number: "01", name: "Selfrow Editorial" },
  { key: "peacock", number: "02", name: "Peacock Atelier" },
  { key: "california", number: "03", name: "California Circuit" },
];

const workflows = [
  ["Calls", "Follow-up"],
  ["Knowledge", "Business memory"],
  ["Meetings", "Decisions + action"],
  ["Expertise", "Capacity"],
];

function StanHandoff({ variant }: { variant: ConceptKey }) {
  return (
    <section className={styles.stanHandoff} id={`${variant}-stan-handoff`}>
      <p>STAN HANDOFF</p>
      <h2>Your site earns the trust. Stan closes the loop.</h2>
      <span>
        The selected concept will route this button to your real Brain-to-System
        Audit booking, course, or lead magnet inside Stan.
      </span>
    </section>
  );
}

function SelfrowConcept() {
  return (
    <article className={`${styles.concept} ${styles.selfrow}`}>
      <header className={styles.selfrowHeader}>
        <Link href="/" aria-label="JacksonTheDev home" className={styles.wordmark}>
          JACKSON<span>THEDEV</span>
        </Link>
        <nav aria-label="Concept navigation">
          <a href="#selfrow-method">Method</a>
          <a href="https://selfrow-blog-sable.vercel.app" target="_blank" rel="noreferrer">
            Writing ↗
          </a>
          <a href="#selfrow-stan-handoff">Book</a>
        </nav>
      </header>

      <section className={styles.selfrowHero}>
        <aside className={styles.selfrowRail} aria-label="Concept character">
          <span>SELFROW / 2018—NOW</span>
          <strong>Founder knowledge, put to work.</strong>
          <div className={styles.selfrowSwatches} aria-label="Selfrow color palette">
            <i />
            <i />
            <i />
            <i />
          </div>
        </aside>
        <div className={styles.selfrowLead}>
          <p className={styles.selfrowKicker}>PRACTICAL AI SYSTEMS · SACRAMENTO, CA</p>
          <h1>
            Turn what’s in your head into systems your business can <em>use.</em>
          </h1>
          <p className={styles.selfrowIntro}>
            I help expert-led businesses turn calls, content, documents, and
            repeated decisions into useful AI systems—without losing the human
            judgment that made the business valuable.
          </p>
          <div className={styles.selfrowActions}>
            <a href="#selfrow-stan-handoff">Book a Brain-to-System Audit</a>
            <a href="#selfrow-method">Read the method ↓</a>
          </div>
        </div>
      </section>

      <section className={styles.selfrowMethod} id="selfrow-method">
        <div className={styles.editorialTitle}>
          <span>THE METHOD / ISSUE 001</span>
          <h2>Expertise becomes leverage when it can move without you.</h2>
        </div>
        <div className={styles.editorialBody}>
          <p className={styles.dropcap}>
            Most businesses already have the raw material for useful AI. It is
            simply scattered across calls, notes, files, tools, and the
            decisions an owner repeats every week.
          </p>
          <ol>
            <li><b>Extract</b><span>Gather the knowledge and repeated work.</span></li>
            <li><b>Map</b><span>Find the bottleneck with real economic weight.</span></li>
            <li><b>Build</b><span>Ship one useful system your team can trust.</span></li>
          </ol>
        </div>
      </section>

      <section className={styles.selfrowOffer}>
        <div>
          <span>START HERE</span>
          <h2>Brain-to-System Audit</h2>
        </div>
        <p>
          A focused diagnostic that turns your scattered business knowledge
          into a prioritized build map and a clear first system.
        </p>
        <a href="#selfrow-stan-handoff">Apply via Stan ↗</a>
      </section>
      <StanHandoff variant="selfrow" />
    </article>
  );
}

function PeacockConcept() {
  return (
    <article className={`${styles.concept} ${styles.peacock}`}>
      <header className={styles.peacockHeader}>
        <Link href="/" className={styles.peacockMark} aria-label="JacksonTheDev home">
          <span>J/</span> JACKSONTHEDEV
        </Link>
        <div className={styles.peacockStatus}>
          <i /> HUMAN SYSTEMS · SACRAMENTO
        </div>
        <a href="#peacock-stan-handoff">BOOK AN AUDIT ↗</a>
      </header>

      <section className={styles.peacockHero}>
        <div className={styles.peacockIdentity}>
          <strong>JACKSONTHEDEV</strong>
          <span>PRACTICAL AI · HUMAN SYSTEMS</span>
        </div>

        <div className={styles.peacockCopy}>
          <p>AI SYSTEMS FOR EXPERT-LED BUSINESSES</p>
          <h1>
            Your expertise should create <span>momentum</span>—not a bottleneck.
          </h1>
          <p className={styles.peacockLede}>
            Turn calls, content, workflows, and hard-earned judgment into
            systems that follow up, remember, deliver, and grow.
          </p>
          <div className={styles.peacockActions}>
            <a href="#peacock-stan-handoff">Map my first system</a>
            <a href="#peacock-grid">Explore the signal ↓</a>
          </div>
        </div>

        <div className={styles.peacockArt}>
          <div className={styles.atelierContours} aria-hidden="true" />
          <div className={styles.atelierFeather} aria-hidden="true" />
          <div className={styles.peacockOrb} aria-label="Expertise becoming an operating system">
            <div className={styles.orbitalOne} />
            <div className={styles.orbitalTwo} />
            <div className={styles.orbCore}>
              <small>YOUR</small>
              <strong>EXPERTISE</strong>
              <span>→ SYSTEM</span>
            </div>
            <span className={styles.orbTagOne}>KNOWLEDGE</span>
            <span className={styles.orbTagTwo}>FOLLOW-UP</span>
            <span className={styles.orbTagThree}>DELIVERY</span>
          </div>
          <aside className={styles.atelierNote}>
            <span>FIELD NOTE / 001</span>
            <p>
              Build the system.
              <br />
              Keep the <em>human.</em>
            </p>
            <small>That is the whole point.</small>
          </aside>
        </div>
      </section>

      <section className={styles.peacockEditorial}>
        <div>
          <span>THE HUMAN THESIS / VOL. I</span>
          <h2>AI isn’t the offer. <em>Time back is.</em></h2>
        </div>
        <p>
          Most businesses already contain the raw material for leverage. It
          lives in client calls, hard-won judgment, half-documented workflows,
          and the answers an owner gives every week. We make that knowledge
          usable—without sanding off the voice, care, or instinct that made it
          valuable.
        </p>
      </section>

      <section className={styles.peacockGrid} id="peacock-grid">
        <div className={styles.peacockGridIntro}>
          <span>04 / LIVING SIGNALS</span>
          <h2>The work is already telling you what to build.</h2>
        </div>
        <div className={styles.signalCards}>
          {workflows.map(([input, output], index) => (
            <article key={input}>
              <span>0{index + 1}</span>
              <small>INPUT</small>
              <h3>{input}</h3>
              <i>↓</i>
              <small>OUTPUT</small>
              <strong>{output}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.peacockOffer}>
        <div className={styles.peacockOfferStamp} aria-hidden="true">
          <span>ONE</span>
          <strong>×</strong>
          <span>USEFUL</span>
        </div>
        <div>
          <span>THE FIRST MOVE</span>
          <h2>One audit. One map. One system worth building first.</h2>
        </div>
        <a href="#peacock-stan-handoff">Reserve through Stan ↗</a>
      </section>
      <StanHandoff variant="peacock" />
    </article>
  );
}

function CaliforniaConcept() {
  return (
    <article className={`${styles.concept} ${styles.california}`}>
      <header className={styles.californiaHeader}>
        <Link href="/" aria-label="JacksonTheDev home">
          <b>JACKSON</b> / THE DEV
        </Link>
        <p>FIELD OFFICE №03 · SACRAMENTO, CALIFORNIA</p>
        <a href="#california-stan-handoff">START HERE +</a>
      </header>

      <section className={styles.californiaHero}>
        <div className={styles.sunStamp} aria-hidden="true">
          <span>HUMAN</span>
          <strong>×</strong>
          <span>SYSTEM</span>
        </div>
        <div className={styles.californiaHeadline}>
          <p>CALIFORNIA CIRCUIT / PRACTICAL AI IN THE REAL WORLD</p>
          <h1>
            Build the system.
            <br />
            Keep the <em>human.</em>
          </h1>
        </div>
        <div className={styles.fieldNote}>
          <span>FIELD NOTE 001</span>
          <p>
            The goal is not more software. It is less repetition, cleaner
            handoffs, faster follow-up, and more room for the work only you can
            do.
          </p>
          <a href="#california-stan-handoff">Book the audit →</a>
        </div>
      </section>

      <section className={styles.californiaManifesto}>
        <p>
          Your calls are data. Your judgment is a model. Your workflows are a
          map. <strong>Let’s make them usable.</strong>
        </p>
      </section>

      <section className={styles.fieldGrid}>
        <article className={styles.fieldMap}>
          <span className={styles.mapLabel}>SYSTEM MAP / LIVE</span>
          <div className={styles.mapPath} aria-hidden="true">
            <i /><i /><i /><i />
          </div>
          <p>EXTRACT</p><p>MAP</p><p>BUILD</p><p>TRAIN</p>
        </article>
        <article className={styles.auditCard}>
          <span>THE OFFER</span>
          <h2>Brain-to-System Audit</h2>
          <ul>
            <li>Workflow + knowledge review</li>
            <li>2–5 leverage opportunities</li>
            <li>Prioritized build map</li>
            <li>A clear first recommendation</li>
          </ul>
          <a href="#california-stan-handoff">APPLY VIA STAN ↗</a>
        </article>
      </section>
      <StanHandoff variant="california" />
    </article>
  );
}

export default function ConceptsPage() {
  const [active, setActive] = useState<ConceptKey>("selfrow");
  const selected = concepts.find((concept) => concept.key === active)!;

  return (
    <main className={styles.lab}>
      <header className={styles.labBar}>
        <Link href="/" className={styles.backLink}>
          ← Current site
        </Link>
        <div className={styles.tabs} aria-label="Choose a design concept">
          {concepts.map((concept) => (
            <button
              key={concept.key}
              type="button"
              aria-pressed={active === concept.key}
              onClick={() => {
                setActive(concept.key);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <span>{concept.number}</span>
              {concept.name}
            </button>
          ))}
        </div>
        <p>
          VIEWING <strong>{selected.number}/03</strong>
        </p>
      </header>

      <div className={styles.mobileLabel}>
        Viewing {selected.number}: {selected.name}
      </div>

      {active === "selfrow" && <SelfrowConcept />}
      {active === "peacock" && <PeacockConcept />}
      {active === "california" && <CaliforniaConcept />}
    </main>
  );
}
