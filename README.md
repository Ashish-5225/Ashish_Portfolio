# 🚀 Ashish Dwivedi - Animated Neon Portfolio Website

A modern, high-performance, responsive animated portfolio website with custom neon themes, Web Audio sound effects, canvas particles, interactive project modals, and stats counters.

---

## 📂 File Structure Overview

```text
Ashish_portfolio/
├── index.html              # Main HTML structure & meta tags
├── styles.css              # Cyberpunk CSS styles, themes, glassmorphism & responsive queries
├── app.js                  # Particle canvas, typing effect, audio synthesizer & modal logic
├── vercel.json             # Vercel deployment config
├── netlify.toml            # Netlify deployment config
└── assets/
    └── images/
        ├── avatar.png               # Cyberpunk Developer Avatar
        ├── project-ai.png           # AI Interview Copilot Screenshot
        ├── project-microservices.png # Real-time Finance Microservices Screenshot
        └── project-fusion.png       # Fusion Feast Restaurant Web App Screenshot
```

---

## ⚡ Deployment Options

### Option 1: Deploy on GitHub Pages (FREE)
1. Initialize Git & commit files:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Ashish Portfolio"
   ```
2. Create a public repository named `Ashish_portfolio` or `ashishdwivedi.github.io` on GitHub.
3. Push to GitHub:
   ```bash
   git remote add origin https://github.com/<YOUR_USERNAME>/Ashish_portfolio.git
   git branch -M main
   git push -u origin main
   ```
4. Go to repository **Settings** -> **Pages** -> Select `main` branch -> Click **Save**. Your site will be live!

---

### Option 2: Deploy on Netlify (1-Click Drag & Drop)
1. Go to [Netlify Drop](https://app.netlify.com/drop).
2. Drag and drop the `Ashish_portfolio` folder into the upload box.
3. Netlify will instantly generate a live URL for your portfolio!

---

### Option 3: Deploy on Vercel
1. Install Vercel CLI (or connect GitHub repo to Vercel Dashboard):
   ```bash
   npx vercel
   ```
2. Follow the on-screen prompts to deploy in seconds.

---

### Option 4: Local Preview
Run any local static HTTP server:
```bash
python3 -m http.server 8080
```
Then visit `http://localhost:8080` in your web browser.
