import advisoryScope from "./advisoryScope.js";

export default function Advisory() {
  return (
    <>
      <style>{`
        .adv-hero { padding: 60px 0 52px; border-bottom: 1px solid var(--ink); }
        .adv-kicker { font-size: 13px; color: var(--ink-3); margin-bottom: 12px; }
        .adv-title { font-size: 40px; line-height: 1.14; font-weight: 600; letter-spacing: -0.024em; max-width: 19ch; }
        .adv-intro { margin-top: 24px; font-size: 17.5px; line-height: 1.6; color: var(--ink-2); max-width: 58ch; }
        .adv-ctas { display: flex; gap: 10px; margin-top: 30px; }
        .adv-scope-t { font-size: 15px; font-weight: 600; }
        .adv-contact { padding: 56px 0 64px; }
        .adv-contact-h { font-size: 28px; font-weight: 600; letter-spacing: -0.02em; line-height: 1.2; }
        .adv-contact-p { margin-top: 16px; font-size: 16px; line-height: 1.6; color: var(--ink-2); max-width: 54ch; }
        .adv-contact-mail { margin-top: 22px; font-size: 18px; font-weight: 600; }
        .adv-contact-mail a { color: var(--sig); }
        .adv-contact-mail a:hover { color: var(--ink); }
        .adv-note { margin-top: 28px; font-size: 14px; line-height: 1.6; color: var(--ink-2); max-width: 60ch; }
        .adv-note strong { color: var(--ink); font-weight: 600; }
        @media (max-width: 768px) {
          .adv-hero { padding: 32px 0 36px; }
          .adv-title { font-size: 29px; line-height: 1.16; letter-spacing: -0.022em; max-width: none; }
          .adv-intro { margin-top: 18px; font-size: 16px; }
          .adv-ctas { flex-direction: column; margin-top: 24px; }
          .adv-ctas .btn { justify-content: center; }
          .adv-contact { padding: 36px 0 44px; }
          .adv-contact-h { font-size: 23px; }
          .adv-contact-mail a { display: inline-block; padding: 10px 0; }
        }
      `}</style>

      <section className="adv-hero">
        <div className="wrap hero-grid">
          <div>
            <p className="adv-kicker">Advisory</p>
            <h1 className="adv-title">Helping leaders navigate government in Saudi Arabia.</h1>
            <p className="adv-intro">
              I have spent over a decade inside the institutions that set the rules
              in Saudi Arabia. I advise companies, investors, and institutions that
              need to understand how those rules work, where they're going, and how
              to position around them.
            </p>
            <div className="adv-ctas">
              <a className="btn fill" href="mailto:talal.h.zd@gmail.com">Start a conversation</a>
            </div>
          </div>

          <aside className="panel" aria-label="How advisory works">
            <div className="ptop">
              <span className="ptop-title">How it works</span>
            </div>
            <div className="prow"><span className="pk">Availability</span><span className="pv flag">Limited</span></div>
            <div className="prow"><span className="pk">Market</span><span className="pv">Saudi Arabia only</span></div>
            <div className="prow"><span className="pk">Format</span><span className="pv">Fixed scope</span></div>
            <div className="prow"><span className="pk">Output</span><span className="pv">A defined deliverable</span></div>
            <div className="prow"><span className="pk">Conflicts</span><span className="pv">Screened first</span></div>
          </aside>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="shead">
            <h2 className="h2">Scope</h2>
            <span className="note">Six areas, each with a defined deliverable</span>
          </div>
          <table className="rec">
            <thead>
              <tr>
                <th style={{ width: "26%" }}>Area</th>
                <th>What it covers</th>
                <th style={{ width: "26%" }}>Deliverable</th>
              </tr>
            </thead>
            <tbody>
              {advisoryScope.map((a) => (
                <tr key={a.title}>
                  <td className="lead-cell"><span className="adv-scope-t">{a.title}</span></td>
                  <td className="soft">{a.text}</td>
                  <td className="soft">{a.deliverable}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="adv-contact">
        <div className="wrap">
          <h2 className="adv-contact-h">Start a conversation.</h2>
          <p className="adv-contact-p">
            Every engagement starts with a conversation about your specific
            situation. No templates. No generic frameworks.
          </p>
          <p className="adv-contact-mail">
            <a href="mailto:talal.h.zd@gmail.com">talal.h.zd@gmail.com</a>
          </p>
          <p className="adv-note">
            <strong>A note on availability:</strong> I take on a limited number of
            advisory engagements alongside my full-time role. Priority goes to
            projects where my institutional knowledge of the Saudi regulatory
            landscape creates a direct advantage.
          </p>
        </div>
      </section>
    </>
  );
}
