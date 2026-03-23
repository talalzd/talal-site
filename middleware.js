var BOT_AGENTS = [
  "linkedinbot",
  "facebookexternalhit",
  "twitterbot",
  "whatsapp",
  "telegrambot",
  "slackbot",
  "discordbot",
  "googlebot",
  "bingbot"
];

export var config = {
  matcher: "/articles/:slug*"
};

export default async function middleware(request) {
  var ua = (request.headers.get("user-agent") || "").toLowerCase();
  var isBot = BOT_AGENTS.some(function(bot) { return ua.includes(bot); });

  if (!isBot) return;

  var url = new URL(request.url);
  var parts = url.pathname.split("/articles/");
  var slug = parts[1];
  var origin = url.origin;

  if (!slug) return;

  // Strip trailing slash to prevent redirect duplicates
  if (slug.endsWith("/")) {
    slug = slug.slice(0, -1);
  }

  try {
    var metaRes = await fetch(origin + "/article-meta.json");
    if (!metaRes.ok) return;
    var allMeta = await metaRes.json();
    var article = allMeta[slug];
    if (!article) return;

    var ogImage = origin + "/api/og"
      + "?title=" + encodeURIComponent(article.title)
      + "&tag=" + encodeURIComponent(article.tag)
      + "&excerpt=" + encodeURIComponent(article.description);

    var canonicalUrl = origin + "/articles/" + slug;

    var html = "<!DOCTYPE html><html><head>"
      + "<meta charset=\"UTF-8\" />"
      + "<link rel=\"canonical\" href=\"" + canonicalUrl + "\" />"
      + "<title>" + article.title + " | Talal Al Zayed</title>"
      + "<meta name=\"description\" content=\"" + article.description + "\" />"
      + "<meta property=\"og:title\" content=\"" + article.title + "\" />"
      + "<meta property=\"og:description\" content=\"" + article.description + "\" />"
      + "<meta property=\"og:image\" content=\"" + ogImage + "\" />"
      + "<meta property=\"og:url\" content=\"" + canonicalUrl + "\" />"
      + "<meta property=\"og:type\" content=\"article\" />"
      + "<meta name=\"twitter:card\" content=\"summary_large_image\" />"
      + "<meta name=\"twitter:title\" content=\"" + article.title + "\" />"
      + "<meta name=\"twitter:description\" content=\"" + article.description + "\" />"
      + "<meta name=\"twitter:image\" content=\"" + ogImage + "\" />"
      + "</head><body></body></html>";

    return new Response(html, {
      headers: { "Content-Type": "text/html" }
    });
  } catch (e) {
    return;
  }
}
