import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Code,
  RocketLaunch,
  ShieldCheck,
  Sparkle,
  WarningCircle
} from "@phosphor-icons/react";

export function DesignComparison() {
  return (
    <main className="comparison-page">
      <header className="comparison-heading">
        <a href="/" className="back-link"><ArrowLeft /> Back to Pulse</a>
        <p className="kicker">Packaged expertise demo</p>
        <h1>Same brief. Different quality bar.</h1>
        <p>
          Brief: “Add a release-readiness panel so a delivery lead can decide whether a release can ship.”
        </p>
      </header>

      <section className="comparison-grid" aria-label="Frontend output comparison">
        <article className="comparison-example before-example">
          <div className="comparison-label">
            <span>Plain prompt</span>
            <strong>Generic output</strong>
          </div>
          <div className="generic-product">
            <div className="generic-hero">
              <span className="generic-icon"><RocketLaunch weight="fill" /></span>
              <h2>Ready to launch?</h2>
              <p>Everything you need to ship with confidence.</p>
              <button type="button">Get started</button>
            </div>
            <div className="generic-cards">
              <div><Sparkle /><strong>Fast</strong><span>Move quickly</span></div>
              <div><ShieldCheck /><strong>Secure</strong><span>Stay protected</span></div>
              <div><Code /><strong>Smart</strong><span>Built for teams</span></div>
            </div>
            <div className="generic-score">
              <span>Release score</span>
              <strong>86%</strong>
              <div><span style={{ width: "86%" }} /></div>
            </div>
          </div>
          <ul className="quality-notes negative">
            <li>Looks polished but does not support the decision.</li>
            <li>Uses vague labels, invented confidence and a generic CTA.</li>
            <li>Ignores failure states, ownership and evidence.</li>
          </ul>
        </article>

        <article className="comparison-example after-example">
          <div className="comparison-label">
            <span>UI/UX + design-taste Skills</span>
            <strong>Product-specific output</strong>
          </div>
          <div className="expert-product">
            <div className="release-heading">
              <div>
                <span className="release-id">Release 2026.07.22</span>
                <h2>Decision required</h2>
                <p>Checkout service · production candidate</p>
              </div>
              <span className="decision-status"><WarningCircle weight="fill" /> Hold</span>
            </div>
            <dl className="evidence-list">
              <div>
                <dt><CheckCircle weight="fill" /> Automated tests</dt>
                <dd><strong>142 passed</strong><span>Required suite complete</span></dd>
              </div>
              <div className="evidence-problem">
                <dt><WarningCircle weight="fill" /> Regressions</dt>
                <dd><strong>3 unresolved</strong><span>2 affect payment retries</span></dd>
              </div>
              <div>
                <dt><Clock weight="fill" /> Security review</dt>
                <dd><strong>Pending</strong><span>Owner: Maya · due 14:00</span></dd>
              </div>
            </dl>
            <div className="decision-footer">
              <div>
                <strong>Why the release is held</strong>
                <p>Payment retry regressions violate the release criteria.</p>
              </div>
              <button type="button">Review regressions</button>
            </div>
          </div>
          <ul className="quality-notes positive">
            <li>Starts with the user’s decision and the evidence required.</li>
            <li>Uses explicit status, rationale, ownership and next action.</li>
            <li>Combines color with text and icons; states remain accessible.</li>
          </ul>
        </article>
      </section>

      <footer className="comparison-takeaway">
        <strong>A Skill is packaged expertise.</strong>
        <span>It changes what the agent notices, questions, produces and verifies.</span>
      </footer>
    </main>
  );
}
