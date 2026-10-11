export const stages = ['Landed', 'Passport control', 'Baggage reclaim', 'Meet your chauffeur'] as const;
export const reasons = ['Passport queue', 'Waiting for bags', 'Taking a little longer'] as const;
export type Reason = typeof reasons[number];
export type Estimate = 10 | 20 | 30 | null;
export type ScenarioId = 'on-time' | 'early' | 'late' | 'unknown' | 'offline' | 'stale' | 'over-hour';
export interface Scenario {
  id: ScenarioId; label: string; description: string;
  scheduled: number; landed: number | null; now: number; signalAt: number | null; network: boolean;
}
const minute = 60_000;
const base = Date.UTC(2026, 9, 11, 13, 0);
export const scenarios: readonly Scenario[] = [
  { id: 'on-time', label: 'On time', description: 'A calm arrival, 18 minutes after landing.', scheduled: base, landed: base, now: base + 18 * minute, signalAt: base + 17 * minute, network: true },
  { id: 'early', label: 'Early flight', description: 'Landed 25 minutes early. The hour begins at actual landing.', scheduled: base, landed: base - 25 * minute, now: base - 7 * minute, signalAt: base - 8 * minute, network: true },
  { id: 'late', label: 'Late flight', description: 'Landed 40 minutes late. No need to update flight details.', scheduled: base, landed: base + 40 * minute, now: base + 58 * minute, signalAt: base + 57 * minute, network: true },
  { id: 'unknown', label: 'Unknown flight', description: 'No confirmed landing time. No waiting-time countdown.', scheduled: base, landed: null, now: base + 18 * minute, signalAt: null, network: true },
  { id: 'offline', label: 'No network', description: 'Keep progress on this page. Updates cannot be simulated until recovery.', scheduled: base, landed: base, now: base + 18 * minute, signalAt: base + 17 * minute, network: false },
  { id: 'stale', label: 'Stale signal', description: 'Chauffeur signal is 12 minutes old. Current availability is unconfirmed.', scheduled: base, landed: base, now: base + 18 * minute, signalAt: base + 6 * minute, network: true },
  { id: 'over-hour', label: 'Over one hour', description: '72 minutes after landing. No fare or continued availability inferred.', scheduled: base, landed: base, now: base + 72 * minute, signalAt: base + 71 * minute, network: true }
];
export interface CheckIn { reason: Reason; estimate: Estimate }
export interface Receipt { revision: number; recipient: 'Morgan'; text: string }
export interface State {
  scenario: Scenario; stage: number; revision: number; checkIn: CheckIn | null;
  draft: CheckIn | null; view: 'timeline' | 'check-in' | 'share' | 'complete' | 'feedback';
  permission: boolean; receipts: Receipt[]; completed: boolean;
  feedback: 'helpful' | 'unclear' | 'skipped' | null; notice: string;
}
export type Action =
  | { type: 'stage'; stage: number }
  | { type: 'open-check-in' }
  | { type: 'draft'; reason: Reason; estimate: Estimate }
  | { type: 'save-check-in' }
  | { type: 'clear-check-in' }
  | { type: 'cancel' }
  | { type: 'open-share' }
  | { type: 'permission'; allowed: boolean }
  | { type: 'send'; revision: number; online: boolean }
  | { type: 'withdraw' }
  | { type: 'network'; online: boolean }
  | { type: 'complete' }
  | { type: 'feedback'; value: 'helpful' | 'unclear' | 'skipped' };
export function initialState(id: ScenarioId = 'on-time'): State {
  const scenario = scenarios.find(s => s.id === id) ?? scenarios[0];
  return { scenario: { ...scenario }, stage: 0, revision: 0, checkIn: null, draft: null, view: 'timeline', permission: false, receipts: [], completed: false, feedback: null, notice: '' };
}
export function waiting(scenario: Scenario): { kind: 'unknown' | 'included' | 'over'; minutes: number | null } {
  if (scenario.landed === null || !Number.isFinite(scenario.landed) || !Number.isFinite(scenario.now) || scenario.landed > scenario.now) return { kind: 'unknown', minutes: null };
  const elapsed = Math.floor((scenario.now - scenario.landed) / minute);
  return elapsed >= 60 ? { kind: 'over', minutes: elapsed } : { kind: 'included', minutes: 60 - elapsed };
}
export function signal(scenario: Scenario): 'unavailable' | 'stale' | 'recent' {
  if (!scenario.network || !Number.isFinite(scenario.now) || scenario.signalAt === null || !Number.isFinite(scenario.signalAt) || scenario.signalAt > scenario.now) return 'unavailable';
  return scenario.now - scenario.signalAt > 5 * minute ? 'stale' : 'recent';
}
export function preview(state: State): string {
  if (state.completed) return 'The passenger has finished their simulated arrival.';
  const progress = `The passenger reports: ${stages[state.stage]}.`;
  return state.checkIn && state.stage < 3 ? `${progress} They are taking a little longer and will update you when ready.` : progress;
}
export function canShare(state: State, online = true): boolean {
  return state.view === 'share' && state.permission === true && online && state.scenario.network && !state.completed && !state.receipts.some(r => r.revision === state.revision);
}
function changed(state: State, update: Partial<State>): State {
  return { ...state, ...update, revision: state.revision + 1, permission: false, notice: '' };
}
export function reduce(state: State, action: Action): State {
  switch (action.type) {
    case 'stage':
      if (state.completed || state.view !== 'timeline' || !Number.isInteger(action.stage) || action.stage < 0 || action.stage >= stages.length || action.stage > state.stage + 1 || action.stage === state.stage) return state;
      return changed(state, { stage: action.stage });
    case 'open-check-in':
      return state.completed ? state : { ...state, view: 'check-in', draft: state.checkIn ? { ...state.checkIn } : { reason: reasons[0], estimate: null }, permission: false, notice: '' };
    case 'draft':
      if (state.view !== 'check-in' || !reasons.includes(action.reason) || ![null, 10, 20, 30].includes(action.estimate)) return state;
      return { ...state, draft: { reason: action.reason, estimate: action.estimate } };
    case 'save-check-in':
      if (state.view !== 'check-in' || !state.draft) return state;
      return changed(state, { checkIn: { ...state.draft }, draft: null, view: 'timeline', notice: '' });
    case 'clear-check-in':
      return state.completed || !state.checkIn ? state : changed(state, { checkIn: null, view: 'timeline', draft: null });
    case 'cancel':
      return { ...state, draft: null, permission: false, view: state.completed ? 'complete' : 'timeline', notice: '' };
    case 'open-share':
      return state.completed ? state : { ...state, view: 'share', permission: false, draft: null, notice: '' };
    case 'permission':
      return state.view !== 'share' || typeof action.allowed !== 'boolean' ? state : { ...state, permission: action.allowed };
    case 'send':
      if (action.revision !== state.revision || !canShare(state, action.online === true)) return { ...state, permission: false, notice: 'Update not simulated. Recheck connection, content and permission.' };
      return { ...state, receipts: [...state.receipts, { revision: state.revision, recipient: 'Morgan', text: preview(state) }], permission: false, view: 'timeline', notice: 'One update simulated to Morgan. Nothing was sent.' };
    case 'withdraw':
      return { ...state, permission: false, view: state.completed ? 'complete' : 'timeline', notice: 'Sharing is off. Previous simulated updates remain in this page’s history; withdrawal cannot recall them.' };
    case 'network':
      if (typeof action.online !== 'boolean') return state;
      return { ...state, scenario: { ...state.scenario, network: action.online }, permission: false, notice: action.online ? 'Demo connection restored. Progress kept; no update queued or sent. Review and allow again.' : 'Offline. Progress kept on this page; no updates queued. Reloading will reset it.' };
    case 'complete':
      if (state.stage !== 3 || state.completed || state.view !== 'timeline') return state;
      return changed(state, { completed: true, view: 'complete', checkIn: null });
    case 'feedback':
      if (!state.completed || state.feedback || !['helpful', 'unclear', 'skipped'].includes(action.value)) return state;
      return { ...state, feedback: action.value, view: 'feedback', notice: action.value === 'skipped' ? 'Feedback skipped. Nothing collected.' : 'Feedback held only on this page. Nothing submitted.' };
    default:
      return state;
  }
}
export function time(value: number | null): string {
  return value === null ? 'Unconfirmed' : new Date(value).toLocaleTimeString('en-GB', { timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit' });
}
