# Actual executed checks

Independent concept by Ayo Ahmed. Synthetic fixtures only. This is engineering evidence, not a customer study or measured product impact.

## Command results — 11 October 2026

Executed using Node 22.23.3 and npm 10.9.9:

```text
npm ci
added 146 packages, and audited 147 packages
found 0 vulnerabilities

npm run typecheck
tsc --noEmit
Exit code: 0

npm run lint
eslint src tests
Exit code: 0

npm test
RUN v4.1.11
Test Files 1 passed (1)
Tests 67 passed (67)
Duration 153ms
Exit code: 0

npm run build
tsc --noEmit && vite build
vite v6.4.4 building for production...
4 modules transformed.
dist/index.html 0.71 kB
dist/assets/index-BAZ8N1yX.css 12.35 kB
dist/assets/index-Di-OyOuQ.js 22.45 kB
built in 85ms
Exit code: 0
```

The typecheck, lint, unit suite, build and audit were rerun successfully at 06:51 UTC after interface-copy and product-documentation integration. npm ci had previously succeeded at 06:44 UTC. npm printed an ESLint support-lifecycle warning during installation; the audit returned no known installed-package vulnerabilities. This is not a guarantee of security.

## Unit coverage

The suite covers all seven fixtures; updated landing versus scheduled timing; unknown/future/nonfinite anchors; exact one-hour boundary; fresh/stale boundary; missing/offline/future/nonfinite signals; sequential and backward progress; no mutation of fixture/source state; draft/save/edit/remove/cancel semantics; malformed reason/estimate; absent/refused/revoked permission; exact receipt-preview equality and recipient key set; one-time consumption; repeated revision refusal; browser and fixture offline refusal; stale revision refusal; privacy exclusions; current-stage preview during delay; ready stage not falsely claiming an earlier delay; local recovery without auto-send; final-stage-only completion; no precompletion or repeated feedback; helpful/unclear/skip; no postcompletion reopening.

## Rendered interface verification

The fresh production browser run executed **89 assertions, all passing**. Actual observed coverage: keyboard-only journey and policy summary; four stages and backward editing; saved private note edit/back/cancel; product-note navigation and cancelled reset preserving progress; exact preview/receipt with synthetic recipient, excluded reason/estimate, unchecked consent, refusal, one-time local send, duplicate refusal, prior-revision label and withdrawal without recall; real browser offline permission revocation and recovery without queued send; all seven fixtures; updated-landing waiting window; unknown without countdown; stale signal unconfirmed; honest over-hour copy; final-stage-only completion and all three feedback choices.

Responsive observations: no horizontal overflow at **320, 390 and 1366 CSS pixels**, across timeline, check-in and preview. Actual desktop/mobile/narrow rendered screenshots inspected. Reduced-motion media and computed styles verified. Both post-review copy fixes passed: notes reset disclosure and recovered-offline fixture labelling. All **14 product-notebook links** opened as nonempty Markdown in the running browser.

Accessibility: **six axe scans, zero violations**. Five scans marked the same decorative aria-hidden circle as incomplete (non-text character contrast). It was manually inspected: decorative, hidden from assistive technology, paired with visible SIMULATION text, same high-contrast computed colour. Measured text contrast minimum **5.25:1**; 3px focus outline minimum **6.48:1**. This scoped check does not establish universal accessibility or native screen-reader certification.

No page errors, external runtime requests or POSTs were observed during the application interactions. Normal static asset/document requests still occurred; absence in this traced run is not a guarantee about hosting access logs.

An earlier 61-assertion run identified two copy issues, which were corrected before the final 89-assertion run. Initial harness races/matcher ambiguity were repaired and rerun; they are not reported as product bugs. Engineering assertions and synthetic UI checks are not customer findings. No independent test run by Ayo is claimed.

## Publication and video

The owner-created GitHub repository is reachable through existing git access. No Cloudflare deployment URL is verified. The voiced vertical live walkthrough is rendered and inspected: **89.000 seconds, 1080×1920 portrait, 30 fps, H.264/AAC**. See the final media verification below and the recorded sections in [walkthrough](walkthrough.md). Repository publication and Cloudflare deployment are separate checks; no deployed-site claim is made.

## Reproducing the browser checks (optional development tooling)

The harness in `tests/browser_check.py` preserves the executed assertions with portable paths and a nonzero exit on failure. It is separate from the 67-case `npm test` suite. It requires Python Playwright and a local axe-core 4.10.3 script; those tools are not application dependencies or runtime requests.

1. Build and start `npm run preview -- --port 4173` in a separate terminal.
2. Install Python Playwright, then `python -m playwright install chromium` (or set `CHROME_EXECUTABLE` to existing compatible Chrome).
3. Put the axe-core 4.10.3 `axe.min.js` release file in `browser-evidence/`, then run `python tests/browser_check.py`.
4. Optional `APP_URL` changes the local test URL; `EVIDENCE_DIR` changes output directory. Defaults: `http://localhost:4173`, `browser-evidence/`.

It confirms reset dialogs and changes only synthetic state. Never point it at a real booking interface. Markdown-link assertions verify nonempty content, not HTML document rendering. No private browser profile or real booking data is shipped.

## Final media verification

Final media inspected: 89.000 seconds, 1080×1920, 30 fps, H.264/AAC; complete voiced ending, actual live controls, all named fixtures, no slides or arbitrary zoom. Narration clearly credits Ayo Ahmed, unchecked consent, no real message, no fare or availability guarantee. Public metadata credits Ayo only; attribution/path audit passed. Decoded visuals are unchanged after an audio-only clarity refinement.

A final full check rerun at 07:10 UTC also passed: typecheck, lint, 67 unit cases (185ms), production build (106ms), and dependency audit (zero vulnerabilities). Browser checks remain from the 89-assertion production run; later changes were documentation and the static MP4 only. The application JS/CSS hashes are unchanged.

## GitHub Pages project-path verification

Executed a fresh relative-base build and local static HTTP check at `/wheely-arrival-companion/` with no SPA fallback: **23 path/content checks passed**, covering index, both compiled assets, wordmark, all **15** Markdown documents, relative document/media references, the byte-identical 89-second MP4 and empty `.nojekyll`. All local responses were 200; the artifact root has no nested `dist` directory. These are static project-path checks, not a new browser interaction run or proof of an enabled GitHub Pages site.

Typecheck, lint, all 67 unit tests, build and dependency audit passed again during fallback preparation. GitHub Pages activation is reserved for the owner UI, using `gh-pages` / root and retaining `build/arrival-companion` as source default. Cloudflare upload failure was reported by the owner, not reproduced locally; no Cloudflare deployment is claimed.
