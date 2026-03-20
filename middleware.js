// Vercel Edge Middleware
// Serves article-specific OG meta tags to social media crawlers
// Regular users get the normal SPA experience

const ARTICLES = {
  "two-coast-advantage": {
    title: "Saudi Arabia's Two-Coast Advantage: How Infrastructure Planning Became the Gulf's Lifeline",
    description: "The Strait of Hormuz is closed. And the one country that saw this coming decades ago is proving why infrastructure investment is not a luxury. It is a survival strategy.",
    image: "og-two-coast-advantage.png",
  },
  "regulatory-cheat-sheet": {
    title: "A Tech Company's Regulatory Cheat Sheet for Saudi, UAE, and Egypt",
    description: "Three countries. Three regulatory philosophies. One region everyone keeps treating as a single market.",
    image: "og-regulatory-cheat-sheet.png",
  },
  "ai-strategies-trade-barriers": {
    title: "National AI Strategies Are the New Trade Barriers. And Nobody's Ready.",
    description: "Saudi Arabia, UAE, and Egypt each have distinct AI governance philosophies. Companies building a single MENA strategy are making a $100M mistake.",
    image: "og-ai-strategies-trade-barriers.png",
  },
  "gcc-fdi-race": {
    title: "The Real GCC FDI Race Isn't About Money. It's About Who Gets Trusted First.",
    description: "Saudi Arabia and the UAE are both throwing billions at tech companies to set up locally. But capital alone doesn't close deals.",
    image: "og-gcc-fdi-race.png",
  },
};

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

export default function middleware(request) {
  const ua = (request.headers.get("user-agent") || "").toLowerCase();
  const isBot = BOT_AGENTS.some((bot) => ua.includes(bot));

  if (!isBot) {
    return;
  }

  const url = new URL(request.url);
  const slug = url.pathname.split("/articles/")[1];
  const article = ARTICLES[slug];

  if (!article) {
    return;
  }

  const origin = url.origin;

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>${article.title} | Talal Al Zayed</title>
  <meta name="description" content="${article.description}" />
  <meta property="og:title" content="${article.title}" />
  <meta property="og:description" content="${article.description}" />
  <meta property="og:image" content="${origin}/${article.image}" />
  <meta property="og:url" content="${origin}/articles/${slug}" />
  <meta property="og:type" content="article" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${article.title}" />
  <meta name="twitter:description" content="${article.description}" />
  <meta name="twitter:image" content="${origin}/${article.image}" />
</head>
<body></body>
</html>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html" },
  });
}
