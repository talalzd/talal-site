// Vercel Edge Middleware
// Serves article-specific OG tags to social media crawlers
// Article metadata is fetched from article-meta.json (auto-generated at build time)

const BOT_AGENTS = [
  "linkedinbot",
  "facebookexternalhit",
  "twitterbot",
  "whatsapp",
  "telegrambot",
  "slackbot",
  "discordbot",
  "googlebot",
  "bingbot",
];

export const config = {
  matcher: "/articles/:slug*",
};

export default async function middleware(request) {
  const ua = (request.headers.get("user-agent") || "").toLowerCase();
  const isBot = BOT_AGENTS.some((bot) => ua.includes(bot));

  if (!isBot) {
    return;
  }

  const url = new URL(request.url);
  const slug = url.pathname.split("/articles/")[1];
  const origin = url.origin;

  if (!slug) return;

  try {
    // Fetch article metadata (static JSON generated at build time)
    const metaRes = await fetch(`${origin}/article-meta.json`);
    if (!metaRes.ok) return;
    const allMeta = await metaRes.json();
    const article = allMeta[slug];
    if (!article) return;

    // Build dynamic OG image URL
    const ogImageUrl = `${origin}/api/og?title=${encodeURIComponent(article.title)}&tag=${encodeURIComponent(article.tag)}&excerpt=${encodeURIComponent(article.description)}`;

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>${article.title} | Talal Al Zayed</title>
  <meta name="description" content="${article.description}" />
  <meta property="og:title" content="${article.title}" />
  <meta property="og:description" content="${article.description}" />
  <meta property="og:image" content="${ogImageUrl}" />
  <meta property="og:url" content="${origin}/articles/${slug}" />
  <meta property="og:type" content="article" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${article.title}" />
  <meta name="twitter:description" content="${article.description}" />
  <meta name="twitter:image" content="${ogImageUrl}" />
</head>
<body></body>
</html>`;

    return new Response(html, {
      headers: { "Content-Type": "text/html" },
    });
  } catch (e) {
    return;
  }
}
