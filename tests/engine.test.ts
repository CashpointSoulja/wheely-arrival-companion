import { describe, it, expect } from 'vitest';
import { initialState, reduce, waiting, signal, preview, canShare, scenarios, stages, type State, type Action } from '../src/engine';

function allow(state: State) { return reduce(reduce(state, { type: 'open-share' }), { type: 'permission', allowed: true }); }
function send(state: State) { return reduce(state, { type: 'send', revision: state.revision, online: true }); }
function note(state: State) {
  state = reduce(state, { type: 'open-check-in' });
  state = reduce(state, { type: 'draft', reason: 'Waiting for bags', estimate: 20 });
  return reduce(state, { type: 'save-check-in' });
}
describe('official waiting policy applied to synthetic fixtures', () => {
  it.each(['on-time', 'early', 'late'] as const)('%s uses actual landing, not scheduled', id => {
    const s = initialState(id);
    expect(waiting(s.scenario)).toEqual({ kind: 'included', minutes: 42 });
  });
  it('late landing is later than scheduled and early is earlier', () => {
    expect(initialState('late').scenario.landed).toBeGreaterThan(initialState('late').scenario.scheduled);
    expect(initialState('early').scenario.landed).toBeLessThan(initialState('early').scenario.scheduled);
  });
  it('unknown landing refuses countdown', () => expect(waiting(initialState('unknown').scenario)).toEqual({ kind: 'unknown', minutes: null }));
  it('over one hour reports elapsed, never a fare', () => expect(waiting(initialState('over-hour').scenario)).toEqual({ kind: 'over', minutes: 72 }));
  it('at exactly one hour the included window ends', () => {
    const s = initialState().scenario;
    expect(waiting({ ...s, now: s.landed! + 60 * 60_000 })).toEqual({ kind: 'over', minutes: 60 });
  });
  it('one millisecond before the hour has one illustrative minute left', () => {
    const s = initialState().scenario;
    expect(waiting({ ...s, now: s.landed! + 3_600_000 - 1 })).toEqual({ kind: 'included', minutes: 1 });
  });
  it('at landing all 60 minutes are included', () => {
    const s = initialState().scenario;
    expect(waiting({ ...s, now: s.landed! })).toEqual({ kind: 'included', minutes: 60 });
  });
  it.each([NaN, Infinity, -Infinity])('nonfinite landing %s refuses countdown', value => {
    expect(waiting({ ...initialState().scenario, landed: value }).kind).toBe('unknown');
  });
  it('future landing is unconfirmed', () => {
    const s = initialState().scenario;
    expect(waiting({ ...s, landed: s.now + 1 }).kind).toBe('unknown');
  });
  it('nonfinite clock is unconfirmed', () => expect(waiting({ ...initialState().scenario, now: NaN }).kind).toBe('unknown'));
});
describe('signal freshness', () => {
  it('recent fixture is still labelled as a demo by its source', () => expect(signal(initialState().scenario)).toBe('recent'));
  it('stale fixture never yields a recent signal', () => expect(signal(initialState('stale').scenario)).toBe('stale'));
  it('offline signal unavailable', () => expect(signal(initialState('offline').scenario)).toBe('unavailable'));
  it('unknown signal unavailable', () => expect(signal(initialState('unknown').scenario)).toBe('unavailable'));
  it('future signal unavailable', () => { const s = initialState().scenario; expect(signal({ ...s, signalAt: s.now + 1 })).toBe('unavailable'); });
  it('nonfinite signal unavailable', () => expect(signal({ ...initialState().scenario, signalAt: Infinity })).toBe('unavailable'));
  it('nonfinite clock never produces a recent signal', () => expect(signal({ ...initialState().scenario, now: NaN })).toBe('unavailable'));
  it('five minutes is accepted, five minutes plus one millisecond stale', () => {
    const s = initialState().scenario;
    expect(signal({ ...s, signalAt: s.now - 300_000 })).toBe('recent');
    expect(signal({ ...s, signalAt: s.now - 300_001 })).toBe('stale');
  });
});
describe('rider progress and optional private check-in', () => {
  it('initialises every fixture independent with no permission or receipts', () => {
    expect(scenarios).toHaveLength(7);
    for (const fixture of scenarios) {
      const state = initialState(fixture.id);
      expect(state.permission).toBe(false); expect(state.receipts).toEqual([]); expect(state.checkIn).toBeNull();
    }
  });
  it('moves through each stage sequentially', () => {
    let s = initialState();
    for (let i = 1; i < stages.length; i++) { s = reduce(s, { type: 'stage', stage: i }); expect(s.stage).toBe(i); }
  });
  it.each([-1, 4, 2, 1.5, NaN, Infinity])('refuses invalid/skipped progress %s', stage => expect(reduce(initialState(), { type: 'stage', stage })).toEqual(initialState()));
  it('does not mutate source state or fixed fixture', () => {
    const s = initialState(); const next = note(s);
    expect(s.checkIn).toBeNull(); expect(next.checkIn).not.toBeNull();
    reduce(s, { type: 'network', online: false }); expect(s.scenario.network).toBe(true); expect(scenarios[0].network).toBe(true);
  });
  it('backward edit keeps saved note and history but changes revision', () => {
    let s = send(allow(note(initialState()))); s = reduce(s, { type: 'stage', stage: 1 });
    const old = s; s = reduce(s, { type: 'stage', stage: 0 });
    expect(s.checkIn).toEqual(old.checkIn); expect(s.receipts).toEqual(old.receipts); expect(s.revision).toBe(old.revision + 1);
  });
  it('check-in creates no receipt and grants no permission', () => {
    const s = note(initialState()); expect(s.receipts).toEqual([]); expect(s.permission).toBe(false);
  });
  it('cancel preserves prior check-in, progress and receipts', () => {
    const s = send(allow(note(reduce(initialState(), { type: 'stage', stage: 1 }))));
    const draft = reduce(reduce(s, { type: 'open-check-in' }), { type: 'draft', reason: 'Passport queue', estimate: 30 });
    const canceled = reduce(draft, { type: 'cancel' });
    expect(canceled.checkIn).toEqual(s.checkIn); expect(canceled.stage).toBe(s.stage); expect(canceled.receipts).toEqual(s.receipts); expect(canceled.revision).toBe(s.revision);
  });
  it('cancel on a new note leaves check-in absent', () => expect(reduce(reduce(initialState(), { type: 'open-check-in' }), { type: 'cancel' }).checkIn).toBeNull());
  it('edit loads committed values', () => expect(reduce(note(initialState()), { type: 'open-check-in' }).draft).toEqual({ reason: 'Waiting for bags', estimate: 20 }));
  it('clearing a note does not clear progress/history', () => {
    const s = send(allow(note(initialState()))); const cleared = reduce(s, { type: 'clear-check-in' });
    expect(cleared.checkIn).toBeNull(); expect(cleared.receipts).toEqual(s.receipts); expect(cleared.stage).toBe(s.stage);
  });
  it('rejects unknown reason at runtime', () => {
    const s = reduce(initialState(), { type: 'open-check-in' });
    expect(reduce(s, { type: 'draft', reason: 'private free text', estimate: 20 } as unknown as Action)).toEqual(s);
  });
  it('rejects invalid estimate at runtime', () => {
    const s = reduce(initialState(), { type: 'open-check-in' });
    expect(reduce(s, { type: 'draft', reason: 'Waiting for bags', estimate: -1 } as unknown as Action)).toEqual(s);
  });
});
describe('permissioned booker updates fail closed', () => {
  it('open preview leaves permission unchecked', () => expect(reduce(initialState(), { type: 'open-share' }).permission).toBe(false));
  it('refuses send without permission', () => expect(send(reduce(initialState(), { type: 'open-share' })).receipts).toEqual([]));
  it('refuses send outside preview even if permission was forged', () => expect(send({ ...initialState(), permission: true }).receipts).toEqual([]));
  it('simulates exactly the preview with one known recipient', () => {
    const s = allow(initialState()); const sent = send(s);
    expect(sent.receipts).toEqual([{ revision: s.revision, recipient: 'Morgan', text: preview(s) }]); expect(sent.permission).toBe(false);
  });
  it('cannot repeat the same progress update', () => { const s = send(allow(initialState())); expect(send(allow(s)).receipts).toHaveLength(1); });
  it('refusal preserves private state and leaves no receipt', () => {
    const s = note(initialState()); const refused = reduce(allow(s), { type: 'withdraw' });
    expect(refused.checkIn).toEqual(s.checkIn); expect(refused.receipts).toEqual([]); expect(refused.permission).toBe(false);
  });
  it('refusal does not nag or interrupt subsequent progress', () => {
    let s = reduce(allow(initialState()), { type: 'withdraw' });
    for (let stage = 1; stage <= 3; stage++) s = reduce(s, { type: 'stage', stage });
    expect(s.view).toBe('timeline'); expect(s.permission).toBe(false); expect(s.receipts).toEqual([]);
  });
  it('two consecutive send dispatches produce a single receipt', () => {
    const allowed = allow(initialState()); const once = send(allowed);
    expect(reduce(once, { type: 'send', revision: allowed.revision, online: true }).receipts).toEqual(once.receipts);
  });
  it('does not leak reason or rough estimate to booker', () => {
    const s = note(initialState()); expect(preview(s)).not.toMatch(/Waiting for bags|20|Passport|queue/); expect(preview(s)).toContain('taking a little longer');
  });
  it('delay preview still shows current passenger progress', () => {
    const s = note(reduce(initialState(), { type: 'stage', stage: 1 }));
    expect(preview(s)).toBe('The passenger reports: Passport control. They are taking a little longer and will update you when ready.');
  });
  it('ready progress does not keep claiming an earlier delay', () => {
    let s = note(initialState()); for (let stage = 1; stage <= 3; stage++) s = reduce(s, { type: 'stage', stage });
    expect(preview(s)).toBe('The passenger reports: Meet your chauffeur.'); expect(s.checkIn).not.toBeNull();
  });
  it('offline synthetic scenario refuses despite permission', () => expect(send(allow(initialState('offline'))).receipts).toEqual([]));
  it('browser offline refuses despite scenario connection', () => {
    const s = allow(initialState()); expect(reduce(s, { type: 'send', revision: s.revision, online: false }).receipts).toEqual([]);
  });
  it('stale revision refuses and revokes permission', () => {
    const s = allow(note(initialState())); const denied = reduce(s, { type: 'send', revision: s.revision - 1, online: true });
    expect(denied.receipts).toEqual([]); expect(denied.permission).toBe(false);
  });
  it('canceling preview preserves progress/history but revokes permission', () => {
    const s = send(allow(note(initialState()))); const canceled = reduce(allow(s), { type: 'cancel' });
    expect(canceled.receipts).toEqual(s.receipts); expect(canceled.checkIn).toEqual(s.checkIn); expect(canceled.permission).toBe(false);
  });
  it('withdrawal never recalls previous receipt', () => {
    const s = send(allow(initialState())); const revoked = reduce(s, { type: 'withdraw' });
    expect(revoked.receipts).toEqual(s.receipts); expect(revoked.notice).toContain('cannot recall');
  });
  it('new progress always requires new permission', () => {
    const s = reduce(send(allow(initialState())), { type: 'stage', stage: 1 });
    expect(s.permission).toBe(false); expect(canShare(s)).toBe(false); expect(send(s).receipts).toHaveLength(1);
  });
  it('nonboolean truthy permission is refused', () => {
    const s = reduce(initialState(), { type: 'open-share' });
    expect(reduce(s, { type: 'permission', allowed: 'true' } as unknown as Action)).toEqual(s);
  });
});
describe('network recovery and post-journey feedback', () => {
  it('network loss keeps progress and notes, revokes permission', () => {
    const s = allow(note(initialState())); const offline = reduce(s, { type: 'network', online: false });
    expect(offline.checkIn).toEqual(s.checkIn); expect(offline.stage).toBe(s.stage); expect(offline.permission).toBe(false);
  });
  it('recovery does not automatically send or grant consent', () => {
    const recovered = reduce(note(initialState('offline')), { type: 'network', online: true });
    expect(recovered.receipts).toEqual([]); expect(recovered.permission).toBe(false); expect(recovered.checkIn).not.toBeNull();
  });
  it('recovery allows a new deliberate preview and send', () => {
    const s = reduce(initialState('offline'), { type: 'network', online: true }); expect(send(allow(s)).receipts).toHaveLength(1);
  });
  it('completion refuses before the meet stage', () => expect(reduce(initialState(), { type: 'complete' })).toEqual(initialState()));
  it('completion revokes sharing and permits optional feedback', () => {
    let s = initialState(); for (let stage = 1; stage <= 3; stage++) s = reduce(s, { type: 'stage', stage });
    s = reduce(s, { type: 'complete' }); expect(s.completed).toBe(true); expect(s.permission).toBe(false); expect(s.receipts).toEqual([]);
    expect(reduce(s, { type: 'feedback', value: 'helpful' }).feedback).toBe('helpful');
  });
  it('feedback cannot be collected before completion', () => expect(reduce(initialState(), { type: 'feedback', value: 'helpful' })).toEqual(initialState()));
  it.each(['helpful', 'unclear', 'skipped'] as const)('feedback %s stored only once in state', value => {
    let s = initialState(); for (let stage = 1; stage <= 3; stage++) s = reduce(s, { type: 'stage', stage });
    s = reduce(s, { type: 'complete' }); const first = reduce(s, { type: 'feedback', value });
    expect(first.feedback).toBe(value); expect(reduce(first, { type: 'feedback', value: 'helpful' })).toEqual(first); expect(first.receipts).toEqual([]);
  });
  it('completed arrival cannot reopen sharing or check-in', () => {
    let s = initialState(); for (let stage = 1; stage <= 3; stage++) s = reduce(s, { type: 'stage', stage });
    s = reduce(s, { type: 'complete' }); expect(reduce(s, { type: 'open-share' })).toEqual(s); expect(reduce(s, { type: 'open-check-in' })).toEqual(s);
  });
});
