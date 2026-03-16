# Talal Al Zayed — Personal Site

## Deploy on Replit (Your Preferred Method)

1. Go to **replit.com** → Click **"Create Repl"**
2. Choose **"Vite (React)"** template
3. Delete the default files in `src/`
4. Upload these files matching the folder structure:
   - `src/main.jsx`
   - `src/App.jsx`
   - `index.html` (replace the existing one)
   - `public/favicon.svg`
   - `package.json` (replace the existing one)
   - `vite.config.js` (replace the existing one)
5. Click **Run** — your site is live with a `.replit.app` URL
6. To add a custom domain: Replit sidebar → "Deployments" → "Custom Domain"

## Deploy on Vercel (Recommended for Custom Domain)

1. Push this folder to a new GitHub repo
2. Go to **vercel.com** → **"Add New Project"**
3. Import the GitHub repo
4. Framework preset will auto-detect as **Vite**
5. Click **Deploy** — live in ~60 seconds
6. Go to **Settings → Domains** → Add your custom domain

## Custom Domain Setup

Recommended domain: `talalalzayed.com` or `talalzayed.com`

Purchase from Namecheap or Google Domains, then point DNS:
- If Vercel: Add CNAME record pointing to `cname.vercel-dns.com`
- If Replit: Follow their custom domain DNS instructions

## Editing Content

All content lives in `src/App.jsx`:
- **perspectives** array — your thought leadership pieces
- **career** array — your career timeline
- Hero headline, subtext, and stats — top of the component
- Contact links — in the Connect section near the bottom
