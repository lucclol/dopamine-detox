# 24-Hour Stimulus Fast Challenge

A simple Next.js app for a college persuasive speech project. Lets classmates take a 24-hour digital stimulus fast and submit their before/after focus and mood ratings. Aggregate results show on a live dashboard.

## What's included

- **Landing page** with the challenge guide and three rules
- **Check-in form** with rating scales for focus and mood (before and after)
- **Results page** with live aggregate stats and reflections
- **API routes** for saving and reading submissions
- **Vercel Postgres** for storage (free tier)

## Deploy to Vercel

### Step 1: Push to GitHub

1. Create a new repo on GitHub (call it whatever, e.g. `dopamine-challenge`)
2. From this folder, run:
   ```bash
   git init
   git add .
   git commit -m "initial"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New Project**, select your repo, click **Deploy**
3. Wait about 60 seconds. You'll get a URL like `your-project.vercel.app`

### Step 3: Add a database

1. In your Vercel project dashboard, go to the **Storage** tab
2. Click **Create Database** → **Postgres** → **Continue**
3. Pick a name and region, click **Create**
4. Click **Connect** to link it to your project
5. Vercel automatically adds the connection environment variables and redeploys

### Step 4: Initialize the database table

After the redeploy finishes, visit this URL **once** in your browser:

```
https://your-project.vercel.app/api/init
```

You should see `{"ok":true,"message":"Table ready"}`. That's it.

### Step 5: Generate your QR code

1. Go to [qr-code-generator.com](https://www.qr-code-generator.com/) (or any free QR generator)
2. Paste your Vercel URL
3. Download the PNG, print it big, and you're set for the speech

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). For local DB testing, you'll need to set up a `.env.local` with Postgres credentials (or just test against your deployed Vercel DB by copying the env vars from the Storage tab).

## Costs

Everything used here is free for this scale:
- Vercel Hobby plan: free
- Vercel Postgres free tier: 256 MB storage, plenty for a class
- GitHub: free
