# talalalzayed.com

Personal site of Talal Al Zayed. Head of Policy and Government Affairs at Nokia, covering Saudi Arabia, since August 2026 (previously HP, May 2024 to July 2026), based in Riyadh. Nearly nine years inside Saudi government (Royal Court Vision 2030 team, Monshaat, SAMA G20 Finance Track, Royal Commission for AlUla) before moving to industry in 2024.

Talal is not a developer. Explain what you changed in plain words, not code. Do not paste diffs into the chat unless he asks.

## What the site is for

- Analysis on Saudi and regional regulation. This is the engine of the site.
- Speaking and moderation invitations.
- New professional connections and introductions.
- Limited advisory work, Saudi-focused, for companies, investors and institutions. Advisory is one mode among four. The site must never read as consulting-only.

Primary reader: someone investing in or operating in Saudi Arabia (fund partner, corp dev, general counsel), plus conference organizers and senior recruiters.

## Stack

- Vite + React single-page app with React Router. Deployed on Vercel. Every push to `main` deploys to production.
- Repo: github.com/talalzd/talal-site
- `src/App.jsx`: homepage, nav, article view, 404.
- `src/Advisory.jsx`: /advisory page.
- `src/articles.js`: single source of truth for all articles. A Vite plugin generates `sitemap.xml` and `article-meta.json` from it at build time. Middleware serves per-article OG tags via `/api/og`.
- `src/ArticlePublisher.jsx`: the tool at /publish that turns pasted text into an articles.js entry.
- `index.html`: Google Analytics (G-CJKEP1MMF2), Schema.org JSON-LD ProfilePage, OG and Twitter tags, canonical URL. Preserve all of these in every change.

## How we work

1. One branch per change. Never commit straight to `main`.
2. Run `npm run build` before every commit. It must pass.
3. Push the branch. Vercel builds a preview URL. Give Talal that link and a short plain summary.
4. Merge to `main` only after Talal says it looks right.
5. Small, targeted edits. Do not rewrite a whole file when a few lines change.
6. New articles go through the `/publish-article` skill in `.claude/skills/publish-article/`. Talal pastes text, attaches a file, or gives notes; the skill does the rest and returns a preview link and a LinkedIn post. The old /publish page on the site is no longer needed.

## Planned redesign (approved direction, port in stages)

The live site is dark with gold accents (Instrument Serif, DM Sans, JetBrains Mono). It is being replaced. Reference pages are in `design/`: `home-desktop.html`, `home-mobile.html`, `article.html`. Open them in a browser. They are the target.

Design system:
- Light and cold. Background #FFFFFF, sunk panels #F1F2F3, ink #0C0D0F, secondary text #4A4F55, tertiary #666C73, rules #D8DBDE and #EAECEE.
- One accent, signal blue #123FBA. One flag red #A33417, used only for "Limited".
- Type: Archivo for everything, Archivo Narrow for table headers and dates. No serif anywhere.
- Dense. Real tables for track record and ways to work together (including the speaking topics). Small type (14 to 15px in tables, 15px base).
- The one bold element is the "Current status" panel in the hero.

Structure: header (Analysis, Track record, Work with me, Contact), reference line, hero with claim and status panel, What I work on, Analysis (lead piece, index, email signup), Track record, Work with me (four modes plus advisory scope), Contact with credentials panel, footer with "Views here are my own, not my employer's."

Speaking is not its own section and is not in the header nav. Talal has no past appearances yet. Instead, the "Speaking and moderation" row under Work with me carries:
- The four speaking topics from the mockups (Inside Vision 2030 policymaking, Entering the Saudi market, AI governance in the Gulf, Consensus across twenty countries), each with its one-line description.
- An "Invite me to speak" button linking to Contact.
- Exactly two credentials, worded exactly: "Conceived and ran the inaugural G20 Deputy Ministers' Symposium" and "Technology committee member, AmCham Saudi Arabia".
- No "For organizers" panel, no formats list, no appearances.

The Speaking section and Speaking nav link in `design/home-desktop.html` and `design/home-mobile.html` are superseded by this. Do not port them.

Port plan. All stages happen on one branch called `redesign`. Each session does one stage, pushes, and gives Talal the preview link. Nothing merges to `main` until every stage is done and Talal approves, so the live site stays untouched until the switch.

1. Foundation: Archivo fonts, color tokens, header, reference line, footer. Remove the old grain, glow and gold styles.
2. Hero and the Current status panel.
3. What I work on, and Analysis (lead piece is always the newest article, then the index, then email signup).
4. Track record. Use these confirmed dates for the two industry roles:
   - Nokia: Head of Policy and Government Affairs, Saudi Arabia only, August 2026 to present. No achievements listed yet. Do not invent any.
   - HP Inc.: Director, Public Policy & Government Affairs, Saudi Arabia, UAE and Egypt (per the CV), May 2024 to July 2026.
   - Earlier roles and outcomes come from `public/Talal_AlZayed_CV.pdf`.
5. Work with me, including advisory scope and the speaking topics, button and two credentials described above. Restyle the /advisory page to match, since people may have it bookmarked.
6. Article page, matching `design/article.html`.
7. Phone check of every page, then SEO: JSON-LD `worksFor`, page titles and meta descriptions, and a new light OG image.
8. Remove the What I Build section and tool links if any remain. Replace the old About and Connect sections with the mockup's Contact section and its Education and credentials panel. Delete unused old styles, final build, then merge to `main` only after Talal says go.

When Talal says "next stage", check which stages are already done on the `redesign` branch and do the next one.

## Decisions already made. Do not reopen without asking.

- No "Tools" or "What I Build" section. Remove links to the risk score, entry playbook and policy monitor.
- No Arabic for now. It may come back later.
- Advisory is Saudi-only, audience is not limited to tech companies. Six scope areas: market entry and regulatory strategy, government relations, strategic partnerships, investment frameworks, digital and AI policy, policy risk monitoring.
- No WhatsApp button and nothing that signals always-on availability.
- LinkedIn is https://www.linkedin.com/in/talal-alzayed/ (with the hyphen). The mockups in `design/` and the old CV show `talalalzayed`; that spelling is wrong. Never copy it from them.
- Domain: talalalzayed.com (no www) is the primary domain in Vercel. www.talalalzayed.com, talalzd.com and www.talalzd.com all 308-redirect straight to it. Talal changed this on October 5, 2026 because the old setup (served at www, canonicals saying no-www) had Google ignoring the site. Every canonical, og:url and sitemap URL must use https://talalalzayed.com. Keep them matching.
- Search engines get a real HTML page per article. `vite-plugin-articles.js` writes `dist/articles/<slug>.html` at build time with the article's own title, description, canonical and full text, served at /articles/<slug> through `cleanUrls` in `vercel.json`. React replaces that text with the normal article view on load. Googlebot and Bingbot must stay out of the bot list in `middleware.js`, which sends an empty tags-only page.
- Status panel values: Speaking and moderation Open, Introductions Always, Advisory engagements Limited, Board and advisory seats Selective. The last two are hidden for now (see open items).

## Writing rules

- Short, direct sentences. Authoritative but human.
- No em dashes. No AI-sounding phrasing.
- US spelling.
- Sentence case for headings and labels. No ALL CAPS labels, no arrows on buttons, no middle-dot separators, no numbered 01/02/03 section markers.
- Never invent facts, numbers, titles or appearances. Use a bracketed placeholder like [Event, city, year] and tell Talal.

## Open items to confirm with Talal before they go live

- Advisory and board seats are hidden until Talal confirms Nokia's outside-activities policy allows them. Switch: `SHOW_ADVISORY` in `src/siteFlags.js`. While false it hides the Advisory engagements and Board and advisory seats rows in the status panel, the matching two rows in Work with me, the advisory scope list, and the /advisory page, and sends /advisory to the homepage (in the app, in `middleware.js`, and by leaving it out of the sitemap). The code stays in place. Set it to true to switch everything back on.
  - The same switch also picks between two wordings for two lines. Advisory off (current): hero "I write about how Saudi policy gets made, where it is heading, and what it means for the people who have to operate inside it." and Contact "A speaking invitation, an introduction, or something you are weighing in the Kingdom. I read everything and I reply."
  - Original wording, which returns when advisory is switched on: hero "I write about how Saudi policy gets made and where it is heading, speak about it, and advise the people who have to operate inside it." and Contact "A speaking invitation, an advisory question, a board conversation, or something you are weighing in the Kingdom. I read everything and I reply. If I am not the right person, I will say so and point you to someone who is."
- The Download CV button is hidden until Talal sends an updated CV (the current `public/Talal_AlZayed_CV.pdf` still lists HP as current). Switch: `SHOW_CV` in `src/siteFlags.js`. Replace the PDF first, then set it to true.
- The "I Served At" logo strip was removed before launch, at Talal's request. The reference line's "Before" item now names the institutions instead: The Royal Court, SAMA, Monshaat, Royal Commission for AlUla, HP. The logo files are still in `public/` if he wants it back.
- New articles. The last one is from May 2026 (HUMAIN One). The design mockups show the March two-coast piece as the lead only because it was the example used; the lead should always be the newest article.
