# Privacy

**Wheely Arrival Companion** — independent concept study by Ayo Ahmed.

## Data model

- **In-memory application state only.** No browser storage, analytics, telemetry, backend, accounts or persistent event log. Reloading clears the application state. Static hosting still receives ordinary requests for assets and documents and may process IP address, browser headers and access logs; this is not a zero-data-processing claim.
- **No real people.** The only recipient is the fixed synthetic "Morgan". No real names, numbers, or contacts are requested or accepted.
- **No real journeys.** No bookings, flights, locations, or payments are touched. The arrival is simulated end to end.

## Consent model for the booker update

- One-time scope: consent applies to a single send only, never remembered.
- Unchecked by default: the box starts empty; sending is impossible until it is explicitly ticked.
- Preview first: exact message and fixed recipient are shown alongside a disabled confirm control. Ticking permission enables only that current update. An edit or network change revokes permission; repeated current-revision updates are refused.
- Generic content: the message carries no delay reason and no time estimate.
- Decline is free: refusing consent changes no progress or saved note and triggers no automatic prompt. A rider may deliberately open a new preview later; it is unchecked again. There is no persistent permission.
- No auto-share: there is no background, scheduled, or inferred sharing of any kind — the code path literally does not exist.
- Withdrawal disables future permission but cannot recall earlier simulated receipts. These remain clearly labelled local history, never messages delivered to a person.

## What stays private even inside the simulation

- Delay check-in reasons and estimates are passenger-only and never copied into the booker update.
- Stage taps describe the passenger; nothing about the chauffeur beyond a location freshness indicator.

## Reset guarantees

- Back and edit preserve committed stages; only an explicit confirmed reset or a reload clears state.
- Private notes are not retained by the application after reload; a hypothetical production version would need a lawful basis, transport/recipient authentication, deletion policy and host-log review. Data minimisation reduces exposure; it does not eliminate security responsibilities.
