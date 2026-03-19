import { useState } from 'react'
import { articles } from './articles'
import './App.css'

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
    impact: 'Established Saudi Arabia\'s first national SME Data Center with the Ministry of Commerce. Contributed to the National SME Strategy under Vision 2030.'
  },
  {
    era: '2015 — 2017',
    title: 'Economic Analyst',
    org: 'Government — Economic Policy',
    impact: 'Co-authored economic diversification research that contributed to Vision 2030. Coordinated energy price reform policy across 6 government agencies.'
  }
]

const domains = [
  {
    number: '01',
    title: 'Tech Policy & AI Governance',
    text: 'Cloud sovereignty. Data localization. AI regulatory frameworks. How governments approach technology governance without killing the companies they\'re trying to attract.'
  },
  {
    number: '02',
    title: 'FDI & Industrial Strategy',
    text: 'Government incentive structures. Investment frameworks. Positioning multinationals inside national transformation programs so both sides get what they want.'
  },
  {
    number: '03',
    title: 'Regulatory Navigation',
    text: 'Import standards. Competition law. Anti-counterfeit enforcement. Three markets, three regulatory personalities. Knowing which door to knock on and when.'
  },
  {
    number: '04',
    title: 'National Economic Transformation',
    text: 'Vision 2030 policy architecture. SME ecosystem design. The kind of policy that starts as a white paper and actually becomes something people can measure.'
  },
  {
    number: '05',
    title: 'Multilateral Diplomacy',
    text: 'G20 policy coordination. Cross-sovereign consensus. Getting multiple governments to agree on a single sentence is a skill that doesn\'t show up on most resumes.'
  },
  {
    number: '06',
    title: 'Social Development & Digital Equity',
    text: 'Education access programs. Socioeconomic impact assessment. Policy that reaches 700,000 students is where government affairs stops being abstract.'
  }
]

function App() {
  const [selectedArticle, setSelectedArticle] = useState(null)

  const scrollTo = (id) => {
    setSelectedArticle(null)
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }

  if (selectedArticle) {
    const article = articles.find(a => a.slug === selectedArticle)
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
          <div className="article-view-body" dangerouslySetInnerHTML={{ __html: article.body }} />
        </div>
        <footer>
          <div className="footer-copy">© 2026 Talal Al Zayed</div>
          <div className="footer-links">
            <a href="mailto:talal.h.zd@gmail.com">talal.h.zd@gmail.com</a>
            <span style={{ color: 'var(--text-faint)', fontSize: '0.72rem' }}>Riyadh, Saudi Arabia</span>
          </div>
        </footer>
      </>
    )
  }

  return (
    <>
      {/* NAV */}
      <nav>
        <div className="nav-name" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>TAZ</div>
        <ul className="nav-links">
          <li><a onClick={() => scrollTo('trajectory')}>Trajectory</a></li>
          <li><a onClick={() => scrollTo('domains')}>Expertise</a></li>
          <li><a onClick={() => scrollTo('writing')}>Writing</a></li>
          <li><a onClick={() => scrollTo('connect')}>Connect</a></li>
        </ul>
      </nav>

      {/* HERO */}
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

      {/* TRAJECTORY */}
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

      {/* DOMAINS */}
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

      {/* WRITING */}
      <section className="section section-border" id="writing">
        <div className="section-label">Writing</div>
        <div className="articles-grid">
          {articles.map((article, i) => (
            <div className="article-card" key={i} onClick={() => { setSelectedArticle(article.slug); window.scrollTo(0, 0) }}>
              {article.tag && <div className="article-tag">{article.tag}</div>}
              <div className="article-title">{article.title}</div>
              <div className="article-excerpt">{article.excerpt}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" id="connect">
        <h2 className="cta-heading">Let's talk policy.</h2>
        <p className="cta-sub">Navigating government, technology, and investment across the Gulf. Always open to a good conversation.</p>
        <div className="cta-links">
          <a href="mailto:talal.h.zd@gmail.com" className="cta-link">Email</a>
          <a href="https://linkedin.com/in/talalalzayed" className="cta-link" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="/Talal_AlZayed_Resume.pdf" className="cta-link" download>Resume ↓</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-copy">© 2026 Talal Al Zayed</div>
        <div className="footer-links">
          <a href="mailto:talal.h.zd@gmail.com">talal.h.zd@gmail.com</a>
          <span style={{ color: 'var(--text-faint)', fontSize: '0.72rem' }}>Riyadh, Saudi Arabia</span>
        </div>
      </footer>
    </>
  )
}

export default App
