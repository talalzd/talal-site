import { useNavigate } from "react-router-dom";

const AREAS = [
  {
    number: "01",
    title: "Market Entry & Regulatory Strategy",
    text: "Navigating the regulatory landscape before you commit capital. Licensing frameworks, compliance requirements, and government incentive structures across Saudi Arabia."
  },
  {
    number: "02",
    title: "Digital & AI Policy",
    text: "Cloud sovereignty, data localization, and AI regulatory frameworks. Reading what the government wants from the digital transformation agenda and translating it into operational positioning."
  },
  {
    number: "03",
    title: "Government Relations & Stakeholder Strategy",
    text: "Identifying the right counterparts, building institutional relationships, and designing engagement strategies that create lasting access across ministries and regulators."
  },
  {
    number: "04",
    title: "Strategic Partnerships",
    text: "Structuring durable alliances with government entities, sovereign institutions, and key local stakeholders. Designing the partnerships that turn one-time engagements into strategic positions."
  },
  {
    number: "05",
    title: "FDI & Investment Framework Navigation",
    text: "Making sense of incentive programs, Special Economic Zones, and regional HQ mandates. Structuring your investment narrative to align with national transformation agendas."
  },
  {
    number: "06",
    title: "Policy Risk Assessment",
    text: "Monitoring and interpreting regulatory change in real-time. Turning policy signals into commercial decisions before your competitors see them."
  }
];

export default function Advisory() {
  var navigate = useNavigate();

  return (
    <>
      <style>{"\n        .adv-page { padding: 140px 40px 80px; max-width: 900px; margin: 0 auto; }\n        .adv-back { font-family: 'Archivo Narrow', 'Archivo', sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: var(--sig); cursor: pointer; margin-bottom: 64px; display: inline-block; transition: opacity 0.3s; background: none; border: none; }\n        .adv-back:hover { opacity: 0.7; }\n        .adv-eyebrow { font-family: 'Archivo Narrow', 'Archivo', sans-serif; font-size: 10px; text-transform: uppercase; letter-spacing: 4px; color: var(--sig); margin-bottom: 24px; }\n        .adv-title { font-family: 'Archivo', sans-serif; font-size: clamp(36px, 5vw, 56px); line-height: 1.1; color: var(--ink); margin-bottom: 32px; }\n        .adv-title em { font-style: italic; color: var(--sig); }\n        .adv-intro { font-size: 18px; line-height: 1.75; color: var(--ink-2); max-width: 700px; margin-bottom: 80px; }\n        .adv-areas-label { font-family: 'Archivo Narrow', 'Archivo', sans-serif; font-size: 10px; text-transform: uppercase; letter-spacing: 3px; color: var(--ink-3); margin-bottom: 40px; display: flex; align-items: center; gap: 16px; }\n        .adv-areas-label::after { content: ''; flex: 1; height: 1px; background: var(--rule); max-width: 200px; }\n        .adv-area { padding: 32px 0; border-top: 1px solid var(--rule-soft); display: grid; grid-template-columns: 60px 1fr; gap: 24px; transition: all 0.3s; }\n        .adv-area:last-child { border-bottom: 1px solid var(--rule-soft); }\n        .adv-area:hover { padding-left: 12px; }\n        .adv-area-num { font-family: 'Archivo', sans-serif; font-size: 24px; color: var(--ink-3); padding-top: 4px; }\n        .adv-area-title { font-family: 'Archivo', sans-serif; font-size: 22px; color: var(--ink); margin-bottom: 8px; font-weight: 400; }\n        .adv-area:hover .adv-area-title { color: var(--sig); }\n        .adv-area-text { font-size: 15px; color: var(--ink-2); line-height: 1.7; }\n        .adv-cta-section { margin-top: 80px; padding: 48px; border: 1px solid var(--rule); text-align: center; position: relative; }\n\n        .adv-cta-title { font-family: 'Archivo', sans-serif; font-size: 28px; color: var(--ink); margin-bottom: 12px; }\n        .adv-cta-sub { font-size: 15px; color: var(--ink-3); margin-bottom: 8px; line-height: 1.6; }\n        .adv-cta-email { font-family: 'Archivo Narrow', 'Archivo', sans-serif; font-size: 14px; margin-top: 24px; }\n        .adv-cta-email a { color: var(--sig); text-decoration: none; transition: opacity 0.3s; }\n        .adv-cta-email a:hover { opacity: 0.7; }\n        .adv-context { margin-top: 80px; font-size: 14px; color: var(--ink-3); line-height: 1.8; max-width: 600px; }\n        .adv-context strong { color: var(--ink-3); font-weight: 500; }\n        @media (max-width: 768px) { .adv-page { padding: 120px 20px 60px; } .adv-area { grid-template-columns: 1fr; gap: 8px; } .adv-area-num { font-size: 18px; } }\n      "}</style>


      <div className="adv-page">
        <button className="adv-back" onClick={function() { navigate("/"); window.scrollTo(0, 0); }}>
          ← Back to Home
        </button>

        <div className="adv-eyebrow">Advisory</div>
        <h1 className="adv-title">
          Helping leaders navigate <em>government</em> in Saudi Arabia.
        </h1>
        <p className="adv-intro">
          I have spent over a decade inside the institutions that set the rules
          in Saudi Arabia. I advise companies, investors, and institutions that
          need to understand how those rules work, where they're going, and how
          to position around them.
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
          projects where my institutional knowledge of the Saudi regulatory
          landscape creates a direct advantage.
        </div>
      </div>

    </>
  );
}
