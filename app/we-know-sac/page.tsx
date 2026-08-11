import Link from "next/link";
import styles from "./we-know-sac.module.css";

const bookingUrl = "https://stan.store/jacksonthedev";
const midtownSource = "https://exploremidtown.org/newbusinesses/";
const broadwaySource =
  "https://www.cityofsacramento.gov/public-works/engineering/projects/envision-broadway-in-oak-park-complete-street-project";
const agencyCounterSource =
  "https://www.cityofsacramento.gov/community-development/agencycounter";

const signals = [
  {
    number: "01",
    status: "OPEN NOW",
    confidence: "HIGH CONFIDENCE",
    place: "LAVENDER HEIGHTS · 1050 20TH ST",
    headline: "Two new concepts now share one address.",
    fact: "The Midtown Association lists both Lou’s Sushi 2.0 and Teneral Cellars at 1050 20th Street.",
    angle:
      "Is this address becoming a miniature hospitality destination—and what does the pairing say about the next version of Lavender Heights?",
    field:
      "Film the block at early evening. Ask both operators what they expect people to do before and after visiting them.",
    source: midtownSource,
    sourceLabel: "Midtown Association · Jul 27, 2026",
    tone: "mint",
  },
  {
    number: "02",
    status: "OPEN NOW",
    confidence: "HIGH CONFIDENCE",
    place: "MIDTOWN · 1630 J ST",
    headline: "Goldfield’s old home is now a two-format nightlife bet.",
    fact: "Midtown Live occupies the former Goldfield Trading Post space, while the adjacent Tack Room has become Landmark Social Club.",
    angle:
      "One address is testing two reasons to stay out: live music and sports on one side, cocktails and conversation on the other.",
    field:
      "Show the transition between both rooms. Ask: who is each side for, and can a split concept make J Street feel like a full-night destination?",
    source: midtownSource,
    sourceLabel: "Midtown Association · Jul 27, 2026",
    tone: "rose",
  },
  {
    number: "03",
    status: "PATTERN",
    confidence: "EDITORIAL INFERENCE",
    place: "MIDTOWN · J + P STREETS",
    headline: "The interesting openings are selling participation, not just products.",
    fact: "Recent openings include a physical VHS gathering space, an immersive artist-built gallery, and a coffee-vintage-vinyl hybrid.",
    angle:
      "Skip the usual restaurant roundup. Ask why analog media, art, and hybrid spaces are gaining physical addresses right now.",
    field:
      "Visit My Cat’s VHS, Slither Gallery, and Roasted Threads. Ask each owner what the internet could not provide their community.",
    source: midtownSource,
    sourceLabel: "Midtown Association · Jul 27, 2026",
    tone: "gold",
  },
  {
    number: "04",
    status: "DESIGN PHASE",
    confidence: "CITY-SOURCED",
    place: "BROADWAY · FRANKLIN TO MLK JR.",
    headline: "Broadway’s next milestone is design—not construction.",
    fact: "The City’s published schedule says final design begins in summer 2026, with construction targeted for 2028. The corridor work is one of five simultaneous Broadway projects.",
    angle:
      "A useful explainer can separate what residents will see soon from what remains years away—and show how the five projects connect.",
    field:
      "Walk the Franklin-to-MLK segment. Mark the handoffs between projects and ask nearby businesses which promised change matters most.",
    source: broadwaySource,
    sourceLabel: "City of Sacramento · current project page",
    tone: "blue",
  },
];

const deskOutputs = [
  ["01", "What changed", "The dated fact, status, location, and confidence level."],
  ["02", "Why it matters", "The pattern a local expert can confirm, challenge, or complicate."],
  ["03", "What to make", "A hook, field questions, source links, and a useful place to film."],
  ["04", "What comes back", "The creator’s firsthand judgment becomes part of Sacramento’s living record."],
];

export default function WeKnowSac() {
  return (
    <main className={styles.site}>
      <a className={styles.skipLink} href="#signals">
        Skip to this week’s signals
      </a>

      <header className={styles.header}>
        <Link className={styles.wordmark} href="/" aria-label="JacksonTheDev home">
          <span>J/</span> JACKSONTHEDEV
        </Link>
        <div className={styles.issue}>FIELD TEST · ISSUE 001 · AUG 2026</div>
        <a className={styles.headerCta} href="#founding-creator">
          CLAIM THE NEXT ISSUE ↘
        </a>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroGrid} aria-hidden="true">
          <i className={styles.river} />
          <span className={styles.markerOne}>01</span>
          <span className={styles.markerTwo}>02</span>
          <span className={styles.markerThree}>03</span>
          <span className={styles.markerFour}>04</span>
        </div>

        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>A LIVING KNOWLEDGE NETWORK FOR SACRAMENTO</p>
          <div className={styles.logoLockup}>
            <span>WE</span>
            <strong>KNOW</strong>
            <em>SAC</em>
          </div>
          <h1>The weekly intelligence desk for people who explain Sacramento.</h1>
          <p className={styles.lede}>
            Public records tell you what happened. Local creators tell you what
            it means. We Know Sac connects the two—then hands you the next story.
          </p>
          <div className={styles.heroActions}>
            <a className={styles.primaryButton} href="#signals">
              Open Issue 001 <span aria-hidden="true">↓</span>
            </a>
            <a className={styles.textLink} href="#how-it-works">
              See the desk workflow <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        <aside className={styles.issueCard} aria-label="Issue 001 summary">
          <div>
            <span>ISSUE</span>
            <strong>001</strong>
          </div>
          <p>DOWNTOWN / MIDTOWN<br />CHANGE DESK</p>
          <dl>
            <div><dt>STORY LEADS</dt><dd>04</dd></div>
            <div><dt>SOURCE LAYERS</dt><dd>03</dd></div>
            <div><dt>CREATOR SEATS</dt><dd>01</dd></div>
          </dl>
          <small>PROTOTYPE BRIEF · FACTS DATED AUG 11, 2026</small>
        </aside>
      </section>

      <section className={styles.promise} aria-label="The We Know Sac promise">
        <span>WHAT IS HERE</span>
        <i aria-hidden="true">→</i>
        <span>WHAT IS CHANGING</span>
        <i aria-hidden="true">→</i>
        <strong>WHO ACTUALLY KNOWS</strong>
      </section>

      <section className={styles.signals} id="signals" aria-labelledby="signals-title">
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.kicker}>THE BRIEF / DOWNTOWN + MIDTOWN</p>
            <h2 id="signals-title">Four signals worth leaving the house for.</h2>
          </div>
          <p>
            Every card separates a sourced fact from a suggested angle. The
            creator supplies the judgment; the system supplies the trailhead.
          </p>
        </div>

        <div className={styles.signalList}>
          {signals.map((signal) => (
            <article
              className={`${styles.signalCard} ${styles[signal.tone]}`}
              key={signal.number}
            >
              <div className={styles.signalMeta}>
                <strong>{signal.number}</strong>
                <div>
                  <span>{signal.status}</span>
                  <small>{signal.confidence}</small>
                </div>
              </div>
              <div className={styles.signalBody}>
                <p className={styles.place}>{signal.place}</p>
                <h3>{signal.headline}</h3>
                <div className={styles.factBlock}>
                  <span>VERIFIED FACT</span>
                  <p>{signal.fact}</p>
                </div>
                <div className={styles.angleBlock}>
                  <span>CREATOR ANGLE</span>
                  <p>{signal.angle}</p>
                </div>
                <div className={styles.fieldNote}>
                  <span>FIELD NOTE</span>
                  <p>{signal.field}</p>
                </div>
              </div>
              <a
                className={styles.sourceLink}
                href={signal.source}
                target="_blank"
                rel="noreferrer"
              >
                SOURCE / {signal.sourceLabel} <span aria-hidden="true">↗</span>
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.workflow} id="how-it-works" aria-labelledby="workflow-title">
        <div className={styles.workflowIntro}>
          <p className={styles.kicker}>THE CREATOR DESK</p>
          <h2 id="workflow-title">Monday morning should start with a lead—not a blank page.</h2>
          <p>
            This is the first product. No giant directory. No chatbot pretending
            to know the city. One territory, one weekly brief, one creator who
            makes it more true.
          </p>
        </div>
        <ol className={styles.outputList}>
          {deskOutputs.map(([number, title, description]) => (
            <li key={number}>
              <span>{number}</span>
              <div><h3>{title}</h3><p>{description}</p></div>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.graph} aria-labelledby="graph-title">
        <div className={styles.graphCopy}>
          <p className={styles.kicker}>THE LONG GAME / STARTED SMALL</p>
          <h2 id="graph-title">A city with memory.</h2>
          <p>
            Places, projects, events, businesses, and the people who know them
            become connected over time. Facts stay sourced. Viewpoints stay
            attributed. Change gets a timestamp.
          </p>
          <a href={agencyCounterSource} target="_blank" rel="noreferrer">
            Explore the City’s AgencyCounter <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className={styles.graphModel} aria-label="Example We Know Sac knowledge model">
          <div className={styles.graphCenter}><span>PLACE</span><strong>1630 J ST</strong></div>
          <div className={styles.graphNode}><span>WAS</span><strong>Goldfield</strong></div>
          <div className={styles.graphNode}><span>IS NOW</span><strong>Two concepts</strong></div>
          <div className={styles.graphNode}><span>EXPLAINED BY</span><strong>Local creator</strong></div>
          <div className={styles.graphNode}><span>UPDATED</span><strong>Jul 27, 2026</strong></div>
        </div>
      </section>

      <section className={styles.founding} id="founding-creator" aria-labelledby="founding-title">
        <div className={styles.foundingStamp} aria-hidden="true">
          <span>ONE</span><strong>×</strong><span>CREATOR</span>
        </div>
        <div>
          <p className={styles.kicker}>THE FIRST MOVE</p>
          <h2 id="founding-title">Use the next issue for one week.</h2>
          <p>
            Pick your Sacramento territory. Get a source-backed brief built
            around your audience. Keep the stories. Tell us what the desk got
            wrong—and what would make it indispensable.
          </p>
        </div>
        <a className={styles.foundingCta} href={bookingUrl} target="_blank" rel="noreferrer">
          Claim the founding creator seat <span aria-hidden="true">↗</span>
        </a>
      </section>

      <footer className={styles.footer}>
        <div>
          <strong>WE KNOW SAC</strong>
          <span>A JACKSONTHEDEV FIELD TEST</span>
        </div>
        <p>
          Prototype issue. Claims are dated and linked to their published
          sources; suggested angles are editorial hypotheses, not reported facts.
        </p>
        <Link href="/">Back to JacksonTheDev ↑</Link>
      </footer>
    </main>
  );
}
