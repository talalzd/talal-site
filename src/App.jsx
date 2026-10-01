import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import articleData from "./articles.js";
import Advisory from "./Advisory.jsx";

const SECTIONS = ["home", "perspectives", "record", "projects", "about", "connect"];

// Sort perspectives by date, newest first
const allPerspectives = [...articleData].sort((a, b) => {
  const dateA = new Date(a.date);
  const dateB = new Date(b.date);
  return dateB - dateA;
});

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

// Article tags are stored in capitals. Show them in sentence case, keeping acronyms.
const ACRONYMS = ["AI", "FDI", "GCC", "UAE", "SME", "G20"];
const formatTag = (t) => {
  const words = (t || "").toLowerCase().split(" ").map((w) =>
    ACRONYMS.includes(w.toUpperCase()) ? w.toUpperCase() : w
  );
  const out = words.join(" ");
  return out.charAt(0).toUpperCase() + out.slice(1);
};

const focusAreas = [
  { q: "Market access and licensing", a: "Which activities can be licensed, what the ownership rules allow, and who actually signs. The approving authority is often not the ministry you have been talking to." },
  { q: "Local content and procurement", a: "Getting onto the mandatory procurement list, and what the government expects in return: hiring, local content, technology transfer and headquarters commitments." },
  { q: "Digital and AI governance", a: "Data residency, cloud sovereignty and the direction of AI regulation across the Gulf, where the frameworks are diverging rather than converging." },
  { q: "Policy risk and timing", a: "Saudi rules move quarterly. Most of the value is in seeing a change early, not reacting on the day it lands." },
];

const statusRows = [
  { k: "Speaking and moderation", v: "Open", tone: "sig" },
  { k: "Introductions", v: "Always", tone: "sig" },
  { k: "Advisory engagements", v: "Limited", tone: "flag" },
  { k: "Board and advisory seats", v: "Selective" },
  { k: "Based", v: "Riyadh" },
  { k: "Working languages", v: "Arabic, English" },
];

// Track record. Dates and outcomes match the CV. Nokia has no outcomes yet: add them only when Talal confirms them.
const trackRecord = [
  {
    dates: "Aug 2026 to now",
    role: "Head of policy and government affairs",
    org: "Nokia, Saudi Arabia",
    outcome: null,
  },
  {
    dates: "May 2024 to Jul 2026",
    role: "Director, public policy and government affairs",
    org: "HP, Saudi Arabia, UAE and Egypt",
    outcome: <>Reversed a restrictive SASO import standard that threatened <b>$200M+</b> in annual revenue. Negotiated the partnerships behind Saudi Arabia's first AI Center of Excellence at KFUPM. Launched a digital equity program reaching <b>700,000+</b> Saudi students.</>,
  },
  {
    dates: "Jun 2021 to Apr 2024",
    role: "Public policy advisor, founding department head",
    org: "Royal Commission for AlUla",
    outcome: <>Built the public policy department from zero for a <b>$15B+</b> sovereign program. Cut the policy-making cycle by half. Drafted the Kingdom's proposed Art Law.</>,
  },
  {
    dates: "Feb 2019 to Jun 2021",
    role: "G20 economic policy advisor",
    org: "Saudi Central Bank, G20 Finance Track",
    outcome: <>Authored the Finance Track's flagship document under the Saudi presidency, adopted across member nations. Built consensus across <b>20</b> members and <b>12</b> international organizations.</>,
  },
  {
    dates: "Feb 2017 to Feb 2019",
    role: "Economic specialist",
    org: "Monshaat, SME authority",
    outcome: <>Wrote the proposal that made the case for the Kingdom's first SME bank. Established the first national SME data center and led the national SME strategy.</>,
  },
  {
    dates: "Sep 2015 to Feb 2017",
    role: "Economic analyst",
    org: "The Royal Court, Vision 2030 foundation team",
    outcome: <>Co-authored the research that informed the economic diversification components of Vision 2030. Coordinated energy price reform work across six agencies.</>,
  },
];

export default function TalalSite() {
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const sectionRefs = useRef({});
  const navigate = useNavigate();
  const location = useLocation();

  // Derive active article from URL instead of state
  const articleSlug = location.pathname.startsWith("/articles/")
    ? location.pathname.split("/articles/")[1]
    : null;
  const activeArticle = articleSlug
    ? allPerspectives.find((a) => a.slug === articleSlug)
    : null;
  const isAdvisory = location.pathname === "/advisory";

  // Update page title for SEO
  useEffect(() => {
    if (activeArticle) {
      document.title = `${activeArticle.title} | Talal Al Zayed`;
    } else if (isAdvisory) {
      document.title = "Advisory — Talal Al Zayed";
    } else {
      document.title = "Talal Al Zayed — Policy · Technology · Builder";
    }
  }, [activeArticle, isAdvisory]);

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
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = sectionRefs.current[id];
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 150);
    } else {
      setTimeout(() => {
        const el = sectionRefs.current[id];
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  };

  const goAdvisory = () => {
    setMenuOpen(false);
    navigate("/advisory");
    window.scrollTo(0, 0);
  };

  // Header nav. Work with me points at /advisory until the redesign builds that section.
  const navItems = [
    { label: "Analysis", go: () => scrollTo("perspectives"), isOn: () => !!activeArticle || (location.pathname === "/" && activeSection === "perspectives") },
    { label: "Track record", go: () => scrollTo("record"), isOn: () => location.pathname === "/" && activeSection === "record" },
    { label: "Work with me", go: goAdvisory, isOn: () => isAdvisory },
    { label: "Contact", go: () => scrollTo("connect"), isOn: () => location.pathname === "/" && activeSection === "connect" },
  ];

  const handleEmailSubmit = () => {
    if (!emailInput || !emailInput.includes("@")) return;
    // Buttondown form submission
    fetch("https://buttondown.com/api/emails/embed-subscribe/talalalzayed", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "email=" + encodeURIComponent(emailInput),
    })
      .then(() => setEmailSubmitted(true))
      .catch(() => setEmailSubmitted(true));
  };

  return (
    <div
      id="talal-scroll-root"
      style={{
        fontFamily: "var(--font)",
        background: "var(--bg)",
        color: "var(--ink)",
        minHeight: "100vh",
        overflowX: "clip",
        position: "relative",
      }}
    >
      <style>{`
        :root {
          --bg: #FFFFFF;
          --sunk: #F1F2F3;
          --ink: #0C0D0F;
          --ink-2: #4A4F55;
          --ink-3: #666C73;
          --rule: #D8DBDE;
          --rule-soft: #EAECEE;
          --sig: #123FBA;
          --flag: #A33417;
          --font: 'Archivo', system-ui, sans-serif;
          --font-narrow: 'Archivo Narrow', 'Archivo', sans-serif;
        }

        body { background: var(--bg); color: var(--ink); -webkit-font-smoothing: antialiased; }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        ::selection {
          background: var(--sig);
          color: #FFFFFF;
        }






        .site-hdr {
          position: sticky;
          top: 0;
          z-index: 100;
          background: var(--bg);
          border-bottom: 1px solid var(--ink);
        }
        .site-hdr-in {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 40px;
          height: 60px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
        }
        .site-brand {
          display: flex;
          align-items: baseline;
          gap: 12px;
          background: none;
          border: 0;
          padding: 0;
          cursor: pointer;
          color: var(--ink);
          font-family: var(--font);
          text-align: left;
        }
        .site-brand-name { font-size: 16px; font-weight: 700; letter-spacing: -0.01em; }
        .site-brand-note { font-size: 13px; color: var(--ink-3); }
        .site-nav { display: flex; gap: 26px; }
        .site-nav button {
          background: none;
          border: 0;
          padding: 0;
          cursor: pointer;
          font-family: var(--font);
          font-size: 14px;
          font-weight: 500;
          color: var(--ink-2);
        }
        .site-nav button:hover { color: var(--sig); }
        .site-nav button.on { color: var(--ink); box-shadow: inset 0 -2px 0 var(--sig); }
        .site-menu-btn {
          display: none;
          align-items: center;
          min-height: 44px;
          padding: 0 14px;
          border: 1px solid var(--ink);
          background: var(--bg);
          color: var(--ink);
          font-family: var(--font);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }
        .site-menu-btn:hover { background: var(--ink); color: var(--bg); }

        .ref-line { background: var(--sunk); border-bottom: 1px solid var(--rule); }
        .ref-line-in {
          max-width: 1200px;
          margin: 0 auto;
          padding: 8px 40px;
          display: flex;
          flex-wrap: wrap;
          gap: 6px 34px;
          font-size: 13px;
          color: var(--ink-2);
        }
        .ref-line b { font-weight: 600; margin-right: 8px; }

        .site-footer { border-top: 1px solid var(--ink); }
        .site-footer-in {
          max-width: 1200px;
          margin: 0 auto;
          padding: 16px 40px 36px;
          display: flex;
          justify-content: space-between;
          gap: 8px;
          font-size: 13px;
          color: var(--ink-3);
        }

        @media (max-width: 768px) {
          .site-hdr-in { height: 56px; padding: 0 20px; }
          .site-nav, .site-brand-note { display: none; }
          .site-menu-btn { display: inline-flex; }
          .ref-line { display: none; }
          .site-footer-in { flex-direction: column; padding: 16px 20px 36px; }
        }














        .wrap { max-width: 1200px; margin: 0 auto; padding: 0 40px; }

        .btn {
          display: inline-flex;
          align-items: center;
          min-height: 44px;
          padding: 0 18px;
          border: 1px solid var(--ink);
          background: var(--bg);
          color: var(--ink);
          font-family: var(--font);
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
        }
        .btn:hover { background: var(--ink); color: var(--bg); }
        .btn.fill { background: var(--sig); border-color: var(--sig); color: #FFFFFF; }
        .btn.fill:hover { background: var(--ink); border-color: var(--ink); }

        .panel { border: 1px solid var(--ink); background: var(--sunk); }
        .ptop {
          background: var(--ink);
          color: #FFFFFF;
          padding: 10px 14px;
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 12px;
        }
        .ptop-title { font-size: 13.5px; font-weight: 600; }
        .ptop-note { font-size: 13px; color: #B5BAC0; }
        .prow {
          display: flex;
          justify-content: space-between;
          gap: 14px;
          padding: 10px 14px;
          border-bottom: 1px solid var(--rule);
          font-size: 13.5px;
        }
        .prow:last-child { border-bottom: 0; }
        .pk { color: var(--ink-2); }
        .pv { font-weight: 600; text-align: right; white-space: nowrap; }
        .sig { color: var(--sig); }
        .flag { color: var(--flag); }

        .hero { padding: 60px 0 52px; border-bottom: 1px solid var(--ink); }
        .hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 356px;
          gap: 64px;
          align-items: start;
        }
        .hero-role { display: none; font-size: 13px; color: var(--ink-3); margin-bottom: 12px; }
        .hero-claim {
          font-size: 40px;
          line-height: 1.14;
          font-weight: 600;
          letter-spacing: -0.024em;
          max-width: 19ch;
        }
        .hero-lede {
          margin-top: 24px;
          font-size: 17.5px;
          line-height: 1.6;
          color: var(--ink-2);
          max-width: 58ch;
        }
        .hero-what {
          margin-top: 14px;
          font-size: 17.5px;
          line-height: 1.6;
          color: var(--ink);
          font-weight: 500;
          max-width: 58ch;
        }
        .hero-ctas { display: flex; gap: 10px; margin-top: 30px; }

        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr; gap: 28px; }
        }
        @media (max-width: 768px) {
          .wrap { padding: 0 20px; }
          .hero { padding: 32px 0 36px; }
          .hero-role { display: block; }
          .hero-claim { font-size: 29px; line-height: 1.16; letter-spacing: -0.022em; max-width: none; }
          .hero-lede { margin-top: 18px; font-size: 16px; }
          .hero-what { display: none; }
          .hero-ctas { flex-direction: column; margin-top: 24px; }
          .hero-ctas .btn { justify-content: center; }
        }

        .sec { padding: 52px 0; border-bottom: 1px solid var(--rule); }
        .shead {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 20px;
          margin-bottom: 22px;
        }
        .h2 { font-size: 21px; font-weight: 700; letter-spacing: -0.015em; }
        .note { font-size: 13px; color: var(--ink-3); }
        .yr { font-family: var(--font-narrow); color: var(--ink-3); font-size: 13.5px; white-space: nowrap; }

        .cells { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); border-top: 1px solid var(--ink); }
        .cell { padding: 16px 20px 18px 0; border-right: 1px solid var(--rule-soft); }
        .cell + .cell { padding-left: 20px; }
        .cell:last-child { border-right: 0; }
        .cq { font-size: 15.5px; font-weight: 600; line-height: 1.3; margin: 0 0 7px; }
        .ca { font-size: 14px; color: var(--ink-2); line-height: 1.55; }

        .a-lead, .idx {
          display: grid;
          grid-template-columns: 110px minmax(0, 1fr) 170px;
          gap: 20px;
          align-items: baseline;
          text-decoration: none;
          color: var(--ink);
        }
        .a-lead { padding: 4px 0 22px; border-bottom: 1px solid var(--ink); }
        .a-lead-title { display: block; font-size: 26px; font-weight: 600; line-height: 1.22; letter-spacing: -0.016em; max-width: 30ch; }
        .a-lead-sum { display: block; margin-top: 10px; font-size: 16px; line-height: 1.55; color: var(--ink-2); max-width: 68ch; }
        .idx { padding: 14px 0; border-bottom: 1px solid var(--rule-soft); }
        .it { display: block; font-size: 16.5px; font-weight: 600; line-height: 1.35; }
        .is { display: block; font-size: 14px; color: var(--ink-2); margin-top: 4px; line-height: 1.5; }
        .a-lead:hover .a-lead-title, .idx:hover .it { color: var(--sig); }
        .a-tag { text-align: right; white-space: normal; }
        .a-mmeta { display: none; }

        .sub-form {
          margin-top: 26px;
          padding: 18px 20px;
          background: var(--sunk);
          border: 1px solid var(--rule);
          display: flex;
          align-items: flex-end;
          gap: 12px;
        }
        .sub-field { flex-grow: 1; }
        .lbl { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; }
        .inp {
          width: 100%;
          min-height: 44px;
          border: 1px solid var(--ink);
          padding: 0 12px;
          font-family: var(--font);
          font-size: 14px;
          background: var(--bg);
          color: var(--ink);
          border-radius: 0;
        }
        .inp:focus { outline: 2px solid var(--sig); outline-offset: -1px; }
        .sub-note { width: 190px; padding-bottom: 4px; }
        .sub-done { margin-top: 26px; padding: 18px 20px; background: var(--sunk); border: 1px solid var(--rule); font-size: 15px; font-weight: 500; }

        @media (max-width: 900px) {
          .cells { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .cell, .cell + .cell { padding: 16px 20px 18px 0; border-right: 0; border-bottom: 1px solid var(--rule-soft); }
        }
        @media (max-width: 768px) {
          .sec { padding: 36px 0; }
          .shead { display: block; margin-bottom: 16px; }
          .shead .note { display: block; margin-top: 4px; }
          .cells { grid-template-columns: 1fr; }
          .cell, .cell + .cell { padding: 14px 0; }
          .a-lead, .idx { display: block; }
          .a-lead { padding: 14px 0 18px; border-top: 1px solid var(--ink); }
          .a-lead-title { margin-top: 6px; font-size: 21px; line-height: 1.25; letter-spacing: -0.012em; }
          .a-lead-sum { margin-top: 8px; font-size: 15px; }
          .a-date, .a-tag, .idx .is { display: none; }
          .a-mmeta { display: block; }
          .idx .it { margin-top: 4px; }
          .sub-form { display: block; padding: 16px; margin-top: 22px; }
          .sub-form .btn { width: 100%; justify-content: center; margin-top: 10px; }
          .sub-note { width: auto; margin-top: 10px; padding: 0; }
        }

        table.rec { width: 100%; border-collapse: collapse; font-size: 14.5px; line-height: 1.5; }
        .rec th {
          text-align: left;
          font-family: var(--font-narrow);
          font-weight: 600;
          font-size: 13px;
          color: var(--ink-2);
          padding: 0 16px 8px 0;
          border-bottom: 1px solid var(--ink);
        }
        .rec td { padding: 13px 16px 13px 0; border-bottom: 1px solid var(--rule-soft); vertical-align: top; }
        .rec th:last-child, .rec td:last-child { padding-right: 0; }
        .rec .lead { font-weight: 600; }
        .rec .org { display: block; font-size: 14px; color: var(--ink-2); }
        .rec .soft { color: var(--ink-2); }
        .rec b { font-weight: 600; color: var(--ink); }

        @media (max-width: 768px) {
          .rec thead { display: none; }
          .rec, .rec tbody, .rec tr, .rec td { display: block; }
          .rec tbody { border-top: 1px solid var(--ink); }
          .rec tr { padding: 14px 0; border-bottom: 1px solid var(--rule-soft); }
          .rec td { padding: 0; border: 0; }
          .rec td.lead-cell { margin-top: 4px; font-size: 15px; }
          .rec td.soft { margin-top: 8px; font-size: 14px; line-height: 1.55; }
          .rec td.soft:empty { display: none; }
        }

        .trust-strip {
          padding: 60px 40px;
          border-top: 1px solid var(--rule-soft);
          border-bottom: 1px solid var(--rule-soft);
        }

        .trust-label {
          font-family: 'Archivo Narrow', 'Archivo', sans-serif;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 3px;
          color: var(--ink-3);
          text-align: center;
          margin-bottom: 32px;
        }

        .trust-logos {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 40px;
          flex-wrap: wrap;
        }

        .trust-logo-img {
          height: 36px;
          width: auto;
          object-fit: contain;
          opacity: 0.75;
          transition: opacity 0.4s ease;
        }

        .trust-logo-img:hover {
          opacity: 1;
        }

        .trust-logo-img.tall {
          height: 44px;
        }

        .trust-divider {
          width: 1px;
          height: 28px;
          background: var(--rule);
        }

        @media (max-width: 768px) {
          .trust-logos { gap: 24px; }
          .trust-divider { display: none; }
          .trust-strip { padding: 40px 20px; }
          .trust-logo-img { height: 28px; }
          .trust-logo-img.tall { height: 34px; }
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 64px;
        }
        .section-number {
          font-family: 'Archivo', sans-serif;
          font-size: 14px;
          color: var(--sig);
          opacity: 0.5;
        }
        .section-line {
          flex: 1;
          height: 1px;
          background: var(--rule);
        }
        .section-title {
          font-family: 'Archivo Narrow', 'Archivo', sans-serif;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 4px;
          color: var(--ink-3);
        }


        .projects-section {
          padding: 120px 40px;
          position: relative;
        }

        .projects-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: var(--rule-soft);
          border: 1px solid var(--rule-soft);
        }

        .project-card {
          background: var(--bg);
          padding: 40px 32px;
          transition: all 0.4s ease;
          cursor: default;
          position: relative;
        }

        .project-card:hover {
          background: var(--sunk);
        }

        .project-card.clickable {
          cursor: pointer;
        }

        .project-status {
          font-family: 'Archivo Narrow', 'Archivo', sans-serif;
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 2px;
          padding: 3px 10px;
          display: inline-block;
          margin-bottom: 16px;
        }

        .project-status.live {
          color: #FFFFFF;
          background: var(--sig);
        }

        .project-status.development {
          color: var(--sig);
          border: 1px solid var(--rule);
        }

        .project-card-title {
          font-family: 'Archivo', sans-serif;
          font-size: 24px;
          color: var(--ink);
          margin-bottom: 12px;
          transition: color 0.3s;
          line-height: 1.2;
        }

        .project-card.clickable:hover .project-card-title {
          color: var(--sig);
        }

        .project-card-desc {
          font-size: 14px;
          color: var(--ink-2);
          line-height: 1.7;
          margin-bottom: 20px;
        }

        .project-card-stack {
          font-family: 'Archivo Narrow', 'Archivo', sans-serif;
          font-size: 10px;
          color: var(--ink-3);
          letter-spacing: 1px;
        }

        .project-card-arrow {
          position: absolute;
          bottom: 32px;
          right: 32px;
          color: var(--sig);
          font-size: 18px;
          opacity: 0;
          transform: translateX(-6px);
          transition: all 0.3s;
        }

        .project-card.clickable:hover .project-card-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        @media (max-width: 768px) {
          .projects-grid {
            grid-template-columns: 1fr;
          }
          .projects-section { padding: 80px 20px; }
        }

        .advisory-section {
          padding: 120px 40px;
          position: relative;
        }

        .advisory-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: start;
        }

        .advisory-headline {
          font-family: 'Archivo', sans-serif;
          font-size: clamp(32px, 4.5vw, 48px);
          line-height: 1.15;
          color: var(--ink);
          margin-bottom: 32px;
        }

        .advisory-headline em {
          color: var(--sig);
          font-style: italic;
        }

        .advisory-body {
          font-size: 17px;
          line-height: 1.75;
          color: var(--ink);
          margin-bottom: 36px;
          max-width: 520px;
        }

        .advisory-cta {
          font-family: 'Archivo Narrow', 'Archivo', sans-serif;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 2px;
          padding: 16px 32px;
          background: transparent;
          color: var(--sig);
          border: 1px solid var(--rule);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .advisory-cta:hover {
          background: var(--sig);
          color: #FFFFFF;
          border-color: var(--sig);
        }

        .advisory-areas-label {
          font-family: 'Archivo Narrow', 'Archivo', sans-serif;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 3px;
          color: var(--ink-3);
          margin-bottom: 32px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .advisory-areas-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--rule);
          max-width: 120px;
        }

        .advisory-area-item {
          padding: 20px 0;
          border-top: 1px solid var(--rule-soft);
          display: grid;
          grid-template-columns: 40px 1fr;
          gap: 16px;
          align-items: center;
          transition: padding-left 0.3s ease;
        }

        .advisory-area-item:last-child {
          border-bottom: 1px solid var(--rule-soft);
        }

        .advisory-area-item:hover {
          padding-left: 8px;
        }

        .advisory-area-num {
          font-family: 'Archivo', sans-serif;
          font-size: 18px;
          color: var(--ink-3);
        }

        .advisory-area-title {
          font-family: 'Archivo', sans-serif;
          font-size: 15px;
          color: var(--ink);
          transition: color 0.3s;
        }

        .advisory-area-item:hover .advisory-area-title {
          color: var(--sig);
        }

        @media (max-width: 900px) {
          .advisory-grid {
            grid-template-columns: 1fr;
            gap: 48px;
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
          width: 240px;
          height: 300px;
          flex-shrink: 0;
          position: relative;
          border-radius: 4px;
          overflow: hidden;
        }

        .about-photo-wrapper::after {
          content: '';
          position: absolute;
          inset: 0;
          border: 1px solid var(--rule);
          border-radius: 4px;
          pointer-events: none;
        }

        .about-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 15%;
          filter: grayscale(10%) contrast(1.02) brightness(1.02);
          transition: filter 0.5s ease;
        }

        .about-photo-wrapper:hover .about-photo {
          filter: grayscale(0%) contrast(1) brightness(1.05);
        }

        .about-photo-intro {
          font-family: 'Archivo', sans-serif;
          font-size: 32px;
          line-height: 1.4;
          color: var(--ink);
        }

        .about-photo-intro strong {
          color: var(--ink);
          font-weight: 400;
        }

        .about-photo-intro em {
          color: var(--sig);
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
          font-family: 'Archivo', sans-serif;
          font-size: 26px;
          line-height: 1.5;
          color: var(--ink);
        }

        .about-narrative strong {
          color: var(--ink);
          font-weight: 400;
        }

        .about-narrative em {
          color: var(--sig);
          font-style: italic;
        }






        .connect-section {
          padding: 120px 40px;
          position: relative;
          text-align: center;
        }


        .connect-headline {
          font-family: 'Archivo', sans-serif;
          font-size: clamp(32px, 5vw, 56px);
          color: var(--ink);
          margin-bottom: 24px;
          line-height: 1.15;
        }

        .connect-headline em {
          color: var(--sig);
          font-style: italic;
        }

        .connect-sub {
          font-size: 16px;
          color: var(--ink-3);
          max-width: 500px;
          margin: 0 auto 20px;
          line-height: 1.7;
        }

        .connect-email-display {
          font-family: 'Archivo Narrow', 'Archivo', sans-serif;
          font-size: 13px;
          color: var(--ink-2);
          letter-spacing: 1px;
          margin-bottom: 48px;
        }

        .connect-email-display a {
          color: var(--sig);
          text-decoration: none;
          transition: opacity 0.3s;
        }

        .connect-email-display a:hover {
          opacity: 0.7;
        }

        .connect-links {
          display: flex;
          justify-content: center;
          gap: 24px;
          flex-wrap: wrap;
        }

        .connect-btn {
          font-family: 'Archivo Narrow', 'Archivo', sans-serif;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 2px;
          padding: 16px 32px;
          border: 1px solid var(--rule);
          background: transparent;
          color: var(--sig);
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
        }

        .connect-btn:hover {
          background: var(--sig);
          color: #FFFFFF;
          border-color: var(--sig);
        }

        .connect-btn.primary {
          background: var(--sig);
          color: #FFFFFF;
          border-color: var(--sig);
        }
        .connect-btn.primary:hover {
          background: transparent;
          color: var(--sig);
        }

        .article-view {
          min-height: 100vh;
          padding: 120px 40px 80px;
          max-width: 780px;
          margin: 0 auto;
        }

        .article-back {
          font-family: 'Archivo Narrow', 'Archivo', sans-serif;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: var(--sig);
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
          font-family: 'Archivo Narrow', 'Archivo', sans-serif;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 3px;
          color: var(--sig);
          margin-bottom: 20px;
        }

        .article-date {
          font-family: 'Archivo Narrow', 'Archivo', sans-serif;
          font-size: 10px;
          color: var(--ink-3);
          letter-spacing: 1px;
          margin-bottom: 24px;
        }

        .article-title {
          font-family: 'Archivo', sans-serif;
          font-size: clamp(32px, 5vw, 48px);
          line-height: 1.15;
          color: var(--ink);
          margin-bottom: 48px;
        }

        .article-body-intro {
          font-family: 'Archivo', sans-serif;
          font-size: 22px;
          line-height: 1.6;
          color: var(--ink);
          margin-bottom: 36px;
          padding-bottom: 36px;
          border-bottom: 1px solid var(--rule-soft);
        }

        .article-body-text {
          font-size: 17px;
          line-height: 1.8;
          color: var(--ink);
          margin-bottom: 24px;
        }

        .article-body-heading {
          font-family: 'Archivo', sans-serif;
          font-size: 26px;
          color: var(--ink);
          margin-top: 48px;
          margin-bottom: 20px;
        }

        .article-author {
          margin-top: 64px;
          padding-top: 32px;
          border-top: 1px solid var(--rule-soft);
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .article-author-info {
          font-size: 14px;
          color: var(--ink-3);
        }

        .article-author-name {
          color: var(--ink);
          font-weight: 500;
          margin-bottom: 2px;
        }

        .article-discuss {
          margin-top: 48px;
          padding: 28px 32px;
          border: 1px solid var(--rule);
          font-family: 'Archivo', sans-serif;
          font-size: 20px;
          color: var(--ink-2);
          text-align: center;
        }

        .article-discuss a {
          color: var(--sig);
          text-decoration: none;
          transition: opacity 0.3s;
        }

        .article-discuss a:hover {
          opacity: 0.7;
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
          border: 1px solid var(--rule-soft);
        }

        .article-image-caption {
          font-family: 'Archivo Narrow', 'Archivo', sans-serif;
          font-size: 11px;
          color: var(--ink-3);
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
          background: var(--sunk);
          border-radius: 6px;
          padding: 20px;
          text-align: center;
        }

        .article-stat-number {
          font-family: 'Archivo', sans-serif;
          font-size: 28px;
          color: var(--sig);
          margin-bottom: 6px;
        }

        .article-stat-number.highlight-green {
          color: var(--sig);
        }

        .article-stat-number.highlight-accent {
          color: var(--sig);
        }

        .article-stat-label {
          font-family: 'Archivo Narrow', 'Archivo', sans-serif;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--ink-3);
        }

        .article-callout {
          border-left: 3px solid var(--sig);
          padding: 20px 24px;
          margin: 36px 0;
          background: var(--sunk);
          border-radius: 0 4px 4px 0;
        }

        .article-callout p {
          font-size: 15px;
          line-height: 1.7;
          color: var(--ink);
          margin: 0;
        }

        @media (max-width: 768px) {
          .article-stats-row {
            grid-template-columns: 1fr;
            gap: 12px;
          }
        }





        .mobile-menu {
          position: fixed;
          inset: 0;
          z-index: 200;
          background: var(--bg);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 28px;
        }

        .mobile-menu button {
          font-family: var(--font);
          font-size: 24px;
          font-weight: 600;
          color: var(--ink);
          background: none;
          border: none;
          cursor: pointer;
          transition: color 0.3s;
        }
        .mobile-menu button:hover { color: var(--sig); }

        .mobile-close {
          position: absolute;
          top: 6px;
          right: 20px;
          min-height: 44px;
          padding: 0 14px !important;
          border: 1px solid var(--ink) !important;
          font-size: 14px !important;
        }


        @media (max-width: 768px) {
          .about-section, .connect-section, .projects-section, .advisory-section { padding: 80px 20px; }
        }
      `}</style>

      {/* HEADER */}
      <header className="site-hdr">
        <div className="site-hdr-in">
          <button className="site-brand" onClick={() => { navigate("/"); window.scrollTo(0, 0); }}>
            <span className="site-brand-name">Talal Al Zayed</span>
            <span className="site-brand-note">Public policy, Saudi Arabia</span>
          </button>
          <nav className="site-nav" aria-label="Main">
            {navItems.map((item) => (
              <button
                key={item.label}
                className={item.isOn() ? "on" : ""}
                onClick={item.go}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <button
            className="site-menu-btn"
            type="button"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
          >
            Menu
          </button>
        </div>
      </header>

      {/* REFERENCE LINE (homepage, desktop only) */}
      {!isAdvisory && !activeArticle && (
        <div className="ref-line">
          <div className="ref-line-in">
            <span><b>Based</b>Riyadh</span>
            <span><b>Now</b>Head of Policy and Government Affairs, Nokia</span>
            <span><b>Before</b>HP, and nearly nine years in Saudi government</span>
            <span><b>Studying</b>Master of public policy, KAPSARC</span>
          </div>
        </div>
      )}

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="mobile-menu">
          <button className="mobile-close" onClick={() => setMenuOpen(false)}>
            Close
          </button>
          {navItems.map((item) => (
            <button key={item.label} onClick={item.go}>
              {item.label}
            </button>
          ))}
        </div>
      )}

      {isAdvisory ? (
        <Advisory />
      ) : activeArticle ? (
        <>
          <div className="article-view">
            <button
              className="article-back"
              onClick={() => {
                navigate("/");
                setTimeout(() => scrollTo("perspectives"), 150);
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
                Head of Policy and Government Affairs, Nokia, Saudi Arabia
              </div>
            </div>
            <div className="article-discuss">
              Have a take on this?{" "}
              <a
                href="https://www.linkedin.com/in/talal-alzayed/"
                target="_blank"
                rel="noopener"
              >
                Find me on LinkedIn →
              </a>
            </div>
          </div>
        </>
      ) : (
      <>
      {/* HERO */}
      <section
        ref={(el) => (sectionRefs.current.home = el)}
        className="hero"
      >
        <div className="wrap hero-grid">
          <div>
            <p className="hero-role">Head of Policy and Government Affairs, Nokia. Riyadh.</p>
            <h1 className="hero-claim">
              I have written Saudi regulation from inside government, and
              negotiated against it from industry.
            </h1>
            <p className="hero-lede">
              Nearly nine years at the Royal Court, the central bank, the SME
              authority and a sovereign giga-project. Since 2024 on the industry
              side of the same table, first at HP and now at Nokia.
            </p>
            <p className="hero-what">
              I write about how Saudi policy gets made and where it is heading,
              speak about it, and advise the people who have to operate inside it.
            </p>
            <div className="hero-ctas">
              <button className="btn fill" onClick={() => scrollTo("perspectives")}>
                Read the analysis
              </button>
              <button className="btn" onClick={goAdvisory}>
                Ways to work together
              </button>
            </div>
          </div>

          <aside className="panel" aria-label="Current status">
            <div className="ptop">
              <span className="ptop-title">Current status</span>
              <span className="ptop-note">Updated Oct 2026</span>
            </div>
            {statusRows.map((row) => (
              <div className="prow" key={row.k}>
                <span className="pk">{row.k}</span>
                <span className={`pv ${row.tone || ""}`}>{row.v}</span>
              </div>
            ))}
          </aside>
        </div>
      </section>

      {/* WHAT I WORK ON */}
      <section className="sec" id="focus">
        <div className="wrap">
          <div className="shead">
            <h2 className="h2">What I work on</h2>
            <span className="note">Where most of my work falls</span>
          </div>
          <div className="cells">
            {focusAreas.map((f) => (
              <div className="cell" key={f.q}>
                <h3 className="cq">{f.q}</h3>
                <p className="ca">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ANALYSIS */}
      <section
        ref={(el) => (sectionRefs.current.perspectives = el)}
        className="sec"
        id="analysis"
      >
        <div className="wrap">
          <div className="shead">
            <h2 className="h2">Analysis</h2>
            <span className="note">Commentary on Saudi and regional regulation</span>
          </div>

          {allPerspectives.map((p, idx) => {
            const isLead = idx === 0;
            const open = (e) => {
              e.preventDefault();
              navigate("/articles/" + p.slug);
              window.scrollTo(0, 0);
            };
            return (
              <a
                key={p.id}
                href={"/articles/" + p.slug}
                onClick={open}
                className={isLead ? "a-lead" : "idx"}
              >
                <span className="yr a-date">{formatDate(p.date)}</span>
                <span>
                  <span className="yr a-mmeta">{formatDate(p.date)}, {formatTag(p.tag)}</span>
                  <span className={isLead ? "a-lead-title" : "it"}>{p.title}</span>
                  <span className={isLead ? "a-lead-sum" : "is"}>{p.excerpt}</span>
                </span>
                <span className="yr a-tag">{formatTag(p.tag)}, {p.readTime}</span>
              </a>
            );
          })}

          {emailSubmitted ? (
            <div className="sub-done">Thanks. New pieces will come to your inbox.</div>
          ) : (
            <form
              className="sub-form"
              onSubmit={(e) => { e.preventDefault(); handleEmailSubmit(); }}
            >
              <div className="sub-field">
                <label className="lbl" htmlFor="sub">Get new analysis by email</label>
                <input
                  className="inp"
                  id="sub"
                  type="email"
                  required
                  placeholder="you@company.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                />
              </div>
              <button className="btn fill" type="submit">Subscribe</button>
              <span className="note sub-note">Only new pieces. Nothing else.</span>
            </form>
          )}
        </div>
      </section>

      {/* TRACK RECORD */}
      <section
        ref={(el) => (sectionRefs.current.record = el)}
        className="sec"
        id="record"
      >
        <div className="wrap">
          <div className="shead">
            <h2 className="h2">Track record</h2>
            <span className="note">Nearly nine years in government, then industry</span>
          </div>
          <table className="rec">
            <thead>
              <tr>
                <th style={{ width: "16%" }}>Dates</th>
                <th style={{ width: "30%" }}>Position</th>
                <th>Outcome</th>
              </tr>
            </thead>
            <tbody>
              {trackRecord.map((r) => (
                <tr key={r.dates}>
                  <td className="yr">{r.dates}</td>
                  <td className="lead-cell">
                    <span className="lead">{r.role}</span>
                    <span className="org">{r.org}</span>
                  </td>
                  <td className="soft">{r.outcome}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* INSTITUTIONAL TRUST STRIP */}
      <div className="trust-strip">
        <div className="trust-label">I Served At</div>
        <div className="trust-logos">
          <img src="/hp-logo.svg" alt="HP Inc." className="trust-logo-img" />
          <span className="trust-divider" />
          <img src="/rcu-logo.png" alt="Royal Commission for AlUla" className="trust-logo-img" />
          <span className="trust-divider" />
          <img src="/sama-logo.png" alt="Saudi Central Bank (SAMA)" className="trust-logo-img" />
          <span className="trust-divider" />
          <img src="/g20-logo.webp" alt="G20 Saudi Arabia 2020" className="trust-logo-img tall" />
          <span className="trust-divider" />
          <img src="/monshaat-logo.webp" alt="Monshaat" className="trust-logo-img" />
          <span className="trust-divider" />
          <img src="/royal-court-logo.png" alt="The Royal Court" className="trust-logo-img tall" />
        </div>
      </div>

      {/* PROJECTS */}
      <section
        ref={(el) => (sectionRefs.current.projects = el)}
        className="projects-section"
      >
        <div className="section-header">
          <span className="section-number">02</span>
          <span className="section-title">What I Build</span>
          <div className="section-line" />
        </div>

        <div className="projects-grid">
          <a
            href="https://mena-risk-score.vercel.app/"
            target="_blank"
            rel="noopener"
            className="project-card clickable"
            style={{ textDecoration: "none" }}
          >
            <span className="project-status live">Live</span>
            <div className="project-card-title">MENA Regulatory Risk Score</div>
            <div className="project-card-desc">
              Answer a few questions about your company's sector, data model, and market plans. Get a regulatory risk score across Saudi Arabia, UAE, and Egypt with specific recommendations on what to fix first.
            </div>
            <div className="project-card-stack">Interactive Assessment · AI-Powered Analysis</div>
            <span className="project-card-arrow">→</span>
          </a>

          <a
            href="https://market-entry-playbook.vercel.app/"
            target="_blank"
            rel="noopener"
            className="project-card clickable"
            style={{ textDecoration: "none" }}
          >
            <span className="project-status live">Live</span>
            <div className="project-card-title">Market Entry Playbook</div>
            <div className="project-card-desc">
              Select your sector, data hosting model, and government contract plans. Get a tailored market entry plan covering licensing costs, employee requirements, and a step-by-step timeline.
            </div>
            <div className="project-card-stack">RAG-Powered · Saudi Arabia Focus</div>
            <span className="project-card-arrow">→</span>
          </a>

          <a
            href="https://mena-new.onrender.com/"
            target="_blank"
            rel="noopener"
            className="project-card clickable"
            style={{ textDecoration: "none" }}
          >
            <span className="project-status live">Live</span>
            <div className="project-card-title">MENA Policy Monitor</div>
            <div className="project-card-desc">
              Regulatory intelligence system tracking government consultations and policy changes across Saudi Arabia, UAE, and Egypt. The tool I wished existed when I started this job.
            </div>
            <div className="project-card-stack">Real-Time Tracking · 3 Markets</div>
            <span className="project-card-arrow">→</span>
          </a>
        </div>
      </section>

      {/* ADVISORY */}
      <section className="advisory-section">
        <div className="section-header">
          <span className="section-number">03</span>
          <span className="section-title">Advisory</span>
          <div className="section-line" />
        </div>

        <div className="advisory-grid">
          <div>
            <h2 className="advisory-headline">
              Private counsel for leaders navigating <em>government</em> in Saudi Arabia.
            </h2>
            <p className="advisory-body">
              I advise companies, investors, and institutions making consequential decisions in Saudi Arabia. Selective engagements across regulatory strategy, market entry, government relations, and policy risk.
            </p>
            <button
              className="advisory-cta"
              onClick={() => { navigate("/advisory"); window.scrollTo(0, 0); }}
            >
              Learn More →
            </button>
          </div>

          <div>
            <div className="advisory-areas-label">Areas of Focus</div>
            <div>
              {[
                { num: "01", title: "Market Entry & Regulatory Strategy" },
                { num: "02", title: "Digital & AI Policy" },
                { num: "03", title: "Government Relations & Stakeholder Strategy" },
                { num: "04", title: "Strategic Partnerships" },
                { num: "05", title: "FDI & Investment Framework Navigation" },
                { num: "06", title: "Policy Risk Assessment" },
              ].map((area) => (
                <div className="advisory-area-item" key={area.num}>
                  <span className="advisory-area-num">{area.num}</span>
                  <span className="advisory-area-title">{area.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section
        ref={(el) => (sectionRefs.current.about = el)}
        className="about-section"
      >
        <div className="section-header">
          <span className="section-number">04</span>
          <span className="section-title">About</span>
          <div className="section-line" />
        </div>

        <div className="about-photo-row">
          <div className="about-photo-wrapper">
            <img
              src="/talal.jpg"
              alt="Talal Al Zayed, Head of Policy and Government Affairs at Nokia, Riyadh Saudi Arabia"
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
              Since August 2026 I have been Head of Policy and Government
              Affairs at <strong>Nokia</strong>, covering Saudi Arabia. Before
              that, at <strong>HP Inc.</strong> from May 2024 to July 2026, I
              turned regulatory complexity into commercial
              advantage: negotiating with standards bodies, securing investment
              incentives, and building anti-counterfeit strategies across Saudi
              Arabia and the UAE.
            </p>
            <p>
              But here's what makes me different:{" "}
              <em>I don't just analyze policy. I build the tools that make it operational.</em>{" "}
              I constructed a regulatory monitoring system that tracks 40+
              government sources across three markets in near real-time. I built
              risk scoring frameworks that quantify regulatory exposure before it
              becomes a board-level problem. I believe the future of government
              affairs belongs to people who can{" "}
              <strong>read the regulatory landscape</strong> and{" "}
              <strong>build the systems that turn it into advantage</strong>.
            </p>
          </div>

          <div>

            <div style={{ marginTop: 40 }}>
              <div
                style={{
                  fontFamily: "'Archivo Narrow', 'Archivo', sans-serif",
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: 2,
                  color: "var(--ink-3)",
                  marginBottom: 16,
                }}
              >
                Education
              </div>
              <div style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.8 }}>
                <div>
                  <span style={{ color: "var(--ink)" }}>MPP</span> — KAPSARC
                  School of Public Policy
                </div>
                <div>
                  <span style={{ color: "var(--ink)" }}>MBA, Entrepreneurship</span>{" "}
                  — MBS College
                </div>
                <div>
                  <span style={{ color: "var(--ink)" }}>B.Econ</span> — Trent
                  University
                </div>
              </div>
            </div>

            <div style={{ marginTop: 32 }}>
              <div
                style={{
                  fontFamily: "'Archivo Narrow', 'Archivo', sans-serif",
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: 2,
                  color: "var(--ink-3)",
                  marginBottom: 16,
                }}
              >
                Credentials
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "var(--ink-3)",
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
                fontFamily: "'Archivo Narrow', 'Archivo', sans-serif",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: 2,
                padding: "14px 28px",
                border: "1px solid var(--rule)",
                background: "transparent",
                color: "var(--sig)",
                textDecoration: "none",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "var(--sig)";
                e.target.style.color = "#FFFFFF";
                e.target.style.borderColor = "var(--sig)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
                e.target.style.color = "var(--sig)";
                e.target.style.borderColor = "var(--rule)";
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
          <span className="section-number">05</span>
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
          and conversations about policy, regulation, and investment in the Gulf and beyond.
        </p>

        <div className="connect-email-display">
          <a href="mailto:talal.h.zd@gmail.com">talal.h.zd@gmail.com</a>
        </div>

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

        <div
          style={{
            marginTop: 32,
            fontFamily: "'Archivo Narrow', 'Archivo', sans-serif",
            fontSize: 11,
            letterSpacing: 1,
            color: "var(--ink-3)",
          }}
        >
          Looking for regulatory advisory in the Gulf?{" "}
          <span
            style={{ color: "var(--sig)", cursor: "pointer", transition: "opacity 0.3s" }}
            onClick={() => { navigate("/advisory"); window.scrollTo(0, 0); }}
            onMouseEnter={(e) => { e.target.style.opacity = "0.7"; }}
            onMouseLeave={(e) => { e.target.style.opacity = "1"; }}
          >
            Learn more →
          </span>
        </div>
      </section>

      </>
      )}

      <footer className="site-footer">
        <div className="site-footer-in">
          <span>© 2026 Talal Al Zayed. Riyadh.</span>
          <span>Views here are my own, not my employer's.</span>
        </div>
      </footer>
    </div>
  );
}
