// Procedural Web Audio Engine for thissoftwarestore
// Handles Desert Wind, Sandstorm Roar, Silicon Fusion Hum, Per-Product Soundscapes, and Tactile UI Foley

export type SoundscapeType = 'desert-breeze' | 'night-breeze' | 'keyboard-rhodes' | 'headphones-spatial' | 'hoodie-lofi' | 'monolith-drone' | 'silent';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private productGain: GainNode | null = null;
  private isMuted: boolean = false;
  private isInitialized: boolean = false;
  private currentProductInterval: number | null = null;
  private windFilter: BiquadFilterNode | null = null;
  private windGain: GainNode | null = null;

  public init() {
    if (this.isInitialized && this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return;
    }

    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    this.ctx = new AudioCtx();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = this.isMuted ? 0 : 0.7;
    this.masterGain.connect(this.ctx.destination);

    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.value = 0.28;
    this.ambientGain.connect(this.masterGain);

    this.productGain = this.ctx.createGain();
    this.productGain.gain.value = 0;
    this.productGain.connect(this.masterGain);

    this.startContinuousDesertBreeze();
    this.isInitialized = true;
  }

  private startContinuousDesertBreeze() {
    if (!this.ctx || !this.ambientGain) return;

    // Generate 4-second looping pink/brown noise buffer for organic desert wind
    const bufferSize = this.ctx.sampleRate * 4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 1.8; // Boost brown noise warmth
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    this.windFilter = this.ctx.createBiquadFilter();
    this.windFilter.type = 'bandpass';
    this.windFilter.frequency.value = 280;
    this.windFilter.Q.value = 1.6;

    this.windGain = this.ctx.createGain();
    this.windGain.gain.value = 0.35;

    noise.connect(this.windFilter);
    this.windFilter.connect(this.windGain);
    this.windGain.connect(this.ambientGain);
    noise.start();
  }

  // Triggered when user taps [ ENTER ] — unleashes the sandstorm whoosh
  public playSandstormSweep() {
    this.init();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime;

    // 1. Modulate the wind filter to roar like a passing sandstorm
    if (this.windFilter && this.windGain) {
      this.windFilter.frequency.cancelScheduledValues(now);
      this.windGain.gain.cancelScheduledValues(now);

      this.windFilter.frequency.setValueAtTime(280, now);
      this.windFilter.frequency.exponentialRampToValueAtTime(950, now + 0.75);
      this.windFilter.frequency.exponentialRampToValueAtTime(220, now + 2.4);

      this.windGain.gain.setValueAtTime(0.35, now);
      this.windGain.gain.linearRampToValueAtTime(0.95, now + 0.7);
      this.windGain.gain.linearRampToValueAtTime(0.25, now + 2.4);
    }

    // 2. Warm Dune sub-bass horizon swell
    const osc = this.ctx.createOscillator();
    const swellGain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(65.41, now); // C2 deep desert fundamental
    osc.frequency.exponentialRampToValueAtTime(98.0, now + 1.4); // G2

    swellGain.gain.setValueAtTime(0.001, now);
    swellGain.gain.linearRampToValueAtTime(0.25, now + 0.6);
    swellGain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

    osc.connect(swellGain);
    swellGain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 2.6);
  }

  // Updates wind character based on scroll depth (0 = sun, 0.5 = night breeze, 0.8 = chip fusion, 1 = clean store)
  public setDesertAtmosphere(scrollProgress: number, inStoreOnly: boolean) {
    if (!this.ctx || !this.windFilter || !this.windGain) return;
    const now = this.ctx.currentTime;

    if (inStoreOnly || scrollProgress > 0.92) {
      // Quiet down the desert wind once inside the clean storefront
      this.windGain.gain.setTargetAtTime(0.04, now, 0.3);
      this.windFilter.frequency.setTargetAtTime(190, now, 0.3);
    } else if (scrollProgress > 0.35 && scrollProgress <= 0.75) {
      // Night Desert Breeze — cooler, slightly higher whistling resonance
      this.windGain.gain.setTargetAtTime(0.38, now, 0.25);
      this.windFilter.frequency.setTargetAtTime(420, now, 0.25);
    } else {
      // Hot Desert Sun — deep warm thermal breeze
      this.windGain.gain.setTargetAtTime(0.26, now, 0.25);
      this.windFilter.frequency.setTargetAtTime(260, now, 0.25);
    }
  }

  // Tactile mechanical button / swatch click
  public playClick(pitch: number = 1) {
    this.init();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const clickGain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520 * pitch, now);
    osc.frequency.exponentialRampToValueAtTime(110 * pitch, now + 0.045);

    clickGain.gain.setValueAtTime(0.18, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

    osc.connect(clickGain);
    clickGain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  // Warm harmonic chord when adding an item to the bag
  public playAddToBagChord() {
    this.init();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const notes = [261.63, 329.63, 392.00, 493.88]; // Cmaj7 warm chord
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);

      gain.gain.setValueAtTime(0.001, now + idx * 0.04);
      gain.gain.linearRampToValueAtTime(0.1, now + idx * 0.04 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + idx * 0.04 + 0.9);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now + idx * 0.04);
      osc.stop(now + idx * 0.04 + 0.95);
    });
  }

  // Starts a unique generative musical loop when entering a Product Spotlight page
  public startProductMusic(style: SoundscapeType) {
    this.init();
    this.stopProductMusic();
    if (!this.ctx || !this.productGain) return;

    const now = this.ctx.currentTime;
    this.productGain.gain.cancelScheduledValues(now);
    this.productGain.gain.setValueAtTime(0.01, now);
    this.productGain.gain.linearRampToValueAtTime(0.32, now + 0.6);

    // Musical scales for each product vibe
    const scales: Record<string, number[]> = {
      'keyboard-rhodes': [220.0, 261.63, 329.63, 392.0, 440.0, 523.25],     // Warm Am9 Rhodes
      'headphones-spatial': [196.0, 246.94, 293.66, 369.99, 440.0, 587.33], // Spatial Gmaj9
      'hoodie-lofi': [174.61, 220.0, 261.63, 311.13, 349.23, 440.0],        // Deep Fmin7 Desert Lo-Fi
      'monolith-drone': [146.83, 220.0, 293.66, 329.63, 440.0]              // D5 Oasis Ambient
    };

    const notes = scales[style] || scales['keyboard-rhodes'];
    let step = 0;

    const triggerNote = () => {
      if (!this.ctx || !this.productGain || this.isMuted) return;
      const t = this.ctx.currentTime;
      const freq = notes[step % notes.length];
      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = style === 'headphones-spatial' ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, t);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(style === 'hoodie-lofi' ? 650 : 1200, t);

      noteGain.gain.setValueAtTime(0.001, t);
      noteGain.gain.linearRampToValueAtTime(0.22, t + 0.15);
      noteGain.gain.exponentialRampToValueAtTime(0.001, t + 1.8);

      osc.connect(filter);
      filter.connect(noteGain);
      noteGain.connect(this.productGain);

      osc.start(t);
      osc.stop(t + 1.9);
      step++;
    };

    triggerNote();
    this.currentProductInterval = window.setInterval(triggerNote, 1150);
  }

  public stopProductMusic() {
    if (this.currentProductInterval) {
      clearInterval(this.currentProductInterval);
      this.currentProductInterval = null;
    }
    if (this.ctx && this.productGain) {
      const now = this.ctx.currentTime;
      this.productGain.gain.cancelScheduledValues(now);
      this.productGain.gain.setTargetAtTime(0.0001, now, 0.2);
    }
  }

  public toggleMute(): boolean {
    this.init();
    this.isMuted = !this.isMuted;
    if (this.ctx && this.masterGain) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.7, this.ctx.currentTime, 0.1);
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }
}

export const soundEngine = new SoundEngine();

