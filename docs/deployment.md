# Free static deployment

Independent concept by Ayo Ahmed. No paid APIs, bookings or messages.

## Build

Node 22; `npm ci`; `npm run build`; output directory `dist`. The resulting site is plain static HTML, CSS, JavaScript, official identifying wordmark and product notes. There are no Functions, bindings, databases, outbound calls or billing-linked services.

## Cloudflare Pages (Git-backed)

In an existing Cloudflare account, create a Pages application and import the public `CashpointSoulja/wheely-arrival-companion` repository. Set framework preset None, build command `npm run build`, output `dist`, Node version 22, production branch to the branch containing the reviewed build. Use the free plan only. If the interface requests an upgrade, payment or account creation, stop.

Do not invent a published URL. After deployment, request the real assigned URL and check the homepage, JS/CSS, logo, and `/docs/prd.md` resolve. Confirm its bundle filenames match the reviewed build. Verify CSP headers. No paid domain is needed.

## Cloudflare Pages (Direct Upload, no tokens)

In the existing dashboard: Workers & Pages → Create application → Pages → Direct Upload. Use project name `wheely-arrival-companion`. Upload the prebuilt ZIP with `index.html` at its root. Stay on the free plan. The build ZIP includes `assets`, `brand`, `docs`, and `_headers`.

Direct Upload projects and Git integration have different update workflows; choose deliberately rather than implying an upload will automatically redeploy from Git. For Workers static assets, `wrangler.jsonc` is supplied as an alternate configuration, but no CLI deployment is necessary for Direct Upload.

## Repository fallback

If connected access cannot create a new user-owned repository, create an empty public repository called `wheely-arrival-companion` under CashpointSoulja with no auto-generated README/licence/gitignore. Description: “Independent arrival experience concept by Ayo Ahmed. Synthetic data only; not affiliated with Wheely.” Source ZIP can also be uploaded via the GitHub website. Local source is developed on `build/arrival-companion`; no existing main branch is overwritten.

## Cost and privacy checks

Use Pages static hosting only. No domain purchase, add-on, backend, worker function, analytics, account creation, flight API, notifications or storage. Static asset requests still expose ordinary network metadata to the host; no “zero data processing” claim is made.
