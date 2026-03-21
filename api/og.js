import { ImageResponse } from "@vercel/og";

export var config = {
  runtime: "edge"
};

export default function handler(req) {
  var url = new URL(req.url);
  var title = url.searchParams.get("title") || "Talal Al Zayed";
  var tag = url.searchParams.get("tag") || "POLICY × TECHNOLOGY × BUILDER";
  var excerpt = url.searchParams.get("excerpt") || "";

  var titleSize = 54;
  if (title.length > 80) titleSize = 40;
  else if (title.length > 60) titleSize = 46;

  var children = [
    // Accent line
    {
      type: "div",
      props: {
        style: {
          position: "absolute",
          top: 0,
          left: 80,
          width: 1,
          height: "100%",
          background: "linear-gradient(to bottom, transparent, rgba(200,169,126,0.2) 30%, rgba(200,169,126,0.2) 70%, transparent)"
        }
      }
    },
    // Bottom bar
    {
      type: "div",
      props: {
        style: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 4,
          background: "linear-gradient(to right, #C8A97E, rgba(200,169,126,0.3))"
        }
      }
    },
    // Tag
    {
      type: "div",
      props: {
        style: {
          fontSize: 12,
          letterSpacing: 5,
          color: "#C8A97E",
          marginBottom: 28,
          fontFamily: "monospace"
        },
        children: tag.toUpperCase()
      }
    },
    // Title
    {
      type: "div",
      props: {
        style: {
          fontSize: titleSize,
          lineHeight: 1.12,
          color: "#E8E4DF",
          maxWidth: 950,
          marginBottom: 32,
          fontFamily: "serif"
        },
        children: title
      }
    }
  ];

  // Excerpt
  if (excerpt) {
    children.push({
      type: "div",
      props: {
        style: {
          fontSize: 17,
          color: "#8A8580",
          maxWidth: 750,
          lineHeight: 1.6
        },
        children: excerpt
      }
    });
  }

  // Footer row
  children.push({
    type: "div",
    props: {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 24,
        marginTop: "auto"
      },
      children: [
        {
          type: "div",
          props: {
            style: { fontSize: 20, color: "#E8E4DF", fontFamily: "serif" },
            children: "Talal Al Zayed"
          }
        },
        {
          type: "div",
          props: {
            style: { width: 1, height: 20, background: "rgba(200,169,126,0.3)" }
          }
        },
        {
          type: "div",
          props: {
            style: { fontSize: 13, letterSpacing: 1, color: "#6B6560", fontFamily: "monospace" },
            children: "talalalzayed.com"
          }
        }
      ]
    }
  });

  return new ImageResponse(
    {
      type: "div",
      props: {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 90px",
          backgroundColor: "#0A0A0A",
          position: "relative"
        },
        children: children
      }
    },
    {
      width: 1200,
      height: 630
    }
  );
}
