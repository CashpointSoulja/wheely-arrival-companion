# Viability

**Wheely Arrival Companion** — independent concept study by Ayo Ahmed.

## What this is

A self-contained, in-memory concept prototype exploring one hypothesis: that post-landing passengers benefit from a self-reported arrival timeline and a strictly opt-in, minimal update to their booker. It is an independent product exercise, not a Wheely feature, proposal, or affiliation.

## Honest strengths

- **Narrow, testable hypothesis.** Post-landing clarity is a bounded question the prototype can actually probe.
- **Consent is structural, not cosmetic.** The send path cannot execute without explicit one-time consent plus preview — compliance is enforced by construction, not policy.
- **Narrow data surface.** In-memory synthetic state, no APIs/storage/telemetry and disabled device permissions minimise exposure. Static host metadata and browser memory remain real security/privacy responsibilities; this is not zero liability.
- **Respects the incumbent.** Documented capabilities (flight tracking, name board, complimentary hour, chauffeur map/chat, book-for-others updates) are treated as the baseline, not as gaps to "fix".

## Honest limits and risks

- **The incremental value is unproven and may be small.** Book-for-others already gives recipients a tracking link and courtesy updates; the actual app may already cover this job well enough that the companion adds little.
- **Self-reported stages require passenger effort.** The same tired traveller this serves must still choose to tap.
- **Simulation cannot validate demand.** It can verify that flows and invariants work; it cannot show anyone wants them.
- **A generic update may be too thin.** Omitting reason and time protects privacy but might feel uninformative; the feedback prompt exists partly to learn this.
- **No real integration path has been designed.** Any production version would need answers on transport, recipients, and data handling that are deliberately out of scope here.

## What would make it viable

1. Mechanism verification: actual checks cover browser/fixture offline, recovery, stale signal, refused consent, >1h wait and state preservation. Independent source failure is not implemented.
2. At adequate real research sample (per metrics policy): better next-step comprehension than a baseline without more pressure or effort. Completion and optional feedback alone are not a launch gate.
3. Qualitative signal that the update is meaningfully different from what a booker already gets — not just a second notification.

## What would kill it

- Any guardrail breach (send without consent, auto-share, leaked specifics, blocked stages).
- Testers consistently preferring "the booker can already watch the tracking link".
- Data showing the taps cost more attention than the clarity returns.

## Bottom line

For this Product Manager, UX audition, the artifact demonstrates scope judgment, explicit consent, responsive interaction design, state-machine reasoning and documented tests. It does not establish production iOS/Android tenure, shipped mobile outcomes, team leadership, internal Wheely access or integration readiness. Those fit gaps require separate evidence; this build is not a substitute.

Viable as a **research artifact**: cheap to build, safe by construction, honest about what it cannot prove. Not yet viable as a **product claim** — that requires executed tests, not this document.
