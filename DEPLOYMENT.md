# Deployment & Environments

This project uses three environments. Code always flows in one direction:

```
Local (your Mac)  ->  Staging (verify)  ->  Production (live)
```

Never edit production directly. Build locally, verify on staging, then promote.

## Environments

| Environment | Runs where                     | Branch    | Audience        | Deploys when                 |
| ----------- | ------------------------------ | --------- | --------------- | ---------------------------- |
| Local       | Your machine (`npm run dev`)   | any       | just you        | you save a file (hot reload) |
| Staging     | Host, private/preview URL      | `staging` | just you        | you push to `staging`        |
| Production  | Host, public URL               | `main`    | everyone (live) | you merge into `main`        |

## Everyday workflow

1. **Develop locally**
   ```bash
   npm run dev        # http://localhost:5173 — iterate here
   ```
2. **Push to staging to verify in a real environment**
   ```bash
   git add -A
   git commit -m "describe the change"
   git push origin staging     # host auto-builds & deploys the staging URL
   ```
   Open the staging URL and confirm the change works for real (real build, real
   hosting — test on your phone too).
3. **Promote to production when satisfied**
   ```bash
   # Option A (recommended) — open a PR from `staging` into `main` on GitHub,
   # review the diff, then click "Merge". Production deploys automatically.

   # Option B — command line:
   git checkout main
   git merge staging
   git push origin main        # host auto-deploys production
   git checkout staging        # go back to working on staging
   ```

Keep `staging` and `main` in sync: after promoting, both point at the same code.
Start your next change from `staging`.

## One-time host setup (do this when you're ready to go live)

Pick one host. Both have a free tier, both auto-detect Vite, both give every
branch its own deploy. No config files needed in this repo.

### Vercel
1. Sign in to vercel.com with GitHub, import the `perceptence/veriqo` repo.
2. Framework preset: **Vite**. Build command `npm run build`, output dir `dist`.
3. Vercel makes the **Production** deployment track `main` automatically.
4. Under Settings -> Git, ensure the `staging` branch is enabled for deploys —
   it gets its own stable preview URL you use to verify before promoting.

### Netlify
1. Sign in to netlify.com with GitHub, "Add new site" -> import `veriqo`.
2. Build command `npm run build`, publish directory `dist`.
3. Set the **production branch** to `main` (Site config -> Build & deploy).
4. Enable **branch deploys** for `staging` to get a stable staging URL.

## Environment variables / secrets

- Never commit secrets (API keys, tokens) to the repo. Set them per environment
  in the host's dashboard (Vercel/Netlify -> Environment Variables), scoped to
  Production vs Staging separately.
- Note: Pulse's "Ask Pulse" currently calls the Anthropic API directly from the
  browser, which won't work in production (the key would be exposed and CORS
  blocks it). Before shipping that feature live, route it through a small
  backend/serverless proxy that holds the key server-side.

## Rolling back a bad production deploy

- Easiest: in the host dashboard, "Redeploy" the previous successful build
  (instant, no Git needed).
- Or in Git: `git revert -m 1 <merge-commit>` on `main` and push — this undoes
  the merge with a new commit, and the host redeploys the previous state.
