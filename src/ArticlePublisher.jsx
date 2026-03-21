import { useState } from "react";

const INITIAL = {
  title: "",
  slug: "",
  tag: "",
  excerpt: "",
  date: "",
  readTime: "",
  body: ""
};

const HELP_TEXT = `Write your article body here using simple formatting:

## Section Heading
Regular paragraphs are separated by blank lines.

The first paragraph will automatically become the intro (styled differently).

[IMAGE: /filename.jpg]
Caption text goes on the next line

[STATS]
1.1M bpd | Pre-war Yanbu exports
4.0M+ bpd | Current Yanbu exports | green
5.0M bpd | Pipeline export capacity | accent

[CALLOUT]
This text will appear in a highlighted box with a gold left border.

Everything else is a regular paragraph.`;

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
}

function estimateReadTime(text) {
  var words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 230)) + " min";
}

function parseBody(raw) {
  var lines = raw.split("\n");
  var blocks = [];
  var i = 0;
  var isFirst = true;

  while (i < lines.length) {
    var line = lines[i].trim();

    // Skip empty lines
    if (!line) { i++; continue; }

    // Heading
    if (line.startsWith("## ")) {
      blocks.push({ type: "heading", text: line.slice(3).trim() });
      i++;
      continue;
    }

    // Image block
    if (line.startsWith("[IMAGE:")) {
      var src = line.replace("[IMAGE:", "").replace("]", "").trim();
      var caption = "";
      if (i + 1 < lines.length && lines[i + 1].trim() && !lines[i + 1].trim().startsWith("[") && !lines[i + 1].trim().startsWith("##")) {
        caption = lines[i + 1].trim();
        i++;
      }
      blocks.push({ type: "image", src: src, alt: caption, caption: caption });
      i++;
      continue;
    }

    // Stats block
    if (line === "[STATS]") {
      var items = [];
      i++;
      while (i < lines.length && lines[i].trim() && !lines[i].trim().startsWith("[") && !lines[i].trim().startsWith("##")) {
        var parts = lines[i].split("|").map(function(p) { return p.trim(); });
        var stat = { value: parts[0], label: parts[1] || "" };
        if (parts[2] === "green") stat.highlight = "highlight-green";
        else if (parts[2] === "accent") stat.highlight = "highlight-accent";
        items.push(stat);
        i++;
      }
      blocks.push({ type: "stats", items: items });
      continue;
    }

    // Callout block
    if (line === "[CALLOUT]") {
      i++;
      var calloutLines = [];
      while (i < lines.length && lines[i].trim() && !lines[i].trim().startsWith("[") && !lines[i].trim().startsWith("##")) {
        calloutLines.push(lines[i].trim());
        i++;
      }
      blocks.push({ type: "callout", text: calloutLines.join(" ") });
      continue;
    }

    // Regular paragraph - collect consecutive non-empty lines
    var paraLines = [];
    while (i < lines.length && lines[i].trim() && !lines[i].trim().startsWith("##") && !lines[i].trim().startsWith("[")) {
      paraLines.push(lines[i].trim());
      i++;
    }
    var text = paraLines.join(" ");
    if (isFirst) {
      blocks.push({ type: "intro", text: text });
      isFirst = false;
    } else {
      blocks.push({ type: "text", text: text });
    }
  }

  return blocks;
}

function generateCode(article, blocks, nextId) {
  var contentStr = blocks.map(function(b) {
    if (b.type === "image") {
      return '      {\n        type: "image",\n        src: "' + b.src + '",\n        alt: "' + (b.alt || "").replace(/"/g, '\\"') + '",\n        caption: "' + (b.caption || "").replace(/"/g, '\\"') + '"\n      }';
    }
    if (b.type === "stats") {
      var itemsStr = b.items.map(function(s) {
        var line = '          { value: "' + s.value + '", label: "' + s.label + '"';
        if (s.highlight) line += ', highlight: "' + s.highlight + '"';
        line += " }";
        return line;
      }).join(",\n");
      return '      {\n        type: "stats",\n        items: [\n' + itemsStr + '\n        ]\n      }';
    }
    if (b.type === "callout") {
      return '      {\n        type: "callout",\n        text: "' + b.text.replace(/"/g, '\\"') + '"\n      }';
    }
    return '      {\n        type: "' + b.type + '",\n        text: "' + b.text.replace(/"/g, '\\"') + '"\n      }';
  }).join(",\n");

  return '  {\n    id: ' + nextId + ',\n    slug: "' + article.slug + '",\n    tag: "' + article.tag.toUpperCase() + '",\n    title: "' + article.title.replace(/"/g, '\\"') + '",\n    excerpt:\n      "' + article.excerpt.replace(/"/g, '\\"') + '",\n    date: "' + article.date + '",\n    readTime: "' + article.readTime + '",\n    content: [\n' + contentStr + '\n    ]\n  },';
}

export default function ArticlePublisher() {
  var s = useState;
  var _form = s(INITIAL);
  var form = _form[0];
  var setForm = _form[1];
  var _output = s("");
  var output = _output[0];
  var setOutput = _output[1];
  var _preview = s(false);
  var preview = _preview[0];
  var setPreview = _preview[1];
  var _copied = s(false);
  var copied = _copied[0];
  var setCopied = _copied[1];
  var _nextId = s(6);
  var nextId = _nextId[0];
  var setNextId = _nextId[1];

  function update(field, value) {
    var next = Object.assign({}, form);
    next[field] = value;
    if (field === "title" && !form.slugManual) {
      next.slug = generateSlug(value);
    }
    if (field === "body") {
      next.readTime = estimateReadTime(value);
    }
    setForm(next);
  }

  function handleGenerate() {
    if (!form.title || !form.body) return;
    var d = new Date();
    var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    var dateStr = form.date || (months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear());
    var final = Object.assign({}, form, { date: dateStr, readTime: form.readTime || estimateReadTime(form.body) });
    var blocks = parseBody(form.body);
    var code = generateCode(final, blocks, nextId);
    setOutput(code);
    setNextId(nextId + 1);
  }

  function handleCopy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(function() { setCopied(false); }, 2000);
  }

  var parsedBlocks = form.body ? parseBody(form.body) : [];

  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif",
      background: "#0A0A0A",
      color: "#E8E4DF",
      minHeight: "100vh",
      padding: "40px"
    }}>
      <style>{"\n        .pub-input, .pub-textarea { width: 100%; background: #141414; border: 1px solid #2a2a2a; color: #E8E4DF; padding: 12px 16px; font-size: 15px; font-family: 'DM Sans', sans-serif; border-radius: 0; outline: none; transition: border-color 0.3s; }\n        .pub-input:focus, .pub-textarea:focus { border-color: #C8A97E; }\n        .pub-textarea { min-height: 400px; font-family: 'JetBrains Mono', monospace; font-size: 13px; line-height: 1.7; resize: vertical; }\n        .pub-label { display: block; font-family: 'JetBrains Mono', monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #6B6560; margin-bottom: 8px; }\n        .pub-row { margin-bottom: 24px; }\n        .pub-btn { font-family: 'JetBrains Mono', monospace; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; padding: 14px 32px; cursor: pointer; border: 1px solid; transition: all 0.3s; }\n        .pub-btn-primary { background: #C8A97E; color: #0A0A0A; border-color: #C8A97E; }\n        .pub-btn-primary:hover { background: transparent; color: #C8A97E; }\n        .pub-btn-secondary { background: transparent; color: #C8A97E; border-color: rgba(200,169,126,0.3); }\n        .pub-btn-secondary:hover { background: #C8A97E; color: #0A0A0A; border-color: #C8A97E; }\n        .pub-output { background: #111; border: 1px solid #2a2a2a; padding: 20px; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.6; color: #8A8580; white-space: pre-wrap; overflow-x: auto; max-height: 500px; overflow-y: auto; }\n        .pub-preview-title { font-family: 'Instrument Serif', serif; font-size: 32px; line-height: 1.2; margin-bottom: 16px; }\n        .pub-preview-intro { font-size: 17px; font-style: italic; color: #ADA8A3; line-height: 1.7; margin-bottom: 20px; }\n        .pub-preview-text { font-size: 16px; color: #8A8580; line-height: 1.75; margin-bottom: 16px; }\n        .pub-preview-heading { font-family: 'Instrument Serif', serif; font-size: 24px; color: #E8E4DF; margin: 32px 0 16px; }\n        .pub-preview-callout { border-left: 3px solid #C8A97E; padding: 16px 24px; background: rgba(200,169,126,0.05); margin: 24px 0; font-size: 15px; color: #ADA8A3; line-height: 1.7; }\n        .pub-preview-stats { display: flex; gap: 16px; margin: 24px 0; }\n        .pub-preview-stat { flex: 1; background: #141414; border: 1px solid #2a2a2a; padding: 20px; text-align: center; }\n        .pub-preview-stat-val { font-family: 'Instrument Serif', serif; font-size: 28px; color: #C8A97E; }\n        .pub-preview-stat-label { font-size: 12px; color: #6B6560; margin-top: 4px; }\n      "}</style>

      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 36, marginBottom: 8 }}>Article Publisher</div>
        <div style={{ fontSize: 14, color: "#6B6560", marginBottom: 48 }}>Write once. Paste into articles.js. Done.</div>

        <div className="pub-row">
          <label className="pub-label">Article Title</label>
          <input className="pub-input" value={form.title} onChange={function(e) { update("title", e.target.value); }} placeholder="Saudi Arabia's Two-Coast Advantage..." />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          <div className="pub-row">
            <label className="pub-label">Tag</label>
            <input className="pub-input" value={form.tag} onChange={function(e) { update("tag", e.target.value); }} placeholder="POLICY ANALYSIS" />
          </div>
          <div className="pub-row">
            <label className="pub-label">Slug (auto)</label>
            <input className="pub-input" value={form.slug} onChange={function(e) { update("slug", e.target.value); setForm(function(f) { return Object.assign({}, f, { slugManual: true }); }); }} placeholder="two-coast-advantage" />
          </div>
          <div className="pub-row">
            <label className="pub-label">Date (auto if empty)</label>
            <input className="pub-input" value={form.date} onChange={function(e) { update("date", e.target.value); }} placeholder="March 20, 2026" />
          </div>
        </div>

        <div className="pub-row">
          <label className="pub-label">Excerpt (1-2 sentences for preview cards)</label>
          <input className="pub-input" value={form.excerpt} onChange={function(e) { update("excerpt", e.target.value); }} placeholder="The Strait of Hormuz is closed..." />
        </div>

        <div className="pub-row">
          <label className="pub-label">Article Body <span style={{ color: "#3A3530", marginLeft: 8 }}>Use ## for headings, [IMAGE:], [STATS], [CALLOUT] for special blocks</span></label>
          <textarea className="pub-textarea" value={form.body} onChange={function(e) { update("body", e.target.value); }} placeholder={HELP_TEXT} />
        </div>

        {form.readTime && (
          <div style={{ fontSize: 13, color: "#6B6560", marginBottom: 24 }}>Estimated read time: {form.readTime}</div>
        )}

        <div style={{ display: "flex", gap: 16, marginBottom: 48 }}>
          <button className="pub-btn pub-btn-primary" onClick={handleGenerate}>Generate Code</button>
          <button className="pub-btn pub-btn-secondary" onClick={function() { setPreview(!preview); }}>{preview ? "Hide Preview" : "Show Preview"}</button>
        </div>

        {preview && parsedBlocks.length > 0 && (
          <div style={{ border: "1px solid #2a2a2a", padding: "40px", marginBottom: 48 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 2, color: "#C8A97E", textTransform: "uppercase", marginBottom: 16 }}>{form.tag || "TAG"}</div>
            <div className="pub-preview-title">{form.title || "Untitled"}</div>
            {parsedBlocks.map(function(b, i) {
              if (b.type === "intro") return <p key={i} className="pub-preview-intro">{b.text}</p>;
              if (b.type === "heading") return <h2 key={i} className="pub-preview-heading">{b.text}</h2>;
              if (b.type === "callout") return <div key={i} className="pub-preview-callout">{b.text}</div>;
              if (b.type === "image") return <div key={i} style={{ margin: "24px 0", padding: "40px", border: "1px dashed #2a2a2a", textAlign: "center", color: "#6B6560", fontSize: 13 }}>Image: {b.src}<br/>{b.caption}</div>;
              if (b.type === "stats") return (
                <div key={i} className="pub-preview-stats">
                  {b.items.map(function(s, j) {
                    return <div key={j} className="pub-preview-stat"><div className="pub-preview-stat-val">{s.value}</div><div className="pub-preview-stat-label">{s.label}</div></div>;
                  })}
                </div>
              );
              return <p key={i} className="pub-preview-text">{b.text}</p>;
            })}
          </div>
        )}

        {output && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <label className="pub-label" style={{ marginBottom: 0 }}>Generated Code — paste this into articles.js</label>
              <button className="pub-btn pub-btn-secondary" style={{ padding: "8px 20px", fontSize: 11 }} onClick={handleCopy}>{copied ? "Copied!" : "Copy"}</button>
            </div>
            <div className="pub-output">{output}</div>
            <div style={{ marginTop: 16, fontSize: 13, color: "#6B6560", lineHeight: 1.8 }}>
              <strong style={{ color: "#C8A97E" }}>Next steps:</strong><br/>
              1. Go to github.com/talalzd/talal-site → src/articles.js<br/>
              2. Click edit (pencil icon)<br/>
              3. Paste this code after the opening bracket: const articles = [<br/>
              4. Commit. Everything else is automatic.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
