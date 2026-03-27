# FAST Dashboard

Personal student planner for FAST-NUCES Karachi — Spring 2026.

## Features
- Smart Timetable (real schedule extracted from FAST Excel)
- Daily Planner
- Assignment Planner (auto-chunked)
- Exam Planner (auto task generation)
- Spaced Repetition Revision Log
- Project Tracker
- Handwritten Notes (PDF upload)
- Resource Hub
- Progress Dashboard

## Deploy to GitHub Pages (step by step)

### Step 1 — Create repo
1. Go to https://github.com/new
2. Name it exactly: `fast-dashboard`
3. Set to **Public**
4. Click **Create repository**

### Step 2 — Push code
```bash
# On your PC, open terminal/cmd in this folder
git init
git add .
git commit -m "initial"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/fast-dashboard.git
git push -u origin main
```
Replace `YOUR_USERNAME` with your actual GitHub username.

### Step 3 — Enable GitHub Pages
1. Go to your repo → **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. Save

The GitHub Action will automatically build and deploy.
Your app will be live at: `https://YOUR_USERNAME.github.io/fast-dashboard`

### Step 4 — Add to phone home screen
**Android (Chrome):**
1. Open Chrome → go to your URL
2. Tap the 3-dot menu (⋮) → "Add to Home screen"
3. Tap "Add"
4. It appears as a full-screen app icon!

**iPhone (Safari):**
1. Open Safari → go to your URL
2. Tap the Share button → "Add to Home Screen"
3. Tap "Add"

### Step 5 — Update timetable if teachers change it
Edit `src/App.jsx` → find `REAL_TIMETABLE` array at the top → update entries → push to GitHub → auto-deploys in ~2 minutes.

## Local development
```bash
npm install
npm run dev
```
