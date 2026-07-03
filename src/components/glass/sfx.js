/**
 * Console SFX — original tones synthesized in-browser (Web Audio), NOT sampled.
 * Tuned to sit in the same sonic world as the GameCube menu sounds we studied:
 * soft swelled attacks (never clicky), musical triads/clusters, a granular
 * "bubbly" shimmer, warm lowpassed timbre, and a soft reverb tail. Measured
 * targets from the originals:
 *   Startup     ~2.5s, slow ~1s swell, bright Bb/D#/F cluster (centroid ~1175Hz)
 *   Turn Center F major (F4·A4·C5), mid register
 *   Turn Side   Bb major (Bb3·D4·F4), darker/lower
 *   Select      E5·F#5·A5 + octaves, bright, ~1s ring
 *   Back        F4·G4 warm cluster, lowest, short descending dip
 *
 * On by default; a visitor can mute via the toggle (choice persisted). Browser
 * autoplay policy still blocks audio until the first real gesture, so we arm a
 * one-time unlock that plays the startup bloom on first interaction.
 */

const LS_KEY = 'gx-sound';
const MASTER_VOL = 0.55;
const listeners = new Set();

let ctx = null;
let master = null;
let wetGain = null;
let lp = null;
let enabled = true; // on by default; only an explicit stored choice overrides
try {
  const v = localStorage.getItem(LS_KEY);
  if (v !== null) enabled = v === '1';
} catch (e) { /* ignore */ }

// Sound "fonts" — each recolors the synth timbre (waveform), brightness (lowpass),
// reverb wash, and pitch register. `glass` keeps the per-call waveforms (the
// original ethereal voice); the others force one waveform for a distinct feel.
export const SOUND_THEMES = [
  { id: 'glass', label: 'Glass' },
  { id: 'chime', label: 'Chime' },
  { id: 'warm', label: 'Warm' },
  { id: 'retro', label: 'Retro' },
  { id: 'crystal', label: 'Crystal' },
  { id: 'pulse', label: 'Pulse' },
];
// `bed` recolors the always-on ambient drone (brightness + waveform) so each
// font also swaps the background "track", not just the interaction blips.
const THEMES = {
  glass: { lp: 5000, wet: 0.44, mul: 1, bed: { lp: 1700, wave: 'sine' } },
  chime: { lp: 9000, wet: 0.55, mul: 1.5, wave: 'sine', bed: { lp: 3200, wave: 'sine' } },
  warm: { lp: 3400, wet: 0.5, mul: 0.8, wave: 'triangle', bed: { lp: 900, wave: 'triangle' } },
  retro: { lp: 3200, wet: 0.1, mul: 1, wave: 'square', bed: { lp: 1150, wave: 'square' } },
  // bright, high, long tail — glassy bells an octave up
  crystal: { lp: 11000, wet: 0.62, mul: 2, wave: 'sine', bed: { lp: 3800, wave: 'sine' } },
  // buzzy analog synth — sawtooth with a short, dry space
  pulse: { lp: 2600, wet: 0.18, mul: 1, wave: 'sawtooth', bed: { lp: 1000, wave: 'sawtooth' } },
};
let themeId = 'glass';
try {
  const t = localStorage.getItem('gx-sound-theme');
  if (t && THEMES[t]) themeId = t;
} catch (e) { /* ignore */ }
const theme = () => THEMES[themeId] || THEMES.glass;

// short algorithmic reverb impulse (decaying filtered noise) for the soft tail
function makeImpulse(c, seconds, decay) {
  const len = Math.floor(c.sampleRate * seconds);
  const buf = c.createBuffer(2, len, c.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
  }
  return buf;
}

function ensureContext() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = MASTER_VOL;
  // warmth: gently roll off the top so nothing is harsh/digital
  lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = theme().lp;   // brightness is theme-driven
  lp.Q.value = 0.4;
  // wet/dry reverb tail — long and lush for an ethereal, washed space
  const reverb = ctx.createConvolver();
  reverb.buffer = makeImpulse(ctx, 2.6, 2.1);
  wetGain = ctx.createGain();
  wetGain.gain.value = theme().wet;
  master.connect(lp);
  lp.connect(ctx.destination);
  lp.connect(reverb);
  reverb.connect(wetGain);
  wetGain.connect(ctx.destination);
  return ctx;
}

function resume() {
  if (ctx && ctx.state === 'suspended') ctx.resume();
}

// one voice: an oscillator with a soft (non-clicky) AD envelope
function voice(freq, opts) {
  const o = opts || {};
  const now = ctx.currentTime + (o.delay || 0);
  const attack = o.attack != null ? o.attack : 0.03;
  const hold = o.hold != null ? o.hold : 0.04;
  const release = o.release != null ? o.release : 0.3;
  const peak = o.gain != null ? o.gain : 0.16;

  const osc = ctx.createOscillator();
  osc.type = theme().wave || o.type || 'sine';
  const m = theme().mul || 1;
  osc.frequency.setValueAtTime(freq * m, now);
  if (o.detune) osc.detune.value = o.detune;
  if (o.glide) osc.frequency.exponentialRampToValueAtTime(freq * m * o.glide, now + attack + hold + release);

  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, now);
  g.gain.linearRampToValueAtTime(peak, now + attack);           // soft swell in
  g.gain.setValueAtTime(peak, now + attack + hold);
  g.gain.exponentialRampToValueAtTime(0.0001, now + attack + hold + release);

  osc.connect(g);
  g.connect(master);
  osc.start(now);
  osc.stop(now + attack + hold + release + 0.05);
}

// ethereal glassy note: fundamental + a slightly detuned twin (chorus shimmer)
// + a quiet inharmonic partial for a faint bell "edge" (the otherworldly quality)
function bell(freq, opts) {
  const o = opts || {};
  const g = o.gain != null ? o.gain : 0.12;
  const rel = o.release != null ? o.release : 0.6;
  const atk = o.attack != null ? o.attack : 0.04;
  voice(freq, o);
  voice(freq, { ...o, detune: (o.detune || 0) + 7, gain: g * 0.6 });
  voice(freq * 2.76, { type: 'sine', attack: atk, hold: 0, release: rel * 0.6, gain: g * 0.12 });
}

// a cluster of soft high grains → the "bubbly shimmer" texture (used by boot)
function sparkle(count, spread, loFreq, hiFreq, gain) {
  for (let i = 0; i < count; i++) {
    const f = loFreq + Math.random() * (hiFreq - loFreq);
    voice(f, {
      type: 'sine',
      delay: Math.random() * spread,
      attack: 0.008,
      hold: 0,
      release: 0.14 + Math.random() * 0.12,
      gain: gain * (0.5 + Math.random() * 0.5),
    });
  }
}

// ---- the building melody ----
// Every navigation advances a cursor through one pre-composed pentatonic phrase
// (Bb major pentatonic — pleasant in any order), so moving around the menu plays
// an evolving line rather than the same chord each time. Long tails let the notes
// overlap and accumulate. After a pause it resolves back to the home note.
// Suspended (thirdless) pentatonic with a b7 for edge — floats and never lands
// on a cheery major triad. Notes: F G Bb C Eb (over the Bb bed these read as a
// suspended 9/11/13, ethereal and unresolved).
const MELODY = [349.23, 392.0, 466.16, 523.25, 622.25, 523.25, 466.16, 392.0];
// F4  G4  Bb4  C5  Eb5(b7) C5  Bb4  G4
let cursor = 0;
let lastNoteAt = -10;

function nextNote() {
  const now = ctx.currentTime;
  if (now - lastNoteAt > 3.5) cursor = 0; // resolve home after a pause
  lastNoteAt = now;
  const f = MELODY[cursor];
  cursor = (cursor + 1) % MELODY.length;
  return f;
}

// ---- ambient bed (always on while sound is enabled) ----
// NOT a static drone (that read as a radiator hum). Instead a slow, drifting
// arpeggio of soft mid-register bells from the suspended scale, each with a slow
// swell + long tail so they overlap into an evolving ambient pad that MOVES
// melodically rather than sitting on one note.
// UNDULATING (not a straight climb — that felt stuck ascending and went too high)
// and centered low-mid with a modest Bb4 ceiling, so it drifts up AND down.
const BED_NOTES = [349.23, 311.13, 233.08, 261.63, 349.23, 392.0, 466.16, 392.0, 311.13, 261.63];
// F4 Eb4 Bb3 C4 F4 G4 Bb4 G4 Eb4 C4 — thirdless / suspended, ethereal
let bed = null;
function startBed() {
  if (!ctx) return;
  if (bed) stopBed(); // never stack two beds (the cause of "two tracks at once")
  const g = ctx.createGain();
  g.gain.value = 1;
  const bedCfg = theme().bed || { lp: 1700, wave: 'sine' };
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = bedCfg.lp; // theme-driven brightness of the ambient track
  lp.Q.value = 0.3;
  g.connect(lp);
  lp.connect(master);
  const state = { g, lp, timer: 0, oscs: [] };
  let i = 0;
  const step = () => {
    if (bed !== state) return; // a stale interval must never sound
    const f = BED_NOTES[i % BED_NOTES.length];
    i += 1; // step through the undulating contour so it drifts up and down
    const now = ctx.currentTime;
    [0, 6].forEach((det) => {          // a detuned pair for a glassy shimmer
      const o = ctx.createOscillator();
      o.type = bedCfg.wave;
      o.frequency.value = f;
      o.detune.value = det;
      const vg = ctx.createGain();
      vg.gain.setValueAtTime(0.0001, now);
      vg.gain.linearRampToValueAtTime(0.03, now + 1.3);       // slow swell in
      vg.gain.exponentialRampToValueAtTime(0.0001, now + 3.4); // long tail → overlaps next
      o.connect(vg);
      vg.connect(g);
      o.start(now);
      o.stop(now + 3.5);
      state.oscs.push(o);
      o.onended = () => { const k = state.oscs.indexOf(o); if (k >= 0) state.oscs.splice(k, 1); };
    });
  };
  state.timer = setInterval(step, 2100);
  bed = state;
  step();
}
function stopBed() {
  if (!bed) return;
  const b = bed;
  bed = null;
  clearInterval(b.timer);
  const t = ctx.currentTime;
  // quick fade, then HARD-STOP every live voice so the bed can't linger
  b.g.gain.cancelScheduledValues(t);
  b.g.gain.setValueAtTime(Math.max(0.0001, b.g.gain.value), t);
  b.g.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
  b.oscs.forEach((o) => { try { o.stop(t + 0.28); } catch (e) { /* already stopped */ } });
  setTimeout(() => { try { b.g.disconnect(); b.lp.disconnect(); } catch (e) { /* ignore */ } }, 400);
}

// ---- events ----

function boot() {
  if (!enabled || !ensureContext()) return;
  resume();
  // suspended bloom: Bb + sus4(Eb) + no third, slow swell, long tail — ethereal,
  // not triumphant. Detuned twins on the upper voices for a glassy shimmer.
  const chord = [116.54, 174.61, 261.63, 311.13, 349.23, 466.16]; // Bb2 F3 C4 Eb4 F4 Bb4
  chord.forEach((f, i) => {
    voice(f, { type: i < 2 ? 'triangle' : 'sine', attack: 0.8 - i * 0.05, hold: 0.3, release: 1.9, gain: 0.11 });
    if (i >= 3) voice(f, { type: 'sine', detune: 7, attack: 0.85, hold: 0.25, release: 1.8, gain: 0.045 });
  });
  // soft, lower shimmer as it blooms (not the bright top-end sparkle)
  sparkle(10, 1.1, 950, 2000, 0.02);
}

let lastAim = 0;
// aim: play the next melody note over the bed (with a soft octave-down body)
function aim() {
  if (!enabled || !ensureContext()) return;
  resume();
  const now = ctx.currentTime;
  if (now - lastAim < 0.05) return; // debounce rapid arrow/hover spam
  lastAim = now;
  const f = nextNote();
  bell(f, { type: 'sine', attack: 0.05, hold: 0.04, release: 0.9, gain: 0.1 });
  voice(f / 2, { type: 'sine', attack: 0.06, hold: 0.04, release: 0.75, gain: 0.04 });
}

// tick: lighter, an octave up — advances the phrase too so roving a list builds it
function tick() {
  if (!enabled || !ensureContext()) return;
  resume();
  const f = nextNote();
  bell(f * 2, { type: 'sine', attack: 0.02, hold: 0.01, release: 0.45, gain: 0.045 });
}

// open: the current note as an arrival — adds the suspended fourth above + shimmer
function open() {
  if (!enabled || !ensureContext()) return;
  resume();
  const f = nextNote();
  bell(f, { type: 'sine', attack: 0.04, hold: 0.06, release: 1.1, gain: 0.11, glide: 1.005 });
  voice(f * 4 / 3, { type: 'sine', delay: 0.03, attack: 0.05, hold: 0.05, release: 0.95, gain: 0.055 }); // sus 4th, not the bright 5th
  sparkle(5, 0.14, 900, 1900, 0.016);
}

// back: the current note an octave down, gliding down — darker, a "step out"
function back() {
  if (!enabled || !ensureContext()) return;
  resume();
  const f = nextNote();
  bell(f / 2, { type: 'triangle', attack: 0.03, hold: 0.03, release: 0.75, gain: 0.1, glide: 0.96 });
}

// ---- mute state ----

function isEnabled() { return enabled; }

function setEnabled(next) {
  enabled = next;
  try { localStorage.setItem(LS_KEY, next ? '1' : '0'); } catch (e) { /* ignore */ }
  listeners.forEach((fn) => fn(enabled));
  if (next) {
    ensureContext();
    resume();
    if (master) master.gain.setTargetAtTime(MASTER_VOL, ctx.currentTime, 0.05); // restore level
    boot();       // confirm with the startup bloom
    startBed();   // bring up the ambient foundation
  } else {
    stopBed();
    if (master) master.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.06); // silence anything in flight
  }
}

function toggle() { setEnabled(!enabled); }

// ---- sound font / theme ----

function getTheme() { return themeId; }

function setTheme(id) {
  if (!THEMES[id]) return;
  themeId = id;
  try { localStorage.setItem('gx-sound-theme', id); } catch (e) { /* ignore */ }
  if (ctx && lp) lp.frequency.setTargetAtTime(theme().lp, ctx.currentTime, 0.05);
  if (ctx && wetGain) wetGain.gain.setTargetAtTime(theme().wet, ctx.currentTime, 0.05);
  listeners.forEach((fn) => fn(enabled));
  // make sure the change is audible: enable if needed and play a preview note
  if (!enabled) { setEnabled(true); } // setEnabled(true) also (re)starts the bed
  else {
    ensureContext();
    resume();
    if (bed) startBed(); // swap the ambient track to the new font's character
    open();
  }
}

function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }

// The click-to-start gate calls this on the visitor's first gesture (which also
// satisfies the browser autoplay policy), so the startup bloom + bed power on in
// sync with the cube's flex. No sound if muted.
function start() {
  if (!ensureContext()) return;
  resume();
  if (enabled) { boot(); startBed(); }
}

const sfx = { boot, aim, tick, open, back, isEnabled, setEnabled, toggle, subscribe, start, getTheme, setTheme };
export default sfx;
