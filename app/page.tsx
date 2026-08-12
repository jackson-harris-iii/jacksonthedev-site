import Image from "next/image";

const bookingUrl = "https://stan.store/jacksonthedev";
const instagramUrl = "https://www.instagram.com/jacksonthedev/";

const systems = [
  {
    index: "01",
    input: "Calls",
    output: "Follow-up",
    description:
      "Turn conversations and call notes into clear next steps before good opportunities go cold.",
  },
  {
    index: "02",
    input: "Knowledge",
    output: "Business memory",
    description:
      "Make the answers buried in documents, recordings, and your head usable by the people who need them.",
  },
  {
    index: "03",
    input: "Meetings",
    output: "Decisions + action",
    description:
      "Move from a transcript to decisions, owners, tasks, follow-up, and an updated source of truth.",
  },
  {
    index: "04",
    input: "Expertise",
    output: "Capacity",
    description:
      "Connect intake, preparation, handoffs, and recurring work without removing the judgment clients value.",
  },
];

const faqs = [
  {
    question: "Do I need to know which AI tool I want?",
    answer:
      "No. We start with the business problem, the repeated work, and the result that matters. The tool comes later.",
  },
  {
    question: "Is this only for tech companies?",
    answer:
      "Not at all. The best opportunities are often inside owner-led businesses where calls, follow-up, knowledge, and delivery still depend on people doing repetitive work.",
  },
  {
    question: "What happens on the first call?",
    answer:
      "We focus on where time or money is leaking, what keeps repeating, and the first practical system worth exploring. You leave with a clearer next move.",
  },
  {
    question: "Can you build it after we map it?",
    answer:
      "Yes. You can take the map and run with it, build alongside me, or have me scope a done-for-you implementation.",
  },
];

export default function Home() {
  return (
    <main className="human-site">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="JacksonTheDev home">
          <span className="brand-mark" aria-hidden="true">J/</span>
          <span>JACKSONTHEDEV</span>
        </a>
        <div className="header-status">
          <i aria-hidden="true" /> HUMAN IN THE LOOP · SACRAMENTO
        </div>
        <nav className="site-nav" aria-label="Primary navigation">
          <a href="#systems">Systems</a>
          <a href="#approach">Method</a>
          <a href="#about">About</a>
          <a className="header-cta" href={bookingUrl} target="_blank" rel="noreferrer">
            BOOK YOUR CALL ↗
          </a>
        </nav>
      </header>

      <div id="main-content">
        <section className="hero section-shell" id="top">
          <div className="identity-card" aria-label="JacksonTheDev, Human in the Loop">
            <strong>JACKSONTHEDEV</strong>
            <span>HUMAN IN THE LOOP</span>
          </div>

          <div className="hero-copy">
            <p className="eyebrow">HUMAN CURRENT / AI SYSTEMS FOR EXPERT-LED BUSINESSES</p>
            <h1>
              Your expertise should create <em>momentum</em>—not a bottleneck.
            </h1>
            <p className="hero-lede">
              I turn calls, leads, documents, workflows, and hard-earned
              judgment into useful AI systems that follow up, remember,
              deliver, and grow—without losing the human touch.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href={bookingUrl} target="_blank" rel="noreferrer">
                Book your call <span aria-hidden="true">↗</span>
              </a>
              <a className="button button-quiet" href="#systems">
                See what I build <span aria-hidden="true">↓</span>
              </a>
            </div>
            <p className="hero-note">One problem · One map · The right first system</p>
          </div>

          <div className="hero-art">
            <div className="current-lines" aria-hidden="true"><i /></div>
            <div className="contour-field" aria-hidden="true" />
            <div className="expertise-orbit" aria-label="Expertise becoming an operating system">
              <div className="orbit-line orbit-line-one" />
              <div className="orbit-line orbit-line-two" />
              <div className="orbit-core">
                <small>YOUR</small>
                <strong>EXPERTISE</strong>
                <span>→ SYSTEM</span>
              </div>
              <span className="orbit-tag orbit-tag-one">KNOWLEDGE</span>
              <span className="orbit-tag orbit-tag-two">FOLLOW-UP</span>
              <span className="orbit-tag orbit-tag-three">DELIVERY</span>
            </div>
            <aside className="field-note">
              <span>FIELD NOTE / 001</span>
              <p>Build the system.<br />Keep the <em>human.</em></p>
              <small>That is the whole point.</small>
            </aside>
          </div>
        </section>

        <section className="proof-bar" aria-label="Selected experience">
          <div><span>BUILDING NOW</span><strong>Founding engineer · Mood Magic</strong></div>
          <div><span>0 → 1</span><strong>Co-founder · SpotX Games</strong></div>
          <div><span>ACQUIRED BY</span><strong>Niantic</strong></div>
          <div><span>HOME BASE</span><strong>Sacramento, California</strong></div>
        </section>

        <section className="thesis" aria-labelledby="thesis-title">
          <div>
            <p className="section-kicker">THE HUMAN THESIS / VOL. I</p>
            <h2 id="thesis-title">AI isn’t the offer. <em>Time back is.</em></h2>
          </div>
          <div className="thesis-copy">
            <p>
              Most businesses already contain the raw material for leverage.
              It lives in client calls, hard-won judgment, half-documented
              workflows, and the answers an owner gives every week.
            </p>
            <p>
              I make that knowledge usable—without sanding off the voice,
              care, or instinct that made it valuable.
            </p>
          </div>
        </section>

        <section className="systems" id="systems" aria-labelledby="systems-title">
          <div className="section-shell systems-heading">
            <p className="section-kicker">WHAT DO YOU WANT TO BUILD?</p>
            <h2 id="systems-title">The work is already telling you what to build.</h2>
            <p>
              Start where the business loses time, misses follow-up, repeats
              itself, or relies on one person knowing everything.
            </p>
          </div>
          <div className="section-shell systems-grid">
            {systems.map((system) => (
              <article className="system-card" key={system.index}>
                <span className="card-index">{system.index}</span>
                <small>INPUT</small>
                <h3>{system.input}</h3>
                <i aria-hidden="true">↓</i>
                <small>OUTPUT</small>
                <strong>{system.output}</strong>
                <p>{system.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="approach" id="approach" aria-labelledby="approach-title">
          <div className="section-shell approach-grid">
            <div className="approach-intro">
              <p className="section-kicker">A SIMPLE WAY IN</p>
              <h2 id="approach-title">Map it. Make it useful. Keep a human in the loop.</h2>
              <p>
                No giant transformation deck. We find the first meaningful
                win, tie it to time or money, and choose the smallest system
                that can prove value.
              </p>
            </div>
            <ol className="method-list">
              <li><span>01</span><div><h3>Find the leak</h3><p>Where does work slow down, fall through, or depend on memory?</p></div></li>
              <li><span>02</span><div><h3>Map the real workflow</h3><p>Use the calls, tools, documents, and decisions already inside the business.</p></div></li>
              <li><span>03</span><div><h3>Build the first win</h3><p>Ship one practical system with clear owners and the right human approvals.</p></div></li>
            </ol>
          </div>
          <div className="section-shell engagement-grid" aria-label="Ways to work together">
            <article><span>01 / MAP</span><h3>Blueprint</h3><p>Get the opportunity map and take it from there.</p></article>
            <article><span>02 / PARTNER</span><h3>Build with you</h3><p>Design the workflow together and teach your team how to own it.</p></article>
            <article className="engagement-featured"><span>03 / DELIVER</span><h3>Build for you</h3><p>Scope and implement the system, then hand it over clearly.</p></article>
          </div>
        </section>

        <section className="about section-shell" id="about" aria-labelledby="about-title">
          <figure className="about-portrait">
            <Image
              src="/jackson-harris-portrait.png"
              alt="Jackson Harris, founder of JacksonTheDev"
              fill
              sizes="(max-width: 1100px) min(100vw - 32px, 570px), 36vw"
            />
            <figcaption>
              <span>JACKSON HARRIS</span>
              <strong>BUILDER / OPERATOR / TRANSLATOR</strong>
            </figcaption>
          </figure>
          <div className="about-copy">
            <p className="section-kicker">HEY, I’M JACKSON</p>
            <h2 id="about-title">I translate between the business and the build.</h2>
            <p>
              I’m a founder, software engineer, and creative operator. My path
              started in sales and marketing, moved through software education
              and frontier technology, and led to co-founding SpotX Games,
              which was acquired by Niantic—the company behind Pokémon GO.
            </p>
            <p>
              Today I build AI-native products and help real businesses put AI
              to work without turning the owner into a technologist. I can sit
              in the room, understand the messy process, and build the first
              version that actually helps.
            </p>
            <div className="about-tags" aria-label="Areas of experience">
              <span>Software</span><span>Sales</span><span>AI products</span>
              <span>Small business</span><span>Creative systems</span>
            </div>
          </div>
        </section>

        <section className="faq section-shell" aria-labelledby="faq-title">
          <div>
            <p className="section-kicker">GOOD QUESTIONS</p>
            <h2 id="faq-title">Start simple.</h2>
          </div>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <details key={faq.question} open={index === 0}>
                <summary>{faq.question}<span aria-hidden="true">+</span></summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="first-move" aria-labelledby="first-move-title">
          <div className="first-move-copy">
            <div className="first-move-stamp" aria-hidden="true"><span>ONE</span><strong>×</strong><span>USEFUL</span></div>
            <div>
              <p className="section-kicker">THE FIRST MOVE</p>
              <h2 id="first-move-title">One call. One map. The right first system.</h2>
              <p>Bring the bottleneck. Leave with a practical next move.</p>
            </div>
            <a className="button button-gold" href={bookingUrl} target="_blank" rel="noreferrer">
              Book your call <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>
      </div>

      <footer className="site-footer">
        <a className="brand" href="#top" aria-label="Back to top">
          <span className="brand-mark" aria-hidden="true">J/</span>
          <span>JACKSONTHEDEV</span>
        </a>
        <p>HUMAN CURRENT · HUMAN IN THE LOOP · SACRAMENTO</p>
        <div className="footer-links">
          <a href="https://x.com/jacksonthedev" target="_blank" rel="noreferrer">X / Twitter</a>
          <a href={instagramUrl} target="_blank" rel="noreferrer">Instagram</a>
          <a href="/concepts">Design Lab</a>
        </div>
      </footer>
    </main>
  );
}
