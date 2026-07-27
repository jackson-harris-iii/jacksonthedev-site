const instagramUrl = "https://www.instagram.com/jacksonthedev/";

const systems = [
  {
    index: "01",
    title: "Lead follow-up",
    description:
      "Turn inquiries, call notes, and CRM activity into clear next steps before good opportunities go cold.",
    outcome: "Faster response",
  },
  {
    index: "02",
    title: "Business memory",
    description:
      "Make the answers buried in calls, documents, and your head usable by your team when they need them.",
    outcome: "Fewer repeat questions",
  },
  {
    index: "03",
    title: "Meeting to action",
    description:
      "Move from a transcript to decisions, owners, tasks, follow-up, and an updated source of truth.",
    outcome: "Work that keeps moving",
  },
  {
    index: "04",
    title: "Client delivery",
    description:
      "Connect intake, preparation, handoffs, and recurring work so the client experience depends less on memory.",
    outcome: "More capacity",
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
      "Not at all. The best opportunities are often inside real, owner-led businesses where calls, follow-up, knowledge, and delivery still depend on people doing repetitive work.",
  },
  {
    question: "What happens in the free blueprint conversation?",
    answer:
      "We spend 15 focused minutes on where time or money is leaking, what you repeat, and the first practical system worth exploring. You leave with a clearer next step.",
  },
  {
    question: "Can you build it after we map it?",
    answer:
      "Yes. You can take the blueprint and run with it, build it with me, or have me scope a done-for-you implementation.",
  },
];

export default function Home() {
  return (
    <main>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="JacksonTheDev home">
          <span className="brand-mark" aria-hidden="true">
            J/
          </span>
          <span>JacksonTheDev</span>
        </a>
        <nav className="site-nav" aria-label="Primary navigation">
          <a href="#systems">What I build</a>
          <a href="#approach">How it works</a>
          <a href="#about">About</a>
        </nav>
        <a
          className="header-cta"
          href={instagramUrl}
          target="_blank"
          rel="noreferrer"
        >
          DM “BLUEPRINT”
        </a>
      </header>

      <div id="main-content">
        <section className="hero section-shell" id="top">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="status-dot" aria-hidden="true" />
              Sacramento · Practical AI systems
            </p>
            <h1>
              Turn the work you repeat into a system that{" "}
              <span>keeps moving.</span>
            </h1>
            <p className="hero-lede">
              I help owner-led businesses turn calls, leads, documents,
              workflows, and hard-earned judgment into useful AI systems—so
              less work falls through the cracks and less of the business has
              to live in your head.
            </p>
            <div className="hero-actions">
              <a
                className="button button-primary"
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
              >
                Get your free AI blueprint <span aria-hidden="true">↗</span>
              </a>
              <a className="button button-quiet" href="#systems">
                See what I build <span aria-hidden="true">↓</span>
              </a>
            </div>
            <p className="hero-note">
              15 minutes · One focused problem · A practical next step
            </p>
          </div>

          <div
            className="system-board"
            aria-label="Business inputs becoming useful systems"
          >
            <div className="board-topline">
              <span>BUSINESS SIGNAL / 001</span>
              <span className="live-label">HUMAN IN THE LOOP</span>
            </div>
            <div className="board-flow">
              <div className="flow-column input-column">
                <p>What you already have</p>
                <span>Calls</span>
                <span>Leads</span>
                <span>Docs</span>
                <span>Decisions</span>
              </div>
              <div className="flow-core">
                <span className="core-ring" aria-hidden="true" />
                <strong>
                  Your
                  <br />
                  business
                </strong>
                <small>Mapped around real work</small>
              </div>
              <div className="flow-column output-column">
                <p>What starts moving</p>
                <span>Follow-up</span>
                <span>Memory</span>
                <span>Delivery</span>
                <span>Growth</span>
              </div>
            </div>
            <div className="board-footer">
              <span>One problem in.</span>
              <strong>A clear first build out.</strong>
            </div>
          </div>
        </section>

        <section className="proof-bar" aria-label="Selected experience">
          <div>
            <span>BUILDING NOW</span>
            <strong>Founding engineer · Mood Magic</strong>
          </div>
          <div>
            <span>0 → 1</span>
            <strong>Co-founder · SpotX Games</strong>
          </div>
          <div>
            <span>ACQUIRED BY</span>
            <strong>Niantic</strong>
          </div>
          <div>
            <span>HOME BASE</span>
            <strong>Sacramento, California</strong>
          </div>
        </section>

        <section className="thesis section-shell" aria-labelledby="thesis-title">
          <p className="section-kicker">The real problem</p>
          <div className="thesis-grid">
            <h2 id="thesis-title">
              AI isn’t the offer.
              <span> Time back is.</span>
            </h2>
            <div className="thesis-copy">
              <p>
                Most businesses do not need another pile of tools. They need a
                simpler way to handle the work that repeats every week.
              </p>
              <p>
                If follow-up depends on memory, your best answers are trapped
                in calls, or every decision still routes through you, that is a
                systems problem. It is also exactly where practical AI can help.
              </p>
            </div>
          </div>
          <div className="pain-grid">
            <article>
              <span>01</span>
              <h3>Everything runs through you</h3>
              <p>
                Your team can help, but you are still the router, trainer, and
                final answer.
              </p>
            </article>
            <article>
              <span>02</span>
              <h3>Good work dies in folders</h3>
              <p>
                Calls, notes, proposals, and SOPs exist—but not as a system
                people can use.
              </p>
            </article>
            <article>
              <span>03</span>
              <h3>AI feels like more complexity</h3>
              <p>
                You know it matters. You just do not need another technology
                project to manage.
              </p>
            </article>
          </div>
        </section>

        <section
          className="systems section-shell"
          id="systems"
          aria-labelledby="systems-title"
        >
          <div className="section-heading">
            <div>
              <p className="section-kicker">What I build</p>
              <h2 id="systems-title">One useful system at a time.</h2>
            </div>
            <p>
              We start close to the work: where the business loses time,
              misses follow-up, repeats itself, or relies on one person knowing
              everything.
            </p>
          </div>
          <div className="systems-grid">
            {systems.map((system) => (
              <article className="system-card" key={system.index}>
                <div className="card-index">{system.index}</div>
                <h3>{system.title}</h3>
                <p>{system.description}</p>
                <div className="card-outcome">
                  <span>Outcome</span>
                  <strong>{system.outcome}</strong>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          className="approach"
          id="approach"
          aria-labelledby="approach-title"
        >
          <div className="section-shell approach-inner">
            <div className="approach-intro">
              <p className="section-kicker section-kicker-light">
                A simple way in
              </p>
              <h2 id="approach-title">
                Map it. Make it useful. Keep a human in the loop.
              </h2>
              <p>
                No giant transformation deck. We find the first meaningful
                win, tie it to time or money, and choose the smallest system
                that can prove value.
              </p>
            </div>
            <ol className="method-list">
              <li>
                <span>01</span>
                <div>
                  <h3>Find the leak</h3>
                  <p>
                    Where does work slow down, fall through, or depend on
                    memory?
                  </p>
                </div>
              </li>
              <li>
                <span>02</span>
                <div>
                  <h3>Map the real workflow</h3>
                  <p>
                    We use the calls, tools, documents, and decisions already
                    inside the business.
                  </p>
                </div>
              </li>
              <li>
                <span>03</span>
                <div>
                  <h3>Build the first win</h3>
                  <p>
                    One practical system, clear owners, and the right human
                    approvals.
                  </p>
                </div>
              </li>
            </ol>
          </div>
          <div className="engagements section-shell">
            <p className="engagement-label">Choose the handoff that fits</p>
            <div className="engagement-grid">
              <article>
                <span>01</span>
                <h3>Blueprint</h3>
                <p>Get the opportunity map and take it from there.</p>
              </article>
              <article>
                <span>02</span>
                <h3>Build with you</h3>
                <p>
                  Design the workflow together and teach your team how to own
                  it.
                </p>
              </article>
              <article className="engagement-featured">
                <span>03</span>
                <h3>Build for you</h3>
                <p>
                  Scope and implement the system, then hand it over clearly.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section
          className="about section-shell"
          id="about"
          aria-labelledby="about-title"
        >
          <div className="about-graphic" aria-hidden="true">
            <div className="portrait-grid" />
            <span className="about-monogram">
              JH<sup>III</sup>
            </span>
            <p>BUILDER / OPERATOR / TRANSLATOR</p>
          </div>
          <div className="about-copy">
            <p className="section-kicker">Hey, I’m Jackson</p>
            <h2 id="about-title">
              I translate between the business and the build.
            </h2>
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
              <span>Software</span>
              <span>Sales</span>
              <span>AI products</span>
              <span>Small business</span>
              <span>Creative systems</span>
            </div>
          </div>
        </section>

        <section className="local-callout section-shell">
          <p className="section-kicker">Atoms, not just bits</p>
          <div>
            <h2>Built for businesses doing real work in the real world.</h2>
            <p>
              I’m especially interested in the businesses AI will not replace:
              the operators, experts, teams, and local companies that still win
              through judgment, relationships, and showing up. Technology
              should make that work lighter—not make it less human.
            </p>
          </div>
        </section>

        <section className="faq section-shell" aria-labelledby="faq-title">
          <div className="faq-heading">
            <p className="section-kicker">Good questions</p>
            <h2 id="faq-title">Start simple.</h2>
          </div>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <details key={faq.question} open={index === 0}>
                <summary>
                  {faq.question}
                  <span aria-hidden="true">+</span>
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section
          className="final-cta section-shell"
          aria-labelledby="final-cta-title"
        >
          <p className="section-kicker section-kicker-light">The first move</p>
          <h2 id="final-cta-title">
            Show me what your business repeats every week.
          </h2>
          <p>
            I’ll help you find the first practical AI system worth building—and
            the work it should give back to you.
          </p>
          <a
            className="button button-primary button-large"
            href={instagramUrl}
            target="_blank"
            rel="noreferrer"
          >
            DM “BLUEPRINT” on Instagram <span aria-hidden="true">↗</span>
          </a>
        </section>
      </div>

      <footer className="site-footer">
        <a className="brand" href="#top" aria-label="Back to top">
          <span className="brand-mark" aria-hidden="true">
            J/
          </span>
          <span>JacksonTheDev</span>
        </a>
        <p>Practical AI systems · Sacramento, California</p>
        <div className="footer-links">
          <a
            href="https://x.com/jacksonthedev"
            target="_blank"
            rel="noreferrer"
          >
            X / Twitter
          </a>
          <a href={instagramUrl} target="_blank" rel="noreferrer">
            Instagram
          </a>
        </div>
      </footer>
    </main>
  );
}
