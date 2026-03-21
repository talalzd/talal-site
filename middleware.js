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

  if (!isBot) return;

  const url = new URL(request.url);
  const slug = url.pathname.split("/articles/")[1];
  const origin = url.origin;

  if (!slug) return;

  try {
    const metaRes = await fetch(origin + "/article-meta.json");
    if (!metaRes.ok) return;
    const allMeta = await metaRes.json();
    const article = allMeta[slug];
    if (!article) return;

    const ogImage = origin + "/og-" + slug + ".png";

    const html = "<!DOCTYPE html><html><head>" +
      "<meta charset=\"UTF-8\" />" +
      "<title>" + article.title + " | Talal Al Zayed</title>" +
      "<meta name=\"description\" content=\"" + article.description + "\" />" +
      "<meta property=\"og:title\" content=\"" + article.title + "\" />" +
      "<meta property=\"og:description\" content=\"" + article.description + "\" />" +
      "<meta property=\"og:image\" content=\"" + ogImage + "\" />" +
      "<meta property=\"og:url\" content=\"" + origin + "/articles/" + slug + "\" />" +
      "<meta property=\"og:type\" content=\"article\" />" +
      "<meta name=\"twitter:card\" content=\"summary_large_image\" />" +
      "<meta name=\"twitter:title\" content=\"" + article.title + "\" />" +
      "<meta name=\"twitter:description\" content=\"" + article.description + "\" />" +
      "<meta name=\"twitter:image\" content=\"" + ogImage + "\" />" +
      "</head><body></body></html>";

    return new Response(html, {
      headers: { "Content-Type": "text/html" },
    });
  } catch (e) {
    return;
  }
}
```

5. Commit

**Step 3: Remove @vercel/og from package.json**

1. Click `package.json`
2. Click pencil to edit
3. Change dependencies back to:
```
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.23.0"
  },
