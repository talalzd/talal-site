// vite-plugin-articles.js
// Auto-generates sitemap.xml and article-meta.json from articles.js at build time
// Drop this in the root of your repo

import fs from "fs";
import path from "path";

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
${sitemapEntries}
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
  };
}
