# Five Whys

**Wheely Arrival Companion** — independent concept study by Ayo Ahmed.

Each "why" is labelled **[Evidence]** (documented, verifiable) or **[Assumption]** (hypothesis to validate, not yet proven).

**Problem statement:** the minutes between touchdown and meeting the chauffeur may be the least self-explanatory part of an otherwise fully managed airport transfer.

1. **Why might an arrival companion help at all?**
   Because between touchdown and the car, a passenger's attention is on the airport — queues, signs, baggage — not on the app. **[Assumption]** — no user research exists yet.

2. **Why is that moment fragile?**
   Because small uncertainties compound: which stage am I at, roughly how long might this take, has anyone been told where I am? **[Assumption]** — plausible but untested.

3. **Why don't existing channels fully cover this job?**
   Public descriptions establish flight tracking, chauffeur map, chat and guest tracking links/courtesy updates. **[Evidence]** — official Wheely materials. They do not establish whether the private app already covers rider progress or whether riders want another flow. Any incremental value remains **[Assumption]**.

4. **Why not just send a normal message?**
   Composing a message may cost attention. Presets may be easier, but multiple timeline taps may also be more work than using existing chat or doing nothing. **[Assumption]** — compare alternatives before claiming lower effort. Private note creation is separate from any optional update.

5. **Why must the update be opt-in, previewed, and generic?**
   I chose explicit permission, exact preview and no private reason/estimate as a trust boundary. **[Design decision]** — not empirically validated. What a booker actually needs and whether the rider feels pressure remain **[Assumption]**. Consent rate is not an optimisation goal.

## Evidence vs. assumption summary

| Known (evidence) | Unknown (assumption to test) |
|---|---|
| Flight tracking auto-adjusts early/late arrivals | Whether passengers still feel post-landing uncertainty |
| 60 min complimentary waiting from updated landing | Whether a self-reported stage timeline reduces it |
| Chauffeur map + in-app chat exist | Whether one-tap presets beat free-text updates |
| Book-for-others sends tracking link + courtesy updates | Whether bookers still want a passenger-initiated ping |
| Guests cannot modify a booking | Whether opt-in generic updates feel respectful vs. redundant |
