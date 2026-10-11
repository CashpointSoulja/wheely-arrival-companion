# Product Decisions

**Wheely Arrival Companion** — written in first person by Ayo Ahmed. These are product calls and their reasoning, not personal anecdotes.

## 1. I scoped this to post-landing only

Wheely publicly describes flight tracking, meet-and-greet and a complimentary hour from updated landing. I have not inspected the private app or established an uncovered gap. I scoped my hypothesis to the passenger's own post-landing progress: narrower scope, clearer question, no claim that the rest of the journey is solved for every rider.

## 2. I made stages self-reported, not inferred

The prototype has no real feeds, so it shouldn't pretend to know where the passenger is. A tap is honest: the passenger declares their stage, and the timeline reflects what was actually declared — nothing more.

## 3. I made the booker update opt-in every single time

Consent is one-time per send, the checkbox starts unchecked, and the exact message text is previewed before anything happens. Convenience never outranks consent. If someone declines, the flow continues identically — no nagging, no dark pattern, no penalty.

## 4. I made the update generic on purpose

The message carries no delay reason and no time estimate. Whoever booked the car needs reassurance, not the passenger's private notes. The delay check-in stays private; the update stays minimal. Different jobs, different data.

## 5. I capped estimates at rough 10/20/30-minute buckets

False precision is worse than honest vagueness. Nobody knows if a passport queue takes 12 or 18 minutes; "+20ish" is the truth at the right granularity, and optional at that.

## 6. I kept everything in memory — no storage, no analytics, no APIs

The private note exists in memory while the page is open; a reload clears it, visibly explained on every view. Static asset hosting still has network metadata, so I do not claim zero privacy or security liability. No booking or messaging system is connected; there is no route for a real booking or update.

## 7. I did not frame Wheely's documented features as gaps

Flight tracking, the name board, the complimentary hour, chauffeur map and chat, and book-for-others updates all exist — the official materials say so. My hypothesis is complementary: passenger self-orientation plus opt-in minimal updates. Claiming otherwise would be dishonest positioning.

## 8. I designed for degraded states, not just the happy path

Airport connectivity may be unreliable; that is a hypothesis, not a measured failure rate. Both the offline fixture and real browser-offline detection disable updates, preserve progress and revoke permission. Recovery never auto-sends. Signals older than five minutes are labelled stale rather than trusted; that threshold is my demo rule. Unknown landing has no countdown. Past the included hour I show no invented fee or availability.

## 9. I made post-journey feedback optional with a real Skip

Helpful / Unclear / Skip — one tap, dismissible, never required to finish. Asking is fine; requiring isn't. "Unclear" is as valuable an answer as "Helpful".

## 10. I separate engineering tests from customer evidence

Actual engineering commands and observed UI checks are recorded in the test ledger. They verify mechanics, not usefulness. No customer usability study, completion lift or product outcome exists. The research plan uses denominators, guardrails and a no-decision policy; invented findings would make the concept look stronger and be worthless.
