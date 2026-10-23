# NBA LIFE SIM — Free Public Beta

Static website. No build command or server-side database is required.

## Fastest free public launch (Vercel + GitHub)

1. Sign in or create a GitHub account at https://github.com/.
2. Create a new repository named `nba-life-sim`. For a public game, choose **Public**. You can leave README / .gitignore / license unchecked because these files are already included.
3. Open the new repository, choose **Add file → Upload files**, and upload the contents of this folder (`index.html`, `styles.css`, `app.js`, `favicon.svg`, `vercel.json`, `README.md`). Make sure `index.html` is at the repository root, not inside another folder.
4. Open https://vercel.com/ and sign in with GitHub.
5. Choose **Add New… → Project**, import `nba-life-sim`, and deploy. For this static site, leave Framework Preset as **Other** and leave Build Command and Output Directory blank unless Vercel detects settings automatically.
6. When deployment completes, Vercel gives you a public `*.vercel.app` URL. Share it with anyone.

## Notes
- Hosting can start on Vercel's free Hobby plan for a personal/non-commercial project, subject to its current plan terms and usage limits.
- No custom domain is required. Do not buy a domain for the first launch.
- Game saves are stored in the player's browser on that device; they are not cloud saves and won't automatically follow the player to another device.
- This is a beta prototype. Some NBA rules and contract mechanics are simplified; the game does not claim to reproduce live rosters or current real-world transactions.
- To update the site later, upload/commit the changed files to GitHub; Vercel redeploys automatically when connected to the repository.
