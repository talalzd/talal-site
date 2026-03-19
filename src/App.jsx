import { useState, useEffect } from 'react'
import { articles } from './articles'

const CSS = `
:root {
  --gold: #C8A97E;
  --gold-dim: #C8A97E33;
  --gold-glow: #C8A97E12;
  --bg: #0A0A0A;
  --bg-card: #111111;
  --bg-elevated: #141414;
  --text: #E8E4DF;
  --text-mid: #B0AAA4;
  --text-dim: #8A8580;
  --text-faint: #5A5550;
  --border: #1E1E1E;
  --border-light: #2a2a2a;
}

* { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; font-size: 16px; }

body {
  background: var(--bg);
  color: var(--text);
  font-family: 'DM Sans', sans-serif;
  font-weight: 300;
  line-height: 1.6;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

body::before {
  content: '';
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 9999;
}

nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  padding: 1.5rem 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(10,10,10,0.88);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
}

.nav-name {
  font-family: 'Instrument Serif', serif;
  font-size: 1.2rem;
  color: var(--gold);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
}

.nav-links { display: flex; gap: 2rem; list-style: none; }

.nav-links a {
  color: var(--text-dim);
  text-decoration: none;
  font-size: 0.78rem;
  font-weight: 400;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  transition: color 0.3s;
  cursor: pointer;
}

.nav-links a:hover { color: var(--gold); }

.hero {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 8rem 3rem 4rem;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
}

.hero::before {
  content: '';
  position: absolute;
  top: 15%;
  right: -15%;
  width: 700px;
  height: 700px;
  background: radial-gradient(circle, var(--gold-glow) 0%, transparent 65%);
  pointer-events: none;
}

.hero-eyebrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.68rem;
  font-weight: 300;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);
  opacity: 0;
  animation: fadeUp 0.7s 0.15s forwards;
}

.hero-tagline {
  font-family: 'Instrument Serif', serif;
  font-size: clamp(2.8rem, 6.5vw, 5.5rem);
  line-height: 1.1;
  color: var(--text);
  margin-bottom: 2.5rem;
  opacity: 0;
  animation: fadeUp 0.7s 0.55s forwards;
}

.hero-tagline .gold {
  font-style: italic;
  color: var(--gold);
}

.hero-description {
  max-width: 620px;
  font-size: 1.02rem;
  line-height: 1.8;
  color: var(--text-dim);
  margin-bottom: 3.5rem;
  opacity: 0;
  animation: fadeUp 0.7s 0.75s forwards;
}

.hero-metrics {
  display: flex;
  gap: 3.5rem;
  padding-top: 2.5rem;
  border-top: 1px solid var(--border);
  opacity: 0;
  animation: fadeUp 0.7s 0.95s forwards;
}

.metric { display: flex; flex-direction: column; }

.metric-value {
  font-family: 'Instrument Serif', serif;
  font-size: 1.9rem;
  color: var(--text);
  line-height: 1.2;
}

.metric-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.62rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--text-faint);
  margin-top: 0.3rem;
}

.section {
  padding: 6rem 3rem;
  max-width: 1200px;
  margin: 0 auto;
}

.section-border { border-top: 1px solid var(--border); }

.section-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.62rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 3rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.section-label::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border);
  max-width: 180px;
}

.trajectory-item {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 2.5rem;
  padding: 2rem 0;
  border-bottom: 1px solid var(--border);
  transition: all 0.35s;
}

.trajectory-item:first-child { border-top: 1px solid var(--border); }
.trajectory-item:hover { padding-left: 0.75rem; }

.trajectory-era {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  color: var(--text-faint);
  padding-top: 0.35rem;
}

.trajectory-content h3 {
  font-family: 'Instrument Serif', serif;
  font-size: 1.3rem;
  color: var(--text);
  margin-bottom: 0.15rem;
  font-weight: 400;
}

.trajectory-org {
  font-size: 0.82rem;
  color: var(--gold);
  margin-bottom: 0.65rem;
}

.trajectory-impact {
  font-size: 0.88rem;
  color: var(--text-dim);
  line-height: 1.65;
}

.domains-wrapper {
  border: 1px solid var(--border);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  background: var(--border);
  gap: 1px;
}

.domain-card {
  background: var(--bg);
  padding: 2.5rem 2rem;
  transition: background 0.35s;
  cursor: default;
}

.domain-card:hover { background: var(--bg-elevated); }
.domain-card:hover .domain-title { color: var(--gold); }

.domain-number {
  font-family: 'Instrument Serif', serif;
  font-size: 2.2rem;
  color: var(--border-light);
  margin-bottom: 0.85rem;
  line-height: 1;
}

.domain-title {
  font-family: 'Instrument Serif', serif;
  font-size: 1.1rem;
  color: var(--text);
  margin-bottom: 0.65rem;
  transition: color 0.3s;
}

.domain-text {
  font-size: 0.82rem;
  color: var(--text-dim);
  line-height: 1.7;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.75rem;
}

.article-card {
  border: 1px solid var(--border);
  padding: 2rem;
  transition: all 0.35s;
  cursor: pointer;
  position: relative;
}

.article-card::after {
  content: '→';
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  color: var(--gold);
  font-size: 1.1rem;
  opacity: 0;
  transform: translateX(-6px);
  transition: all 0.3s;
}

.article-card:hover {
  border-color: var(--gold-dim);
  background: var(--bg-elevated);
}

.article-card:hover::after { opacity: 1; transform: translateX(0); }

.article-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.58rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 0.9rem;
}

.article-title {
  font-family: 'Instrument Serif', serif;
  font-size: 1.15rem;
  color: var(--text);
  line-height: 1.4;
  margin-bottom: 0.85rem;
}

.article-excerpt {
  font-size: 0.82rem;
  color: var(--text-dim);
  line-height: 1.65;
}

.article-view {
  padding: 8rem 3rem 4rem;
  max-width: 720px;
  margin: 0 auto;
}

.article-view-back {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--gold);
  cursor: pointer;
  margin-bottom: 3rem;
  display: inline-block;
  transition: opacity 0.3s;
}

.article-view-back:hover { opacity: 0.7; }

.article-view-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.58rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 1.5rem;
}

.article-view-title {
  font-family: 'Instrument Serif', serif;
  font-size: clamp(2rem, 4vw, 3rem);
  color: var(--text);
  line-height: 1.15;
  margin-bottom: 1rem;
}

.article-view-meta {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.68rem;
  letter-spacing: 0.1em;
  color: var(--text-faint);
  margin-bottom: 2.5rem;
}

.article-view-body {
  font-size: 1.02rem;
  line-height: 1.85;
  color: var(--text-mid);
}

.article-view-body h2 {
  font-family: 'Instrument Serif', serif;
  font-size: 1.5rem;
  color: var(--text);
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  font-weight: 400;
}

.article-view-body p {
  margin-bottom: 1.25rem;
}

.cta-section {
  padding: 8rem 3rem;
  text-align: center;
  border-top: 1px solid var(--border);
  position: relative;
}

.cta-section::before {
  content: '';
  position: absolute;
  top: -50px; left: 50%;
  transform: translateX(-50%);
  width: 500px;
  height: 350px;
  background: radial-gradient(circle, var(--gold-glow) 0%, transparent 65%);
  pointer-events: none;
}

.cta-heading {
  font-family: 'Instrument Serif', serif;
  font-size: clamp(2rem, 4vw, 3.2rem);
  color: var(--text);
  margin-bottom: 0.75rem;
}

.cta-sub {
  font-size: 0.95rem;
  color: var(--text-dim);
  margin-bottom: 2.5rem;
  max-width: 480px;
  margin-left: auto;
  margin-right: auto;
}

.cta-links { display: flex; justify-content: center; gap: 1.5rem; }

.cta-link {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--gold);
  text-decoration: none;
  padding: 0.7rem 1.8rem;
  border: 1px solid var(--gold-dim);
  transition: all 0.3s;
  cursor: pointer;
  background: none;
}

.cta-link:hover {
  background: var(--gold);
  color: var(--bg);
}

footer {
  padding: 2rem 3rem;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.footer-copy { font-size: 0.72rem; color: var(--text-faint); }
.footer-links { display: flex; gap: 1.5rem; }

.footer-links a, .footer-links span {
  font-size: 0.72rem;
  color: var(--text-faint);
  text-decoration: none;
  transition: color 0.3s;
}

.footer-links a:hover { color: var(--gold); }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 900px) {
  nav { padding: 1rem 1.5rem; }
  .hero { padding: 7rem 1.5rem 3rem; }
  .section { padding: 4rem 1.5rem; }
  .hero-metrics { flex-wrap: wrap; gap: 1.75rem; }
  .trajectory-item { grid-template-columns: 1fr; gap: 0.4rem; }
  .domains-wrapper { grid-template-columns: 1fr; }
  .articles-grid { grid-template-columns: 1fr; }
  .cta-links { flex-direction: column; align-items: center; }
  .cta-section { padding: 5rem 1.5rem; }
  .nav-links { gap: 1rem; }
  .nav-links a { font-size: 0.68rem; }
  .article-view { padding: 7rem 1.5rem 3rem; }
}
`

const trajectory = [
  {
    era: '2024 — PRESENT',
    title: 'Director, Public Policy & Government Affairs',
    org: 'HP Inc. — Saudi Arabia, UAE, Egypt',
    impact: 'Reversed a $200M+ import restriction through multi-stakeholder advocacy. Built a regulatory intelligence function tracking 20+ new regulations per quarter. Launched a digital equity initiative reaching 700,000+ Saudi students.'
  },
  {
    era: '2021 — 2024',
    title: 'Public Policy Advisor',
    org: 'Royal Commission for AlUla — Institutional Design',
    impact: 'Built an entire policy department from scratch for a $15B+ mega-program. Established governance frameworks, resolved 90+ policy gaps, and cut the regulatory lifecycle by 50%.'
  },
  {
    era: '2019 — 2021',
    title: 'G20 Economic Policy Advisor',
    org: 'SAMA — Saudi G20 Presidency',
    impact: 'Authored "Menu of Policy Options: Enhancing Access to Opportunities for All," a flagship G20 Finance Track document adopted across member nations. Contributed to consensus-building across 20 nations and 12 international organizations.'
  },
  {
    era: '2017 — 2019',
    title: 'Economic Specialist',
    org: 'Monshaat — SME Authority',
    impact: "Established Saudi Arabia's first national SME Data Center with the Ministry of Commerce. Contributed to the National SME Strategy under Vision 2030."
  },
  {
    era: '2015 — 2017',
    title: 'Economic Analyst',
    org: 'Government — Economic Policy',
    impact: 'Co-authored economic diversification research that contributed to Vision 2030. Coordinated energy price reform policy across 6 government agencies.'
  }
]

const domains = [
  { number: '01', title: 'Tech Policy & AI Governance', text: "Cloud sovereignty. Data localization. AI regulatory frameworks. How governments approach technology governance without killing the companies they're trying to attract." },
  { number: '02', title: 'FDI & Industrial Strategy', text: 'Government incentive structures. Investment frameworks. Positioning multinationals inside national transformation programs so both sides get what they want.' },
  { number: '03', title: 'Regulatory Navigation', text: 'Import standards. Competition law. Anti-counterfeit enforcement. Three markets, three regulatory personalities. Knowing which door to knock on and when.' },
  { number: '04', title: 'National Economic Transformation', text: 'Vision 2030 policy architecture. SME ecosystem design. The kind of policy that starts as a white paper and actually becomes something people can measure.' },
  { number: '05', title: 'Multilateral Diplomacy', text: "G20 policy coordination. Cross-sovereign consensus. Getting multiple governments to agree on a single sentence is a skill that doesn't show up on most resumes." },
  { number: '06', title: 'Social Development & Digital Equity', text: 'Education access programs. Socioeconomic impact assessment. Policy that reaches 700,000 students is where government affairs stops being abstract.' }
]

function renderArticleContent(content) {
  return content.map((block, i) => {
    if (block.type === 'heading') return <h2 key={i}>{block.text}</h2>
    if (block.type === 'intro') return <p key={i} style={{ fontSize: '1.1rem', color: 'var(--text)' }}>{block.text}</p>
    return <p key={i}>{block.text}</p>
  })
}

function App() {
  const [selectedArticle, setSelectedArticle] = useState(null)

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = CSS
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])

  const scrollTo = (id) => {
    setSelectedArticle(null)
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }

  if (selectedArticle) {
    const article = articles.find(a => a.id === selectedArticle)
    if (!article) return null
    return (
      <>
        <nav>
          <div className="nav-name" onClick={() => { setSelectedArticle(null); window.scrollTo(0, 0) }}>TAZ</div>
          <ul className="nav-links">
            <li><a onClick={() => scrollTo('trajectory')}>Trajectory</a></li>
            <li><a onClick={() => scrollTo('domains')}>Expertise</a></li>
            <li><a onClick={() => scrollTo('writing')}>Writing</a></li>
            <li><a onClick={() => scrollTo('connect')}>Connect</a></li>
          </ul>
        </nav>
        <div className="article-view">
          <div className="article-view-back" onClick={() => { setSelectedArticle(null); setTimeout(() => document.getElementById('writing')?.scrollIntoView({ behavior: 'smooth' }), 50) }}>← Back to Writing</div>
          {article.tag && <div className="article-view-tag">{article.tag}</div>}
          <h1 className="article-view-title">{article.title}</h1>
          {article.date && <div className="article-view-meta">{article.date}{article.readTime ? ` · ${article.readTime}` : ''}</div>}
          <div className="article-view-body">
            {renderArticleContent(article.content)}
          </div>
        </div>
        <footer>
          <div className="footer-copy">© 2026 Talal Al Zayed</div>
          <div className="footer-links">
            <a href="mailto:talal.h.zd@gmail.com">talal.h.zd@gmail.com</a>
            <span>Riyadh, Saudi Arabia</span>
          </div>
        </footer>
      </>
    )
  }

  return (
    <>
      <nav>
        <div className="nav-name" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>TAZ</div>
        <ul className="nav-links">
          <li><a onClick={() => scrollTo('trajectory')}>Trajectory</a></li>
          <li><a onClick={() => scrollTo('domains')}>Expertise</a></li>
          <li><a onClick={() => scrollTo('writing')}>Writing</a></li>
          <li><a onClick={() => scrollTo('connect')}>Connect</a></li>
        </ul>
      </nav>

      <section className="hero">
        <div className="hero-eyebrow">Policy × Technology × Builder</div>
        <p className="hero-tagline">
          I don't just advise on <span className="gold">policy</span> — I build the systems that make it a <span className="gold">competitive weapon.</span>
        </p>
        <p className="hero-description">
          I have spent over a decade on both sides of the table. Government side: contributing to Vision 2030 economic policy, authoring a G20 flagship document, building a policy department from zero for a $15B mega-program. Industry side: protecting $200M+ in revenue for a Fortune 500 tech company by navigating the regulators I used to sit beside. I cover Saudi Arabia, UAE, and Egypt.
        </p>
        <div className="hero-metrics">
          <div className="metric">
            <span className="metric-value">$200M+</span>
            <span className="metric-label">Revenue Protected</span>
          </div>
          <div className="metric">
            <span className="metric-value">10+</span>
            <span className="metric-label">Years in Policy</span>
          </div>
          <div className="metric">
            <span className="metric-value">3</span>
            <span className="metric-label">Markets</span>
          </div>
          <div className="metric">
            <span className="metric-value">G20</span>
            <span className="metric-label">Policy Author</span>
          </div>
        </div>
      </section>

      <section className="section section-border" id="trajectory">
        <div className="section-label">Trajectory</div>
        <div>
          {trajectory.map((item, i) => (
            <div className="trajectory-item" key={i}>
              <div className="trajectory-era">{item.era}</div>
              <div className="trajectory-content">
                <h3>{item.title}</h3>
                <div className="trajectory-org">{item.org}</div>
                <div className="trajectory-impact">{item.impact}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section section-border" id="domains">
        <div className="section-label">Domains of Expertise</div>
        <div className="domains-wrapper">
          {domains.map((d, i) => (
            <div className="domain-card" key={i}>
              <div className="domain-number">{d.number}</div>
              <div className="domain-title">{d.title}</div>
              <div className="domain-text">{d.text}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section section-border" id="writing">
        <div className="section-label">Writing</div>
        <div className="articles-grid">
          {articles.map((article) => (
            <div className="article-card" key={article.id} onClick={() => { setSelectedArticle(article.id); window.scrollTo(0, 0) }}>
              {article.tag && <div className="article-tag">{article.tag}</div>}
              <div className="article-title">{article.title}</div>
              <div className="article-excerpt">{article.excerpt}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section" id="connect">
        <h2 className="cta-heading">Let's talk policy.</h2>
        <p className="cta-sub">Navigating government, technology, and investment across the Gulf. Always open to a good conversation.</p>
        <div className="cta-links">
          <a href="mailto:talal.h.zd@gmail.com" className="cta-link">Email</a>
          <a href="https://linkedin.com/in/talalalzayed" className="cta-link" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="/Talal_AlZayed_Resume.pdf" className="cta-link" download>Resume ↓</a>
        </div>
      </section>

      <footer>
        <div className="footer-copy">© 2026 Talal Al Zayed</div>
        <div className="footer-links">
          <a href="mailto:talal.h.zd@gmail.com">talal.h.zd@gmail.com</a>
          <span>Riyadh, Saudi Arabia</span>
        </div>
      </footer>
    </>
  )
}

export default App
