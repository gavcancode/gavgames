# GavGames

A colorful, responsive browser-game hub built with plain HTML, CSS, and JavaScript.

## Run it on your Mac
1. Unzip `gavgames.zip`.
2. Open the `gavgames` folder in Visual Studio Code.
3. Open `index.html` in a browser, or use the VS Code Live Server extension.

## Publish for free with Cloudflare Pages
1. Create a GitHub account at https://github.com/.
2. Create a new **public** repository named `gavgames`.
3. Upload the contents of this folder (index.html, style.css, games.js, app.js, README.md) to the repository root.
4. Sign in at https://dash.cloudflare.com/ and open **Workers & Pages**.
5. Choose **Create application** → **Pages** → **Connect to Git**.
6. Select your `gavgames` GitHub repository.
7. For a plain HTML site, leave the build command empty and set the build output directory to `/` (or `.` if the dashboard requires a relative directory).
8. Deploy. Cloudflare will give you a `*.pages.dev` address.

Every push to your connected GitHub branch can trigger a new deployment.

## Add a game
Edit `games.js`. External games use `type: "external"` and a normal `https://` URL. Built-in games need a matching game implementation in `app.js`.
Only embed games when their publisher permits embedding. Many game portals block iframe embedding; use an external link for those.

## Notes
- Favorites are stored in each visitor's browser using localStorage.
- The mini-games are original simple demos and run locally in the browser.
- The Google Fonts import is optional; the site falls back to system fonts if unavailable.
- Change `hello@example.com` in `index.html` to your preferred contact address, or remove the suggestion link.
