import { useNavigate } from "react-router-dom";

const AREAS = [
  {
    number: "01",
    title: "Market Entry & Regulatory Strategy",
    text: "Navigating the regulatory landscape before you commit capital. Licensing frameworks, compliance requirements, and government incentive structures across Saudi Arabia, UAE, and Egypt."
  },
  {
    number: "02",
    title: "AI Governance & Data Policy",
    text: "Cloud sovereignty, data localization, and AI regulatory frameworks. Helping technology companies understand what governments actually want and how to position around it."
  },
  {
    number: "03",
    title: "Government Relations & Stakeholder Strategy",
    text: "Identifying the right counterparts, building institutional relationships, and designing engagement strategies that create lasting access across ministries and regulators."
  },
  {
    number: "04",
    title: "FDI & Investment Framework Navigation",
    text: "Making sense of incentive programs, Special Economic Zones, and regional HQ mandates. Structuring your investment narrative to align with national transformation agendas."
  },
  {
    number: "05",
    title: "Policy Risk Assessment",
    text: "Monitoring and interpreting regulatory change across three markets. Turning policy signals into commercial decisions before your competitors see them."
  }
];

export default function Advisory() {
  var navigate = useNavigate();

  return (
    <>
      <style>{"\n        .adv-page { padding: 140px 40px 80px; max-width: 900px; margin: 0 auto; }\n        .adv-back { font-family: 'JetBrains Mono', monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #C8A97E; cursor: pointer; margin-bottom: 64px; display: inline-block; transition: opacity 0.3s; background: none; border: none; }\n        .adv-back:hover { opacity: 0.7; }\n        .adv-eyebrow { font-family: 'JetBrains Mono', monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 4px; color: #C8A97E; margin-bottom: 24px; }\n        .adv-title { font-family: 'Instrument Serif', serif; font-size: clamp(36px, 5vw, 56px); line-height: 1.1; color: #E8E4DF; margin-bottom: 32px; }\n        .adv-title em { font-style: italic; color: #C8A97E; }\n        .adv-intro { font-size: 18px; line-height: 1.75; color: #8A8580; max-width: 700px; margin-bottom: 80px; }\n        .adv-areas-label { font-family: 'JetBrains Mono', monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 3px; color: #6B6560; margin-bottom: 40px; display: flex; align-items: center; gap: 16px; }\n        .adv-areas-label::after { content: ''; flex: 1; height: 1px; background: rgba(200,169,126,0.12); max-width: 200px; }\n        .adv-area { padding: 32px 0; border-top: 1px solid rgba(200,169,126,0.1); display: grid; grid-template-columns: 60px 1fr; gap: 24px; transition: all 0.3s; }\n        .adv-area:last-child { border-bottom: 1px solid rgba(200,169,126,0.1); }\n        .adv-area:hover { padding-left: 12px; }\n        .adv-area-num { font-family: 'Instrument Serif', serif; font-size: 24px; color: rgba(200,169,126,0.2); padding-top: 4px; }\n        .adv-area-title { font-family: 'Instrument Serif', serif; font-size: 22px; color: #E8E4DF; margin-bottom: 8px; font-weight: 400; }\n        .adv-area:hover .adv-area-title { color: #C8A97E; }\n        .adv-area-text { font-size: 15px; color: #8A8580; line-height: 1.7; }\n        .adv-cta-section { margin-top: 80px; padding: 48px; border: 1px solid rgba(200,169,126,0.15); text-align: center; position: relative; }\n        .adv-cta-section::before { content: ''; position: absolute; top: -40px; left: 50%; transform: translateX(-50%); width: 400px; height: 300px; background: radial-gradient(circle, rgba(200,169,126,0.05) 0%, transparent 65%); pointer-events: none; }\n        .adv-cta-title { font-family: 'Instrument Serif', serif; font-size: 28px; color: #E8E4DF; margin-bottom: 12px; }\n        .adv-cta-sub { font-size: 15px; color: #6B6560; margin-bottom: 8px; line-height: 1.6; }\n        .adv-cta-email { font-family: 'JetBrains Mono', monospace; font-size: 14px; margin-top: 24px; }\n        .adv-cta-email a { color: #C8A97E; text-decoration: none; transition: opacity 0.3s; }\n        .adv-cta-email a:hover { opacity: 0.7; }\n        .adv-context { margin-top: 80px; font-size: 14px; color: #4A4540; line-height: 1.8; max-width: 600px; }\n        .adv-context strong { color: #6B6560; font-weight: 500; }\n        @media (max-width: 768px) { .adv-page { padding: 120px 20px 60px; } .adv-area { grid-template-columns: 1fr; gap: 8px; } .adv-area-num { font-size: 18px; } }\n      "}</style>

      <nav className="nav-fixed">
        <div className="nav-logo" onClick={function() { navigate("/"); window.scrollTo(0, 0); }}>
          TAZ
        </div>
        <div className="nav-links">
          {[
            { id: "perspectives", label: "Perspectives" },
            { id: "about", label: "About" },
            { id: "connect", label: "Connect" },
          ].map(function(item) {
            return (
              <button
                key={item.id}
                className="nav-link"
                onClick={function() {
                  navigate("/");
                  setTimeout(function() {
                    var el = document.getElementById(item.id) || document.querySelector("." + item.id + "-section");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }, 150);
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="adv-page">
        <button className="adv-back" onClick={function() { navigate("/"); window.scrollTo(0, 0); }}>
          ← Back to Home
        </button>

        <div className="adv-eyebrow">Advisory</div>
        <h1 className="adv-title">
          Helping technology companies navigate <em>government</em> in the Gulf.
        </h1>
        <p className="adv-intro">
          I have spent over a decade inside the institutions that set the rules
          across Saudi Arabia, UAE, and Egypt. I advise companies that need to
          understand how those rules work, where they're going, and how to
          position around them.
        </p>

        <div className="adv-areas-label">Areas of Focus</div>

        {AREAS.map(function(area) {
          return (
            <div className="adv-area" key={area.number}>
              <div className="adv-area-num">{area.number}</div>
              <div>
                <div className="adv-area-title">{area.title}</div>
                <div className="adv-area-text">{area.text}</div>
              </div>
            </div>
          );
        })}

        <div className="adv-cta-section">
          <div className="adv-cta-title">Start a conversation.</div>
          <div className="adv-cta-sub">
            Every engagement starts with a conversation about your specific
            situation. No templates. No generic frameworks.
          </div>
          <div className="adv-cta-email">
            <a href="mailto:talal.h.zd@gmail.com">talal.h.zd@gmail.com</a>
          </div>
        </div>

        <div className="adv-context">
          <strong>A note on availability:</strong> I take on a limited number of
          advisory engagements alongside my full-time role. Priority goes to
          projects where my institutional knowledge of the Saudi, UAE, and
          Egyptian regulatory landscape creates a direct advantage.
        </div>
      </div>

      <footer className="footer">
        <div className="footer-left">© 2026 Talal Al Zayed</div>
        <div className="footer-quote">
          على قدر أهل العزم تأتي العزائم
        </div>
      </footer>
    </>
  );
}
