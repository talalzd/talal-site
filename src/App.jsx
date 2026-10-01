import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import articleData from "./articles.js";
import Advisory from "./Advisory.jsx";
import advisoryScope from "./advisoryScope.js";

const SECTIONS = ["home", "perspectives", "record", "work", "connect"];

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

const formatLongDate = (d) =>
  new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

// Lowercase the first letter unless the first word is an acronym (AI, FDI).
const midSentence = (t) => (/^[A-Z]{2}/.test(t) ? t : t.charAt(0).toLowerCase() + t.slice(1));

const headingId = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const focusAreas = [
  { q: "Market access and licensing", a: "Which activities can be licensed, what the ownership rules allow, and who actually signs. The approving authority is often not the ministry you have been talking to." },
  { q: "Local content and procurement", a: "Getting onto the mandatory procurement list, and what the government expects in return: hiring, local content, technology transfer and headquarters commitments." },
  { q: "Digital and AI governance", a: "Data residency, cloud sovereignty and the direction of AI regulation across the Gulf, where the frameworks are diverging rather than converging." },
  { q: "Policy risk and timing", a: "Saudi rules move quarterly. Most of the value is in seeing a change early, not reacting on the day it lands." },
];

const speakingTopics = [
  { q: "Inside Vision 2030 policymaking", a: "How Saudi policy actually gets made, who decides, and why the published strategy and the operating reality are different documents." },
  { q: "Entering the Saudi market", a: "Licensing, local content, incentives and headquarters rules, from someone who has negotiated them from both sides." },
  { q: "AI governance in the Gulf", a: "Why Saudi Arabia, the UAE and Egypt are diverging, and what that means for anyone deploying AI in the region." },
  { q: "Consensus across twenty countries", a: "What the G20 Finance Track under the Saudi presidency teaches about moving multilateral policy." },
];

// Worded exactly as Talal approved. Do not add others without asking.
const speakingCredentials = [
  "Conceived and ran the inaugural G20 Deputy Ministers' Symposium",
  "Technology committee member, AmCham Saudi Arabia",
];

const workModes = [
  { mode: "Speaking and moderation", what: "Conferences, panels, closed-door briefings and executive sessions on Saudi regulation, AI governance and Vision 2030 policymaking.", status: "Open", tone: "sig", speaking: true },
  { mode: "Conversations", what: "Introductions, comparing notes, or talking through something you are weighing. No agenda needed and no invoice attached.", status: "Always", tone: "sig" },
  { mode: "Advisory engagements", what: "Fixed-scope work for investors, operators and institutions entering or expanding in the Kingdom. Scope below.", status: "Limited", tone: "flag" },
  { mode: "Boards and advisory seats", what: "Ongoing roles where a regulatory and government affairs view belongs in the room rather than in a report.", status: "Selective" },
];

// From the CV.
const credentials = [
  { k: "Master of public policy", v: "KAPSARC, expected 2027" },
  { k: "MBA, entrepreneurship", v: "MBS College" },
  { k: "Bachelor of economics", v: "Trent University" },
  { k: "Implementing public policy", v: "Harvard Kennedy School" },
  { k: "Policy analysis, regulation", v: "London School of Economics" },
  { k: "Certified", v: "PMP, PROSCI" },
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
      document.title = "Advisory | Talal Al Zayed";
    } else {
      document.title = "Talal Al Zayed | Public policy and government affairs, Saudi Arabia";
    }
  }, [activeArticle, isAdvisory]);


  useEffect(() => {
    const handleScroll = () => {
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

  // Header nav.
  const navItems = [
    { label: "Analysis", go: () => scrollTo("perspectives"), isOn: () => !!activeArticle || (location.pathname === "/" && activeSection === "perspectives") },
    { label: "Track record", go: () => scrollTo("record"), isOn: () => location.pathname === "/" && activeSection === "record" },
    { label: "Work with me", go: () => scrollTo("work"), isOn: () => isAdvisory || (location.pathname === "/" && activeSection === "work") },
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
          line-height: 1.4;
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

        .wk .status { font-weight: 600; white-space: nowrap; }
        .spk { margin-top: 16px; }
        .spk-topics { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: 20px; border-top: 1px solid var(--rule); }
        .spk-topic { padding: 12px 0; border-bottom: 1px solid var(--rule-soft); }
        .spk-topic .cq { font-size: 14.5px; color: var(--ink); margin-bottom: 4px; }
        .spk-topic .ca { font-size: 13.5px; }
        .spk-foot { display: flex; justify-content: space-between; align-items: flex-end; gap: 20px; margin-top: 16px; }
        .spk-creds { list-style: none; font-size: 13.5px; color: var(--ink-2); }
        .spk-creds .lbl { margin-bottom: 4px; color: var(--ink); }
        .spk-creds li + li { margin-top: 2px; }

        .scope { margin-top: 38px; display: grid; grid-template-columns: 240px minmax(0, 1fr); gap: 40px; align-items: start; }
        .scope-h { font-size: 16px; font-weight: 700; }
        .scope-intro { margin-top: 8px; font-size: 14px; line-height: 1.55; color: var(--ink-2); }
        .scope-link { display: inline-block; margin-top: 12px; font-size: 14px; font-weight: 600; color: var(--sig); }
        .scope-link:hover { color: var(--ink); }
        .scope-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); column-gap: 20px; border-top: 1px solid var(--ink); }
        .scope-item { padding: 14px 18px 14px 0; border-bottom: 1px solid var(--rule-soft); }
        .scope-item-t { font-size: 15px; font-weight: 600; line-height: 1.35; }
        .scope-item-d { font-size: 14px; line-height: 1.45; margin-top: 4px; color: var(--ink-2); }

        @media (max-width: 900px) {
          .scope { grid-template-columns: 1fr; gap: 16px; }
          .scope-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 768px) {
          .wk tr { display: grid; grid-template-columns: minmax(0, 1fr) auto; column-gap: 12px; }
          .wk td.lead-cell { grid-column: 1; grid-row: 1; margin-top: 0; }
          .wk td.status { grid-column: 2; grid-row: 1; font-size: 14px; }
          .wk td.soft { grid-column: 1 / -1; margin-top: 6px; }
          .spk-topics { grid-template-columns: 1fr; }
          .spk-foot { display: block; }
          .spk-foot .btn { width: 100%; justify-content: center; margin-top: 16px; }
          .scope-grid { grid-template-columns: 1fr; }
        }

        .art-grid {
          display: grid;
          grid-template-columns: minmax(0, 720px) 300px;
          gap: 100px;
          align-items: start;
          padding-top: 44px;
          padding-bottom: 72px;
        }
        .art-kicker { font-size: 13px; color: var(--ink-3); text-decoration: none; }
        .art-kicker:hover { color: var(--sig); }
        .art-title { margin-top: 12px; font-size: 38px; line-height: 1.16; font-weight: 600; letter-spacing: -0.024em; }
        .art-sum { margin-top: 18px; font-size: 19px; line-height: 1.55; color: var(--ink-2); }
        .art-by {
          display: flex;
          flex-wrap: wrap;
          gap: 6px 24px;
          margin: 26px 0 34px;
          padding: 12px 0;
          border-top: 1px solid var(--ink);
          border-bottom: 1px solid var(--rule);
          font-size: 13.5px;
          color: var(--ink-2);
        }
        .art-by b { font-weight: 600; color: var(--ink); }
        .art-body p { margin: 0 0 20px; font-size: 18px; line-height: 1.72; color: #16181B; }
        .art-body p.art-intro { font-size: 20px; line-height: 1.6; color: var(--ink); }
        .art-body h2 { margin: 40px 0 14px; font-size: 22px; font-weight: 700; letter-spacing: -0.012em; scroll-margin-top: 80px; }
        .art-body figure { margin: 8px 0 28px; }
        .art-body figure img { display: block; width: 100%; height: auto; border: 1px solid var(--rule); }
        .art-body figcaption { margin-top: 10px; line-height: 1.5; }
        .art-body table { width: 100%; border-collapse: collapse; margin: 4px 0 28px; font-size: 15px; line-height: 1.5; }
        .art-body th {
          text-align: left;
          font-family: var(--font-narrow);
          font-weight: 600;
          font-size: 13px;
          color: var(--ink-2);
          padding: 0 16px 8px 0;
          border-bottom: 1px solid var(--ink);
        }
        .art-body td { padding: 11px 16px 11px 0; border-bottom: 1px solid var(--rule-soft); vertical-align: top; }
        .art-body th:last-child, .art-body td:last-child { padding-right: 0; text-align: right; }
        .art-body td:last-child { font-weight: 600; white-space: nowrap; }
        .art-callout { margin: 6px 0 28px; padding: 18px 20px; border: 1px solid var(--ink); background: var(--sunk); font-size: 16px; line-height: 1.6; }
        .art-end { margin-top: 44px; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
        .art-end-box { padding: 18px 20px; border: 1px solid var(--ink); }
        .art-end .sub-form, .art-end .sub-done { margin-top: 0; display: block; }
        .art-end .sub-form .btn { margin-top: 10px; }
        .art-end-h { font-size: 13px; font-weight: 700; }
        .art-end-p { margin: 8px 0 12px; font-size: 14.5px; line-height: 1.55; color: var(--ink-2); }
        .art-mail { font-weight: 600; color: var(--sig); }
        .art-mail:hover { color: var(--ink); }

        .art-side { padding-top: 36px; display: flex; flex-direction: column; gap: 34px; }
        .art-side-body { padding: 14px; font-size: 14px; line-height: 1.55; color: var(--ink-2); }
        .art-side-link { display: inline-block; margin-top: 12px; font-weight: 600; color: var(--sig); }
        .art-side-link:hover { color: var(--ink); }
        .art-side-h { font-size: 13px; font-weight: 700; padding-bottom: 8px; border-bottom: 1px solid var(--ink); }
        .art-toc a { display: block; padding: 7px 0; font-size: 14px; color: var(--ink); text-decoration: none; border-bottom: 1px solid var(--rule-soft); }
        .art-toc a:hover { color: var(--sig); }
        .art-more a { display: block; padding: 10px 0; color: var(--ink); text-decoration: none; border-bottom: 1px solid var(--rule-soft); }
        .art-more-t { display: block; font-size: 14.5px; font-weight: 600; line-height: 1.35; margin-top: 3px; }
        .art-more a:hover .art-more-t { color: var(--sig); }

        @media (max-width: 1200px) {
          .art-grid { gap: 56px; grid-template-columns: minmax(0, 1fr) 280px; }
        }
        @media (max-width: 1000px) {
          .art-grid { grid-template-columns: minmax(0, 1fr); gap: 0; }
          .art-side { padding-top: 48px; }
          .art-toc { display: none; }
        }
        @media (max-width: 768px) {
          .art-grid { padding-top: 28px; padding-bottom: 48px; }
          .art-title { font-size: 28px; line-height: 1.18; letter-spacing: -0.02em; }
          .art-sum { font-size: 17px; }
          .art-body p { font-size: 17px; }
          .art-body p.art-intro { font-size: 18px; }
          .art-end { grid-template-columns: 1fr; }
          .art-end .sub-form .btn { width: 100%; justify-content: center; }
          .site-brand { min-height: 44px; align-items: center; }
          .scope-link, .art-kicker, .art-mail, .art-side-link { display: inline-block; padding: 12px 0; }
          .art-side-link { margin-top: 0; }
        }

        .contact { padding: 56px 0 64px; }
        .contact-grid { display: grid; grid-template-columns: minmax(0, 1fr) 356px; gap: 64px; align-items: start; }
        .contact-h { font-size: 28px; font-weight: 600; letter-spacing: -0.02em; line-height: 1.2; }
        .contact-p { margin-top: 16px; font-size: 16px; line-height: 1.6; color: var(--ink-2); max-width: 54ch; }
        .contact-mail { margin-top: 22px; font-size: 18px; font-weight: 600; }
        .contact-mail a { color: var(--sig); }
        .contact-mail a:hover { color: var(--ink); }
        .contact-btns { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 22px; }
        @media (max-width: 900px) {
          .contact-grid { grid-template-columns: 1fr; gap: 32px; }
        }
        @media (max-width: 768px) {
          .contact { padding: 36px 0 44px; }
          .contact-h { font-size: 23px; }
          .contact-mail a { display: inline-block; padding: 10px 0; }
          .contact-btns { flex-direction: column; }
          .contact-btns .btn { justify-content: center; }
        }

        .trust-strip {
          padding: 60px 40px;
          border-top: 1px solid var(--rule-soft);
          border-bottom: 1px solid var(--rule-soft);
        }

        .trust-label {
          font-size: 13px;
          color: var(--ink-3);
          text-align: center;
          margin-bottom: 32px;
        }

        .trust-logos {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 28px;
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

        .trust-logo-img.wide {
          height: 20px;
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
          .trust-logo-img.wide { height: 16px; }
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
          <div className="wrap art-grid">
            <article>
              <a
                className="art-kicker"
                href="/#analysis"
                onClick={(e) => { e.preventDefault(); scrollTo("perspectives"); }}
              >
                Analysis, {midSentence(formatTag(activeArticle.tag))}
              </a>
              <h1 className="art-title">{activeArticle.title}</h1>
              {activeArticle.excerpt && <p className="art-sum">{activeArticle.excerpt}</p>}
              <div className="art-by">
                <b>Talal Al Zayed</b>
                <span>{formatLongDate(activeArticle.date)}</span>
                <span>{activeArticle.readTime} read</span>
              </div>

              <div className="art-body">
                {activeArticle.content.map((block, i) => {
                  if (block.type === "intro")
                    return <p key={i} className="art-intro">{block.text}</p>;
                  if (block.type === "heading")
                    return <h2 key={i} id={headingId(block.text)}>{block.text}</h2>;
                  if (block.type === "image")
                    return (
                      <figure key={i}>
                        <img src={block.src} alt={block.alt || ""} />
                        {block.caption && <figcaption className="note">{block.caption}</figcaption>}
                      </figure>
                    );
                  if (block.type === "stats")
                    return (
                      <table key={i}>
                        <thead>
                          <tr><th>Measure</th><th>Figure</th></tr>
                        </thead>
                        <tbody>
                          {block.items.map((stat, j) => (
                            <tr key={j}><td>{stat.label}</td><td>{stat.value}</td></tr>
                          ))}
                        </tbody>
                      </table>
                    );
                  if (block.type === "callout")
                    return <div key={i} className="art-callout">{block.text}</div>;
                  return <p key={i}>{block.text}</p>;
                })}
              </div>

              <div className="art-end">
                {emailSubmitted ? (
                  <div className="sub-done">Thanks. New pieces will come to your inbox.</div>
                ) : (
                  <form
                    className="sub-form"
                    onSubmit={(e) => { e.preventDefault(); handleEmailSubmit(); }}
                  >
                    <label className="lbl" htmlFor="asub">Get the next piece by email</label>
                    <input
                      className="inp"
                      id="asub"
                      type="email"
                      required
                      placeholder="you@company.com"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                    />
                    <button className="btn fill" type="submit">Subscribe</button>
                  </form>
                )}
                <div className="art-end-box">
                  <div className="art-end-h">Working on something this affects?</div>
                  <p className="art-end-p">Write to me. I read everything and I reply.</p>
                  <a className="art-mail" href="mailto:talal.h.zd@gmail.com">talal.h.zd@gmail.com</a>
                </div>
              </div>
            </article>

            <aside className="art-side">
              <div className="panel">
                <div className="ptop"><span className="ptop-title">About the author</span></div>
                <div className="art-side-body">
                  Head of Policy and Government Affairs at Nokia, based in Riyadh.
                  Previously HP, the Royal Court, the G20 team at the Saudi Central
                  Bank, Monshaat and the Royal Commission for AlUla.
                  <div>
                    <a
                      className="art-side-link"
                      href="/#record"
                      onClick={(e) => { e.preventDefault(); scrollTo("record"); }}
                    >
                      Track record
                    </a>
                  </div>
                </div>
              </div>

              {activeArticle.content.some((b) => b.type === "heading") && (
                <nav className="art-toc" aria-label="In this piece">
                  <div className="art-side-h">In this piece</div>
                  {activeArticle.content
                    .filter((b) => b.type === "heading")
                    .map((b) => (
                      <a key={b.text} href={"#" + headingId(b.text)}>{b.text}</a>
                    ))}
                </nav>
              )}

              <div className="art-more">
                <div className="art-side-h">More analysis</div>
                {allPerspectives
                  .filter((p) => p.slug !== activeArticle.slug)
                  .slice(0, 3)
                  .map((p) => (
                    <a
                      key={p.id}
                      href={"/articles/" + p.slug}
                      onClick={(e) => { e.preventDefault(); navigate("/articles/" + p.slug); window.scrollTo(0, 0); }}
                    >
                      <span className="yr">{formatDate(p.date)}</span>
                      <span className="art-more-t">{p.title}</span>
                    </a>
                  ))}
              </div>
            </aside>
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
              <button className="btn" onClick={() => scrollTo("work")}>
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
        <div className="trust-label">I served at</div>
        <div className="trust-logos">
          <img src="/nokia-logo.png" alt="Nokia" className="trust-logo-img wide" />
          <span className="trust-divider" />
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

      {/* WORK WITH ME */}
      <section
        ref={(el) => (sectionRefs.current.work = el)}
        className="sec"
        id="work"
      >
        <div className="wrap">
          <div className="shead">
            <h2 className="h2">Work with me</h2>
            <span className="note">Four ways in, different commitments</span>
          </div>
          <table className="rec wk">
            <thead>
              <tr>
                <th style={{ width: "24%" }}>Mode</th>
                <th>What it looks like</th>
                <th style={{ width: "12%" }}>Availability</th>
              </tr>
            </thead>
            <tbody>
              {workModes.map((m) => (
                <tr key={m.mode}>
                  <td className="lead-cell"><span className="lead">{m.mode}</span></td>
                  <td className="soft">
                    {m.what}
                    {m.speaking && (
                      <div className="spk">
                        <div className="spk-topics">
                          {speakingTopics.map((t) => (
                            <div className="spk-topic" key={t.q}>
                              <h3 className="cq">{t.q}</h3>
                              <p className="ca">{t.a}</p>
                            </div>
                          ))}
                        </div>
                        <div className="spk-foot">
                          <ul className="spk-creds">
                            {speakingCredentials.map((c) => <li key={c}>{c}</li>)}
                          </ul>
                          <button className="btn fill" onClick={() => scrollTo("connect")}>
                            Invite me to speak
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                  <td className={`status ${m.tone || ""}`}>{m.status}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="scope">
            <div>
              <h3 className="scope-h">Advisory scope</h3>
              <p className="scope-intro">
                Saudi Arabia only. Fixed scope and a defined deliverable.
                Conflicts are screened before anything is scoped.
              </p>
              <a
                className="scope-link"
                href="/advisory"
                onClick={(e) => { e.preventDefault(); goAdvisory(); }}
              >
                More on advisory
              </a>
            </div>
            <div className="scope-grid">
              {advisoryScope.map((a) => (
                <div className="scope-item" key={a.title}>
                  <div className="scope-item-t">{a.title}</div>
                  <div className="scope-item-d">{a.deliverable}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section
        ref={(el) => (sectionRefs.current.connect = el)}
        className="contact"
        id="contact"
      >
        <div className="wrap contact-grid">
          <div>
            <h2 className="contact-h">Whatever brought you here, write to me.</h2>
            <p className="contact-p">
              A speaking invitation, an advisory question, a board conversation,
              or something you are weighing in the Kingdom. I read everything and
              I reply. If I am not the right person, I will say so and point you
              to someone who is.
            </p>
            <p className="contact-mail">
              <a href="mailto:talal.h.zd@gmail.com">talal.h.zd@gmail.com</a>
            </p>
            <div className="contact-btns">
              <a className="btn fill" href="mailto:talal.h.zd@gmail.com">Email me</a>
              <a className="btn" href="https://www.linkedin.com/in/talal-alzayed/" target="_blank" rel="noopener">LinkedIn</a>
              <a className="btn" href="/Talal_AlZayed_CV.pdf" target="_blank" rel="noopener">Download CV</a>
            </div>
          </div>

          <aside className="panel" aria-label="Education and credentials">
            <div className="ptop"><span className="ptop-title">Education and credentials</span></div>
            {credentials.map((c) => (
              <div className="prow" key={c.k}>
                <span className="pk">{c.k}</span>
                <span className="pv">{c.v}</span>
              </div>
            ))}
          </aside>
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
