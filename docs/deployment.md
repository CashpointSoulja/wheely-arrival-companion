# Free static deployment

Independent concept by Ayo Ahmed. No paid APIs, bookings or messages.

## Live publication — 11 October 2026

- Demo: https://cashpointsoulja.github.io/wheely-arrival-companion/
- Voiced walkthrough: https://cashpointsoulja.github.io/wheely-arrival-companion/media/arrival-walkthrough.mp4
- GitHub Pages is activated from `gh-pages` / root. `build/arrival-companion` remains the default source branch.
- Independent public verification reported HTTP 200, the matching 89-second video/hash, and 89 passing browser assertions. Separately executed direct HTTP/media checks confirmed the demo, deployed notes and video return 200, and the public MP4 is byte-identical to the reviewed artifact. The browser result is reported evidence, not a claimed rerun or Ayo-performed check. See [actual checks and provenance](actual-tests.md).
- Cloudflare normal upload failure was externally reported; no Cloudflare deployment is verified. The following Cloudflare instructions remain alternatives, not the live hosting route.

## Build

Node 22; `npm ci`; `npm run build`; output directory `dist`. The resulting site is plain static HTML, CSS, JavaScript, official identifying wordmark and product notes. There are no Functions, bindings, databases, outbound calls or billing-linked services.

## Cloudflare Pages (Git-backed)

In an existing Cloudflare account, create a Pages application and import the public `CashpointSoulja/wheely-arrival-companion` repository. Set framework preset None, build command `npm run build`, output `dist`, Node version 22, production branch to the branch containing the reviewed build. Use the free plan only. If the interface requests an upgrade, payment or account creation, stop.

Do not invent a published URL. After deployment, request the real assigned URL and check the homepage, JS/CSS, logo, and `/docs/prd.md` resolve. Confirm its bundle filenames match the reviewed build. Verify CSP headers. No paid domain is needed.

## Cloudflare Pages (Direct Upload, no tokens)

In the existing dashboard: Workers & Pages → Create application → Pages → Direct Upload. Use project name `wheely-arrival-companion`. Upload the prebuilt ZIP with `index.html` at its root. Stay on the free plan. The build ZIP includes `assets`, `brand`, `docs`, `media`, and `_headers`.

Direct Upload projects and Git integration have different update workflows; choose deliberately rather than implying an upload will automatically redeploy from Git. For Workers static assets, `wrangler.jsonc` is supplied as an alternate configuration, but no CLI deployment is necessary for Direct Upload.

## GitHub Pages fallback (activated)

The Vite base is `./`, so scripts, styles, the wordmark, product notes and media resolve below the project path `/wheely-arrival-companion/`. The separate `gh-pages` branch contains the compiled `dist` contents at its root plus an empty `.nojekyll`; it does not contain a nested `dist` directory. Keep `build/arrival-companion` as the default source branch.

Activation settings: repository Settings → Pages → Build and deployment → Deploy from a branch → `gh-pages` and `/ (root)`. No API credentials, purchases or custom domain are needed. The live URL is `https://cashpointsoulja.github.io/wheely-arrival-companion/`; verify its assets, `/wheely-arrival-companion/docs/prd.md` and `/wheely-arrival-companion/media/arrival-walkthrough.mp4` after future updates. A pushed branch alone is not proof of publication; the HTTP/media checks above establish the current live state.

GitHub Pages does not apply Cloudflare's `_headers` file. Do not claim those custom response headers are enforced on this host. The application still has no analytics, storage, API calls or real messages; normal host access metadata remains subject to GitHub's handling. Product notes are nonempty Markdown files, not generated HTML pages.

## Repository upload fallback

If connected access cannot create a new user-owned repository, create an empty public repository called `wheely-arrival-companion` under CashpointSoulja with no auto-generated README/licence/gitignore. Description: “Independent arrival experience concept by Ayo Ahmed. Synthetic data only; not affiliated with Wheely.” Source ZIP can also be uploaded via the GitHub website. Local source is developed on `build/arrival-companion`; no existing main branch is overwritten.

## Cost and privacy checks

Use Pages static hosting only. No domain purchase, add-on, backend, worker function, analytics, account creation, flight API, notifications or storage. Static asset requests still expose ordinary network metadata to the host; no “zero data processing” claim is made.

The source ZIP includes a portable `history.bundle` containing only Ayo-authored commits on `build/arrival-companion`. To preserve that history, extract the ZIP, then clone the bundle into a new folder with `git clone history.bundle arrival-source`. Set the remote to the new empty repository before pushing the build branch; do not overwrite an existing main branch. The regular source files can also be uploaded directly without Git history.
