# Product Requirements Document

**Concept:** Wheely Arrival Companion — an independent concept study by Ayo Ahmed. Not affiliated with, endorsed by, or built for Wheely.

## 1. Summary

A mobile companion concept for the stretch of a chauffeured airport pickup that sits between touchdown and stepping into the car: a self-reported arrival timeline (landed → passport control → baggage reclaim → meet chauffeur), an optional private delay check-in, and a strictly opt-in generic update to the person who booked the ride.

## 2. Context — what already exists

From Wheely's official "Perfect Airport Transfers" page (wheely.com/en/essentials/perfect-airport-transfers) and FAQ:

- Flight tracking automatically adjusts the pickup for early or late arrivals.
- The chauffeur waits at the correct Arrivals exit with a name board.
- 60 minutes of complimentary waiting begins at the updated landing time.
- The chauffeur's location is visible on a map, with a private in-app chat.
- "Book for Another Person" gives the recipient a tracking link, courtesy updates, and in-app chat.
- Guests cannot modify a booking.

None of these are treated as gaps or defects. They are the baseline this concept builds alongside.

## 3. Hypothesis

Post-landing, a passenger may benefit from (a) a simple, self-anchored view of where they are in the arrivals flow and (b) a one-tap, fully consented way to reassure a waiting booker. This is a hypothesis about added clarity — not a claim that the actual product is missing anything. It remains unproven until tested.

## 4. Users

- **Passenger (primary):** the arriving traveller.
- **Booker (secondary):** represented by a fixed synthetic recipient, "Morgan", standing in for whoever arranged the ride. No real person is ever contacted.

## 5. Functional requirements

| ID | Requirement |
|---|---|
| F1 | Arrival timeline: four stages — landed, passport control, baggage reclaim, meet chauffeur — self-reported by tap, in order. Committed stages are preserved across back/edit. |
| F2 | Flight status context: early, on-time, late, or unknown. The timeline works in every case; an unknown flight degrades flight-derived displays gracefully and never blocks progress. |
| F3 | Delay check-in (private): an optional preset reason plus an optional rough estimate of +10, +20, or +30 minutes. Visible to the passenger only. |
| F4 | Booker update: current passenger-reported stage, with a generic delay line if a private note exists before the ready stage. Fixed synthetic Morgan recipient. Exact preview first, then unchecked one-time permission. One simulated update per revision; edits revoke permission. No reason, estimate, location or contact details in the update. Nothing leaves the page. |
| F5 | No-network recovery: synthetic offline fixture and real browser offline disable updates and make current chauffeur status unavailable. Fixed flight times remain visibly synthetic, not fetched. Progress and saved notes stay in memory. Demo recovery or browser reconnection never queues/sends anything or restores permission; explicit review is required. Independent data-source recovery is a future integration question, not implemented. |
| F6 | Stale chauffeur: a chauffeur location older than 5 minutes is labelled stale, never presented as live. |
| F7 | Long wait: when the simulated elapsed wait passes the complimentary 60 minutes (counted from the updated landing time), a neutral informational notice is shown. No fees or outcomes are asserted. |
| F8 | Post-journey: a separate finish action at the final stage ends the simulated arrival, not a real journey. Optional Helpful, Still unclear, or Skip feedback remains local. Completed arrivals lock editing and sharing. |
| F9 | Back/edit/cancel: cancel discards only the unsaved draft and permission; committed progress, private note and receipts remain. Backward progress edits are explicit and old receipts become prior-progress history. Only confirmed scenario/reset changes or reload clear the state; reload-reset is labelled on every view. |
| F10 | In-memory only: no APIs, storage, analytics, real messages, bookings, or payments. A reload clears everything. |

## 6. Non-goals

No account, API, telemetry or persistent event log is implemented. The event schema and metrics describe a proposed future validation protocol, not running instrumentation. The last five-minute signal boundary is a demo design rule, not an official Wheely policy. Source freshness and waiting allowance are separate.

- Changing any booking, journey, or pickup plan (per the official FAQ, guests cannot modify a booking — this concept changes nothing).
- Real flight data, real recipients, real messages, or live location.
- Persistence, accounts, analytics, or payments.
- Positioning as a Wheely feature or proposal; it is an independent product exercise.

## 7. Constraints

- Mobile-first single flow; synthetic data only.
- The entire arrival is simulated. Completing the final stage ends the simulation — no real journey occurs.
- The booker update is a simulation too: no message leaves the device.
