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
Edit `games.js` to add or update games. Hosted games use `type: "hosted"` with the publisher public game URL; external destinations use `type: "external"` and open in a new tab. Game cards use live page screenshots as thumbnails. Only embed games when their publisher permits embedding. Many game portals block iframe embedding; use an external link for those.

## Notes
- Favorites are stored in each visitor's browser using localStorage.
- The Google Fonts import is optional; the site falls back to system fonts if unavailable.
- The suggestion link opens a new GitHub issue in the GavGames repository.


## Game library expansion

The catalog currently includes **19 hosted third-party games**, plus links to the CrazyGames and Poki game portals. The six original code-based mini-games have been removed.

The third-party games are embedded from their upstream public game pages rather than copied into this repository. This keeps the GavGames repo lightweight and preserves the upstream source of each game, but means a game can stop loading if its host changes or blocks embedding. Each card now uses a screenshot thumbnail of its game page; the player includes a direct-open fallback and displays source and license information.

See [THIRD_PARTY_GAMES.md](THIRD_PARTY_GAMES.md) for source and license details. Before copying any third-party game files into this repository, review the exact license and notices for its code, images, audio, and fonts.


### Catalog quality checks

The third-party catalog includes 19 upstream titles. During a source-integrity review, duplicate/mislabelled pages in the original candidate list were removed and replaced with distinct game pages. The current 15-game selection from `sausi-7/games` has unique index-file contents and its referenced relative files were checked against the upstream repository tree. This does not replace manual in-browser gameplay testing or mobile testing.
