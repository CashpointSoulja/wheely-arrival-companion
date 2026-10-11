# Event schema — proposed, not instrumented

Independent concept by Ayo Ahmed. Not affiliated with Wheely. Synthetic data only.

The app uses deterministic reducer actions and local simulated receipt history. It **does not implement an event log, telemetry, analytics transport or persistent session ID**. This is a proposed test/research protocol, not emitted events or a measured funnel.

## Suggested envelope

```json
{
  "schema_version": 1,
  "event": "booker_update_simulated",
  "session": "synthetic-session-01",
  "sequence": 9,
  "revision": 2,
  "payload": { "stage": "passport_control", "consent": "one_time", "simulation": true }
}
```

Example only. Allowed fields are enumerations, ephemeral session code, monotonic sequence and revision. Never collect names, email, phone, exact flight, terminal, location, message text, reason or estimate. No fingerprint or identity linkage. A future collection plan needs separate consent, minimisation, retention and privacy review. Booker-update permission does not authorise analytics.

| Proposed event | Allowed fields | Reducer mapping / interpretation |
| --- | --- | --- |
| `companion_opened` | scenario enum, simulation: true | Initial state; entry denominator. |
| `stage_committed` | stage enum, direction: forward/back | stage; passenger-reported, not verified location. |
| `checkin_opened` | none | open-check-in. |
| `checkin_saved` | present: true | save-check-in; never log reason/estimate. |
| `checkin_removed` | present: false | clear-check-in. |
| `draft_cancelled` | committed_preserved: true | cancel; not a reset. |
| `update_previewed` | stage, revision | open-share; exact text visible, checkbox empty. |
| `permission_changed` | allowed: boolean, scope: one_time | permission; current revision only. |
| `update_declined` | revision | withdraw/back; not a failure. |
| `booker_update_simulated` | stage, consent: one_time, simulation: true | Successful send, no real delivery. One receipt per revision. |
| `update_refused` | reason enum: offline/no_permission/stale_revision/duplicate/completed | Failed send; no private note text. |
| `permission_withdrawn` | prior_receipts_retained: true | withdraw; no recall. |
| `connectivity_changed` | scope: browser/fixture, online: boolean | offline/online/network; does not establish freshness. |
| `signal_state_shown` | freshness: recent/stale/unavailable | Fixed fixture; five-minute threshold is a demo rule. |
| `waiting_policy_shown` | kind: included/over/unknown | Fixed updated landing, not a live threshold-crossing event. |
| `arrival_completed` | simulation: true | Separate complete action at final stage; not a completed booking. |
| `feedback_chosen` | choice: helpful/unclear/skipped | One local choice, no submission. |
| `scenario_reset` | confirmed: true | Explicit reset; history deliberately erased. |

## Invariants

1. A simulated update requires exact preview, explicit permission for the same revision, online browser and fixture, and an incomplete arrival.
2. Consumed/revoked/refused permission is never restored by navigation, edits or reconnect. No queue, retry or auto-prompt.
3. Preview and receipt use the same function. Current receipt keys: revision, fixed synthetic recipient, text. There is no outbound payload.
4. Repeated revision sends yield one receipt; prior receipts remain labelled historical.
5. Completion locks edits/sharing. Feedback optional. Reset/reload clears all in-memory state.
6. Independent source recovery is not implemented; production integration needs separate source freshness and reconnect validation.
