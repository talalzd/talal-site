import { useState, useEffect, useRef } from "react";
import articleData from "./articles.js";

const SECTIONS = ["home", "perspectives", "about", "connect"];

// All perspectives come from articles.js
const allPerspectives = articleData;

const career = [
  {
    role: "Director, Public Policy & Government Affairs",
    org: "HP Inc.",
    scope: "Saudi Arabia & UAE",
    highlight: "Reversed a restrictive import rule protecting $200M+ in annual revenue. Established the nation's first AI Center of Excellence.",
  },
  {
    role: "Public Policy Advisor",
    org: "Royal Commission for Al-Ula",
    scope: "Institutional Design",
    highlight: "Built the entire Public Policy Department from zero. Accelerated the policy-making lifecycle by 50%.",
  },
  {
    role: "G20 Economic Policy Advisor",
    org: "Saudi Arabian Monetary Authority",
    scope: "Multilateral Diplomacy",
    highlight: "Authored key G20 Finance Track policy documents adopted across member nations.",
  },
  {
    role: "Economic Specialist",
    org: "Monshaat (SME Authority)",
    scope: "National Strategy",
    highlight: "Established Saudi Arabia's first national SME Data Center. Led the National SME Strategy.",
  },
  {
    role: "Economic Analyst",
    org: "The Royal Court",
    scope: "Vision 2030 Foundation",
    highlight: "Co-authored strategic research that informed key components of Vision 2030.",
  },
];

export default function TalalSite() {
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [hoveredPerspective, setHoveredPerspective] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [activeArticle, setActiveArticle] = useState(null);
  const sectionRefs = useRef({});

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY || document.documentElement.scrollTop);
      const offsets = SECTIONS.map((s) => {
        const el = sectionRefs.current[s];
        if (!el) return { id: s, top: 0 };
        return { id: s, top: el.getBoundingClientRect().top };
      });
      const current = offsets.reduce((prev, curr) =>
        Math.abs(curr.top) < Math.abs(prev.top) ? curr : prev
      );
      setActiveSection(current.id);
    };
    const container = document.getElementById("talal-scroll-root");
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true });
      return () => container.removeEventListener("scroll", handleScroll);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => {
    setMenuOpen(false);
    setActiveArticle(null);
    setTimeout(() => {
      const el = sectionRefs.current[id];
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return (
    <div
      id="talal-scroll-root"
      style={{
        fontFamily: "'DM Sans', sans-serif",
        background: "#0A0A0A",
        color: "#E8E4DF",
        minHeight: "100vh",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        ::selection {
          background: #C8A97E;
          color: #0A0A0A;
        }

        .nav-fixed {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          padding: 20px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(10,10,10,0.85);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(200,169,126,0.08);
          transition: all 0.4s ease;
        }

        .nav-logo {
          font-family: 'Instrument Serif', serif;
          font-size: 22px;
          color: #C8A97E;
          cursor: pointer;
          letter-spacing: -0.5px;
          transition: opacity 0.3s;
        }
        .nav-logo:hover { opacity: 0.7; }

        .nav-links {
          display: flex;
          gap: 32px;
          align-items: center;
        }

        .nav-link {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #6B6560;
          cursor: pointer;
          transition: color 0.3s;
          background: none;
          border: none;
          padding: 4px 0;
          position: relative;
        }
        .nav-link:hover, .nav-link.active {
          color: #C8A97E;
        }
        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 1px;
          background: #C8A97E;
        }

        @media (max-width: 768px) {
          .nav-fixed { padding: 16px 20px; }
          .nav-links { display: none; }
          .mobile-toggle { display: block !important; }
        }

        .hero-section {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 120px 40px 80px;
          position: relative;
          overflow: hidden;
        }

        .hero-grain {
          position: absolute;
          inset: 0;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          pointer-events: none;
        }

        .hero-accent-line {
          position: absolute;
          top: 0;
          left: 40px;
          width: 1px;
          height: 100%;
          background: linear-gradient(to bottom, transparent, rgba(200,169,126,0.15) 30%, rgba(200,169,126,0.15) 70%, transparent);
        }

        .hero-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 4px;
          color: #C8A97E;
          margin-bottom: 32px;
          opacity: 0;
          transform: translateY(20px);
          animation: fadeUp 0.8s ease forwards;
          animation-delay: 0.3s;
        }

        .hero-title {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(42px, 7vw, 90px);
          line-height: 1.05;
          color: #E8E4DF;
          max-width: 900px;
          margin-bottom: 36px;
          opacity: 0;
          transform: translateY(30px);
          animation: fadeUp 0.8s ease forwards;
          animation-delay: 0.5s;
        }

        .hero-title em {
          font-style: italic;
          color: #C8A97E;
        }

        .hero-sub {
          font-size: 18px;
          line-height: 1.7;
          color: #ADA8A3;
          max-width: 620px;
          margin-bottom: 48px;
          opacity: 0;
          transform: translateY(20px);
          animation: fadeUp 0.8s ease forwards;
          animation-delay: 0.7s;
        }

        .hero-cta {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 48px;
          opacity: 0;
          transform: translateY(20px);
          animation: fadeUp 0.8s ease forwards;
          animation-delay: 0.85s;
        }

        .hero-cta-btn {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 2px;
          padding: 16px 32px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
        }

        .hero-cta-btn.primary {
          background: #C8A97E;
          color: #0A0A0A;
          border: 1px solid #C8A97E;
        }
        .hero-cta-btn.primary:hover {
          background: transparent;
          color: #C8A97E;
        }

        .hero-cta-btn.secondary {
          background: transparent;
          color: #C8A97E;
          border: 1px solid rgba(200,169,126,0.3);
        }
        .hero-cta-btn.secondary:hover {
          background: #C8A97E;
          color: #0A0A0A;
          border-color: #C8A97E;
        }

        .hero-stats {
          display: flex;
          gap: 48px;
          flex-wrap: wrap;
          opacity: 0;
          transform: translateY(20px);
          animation: fadeUp 0.8s ease forwards;
          animation-delay: 0.9s;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .stat-number {
          font-family: 'Instrument Serif', serif;
          font-size: 36px;
          color: #C8A97E;
        }
        .stat-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #8A8580;
        }

        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 64px;
        }
        .section-number {
          font-family: 'Instrument Serif', serif;
          font-size: 14px;
          color: #C8A97E;
          opacity: 0.5;
        }
        .section-line {
          flex: 1;
          height: 1px;
          background: rgba(200,169,126,0.12);
        }
        .section-title {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 4px;
          color: #6B6560;
        }

        .perspectives-section {
          padding: 120px 40px;
          position: relative;
        }

        .perspective-card {
          border-top: 1px solid rgba(200,169,126,0.1);
          padding: 40px 0;
          cursor: pointer;
          transition: all 0.4s ease;
          display: grid;
          grid-template-columns: 140px 1fr;
          gap: 40px;
          align-items: start;
        }

        .perspective-card:hover {
          padding-left: 20px;
        }

        .perspective-card:last-child {
          border-bottom: 1px solid rgba(200,169,126,0.1);
        }

        .perspective-meta {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .perspective-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #C8A97E;
        }

        .perspective-date {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: #6B6560;
          letter-spacing: 1px;
        }

        .perspective-content h3 {
          font-family: 'Instrument Serif', serif;
          font-size: 28px;
          line-height: 1.2;
          color: #E8E4DF;
          margin-bottom: 12px;
          transition: color 0.3s;
        }

        .perspective-card:hover .perspective-content h3 {
          color: #C8A97E;
        }

        .perspective-content p {
          font-size: 15px;
          line-height: 1.7;
          color: #8A8580;
          max-width: 680px;
          transition: color 0.3s;
        }

        .perspective-card:hover .perspective-content p {
          color: #ADA8A3;
        }

        .perspective-read {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #6B6560;
          margin-top: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: color 0.3s;
        }

        .perspective-card:hover .perspective-read {
          color: #C8A97E;
        }

        @media (max-width: 768px) {
          .perspective-card {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          .perspective-meta {
            flex-direction: row;
            align-items: center;
          }
        }

        .about-section {
          padding: 120px 40px;
          position: relative;
        }

        .about-photo-row {
          display: flex;
          align-items: center;
          gap: 48px;
          margin-bottom: 64px;
        }

        .about-photo-wrapper {
          width: 200px;
          height: 200px;
          flex-shrink: 0;
          position: relative;
          border-radius: 4px;
          overflow: hidden;
        }

        .about-photo-wrapper::after {
          content: '';
          position: absolute;
          inset: 0;
          border: 1px solid rgba(200,169,126,0.2);
          border-radius: 4px;
          pointer-events: none;
        }

        .about-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 15%;
          filter: grayscale(30%) contrast(1.05);
          transition: filter 0.5s ease;
        }

        .about-photo-wrapper:hover .about-photo {
          filter: grayscale(0%) contrast(1);
        }

        .about-photo-intro {
          font-family: 'Instrument Serif', serif;
          font-size: 32px;
          line-height: 1.4;
          color: #B0AAA4;
        }

        .about-photo-intro strong {
          color: #E8E4DF;
          font-weight: 400;
        }

        .about-photo-intro em {
          color: #C8A97E;
          font-style: italic;
        }

        @media (max-width: 768px) {
          .about-photo-row {
            flex-direction: column;
            text-align: center;
            gap: 32px;
          }
          .about-photo-wrapper {
            width: 160px;
            height: 160px;
          }
        }

        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: start;
        }

        @media (max-width: 900px) {
          .about-grid { grid-template-columns: 1fr; gap: 48px; }
        }

        .about-narrative {
          font-family: 'Instrument Serif', serif;
          font-size: 26px;
          line-height: 1.5;
          color: #B0AAA4;
        }

        .about-narrative strong {
          color: #E8E4DF;
          font-weight: 400;
        }

        .about-narrative em {
          color: #C8A97E;
          font-style: italic;
        }

        .career-item {
          padding: 24px 0;
          border-top: 1px solid rgba(200,169,126,0.08);
        }

        .career-item:last-child {
          border-bottom: 1px solid rgba(200,169,126,0.08);
        }

        .career-role {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: #E8E4DF;
          margin-bottom: 2px;
        }

        .career-org {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #C8A97E;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .career-highlight {
          font-size: 13px;
          color: #8A8580;
          line-height: 1.6;
        }

        .connect-section {
          padding: 120px 40px;
          position: relative;
          text-align: center;
        }

        .connect-headline {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(32px, 5vw, 56px);
          color: #E8E4DF;
          margin-bottom: 24px;
          line-height: 1.15;
        }

        .connect-headline em {
          color: #C8A97E;
          font-style: italic;
        }

        .connect-sub {
          font-size: 16px;
          color: #6B6560;
          max-width: 500px;
          margin: 0 auto 48px;
          line-height: 1.7;
        }

        .connect-links {
          display: flex;
          justify-content: center;
          gap: 24px;
          flex-wrap: wrap;
        }

        .connect-btn {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 2px;
          padding: 16px 32px;
          border: 1px solid rgba(200,169,126,0.3);
          background: transparent;
          color: #C8A97E;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
        }

        .connect-btn:hover {
          background: #C8A97E;
          color: #0A0A0A;
          border-color: #C8A97E;
        }

        .connect-btn.primary {
          background: #C8A97E;
          color: #0A0A0A;
          border-color: #C8A97E;
        }
        .connect-btn.primary:hover {
          background: transparent;
          color: #C8A97E;
        }

        .article-view {
          min-height: 100vh;
          padding: 120px 40px 80px;
          max-width: 780px;
          margin: 0 auto;
        }

        .article-back {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #C8A97E;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
          margin-bottom: 48px;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: opacity 0.3s;
        }
        .article-back:hover { opacity: 0.7; }

        .article-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 3px;
          color: #C8A97E;
          margin-bottom: 20px;
        }

        .article-date {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: #6B6560;
          letter-spacing: 1px;
          margin-bottom: 24px;
        }

        .article-title {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(32px, 5vw, 48px);
          line-height: 1.15;
          color: #E8E4DF;
          margin-bottom: 48px;
        }

        .article-body-intro {
          font-family: 'Instrument Serif', serif;
          font-size: 22px;
          line-height: 1.6;
          color: #B0AAA4;
          margin-bottom: 36px;
          padding-bottom: 36px;
          border-bottom: 1px solid rgba(200,169,126,0.1);
        }

        .article-body-text {
          font-size: 17px;
          line-height: 1.8;
          color: #ADA8A3;
          margin-bottom: 24px;
        }

        .article-body-heading {
          font-family: 'Instrument Serif', serif;
          font-size: 26px;
          color: #E8E4DF;
          margin-top: 48px;
          margin-bottom: 20px;
        }

        .article-author {
          margin-top: 64px;
          padding-top: 32px;
          border-top: 1px solid rgba(200,169,126,0.1);
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .article-author-info {
          font-size: 14px;
          color: #6B6560;
        }

        .article-author-name {
          color: #E8E4DF;
          font-weight: 500;
          margin-bottom: 2px;
        }

        @media (max-width: 768px) {
          .article-view { padding: 100px 20px 60px; }
        }

        .article-image-block {
          margin: 36px 0;
        }

        .article-image-block img {
          width: 100%;
          border-radius: 4px;
          border: 1px solid rgba(200,169,126,0.1);
        }

        .article-image-caption {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #6B6560;
          margin-top: 12px;
          line-height: 1.6;
        }

        .article-stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin: 36px 0;
        }

        .article-stat-card {
          background: #111110;
          border-radius: 6px;
          padding: 20px;
          text-align: center;
        }

        .article-stat-number {
          font-family: 'Instrument Serif', serif;
          font-size: 28px;
          color: #C8A97E;
          margin-bottom: 6px;
        }

        .article-stat-number.highlight-green {
          color: #5DCAA5;
        }

        .article-stat-number.highlight-accent {
          color: #C8A97E;
        }

        .article-stat-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #6B6560;
        }

        .article-callout {
          border-left: 3px solid #C8A97E;
          padding: 20px 24px;
          margin: 36px 0;
          background: rgba(200,169,126,0.04);
          border-radius: 0 4px 4px 0;
        }

        .article-callout p {
          font-size: 15px;
          line-height: 1.7;
          color: #ADA8A3;
          margin: 0;
        }

        @media (max-width: 768px) {
          .article-stats-row {
            grid-template-columns: 1fr;
            gap: 12px;
          }
        }

        .footer {
          padding: 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid rgba(200,169,126,0.06);
          flex-wrap: wrap;
          gap: 16px;
        }

        .footer-left {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: #3A3530;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .footer-quote {
          font-family: 'Instrument Serif', serif;
          font-size: 14px;
          color: #3A3530;
          font-style: italic;
        }

        .mobile-toggle {
          display: none;
          background: none;
          border: none;
          color: #C8A97E;
          font-size: 24px;
          cursor: pointer;
        }

        .mobile-menu {
          position: fixed;
          inset: 0;
          z-index: 200;
          background: rgba(10,10,10,0.98);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 32px;
        }

        .mobile-menu button {
          font-family: 'Instrument Serif', serif;
          font-size: 36px;
          color: #E8E4DF;
          background: none;
          border: none;
          cursor: pointer;
          transition: color 0.3s;
        }
        .mobile-menu button:hover { color: #C8A97E; }

        .mobile-close {
          position: absolute;
          top: 20px;
          right: 20px;
          font-size: 28px !important;
          color: #6B6560 !important;
        }

        .arabic-watermark {
          position: absolute;
          right: 40px;
          top: 50%;
          transform: translateY(-50%);
          font-family: 'Instrument Serif', serif;
          font-size: 180px;
          color: rgba(200,169,126,0.03);
          writing-mode: vertical-rl;
          pointer-events: none;
          user-select: none;
        }

        @media (max-width: 768px) {
          .hero-section { padding: 100px 20px 60px; }
          .perspectives-section, .about-section, .connect-section { padding: 80px 20px; }
          .hero-stats { gap: 32px; }
          .arabic-watermark { display: none; }
        }
      `}</style>

      {/* NAV */}
      <nav className="nav-fixed">
        <div className="nav-logo" onClick={() => scrollTo("home")}>
          TAZ
        </div>
        <div className="nav-links">
          {[
            { id: "perspectives", label: "Perspectives" },
            { id: "about", label: "About" },
            { id: "connect", label: "Connect" },
          ].map((item) => (
            <button
              key={item.id}
              className={`nav-link ${activeSection === item.id ? "active" : ""}`}
              onClick={() => scrollTo(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <button
          className="mobile-toggle"
          onClick={() => setMenuOpen(true)}
        >
          ☰
        </button>
      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="mobile-menu">
          <button className="mobile-close" onClick={() => setMenuOpen(false)}>
            ✕
          </button>
          {SECTIONS.map((s) => (
            <button key={s} onClick={() => scrollTo(s)}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* ARTICLE VIEW */}
      {activeArticle ? (
        <>
          <div className="article-view">
            <button
              className="article-back"
              onClick={() => {
                setActiveArticle(null);
                setTimeout(() => scrollTo("perspectives"), 100);
              }}
            >
              ← Back to Perspectives
            </button>
            <div className="article-tag">{activeArticle.tag}</div>
            <div className="article-date">{activeArticle.date} · {activeArticle.readTime}</div>
            <h1 className="article-title">{activeArticle.title}</h1>
            {activeArticle.content.map((block, i) => {
              if (block.type === "intro")
                return <p key={i} className="article-body-intro">{block.text}</p>;
              if (block.type === "heading")
                return <h2 key={i} className="article-body-heading">{block.text}</h2>;
              if (block.type === "image")
                return (
                  <div key={i} className="article-image-block">
                    <img src={block.src} alt={block.alt || ""} />
                    {block.caption && <div className="article-image-caption">{block.caption}</div>}
                  </div>
                );
              if (block.type === "stats")
                return (
                  <div key={i} className="article-stats-row">
                    {block.items.map((stat, j) => (
                      <div key={j} className="article-stat-card">
                        <div className={`article-stat-number ${stat.highlight || ""}`}>{stat.value}</div>
                        <div className="article-stat-label">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                );
              if (block.type === "callout")
                return (
                  <div key={i} className="article-callout">
                    <p>{block.text}</p>
                  </div>
                );
              return <p key={i} className="article-body-text">{block.text}</p>;
            })}
            <div className="article-author">
              <img
                src="/talal.jpg"
                alt="Talal Al Zayed, Public Policy and Government Affairs Executive"
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 4,
                  objectFit: "cover",
                  objectPosition: "center 15%",
                  filter: "grayscale(30%)",
                }}
              />
              <div className="article-author-info">
                <div className="article-author-name">Talal Al Zayed</div>
                Director, Public Policy & Government Affairs
              </div>
            </div>
          </div>
          <footer className="footer">
            <div className="footer-left">© 2026 Talal Al Zayed</div>
            <div className="footer-quote">
              على قدر أهل العزم تأتي العزائم
            </div>
          </footer>
        </>
      ) : (
      <>
      {/* HERO */}
      <section
        ref={(el) => (sectionRefs.current.home = el)}
        className="hero-section"
      >
        <div className="hero-grain" />
        <div className="hero-accent-line" />
        <div className="arabic-watermark">طلال</div>

        <div className="hero-tag">Policy × Technology × Builder</div>

        <h1 className="hero-title">
          I don't just advise on <em>policy</em> — I build the systems that
          make it a <em>competitive weapon.</em>
        </h1>

        <p className="hero-sub">
          10+ years shaping tech policy, industrial strategy, and commercial
          outcomes across Saudi Arabia, UAE, and Egypt. Turning regulatory
          complexity into market access.
        </p>

        <div className="hero-cta">
          <button
            className="hero-cta-btn primary"
            onClick={() => scrollTo("perspectives")}
          >
            Read My Perspectives
          </button>
          <button
            className="hero-cta-btn secondary"
            onClick={() => scrollTo("connect")}
          >
            Let's Connect
          </button>
        </div>

        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-number">10+</span>
            <span className="stat-label">Years in Policy</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">$200M+</span>
            <span className="stat-label">Revenue Protected</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">3</span>
            <span className="stat-label">Markets Covered</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">G20</span>
            <span className="stat-label">Policy Author</span>
          </div>
        </div>
      </section>

      {/* PERSPECTIVES */}
      <section
        ref={(el) => (sectionRefs.current.perspectives = el)}
        className="perspectives-section"
      >
        <div className="section-header">
          <span className="section-number">01</span>
          <span className="section-title">Perspectives</span>
          <div className="section-line" />
        </div>

        {allPerspectives.map((p) => (
          <div
            key={p.id}
            className="perspective-card"
            onMouseEnter={() => setHoveredPerspective(p.id)}
            onMouseLeave={() => setHoveredPerspective(null)}
            onClick={() => {
              if (p.content) {
                setActiveArticle(p);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            style={{ cursor: p.content ? "pointer" : "default" }}
          >
            <div className="perspective-meta">
              <span className="perspective-tag">{p.tag}</span>
              <span className="perspective-date">
                {p.date} · {p.readTime}
              </span>
            </div>
            <div className="perspective-content">
              <h3>{p.title}</h3>
              <p>{p.excerpt}</p>
              {p.content ? (
                <div className="perspective-read">
                  Read more →
                </div>
              ) : (
                <div className="perspective-read" style={{ color: "#3A3530" }}>
                  Coming soon
                </div>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* ABOUT */}
      <section
        ref={(el) => (sectionRefs.current.about = el)}
        className="about-section"
      >
        <div className="section-header">
          <span className="section-number">02</span>
          <span className="section-title">About</span>
          <div className="section-line" />
        </div>

        <div className="about-photo-row">
          <div className="about-photo-wrapper">
            <img
              src="/talal.jpg"
              alt="Talal Al Zayed, Director of Public Policy and Government Affairs, Riyadh Saudi Arabia"
              className="about-photo"
            />
          </div>
          <div className="about-photo-intro">
            <strong>Talal Al Zayed</strong> — a policy executive who <em>builds</em>. Based in Riyadh, operating across Saudi Arabia, UAE, and Egypt.
          </div>
        </div>

        <div className="about-grid">
          <div className="about-narrative">
            <p style={{ marginBottom: 24 }}>
              I started at <strong>the Royal Court</strong>, where I helped
              shape the economic research that fed into <em>Vision 2030</em>.
              From there, I built Saudi Arabia's first SME Data Center, advised
              on <strong>G20 Finance Track</strong> policy that was adopted
              across member nations, and architected an entire policy department
              for the <strong>Royal Commission for Al-Ula</strong> from scratch.
            </p>
            <p style={{ marginBottom: 24 }}>
              Today at <strong>HP Inc.</strong>, I turn regulatory complexity
              into commercial advantage — negotiating with standards bodies,
              securing investment incentives, and building anti-counterfeit
              strategies across Saudi Arabia and the UAE.
            </p>
            <p>
              But here's what makes me different:{" "}
              <em>I build things.</em> I write code. I ship apps. I
              constructed an AI-powered policy monitoring system that tracks 40+
              government sources in real time. I believe the future of government
              affairs belongs to people who can <strong>think in policy</strong>{" "}
              and <strong>build in product</strong>.
            </p>
          </div>

          <div>
            <div style={{ marginBottom: 32 }}>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: 2,
                  color: "#6B6560",
                  marginBottom: 20,
                }}
              >
                Career Arc
              </div>
              {career.map((c, i) => (
                <div key={i} className="career-item">
                  <div className="career-role">{c.role}</div>
                  <div className="career-org">{c.org}</div>
                  <div className="career-highlight">{c.highlight}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 40 }}>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: 2,
                  color: "#6B6560",
                  marginBottom: 16,
                }}
              >
                Education
              </div>
              <div style={{ fontSize: 14, color: "#8A8580", lineHeight: 1.8 }}>
                <div>
                  <span style={{ color: "#B0AAA4" }}>MPP</span> — KAPSARC
                  School of Public Policy
                </div>
                <div>
                  <span style={{ color: "#B0AAA4" }}>MBA, Entrepreneurship</span>{" "}
                  — MBS College
                </div>
                <div>
                  <span style={{ color: "#B0AAA4" }}>B.Econ</span> — Trent
                  University
                </div>
              </div>
            </div>

            <div style={{ marginTop: 32 }}>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: 2,
                  color: "#6B6560",
                  marginBottom: 16,
                }}
              >
                Credentials
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "#6B6560",
                  lineHeight: 1.8,
                }}
              >
                Harvard Kennedy School · LSE (×2) · PROSCI · PMP · Udacity
              </div>
            </div>

            <a
              href="/Talal_AlZayed_CV.pdf"
              target="_blank"
              rel="noopener"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                marginTop: 36,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: 2,
                padding: "14px 28px",
                border: "1px solid rgba(200,169,126,0.3)",
                background: "transparent",
                color: "#C8A97E",
                textDecoration: "none",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#C8A97E";
                e.target.style.color = "#0A0A0A";
                e.target.style.borderColor = "#C8A97E";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
                e.target.style.color = "#C8A97E";
                e.target.style.borderColor = "rgba(200,169,126,0.3)";
              }}
            >
              ↓ Download Executive CV
            </a>
          </div>
        </div>
      </section>

      {/* CONNECT */}
      <section
        ref={(el) => (sectionRefs.current.connect = el)}
        className="connect-section"
      >
        <div className="section-header">
          <span className="section-number">03</span>
          <span className="section-title">Connect</span>
          <div className="section-line" />
        </div>

        <h2 className="connect-headline">
          Let's talk <em>policy, technology,</em>
          <br />
          and what's <em>next.</em>
        </h2>

        <p className="connect-sub">
          Available for advisory engagements, speaking invitations,
          and conversations about tech policy in the Gulf and beyond.
        </p>

        <div className="connect-links">
          <a href="mailto:talal.h.zd@gmail.com" className="connect-btn primary">
            Email Me
          </a>
          <a
            href="https://www.linkedin.com/in/talal-alzayed/"
            target="_blank"
            rel="noopener"
            className="connect-btn"
          >
            LinkedIn
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-left">© 2026 Talal Al Zayed</div>
        <div className="footer-quote">
          على قدر أهل العزم تأتي العزائم
        </div>
      </footer>
      </>
      )}
    </div>
  );
}
