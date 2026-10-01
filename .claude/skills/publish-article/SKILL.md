---
name: publish-article
description: Turn Talal's article text, a draft file, or rough notes into a published article on talalalzayed.com, with a preview link first and a LinkedIn post at the end.
---

# Publish an article

Talal gives you one of three things:
- finished text, pasted into the chat
- a file (Word, PDF, Markdown, plain text), attached or as a path
- rough notes, with a request to draft

## 1. Get the text right first

- **Finished text or a file:** keep his words. Fix typos only. Replace every em dash with a period or a comma. Do not rewrite, soften or "improve" his arguments.
- **Notes:** write a draft in his voice (see Writing rules) and show it to him in the chat. Wait for his approval or edits before you touch any code.
- Never invent facts, numbers, quotes, dates or sources. If a claim looks wrong or out of date, list it for him at the end. Do not change it yourself.

## 2. Add it to the site

1. `git checkout main && git pull`, then create a branch `article/<slug>`.
2. Open `src/articles.js` and follow the schema of the existing entries exactly. Add the new entry at the top of the array.
   - `id`: highest existing id plus one.
   - `slug`: short, lowercase, hyphens only, from the title.
   - `tag`: match the style of existing tags. Suggest one that fits; Talal can change it.
   - `title`: his title.
   - `excerpt`: one or two sentences in his voice, taken from the piece where possible.
   - `date`: today, as "Month D, YYYY", unless he gives one.
   - `readTime`: word count divided by 230, rounded up, as "N min".
   - `content`: first paragraph is `intro`, section titles are `heading`, paragraphs are `text`. Use `image`, `stats` or `callout` blocks only where he marked something as a figure, a set of numbers, or a highlighted box.
   - Images: copy the file into `public/` with a short lowercase name and use `/name.jpg` as `src`, with a plain `alt` and his caption.
3. Change no other article and no other file, apart from what the build regenerates.

## 3. Check it

1. `npm run build` must pass.
2. Start the dev server and open `/articles/<slug>` in the browser pane. Check the title, intro, headings, any images, and the end of the piece.
3. Commit as `Add article: <title>` and push the branch. Get the Vercel preview link.

## 4. Report back, briefly

- The preview link.
- Title, tag, excerpt and read time, so he can change any of them.
- Anything you flagged in step 1.
- A LinkedIn post to promote it: English, under 1,300 characters, his voice, one clear point from the piece, ending with `https://talalalzayed.com/articles/<slug>`. Offer an Arabic version; write it only if he says yes.

## 5. Publish only when he says so

When Talal says to publish: merge the branch into `main`, push, wait about a minute, then open the live URL and confirm it loads. Tell him it is live.

## Writing rules

- Short, direct sentences. Authoritative but human.
- No em dashes. No AI-sounding phrasing ("delve", "in today's landscape", "it's worth noting", "navigate the complexities").
- US spelling, as in his existing pieces.
- He writes as a practitioner who has worked inside Saudi government and in industry. First person is fine.
