import './style.css';
import { initialState, reduce, scenarios, stages, reasons, waiting, signal, time, preview, canShare, type Action, type ScenarioId, type Reason, type Estimate } from './engine';

let state = initialState();
let tab: 'companion' | 'notes' = 'companion';
let browserOnline = navigator.onLine;
const root = document.querySelector<HTMLDivElement>('#app')!;
const airportSource = 'https://wheely.com/en/essentials/perfect-airport-transfers';
const stageDetails = [
  'Your next step is passport control. Take your time; progress is yours to share.',
  'When you are through passport control, collect your luggage. No check-in is required.',
  'Collect your bags, then head to Arrivals. Your reason and estimate remain private, even if you choose an update.',
  'Wheely describes a name-board meet & greet at the correct Arrivals exit. This concept cannot confirm a real meeting.'
];
const nextLabels = ['I’m at passport control', 'I’m collecting my bags', 'I’m ready for Arrivals'];
const icon = (name: 'arrow' | 'lock' | 'plane' | 'check' | 'clock') => {
  const paths = { arrow: '<path d="M4 12h16M14 6l6 6-6 6"/>', lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V6a4 4 0 0 1 8 0v4"/>', plane: '<path d="m3 13 8-3V4l2-2 2 2v6l6 3v2l-6-1v5l3 2H8l3-2v-5l-8 1z"/>', check: '<path d="m5 12 4 4L19 6"/>', clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>' };
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">${paths[name]}</svg>`;
};
function waitingCard() {
  const wait = waiting(state.scenario);
  const title = wait.kind === 'unknown' ? 'Waiting time unconfirmed' : wait.kind === 'over' ? 'Complimentary hour has ended' : `${wait.minutes} min of the included hour`;
  const body = wait.kind === 'unknown' ? 'Without a confirmed landing time, we cannot calculate the complimentary hour.' : wait.kind === 'over' ? `${wait.minutes} min since simulated landing. Confirm arrangements in the real app; no charge or continued availability is estimated here.` : 'Illustrative only. Wheely’s published hour begins at the updated landing time, not the scheduled time.';
  return `<section class="waiting-card ${wait.kind === 'over' ? 'warning' : ''}" aria-label="Waiting policy">${icon('clock')}<div><strong>${title}</strong><p>${body}</p><a href="${airportSource}" target="_blank" rel="noreferrer">Read official airport policy ↗</a></div></section>`;
}
function chauffeurCard() {
  const status = browserOnline ? signal(state.scenario) : 'unavailable';
  return `<div class="chauffeur"><div class="monogram" aria-hidden="true">J</div><div><strong>James · synthetic chauffeur</strong><p>${status === 'recent' ? 'Demo signal: at Arrivals · 1 min ago' : status === 'stale' ? 'Stale demo signal · 12 min ago' : 'Current signal unavailable'}</p></div><span class="signal-dot ${status === 'recent' ? '' : 'muted'}" aria-hidden="true"></span></div>${status !== 'recent' ? '<p class="signal-note">Current waiting status is unconfirmed. Use the real app’s chat or support to confirm; neither is connected here.</p>' : '<p class="signal-note">Fixture only, not a live location or availability guarantee.</p>'}`;
}
function timeline() {
  return `<div class="timeline-heading"><span class="eyebrow">AFTER LANDING</span><span class="small">Your progress, your pace</span></div><ol class="timeline">${stages.map((stage, i) => `<li class="${i === state.stage ? 'current' : i < state.stage ? 'done' : 'future'}"><span class="step-mark" aria-hidden="true">${i < state.stage ? icon('check') : i + 1}</span><div><div class="step-title"><${i === state.stage ? 'h2' : 'h3'}>${stage}</${i === state.stage ? 'h2' : 'h3'}>${i < state.stage ? `<button class="text-button" data-stage="${i}" aria-label="Edit progress back to ${stage}">Edit</button>` : ''}</div>${i === state.stage ? `<p>${stageDetails[i]}</p><span class="local-label">Passenger-reported · on this page only</span>${i < 3 ? `<button class="primary next" data-stage="${i + 1}">${nextLabels[i]}${icon('arrow')}</button>` : '<button class="primary next" data-action="complete">Finish simulated arrival'+icon('check')+'</button>'}` : i < state.stage ? '<span class="small">Reported by you</span>' : '<span class="small">Next step</span>'}</div></li>`).join('')}</ol>
  <section class="check-in-card"><div class="section-line"><h3>${state.checkIn ? 'Your private check-in' : 'Taking a little longer?'}</h3><span class="pill">OPTIONAL</span></div><p>${state.checkIn ? `${state.checkIn.reason} · ${state.checkIn.estimate ? `about ${state.checkIn.estimate} more minutes` : 'no estimate'}. Kept only on this page, not sent to your chauffeur or booker.` : 'Keep a note for yourself. No explanation is required, and it does not change your pickup or waiting allowance.'}</p><button class="secondary" data-action="open-check-in">${state.checkIn ? 'Edit check-in' : 'Add a private check-in'}</button>${state.checkIn ? '<button class="text-button clear" data-action="clear-check-in">Remove check-in</button>' : ''}</section>
  <section class="booker-card"><div class="section-line"><h3>Keep Morgan in the loop?</h3>${icon('lock')}</div><p>Morgan is your synthetic booker. Nothing is shared automatically. You choose each update.</p><button class="secondary" data-action="open-share">Preview a booker update ${icon('arrow')}</button><span class="local-label">Sharing off by default · no real messages</span></section>
  ${state.receipts.length ? `<details class="receipts"><summary>Simulated update history (${state.receipts.length})</summary>${state.receipts.map(r => `<div><strong>To Morgan · simulated, not delivered</strong><p>${r.text}</p><span class="small">Revision ${r.revision}${r.revision !== state.revision ? ' · prior progress, not current' : ''}</span></div>`).join('')}<button class="text-button" data-action="withdraw">Keep future updates private</button></details>` : ''}`;
}
function checkInView() {
  const draft = state.draft!;
  return `<button class="text-button back" data-action="cancel">← Back to arrival</button><span class="eyebrow">OPTIONAL CHECK-IN</span><h2 class="view-title">A little more time.</h2><p class="view-intro">This note stays on this page. You do not have to explain your delay. It changes no booking, pickup time or waiting allowance.</p><form id="check-in-form"><fieldset><legend>What’s holding you up?</legend>${reasons.map(reason => `<label class="radio-option"><input type="radio" name="reason" value="${reason}" ${draft.reason === reason ? 'checked' : ''}/><span>${reason}</span></label>`).join('')}</fieldset><label class="field-label" for="estimate">Rough estimate <span>(optional, not a promise)</span></label><select id="estimate" name="estimate"><option value="" ${draft.estimate === null ? 'selected' : ''}>I’m not sure</option>${[10, 20, 30].map(n => `<option value="${n}" ${draft.estimate === n ? 'selected' : ''}>About ${n} more minutes</option>`).join('')}</select><div class="privacy-note">${icon('lock')}<span>Your reason and estimate are never included in a booker update.</span></div><button class="primary full" type="submit">Save private check-in</button><button type="button" class="secondary full" data-action="cancel">Cancel — keep previous state</button></form>`;
}
function shareView() {
  const offline = !browserOnline || !state.scenario.network;
  const sent = state.receipts.some(r => r.revision === state.revision);
  return `<button class="text-button back" data-action="cancel">← Back to arrival</button><span class="eyebrow">ONE-TIME PERMISSION</span><h2 class="view-title">Only what you choose.</h2><p class="view-intro">Preview the complete update. This is a local simulation, not an email, text or app notification.</p><div class="message-preview"><span class="eyebrow">TO MORGAN · SYNTHETIC BOOKER</span><p>${preview(state)}</p><span class="small">No delay reason, estimate, location or contact details.</span></div><label class="consent-option"><input id="permission" type="checkbox" ${state.permission ? 'checked' : ''} ${offline || sent ? 'disabled' : ''}/><span>Allow this exact update to Morgan once.<small>No ongoing permission. Each new update asks again.</small></span></label>${offline ? '<p class="alert">Offline. Update unavailable; no queued messages. Recover connection, then review and allow again.</p>' : ''}${sent ? '<p class="alert">This progress update was already simulated. It cannot be repeated.</p>' : ''}<button class="primary full" data-send-revision="${state.revision}" ${canShare(state, browserOnline) ? '' : 'disabled'}>Simulate one update ${icon('arrow')}</button><button class="secondary full" data-action="withdraw">Not now — keep it private</button><p class="small consent-footnote">Nothing leaves this browser. Withdrawal stops future permission; previous simulated updates cannot be recalled.</p>`;
}
function completeView() {
  return `<div class="completion-mark">${icon('check')}</div><span class="eyebrow">SIMULATED ARRIVAL COMPLETE</span><h2 class="view-title">You’ve arrived.</h2><p class="view-intro">This ends the concept’s timeline, not a real journey. No booking was created, changed or completed.</p>${state.feedback === null ? `<section class="feedback-card"><h3>Did the timeline help?</h3><p>Optional post-journey feedback. Kept on this page only, not submitted or counted as measured product impact.</p><div class="feedback-actions"><button class="secondary" data-feedback="helpful">Helpful</button><button class="secondary" data-feedback="unclear">Still unclear</button></div><button class="text-button" data-feedback="skipped">Skip feedback</button></section>` : `<section class="feedback-card"><h3>${state.feedback === 'skipped' ? 'Feedback skipped' : 'Thank you for the local feedback'}</h3><p>${state.feedback === 'skipped' ? 'Nothing collected.' : `Your choice: ${state.feedback === 'helpful' ? 'Helpful' : 'Still unclear'}. Nothing submitted or stored beyond this page.`}</p></section>`}<button class="secondary full" data-reset>Try another synthetic arrival</button>`;
}
function notes() {
  const docs = [['prd','PRD'],['jtbd','Jobs to be done'],['five-whys','Five Whys'],['eli5','ELI5'],['decisions','My product decisions'],['events','Event schema'],['privacy','Privacy & consent'],['metrics','Metrics & experiment'],['viability','Viability & fit gaps'],['v2','Version 2'],['actual-tests','Actual test evidence'],['sources','Source ledger'],['brand','Visual research'],['deployment','Free deployment']];
  return `<main class="notes-page" id="rider" tabindex="-1"><span class="eyebrow">PRODUCT MANAGER, UX AUDITION · AYO AHMED</span><h1>Clarity, without<br>another obligation.</h1><p class="lede">A hypothesis about the minutes between landing and meeting your chauffeur. Not a claim that Wheely lacks flight tracking, maps, chat or guest updates.</p><div class="notes-grid"><section><h2>The narrow bet</h2><p>An optional rider-controlled timeline may reduce uncertainty after landing. A minimal update to a known booker is a separate, one-time choice—not the price of getting help.</p><h2>What already exists</h2><p>Wheely publicly documents automatic flight tracking, an Arrivals name-board meet & greet, chauffeur location, private chat, guest journey updates and one hour of complimentary waiting from the updated landing time.</p><a href="${airportSource}" target="_blank" rel="noreferrer">Official airport transfers ↗</a><h2>What this build proves</h2><p>A responsive web interaction, synthetic edge-case handling and explicit consent. Not native mobile production tenure, internal access, proven lift or commercial readiness.</p><h2>Metrics: illustrative, not impact</h2><p>Example arithmetic only: 8 of 12 synthetic participants correctly identify their next step (66.7%). This is fabricated fixture arithmetic, not a study or observed result. No winner or lift claim.</p><button class="primary" data-tab="companion">Try the companion ${icon('arrow')}</button></section><section class="doc-list"><h2>Product notebook</h2><p>Open the source notes. Evidence and assumptions are kept separate.</p>${docs.map(([slug,label]) => `<a href="./docs/${slug}.md" target="_blank" rel="noreferrer">${label}<span aria-hidden="true">↗</span></a>`).join('')}</section></div></main>`;
}
function render(focus?: string) {
  const offline = !state.scenario.network || !browserOnline;
  root.innerHTML = `<header class="site-header"><div class="brand"><img src="./brand/wheely-logo.svg" alt="Wheely" width="202" height="24"/><span>ARRIVAL COMPANION</span></div><nav aria-label="Main"><button data-tab="companion" ${tab === 'companion' ? 'aria-current="page"' : ''}>Companion</button><button data-tab="notes" ${tab === 'notes' ? 'aria-current="page"' : ''}>Product notes</button></nav></header><div class="disclaimer">Independent concept by Ayo Ahmed. Not affiliated with Wheely. <span>Synthetic data only.</span></div>${tab === 'notes' ? notes() : `<main class="workspace"><aside class="editorial"><span class="eyebrow">A LITTLE SPACE AFTER LANDING</span><h1>A quieter<br>arrival.</h1><p class="lede">From touchdown to your chauffeur.<br>One clear next step, at your own pace.</p><div class="editorial-rule"></div><p class="editorial-copy">The flight is tracked. The car is arranged.<br>This concept explores the in-between:<br>progress you control, updates you permit.</p><div class="hypothesis"><span class="eyebrow">THE PRODUCT BET · NOT VALIDATED</span><p>Can a calm post-landing timeline offer reassurance without creating another task?</p><button class="text-button" data-tab="notes">Read my product decisions ↗</button></div><span class="byline">Product Manager, UX concept · Ayo Ahmed</span></aside><section class="rider-card" id="rider" tabindex="-1" aria-label="Synthetic rider arrival companion"><div class="rider-top"><span class="eyebrow">YOUR ARRIVAL</span><span class="simulation"><span aria-hidden="true">●</span> SIMULATION</span></div><div class="journey-title"><h2>London Heathrow</h2><span>Terminal 5 · Arrivals</span></div><div class="flight-row">${icon('plane')}<span>WA 204 · synthetic flight</span><span>London time</span></div><div class="time-grid"><div><span>Scheduled</span><strong>${time(state.scenario.scheduled)}</strong></div><div><span>Updated landing</span><strong>${time(state.scenario.landed)}</strong></div><div><span>Demo clock</span><strong>${time(state.scenario.now)}</strong></div></div>${offline ? `<div class="offline-banner" role="status"><strong>No network${!browserOnline ? ' · browser offline' : ' · simulated'}</strong><p>Progress stays on this page. No updates queued. Reloading resets it.</p>${browserOnline ? '<button class="text-button" data-recover>Recover demo connection →</button>' : '<p>Reconnect your device; then review permission again.</p>'}</div>` : ''}<div class="status-announcement" role="status" aria-live="polite">${state.notice}</div>${state.view === 'timeline' ? `${chauffeurCard()}${waitingCard()}${timeline()}` : state.view === 'check-in' ? checkInView() : state.view === 'share' ? shareView() : completeView()}<div class="rider-footer">${icon('lock')}<span>In memory only. No booking. No messages. Reload to reset.</span></div></section><aside class="scenario-panel"><span class="eyebrow">EXPLORE THE CONCEPT</span><h2>A different arrival.</h2><p>Every signal and time below is a fixed synthetic fixture. No live APIs are connected.</p><label for="scenario">Synthetic scenario</label><select id="scenario">${scenarios.map(s => `<option value="${s.id}" ${s.id === state.scenario.id ? 'selected' : ''}>${s.label}</option>`).join('')}</select><p class="scenario-description">${state.scenario.description}</p><button class="text-button" data-reset>Reset this scenario ↺</button><details class="policy"><summary>What is official policy?</summary><p>Wheely states the complimentary hour starts at the updated landing time, including early or delayed flights. Beyond it, confirm arrangements and any charges in the real app. No fare is shown here.</p><a href="${airportSource}" target="_blank" rel="noreferrer">Read the official source ↗</a></details><details class="policy"><summary>Existing map & chat</summary><p>Chauffeur location, private in-app chat and flight tracking already exist. They are deliberately not recreated or connected in this concept.</p></details><button class="secondary full" data-tab="notes">Explore the product notebook</button><div class="scenario-caption">Optional. Private by default.<br>No action required to keep travelling.</div></aside></main>`}<footer class="site-footer"><span>Independent concept by Ayo Ahmed · No affiliation or endorsement.</span><span>Wheely’s wordmark belongs to Wheely.</span></footer>`;
  bind();
  if (tab === 'notes') {
    const disclosure = document.createElement('p');
    disclosure.className = 'editorial-copy';
    disclosure.textContent = 'Application state is in memory only. Nothing is sent or stored. Reloading resets private progress and local update history.';
    root.querySelector('.notes-grid')?.before(disclosure);
  }
  if (state.scenario.id === 'offline' && state.scenario.network && browserOnline) {
    const description = root.querySelector('.scenario-description');
    const option = root.querySelector('option[value="offline"]');
    if (description) description.textContent = 'Demo connection restored. This fixture began offline. Progress kept; no updates queued or sent. Review permission again.';
    if (option) option.textContent = 'No network · recovered';
  }
  if (focus) {
    const target = document.querySelector<HTMLElement>(focus);
    target?.focus({ preventScroll: true });
    target?.scrollIntoView({ block: 'start', behavior: 'auto' });
  }
}
function dispatch(action: Action, focus?: string) { state = reduce(state, action); render(focus); }
function reset(id: ScenarioId = state.scenario.id) {
  if ((state.revision || state.draft || state.receipts.length || state.feedback) && !window.confirm('Reset this synthetic arrival? This clears private progress and local update history.')) { render(); return; }
  state = initialState(id); render('#rider');
}
function bind() {
  root.querySelectorAll<HTMLButtonElement>('[data-tab]').forEach(button => button.onclick = () => { tab = button.dataset.tab as typeof tab; render('#rider'); });
  root.querySelectorAll<HTMLButtonElement>('[data-action]').forEach(button => button.onclick = () => dispatch({ type: button.dataset.action } as Action, '#rider'));
  root.querySelectorAll<HTMLButtonElement>('[data-stage]').forEach(button => button.onclick = () => dispatch({ type: 'stage', stage: Number(button.dataset.stage) }, '#rider'));
  root.querySelectorAll<HTMLButtonElement>('[data-feedback]').forEach(button => button.onclick = () => dispatch({ type: 'feedback', value: button.dataset.feedback as 'helpful' | 'unclear' | 'skipped' }, '#rider'));
  root.querySelectorAll<HTMLButtonElement>('[data-reset]').forEach(button => button.onclick = () => reset());
  const select = root.querySelector<HTMLSelectElement>('#scenario');
  if (select) select.onchange = () => reset(select.value as ScenarioId);
  const recover = root.querySelector<HTMLButtonElement>('[data-recover]');
  if (recover) recover.onclick = () => dispatch({ type: 'network', online: true }, '#rider');
  const form = root.querySelector<HTMLFormElement>('#check-in-form');
  if (form) {
    form.onchange = () => {
      const values = new FormData(form);
      state = reduce(state, { type: 'draft', reason: values.get('reason') as Reason, estimate: values.get('estimate') ? Number(values.get('estimate')) as Estimate : null });
    };
    form.onsubmit = e => { e.preventDefault(); dispatch({ type: 'save-check-in' }, '#rider'); };
  }
  const permission = root.querySelector<HTMLInputElement>('#permission');
  if (permission) permission.onchange = () => {
    state = reduce(state, { type: 'permission', allowed: permission.checked });
    const button = root.querySelector<HTMLButtonElement>('[data-send-revision]')!;
    button.disabled = !canShare(state, browserOnline);
  };
  const send = root.querySelector<HTMLButtonElement>('[data-send-revision]');
  if (send) send.onclick = () => dispatch({ type: 'send', revision: Number(send.dataset.sendRevision), online: navigator.onLine }, '#rider');
}
window.addEventListener('offline', () => { browserOnline = false; state = reduce(state, { type: 'permission', allowed: false }); render(); });
window.addEventListener('online', () => { browserOnline = true; state = reduce(state, { type: 'network', online: state.scenario.network }); render(); });
render();
