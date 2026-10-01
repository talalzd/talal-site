import { ImageResponse } from "@vercel/og";

export var config = {
  runtime: "edge"
};

// Tags are stored in capitals. Show them in sentence case, keeping acronyms.
var ACRONYMS = ["AI", "FDI", "GCC", "UAE", "SME", "G20"];
function formatTag(t) {
  var out = (t || "").toLowerCase().split(" ").map(function(w) {
    return ACRONYMS.indexOf(w.toUpperCase()) >= 0 ? w.toUpperCase() : w;
  }).join(" ");
  return out.charAt(0).toUpperCase() + out.slice(1);
}

export default function handler(req) {
  var url = new URL(req.url);
  var title = url.searchParams.get("title") || "Talal Al Zayed";
  var tag = url.searchParams.get("tag");
  var excerpt = url.searchParams.get("excerpt") || "";

  var titleSize = 58;
  if (title.length > 80) titleSize = 44;
  else if (title.length > 60) titleSize = 50;

  if (excerpt.length > 180) excerpt = excerpt.slice(0, 177).replace(/\s+\S*$/, "") + "...";

  var body = [
    {
      type: "div",
      props: {
        style: { fontSize: 22, color: "#666C73", marginBottom: 22 },
        children: tag ? "Analysis, " + formatTag(tag) : "Analysis"
      }
    },
    {
      type: "div",
      props: {
        style: {
          fontSize: titleSize,
          lineHeight: 1.14,
          fontWeight: 600,
          letterSpacing: "-0.02em",
          color: "#0C0D0F",
          maxWidth: 1000
        },
        children: title
      }
    }
  ];

  if (excerpt) {
    body.push({
      type: "div",
      props: {
        style: { fontSize: 24, lineHeight: 1.5, color: "#4A4F55", maxWidth: 940, marginTop: 24 },
        children: excerpt
      }
    });
  }

  return new ImageResponse(
    {
      type: "div",
      props: {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#FFFFFF",
          borderTop: "12px solid #123FBA"
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
                justifyContent: "center",
                padding: "0 80px"
              },
              children: body
            }
          },
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                margin: "0 80px",
                padding: "22px 0 40px",
                borderTop: "2px solid #0C0D0F",
                fontSize: 22,
                color: "#4A4F55"
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: { fontWeight: 700, color: "#0C0D0F" },
                    children: "Talal Al Zayed"
                  }
                },
                {
                  type: "div",
                  props: { children: "talalalzayed.com" }
                }
              ]
            }
          }
        ]
      }
    },
    {
      width: 1200,
      height: 630
    }
  );
}
