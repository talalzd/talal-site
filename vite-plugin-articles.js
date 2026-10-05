// vite-plugin-articles.js
// Auto-generates sitemap.xml and article-meta.json from articles.js at build time
// Drop this in the root of your repo

import fs from "fs";
import path from "path";
import { SHOW_ADVISORY } from "./src/siteFlags.js";

export default function articlesPlugin() {
  return {
    name: "articles-plugin",
    buildStart() {
      // Read articles.js source
      const articlesPath = path.resolve("src/articles.js");
      const articlesSource = fs.readFileSync(articlesPath, "utf-8");

      // Extract article metadata using regex (safe since we control the format)
      const articleRegex =
        /\{\s*id:\s*(\d+),\s*slug:\s*"([^"]+)",\s*tag:\s*"([^"]+)",\s*title:\s*"([^"]+)",\s*excerpt:\s*"([^"]+)",\s*date:\s*"([^"]+)"/g;

      const articles = [];
      let match;
      while ((match = articleRegex.exec(articlesSource)) !== null) {
        articles.push({
          id: parseInt(match[1]),
          slug: match[2],
          tag: match[3],
          title: match[4],
          excerpt: match[5],
          date: match[6],
        });
      }

      console.log(`[articles-plugin] Found ${articles.length} articles`);

      // Generate sitemap.xml
      const today = new Date().toISOString().split("T")[0];
      const sitemapEntries = articles
        .map((a) => {
          const d = new Date(a.date);
          const lastmod = d.toISOString().split("T")[0];
          return `  <url>
    <loc>https://talalalzayed.com/articles/${a.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>0.8</priority>
  </url>`;
        })
        .join("\n");

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://talalalzayed.com/</loc>
    <lastmod>${today}</lastmod>
    <priority>1.0</priority>
  </url>
${SHOW_ADVISORY ? `  <url>
    <loc>https://talalalzayed.com/advisory</loc>
    <lastmod>${today}</lastmod>
    <priority>0.7</priority>
  </url>
` : ""}${sitemapEntries}
</urlset>
`;

      fs.writeFileSync(path.resolve("public/sitemap.xml"), sitemap);
      console.log(`[articles-plugin] Generated sitemap.xml with ${articles.length + 1} URLs`);

      // Generate article-meta.json for middleware
      const meta = {};
      articles.forEach((a) => {
        meta[a.slug] = {
          title: a.title,
          description: a.excerpt,
          tag: a.tag,
          date: a.date,
        };
      });

      fs.writeFileSync(
        path.resolve("public/article-meta.json"),
        JSON.stringify(meta, null, 2)
      );
      console.log(`[articles-plugin] Generated article-meta.json`);
    },

    // After the build, write a real HTML page for each article at
    // dist/articles/<slug>.html. Search engines get the article's own
    // title, description, canonical URL and full text without running
    // JavaScript. When the app loads, React replaces the text with the
    // normal article view, so visitors see the same page as before.
    async closeBundle() {
      const distIndex = path.resolve("dist/index.html");
      if (!fs.existsSync(distIndex)) return;
      const template = fs.readFileSync(distIndex, "utf-8");

      const articlesUrl = new URL("./src/articles.js", import.meta.url).href;
      const { default: allArticles } = await import(`${articlesUrl}?t=${Date.now()}`);

      for (const a of allArticles) {
        const url = `${SITE}/articles/${a.slug}`;
        const title = `${a.title} | Talal Al Zayed`;
        const ogImage = `${SITE}/api/og?title=${encodeURIComponent(a.title)}&tag=${encodeURIComponent(a.tag)}&excerpt=${encodeURIComponent(a.excerpt)}`;
        const published = new Date(`${a.date} UTC`).toISOString().split("T")[0];

        const schema = {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: a.title,
          description: a.excerpt,
          datePublished: published,
          url,
          mainEntityOfPage: url,
          image: ogImage,
          author: {
            "@type": "Person",
            "@id": `${SITE}/#talal`,
            name: "Talal Al Zayed",
            url: SITE,
          },
        };

        let html = template
          .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
          .replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(a.excerpt)}$2`)
          .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(a.title)}$2`)
          .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(a.excerpt)}$2`)
          .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
          .replace(/(<meta property="og:type" content=")[^"]*(")/, `$1article$2`)
          .replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${esc(ogImage)}$2`)
          .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(a.title)}$2`)
          .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${esc(a.excerpt)}$2`)
          .replace(/(<meta name="twitter:image" content=")[^"]*(")/, `$1${esc(ogImage)}$2`)
          .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
          .replace(
            "</head>",
            `<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script>\n  </head>`
          )
          .replace('<div id="root"></div>', `<div id="root">${articleBody(a)}</div>`);

        // Served at /articles/<slug> through "cleanUrls" in vercel.json.
        const outDir = path.resolve("dist/articles");
        fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(path.join(outDir, `${a.slug}.html`), html);
      }

      console.log(`[articles-plugin] Wrote ${allArticles.length} static article pages`);
    },
  };
}

const SITE = "https://talalalzayed.com";

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Plain HTML version of an article. Shown only until the app loads.
function articleBody(a) {
  const blocks = (a.content || [])
    .map((b) => {
      switch (b.type) {
        case "heading":
          return `<h2>${esc(b.text)}</h2>`;
        case "callout":
          return `<blockquote>${esc(b.text)}</blockquote>`;
        case "image":
          return `<figure><img src="${esc(b.src)}" alt="${esc(b.alt || "")}" style="max-width:100%;height:auto" />${
            b.caption ? `<figcaption>${esc(b.caption)}</figcaption>` : ""
          }</figure>`;
        case "stats":
          return `<ul>${(b.items || [])
            .map((i) => `<li><strong>${esc(i.value)}</strong> ${esc(i.label)}</li>`)
            .join("")}</ul>`;
        default:
          return b.text ? `<p>${esc(b.text)}</p>` : "";
      }
    })
    .join("\n");

  return `<article style="max-width:680px;margin:0 auto;padding:96px 20px;font-family:Archivo,system-ui,sans-serif;color:#0C0D0F;line-height:1.6">
<p><a href="/">Talal Al Zayed</a></p>
<h1>${esc(a.title)}</h1>
<p>${esc(a.date)}${a.readTime ? `, ${esc(a.readTime)} read` : ""}</p>
${blocks}
</article>`;
}
