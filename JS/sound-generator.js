// === RANDOM SOUND GENERATOR SYSTEM ===
// Works best when included after a user gesture (like click/touch)

// Lazy init for AudioContext (mobile safe)
function getAudioContext() {
  if (!window.audioContext) {
    window.audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return window.audioContext;
}

document.addEventListener("pointerdown", () => {
  const ctx = getAudioContext();
  if (ctx.state === "suspended") {
    ctx.resume().then(() => {
      console.log("AudioContext resumed via pointerdown");
    });
  }
}, { once: true });

let lastScreechTime = 0;
const screechCooldown = 100; // ms

class RandomSynth {
  constructor(ctx) {
    this.ctx = ctx;
    this.isRunning = true;
    this.run();
  }

  run() {
    const loop = () => {
      if (!this.isRunning) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const pan = this.ctx.createStereoPanner();

      osc.type = this.randomWaveform();
      osc.frequency.value = this.randomFrequency();

      const duration = this.randomDuration();
      const attack = 0.005;
      const release = 0.08;

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.2, now + attack);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration - release);

      pan.pan.value = Math.random() * 2 - 1;

      osc.connect(gain).connect(pan).connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + duration);

      const nextDelay = this.randomInterval();
      setTimeout(loop, nextDelay);
    };

    loop();
  }

  stop() {
    this.isRunning = false;
  }

  randomWaveform() {
    const types = ["sine", "square", "sawtooth", "triangle"];
    return types[Math.floor(Math.random() * types.length)];
  }

  randomFrequency() {
    return Math.pow(2, Math.random() * 5 + 5); // ~100–1500Hz
  }

  randomDuration() {
    return 0.1 + Math.random() * 0.4;
  }

  randomInterval() {
    return 200 + Math.random() * 1800;
  }
}

// === Setup: Start synths after first user interaction ===
window.addEventListener(
  "pointerdown",
  () => {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume();

    if (!window.synthEngines || window.synthEngines.length === 0) {
      const numGenerators = Math.floor(Math.random() * 3) + 4;
      window.synthEngines = [];

      for (let i = 0; i < numGenerators; i++) {
        const synth = new RandomSynth(ctx);
        window.synthEngines.push(synth);
      }

      console.log(`Started ${numGenerators} random synth engines`);
    }
  },
  { once: true }
);

let interactionCount = 0;

function spawnExtraOscillator() {
  const ctx = getAudioContext();
  const freq = Math.random() * 1000 + 100;
  const waveform = ["sine", "square", "triangle", "sawtooth"][Math.floor(Math.random() * 4)];
  const dur = Math.random() * 0.4 + 0.05;
  const detune = (Math.random() - 0.5) * 100;
  const pan = (Math.random() - 0.5) * 2;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const panner = new StereoPannerNode(ctx, { pan });

  osc.type = waveform;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  osc.detune.setValueAtTime(detune, ctx.currentTime);

  gain.gain.setValueAtTime(0.1, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);

  osc.connect(gain).connect(panner).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + dur);
}

function createScreechSound() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  const bufferSize = ctx.sampleRate * 0.02;
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;
  noise.loop = true;

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.8, now);

  const osc = ctx.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(Math.random() * 80 + 80, now);

  const oscGain = ctx.createGain();
  oscGain.gain.setValueAtTime(0.5, now);

  const highOsc = ctx.createOscillator();
  highOsc.type = "triangle";
  highOsc.frequency.setValueAtTime(6000 + Math.random() * 2000, now);

  const highGain = ctx.createGain();
  highGain.gain.setValueAtTime(0.03, now);

  const distortion = ctx.createWaveShaper();
  distortion.curve = makeDistortionCurve(600);
  distortion.oversample = "4x";

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(300, now);
  filter.Q.setValueAtTime(10, now);
  filter.frequency.linearRampToValueAtTime(8000, now + 0.7);

  const highShelf = ctx.createBiquadFilter();
  highShelf.type = "highshelf";
  highShelf.frequency.setValueAtTime(5000, now);
  highShelf.gain.setValueAtTime(6, now);

  const delay = ctx.createDelay();
  delay.delayTime.setValueAtTime(0.03, now);

  const feedbackGain = ctx.createGain();
  feedbackGain.gain.setValueAtTime(0.8, now);

  delay.connect(feedbackGain);
  feedbackGain.connect(delay);

  const finalGain = ctx.createGain();
  finalGain.gain.setValueAtTime(0.25, now);
  finalGain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);

  noise.connect(noiseGain).connect(filter);
  osc.connect(oscGain).connect(filter);
  highOsc.connect(highGain).connect(filter);

  filter.connect(distortion).connect(delay).connect(highShelf).connect(finalGain).connect(ctx.destination);

  noise.start(now);
  osc.start(now);
  highOsc.start(now);

  noise.stop(now + 1.0);
  osc.stop(now + 1.0);
  highOsc.stop(now + 3.0);
}

function makeDistortionCurve(amount) {
  const k = typeof amount === "number" ? amount : 50;
  const n_samples = 44100;
  const curve = new Float32Array(n_samples);
  const deg = Math.PI / 180;

  for (let i = 0; i < n_samples; ++i) {
    const x = (i * 2) / n_samples - 1;
    curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
  }
  return curve;
}

let isDragging = false;

window.addEventListener("mousedown", () => {
  isDragging = true;
});
window.addEventListener("mouseup", () => {
  isDragging = false;
});
window.addEventListener("mousemove", () => {
  if (isDragging && performance.now() - lastScreechTime > screechCooldown) {
    createScreechSound();
    lastScreechTime = performance.now();
  }
});
window.addEventListener("touchstart", () => {
  isDragging = true;
});
window.addEventListener("touchend", () => {
  isDragging = false;
});
window.addEventListener("touchmove", () => {
  if (isDragging && performance.now() - lastScreechTime > screechCooldown) {
    createScreechSound();
    lastScreechTime = performance.now();
  }
});

function burstShapes() {
  console.log("burstShapes called - implement shape generation logic here");
}

// Unified input triggers
function handleUserTrigger() {
  const ctx = getAudioContext();
  if (ctx.state === "suspended") ctx.resume();

  spawnExtraOscillator();
  burstShapes();
  interactionCount++;
}

window.addEventListener("click", handleUserTrigger);
window.addEventListener("touchstart", handleUserTrigger);




