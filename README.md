# Wheely Arrival Companion

**Independent concept by Ayo Ahmed · Product Manager, UX audition. Not affiliated with, commissioned by or endorsed by Wheely. Synthetic data only.**

A mobile-first web concept for the minutes between landing and meeting a chauffeur: a rider-controlled arrival timeline, optional private delay check-in and a minimal booker update with explicit, one-time permission.

Flight tracking, chauffeur maps, private chat and guest journey updates already exist in Wheely's public descriptions. This prototype does not claim to fix their absence or establish whether a similar pattern already exists inside the app. No native mobile tenure, company employment, internal access or measured product lift is claimed.

## Live concept

[Open the live demo](https://cashpointsoulja.github.io/wheely-arrival-companion/) · [Watch the 89-second voiced walkthrough](https://cashpointsoulja.github.io/wheely-arrival-companion/media/arrival-walkthrough.mp4).

11 October 2026: independent public verification reported HTTP 200, the matching 89-second video/hash, and **89 browser assertions passed**. Direct HTTP/media checks also confirmed publication. These are engineering checks, not customer research or measured product impact; the independent browser result is recorded as reported evidence, not attributed to Ayo. See [actual checks and provenance](docs/actual-tests.md).

## What works

- Four passenger-reported stages: landed, passport control, baggage reclaim, meet your chauffeur. Sequential forward progress and backward edits.
- Optional check-in: preset reason and rough estimate. Private to this page; no pickup changes or waiting extensions.
- Exact booker-update preview to synthetic Morgan; unchecked permission; one simulated update per progress revision; no ongoing permission.
- Early, late, unknown, offline, stale-chauffeur and over-one-hour fixtures, plus on-time arrival.
- Network recovery preserves in-memory progress without queuing or sending anything; a new review and permission are required.
- Completion and optional post-journey feedback, including skip. Feedback is not submitted or treated as impact evidence.
- Back, edit and cancel preserve committed progress, notes and history. Scenario/reset changes explicitly confirm loss of existing progress.

## Boundaries

No APIs, real bookings, payments, fares, emails, texts, applications, account creation, analytics or customer/employer data. No geolocation. No storage or service worker. All state is in memory; reload resets it. A deployed host still handles normal asset requests; see [privacy](docs/privacy.md). Real browser offline disables simulated updates too. The demo does not claim first-load offline availability.

Wheely's [official airport policy](https://wheely.com/en/essentials/perfect-airport-transfers) states the complimentary hour begins at the updated landing time. The prototype's waiting window uses fixed synthetic times and does not run a live clock. Unknown landing means no countdown. Beyond one hour it asks the rider to confirm arrangements in the real app without inventing a fare or continued availability.

## Run locally

Node 22 or newer:

```sh
npm ci
npm run dev
```

Quality checks:

```sh
npm run typecheck
npm run lint
npm test
npm run build
```

`.npmrc` uses legacy peer resolution to avoid a package-manager optional-peer dependency resolution crash; all direct tools are pinned and installed dependencies are audited. Built assets are static, with no runtime package dependencies. Product docs are copied into the build by the Vite configuration.

## Product notebook

[Recorded sections and narration](docs/walkthrough.md) · [Repository video file](public/media/arrival-walkthrough.mp4).

[PRD](docs/prd.md) · [JTBD](docs/jtbd.md) · [Five Whys](docs/five-whys.md) · [ELI5](docs/eli5.md) · [My decisions](docs/decisions.md) · [Event schema](docs/events.md) · [Privacy](docs/privacy.md) · [Metrics](docs/metrics.md) · [Viability](docs/viability.md) · [v2](docs/v2.md) · [Actual tests](docs/actual-tests.md) · [Sources](docs/sources.md) · [Visual research](docs/brand.md) · [Deployment](docs/deployment.md).

All numerical examples in product notes are synthetic or proposed research targets. None is a customer result, quote, validated lift or experiment winner.

## Publication

Public repository: [CashpointSoulja/wheely-arrival-companion](https://github.com/CashpointSoulja/wheely-arrival-companion). GitHub Pages is live from `gh-pages` / root; `build/arrival-companion` remains the default source branch. Vite base is `./`. GitHub Pages does not apply Cloudflare's `_headers` file; custom Cloudflare headers must not be claimed for this host. No Cloudflare deployment is verified. See [deployment](docs/deployment.md).

## Ownership

Concept, implementation and product decisions: Ayo Ahmed. Wheely owns its wordmark, used solely to identify the subject of this independent concept; no permission, endorsement or affiliation is implied. No proprietary fonts or product imagery are distributed. Dependencies retain their respective licences.
