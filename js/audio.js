// Romantic Audio Engine using Web Audio API
// No external dependencies - works 100% offline and instantly!

class RomanticAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.musicTimer = null;
    this.currentStep = 0;
    this.bpm = 68;
    this.volume = 0.6;
    this.isMuted = false;
    this.customAudio = null;
    this.customAudioUrl = null;

    // Chord progressions in C Major (Romantic / Nostalgic Lofi feel)
    // Cmaj9 -> Am9 -> Fmaj7 -> Gsus4 -> G
    this.chords = [
      // Cmaj9: C3, G3, B3, D4, E4
      [130.81, 196.00, 246.94, 293.66, 329.63],
      // Am9: A2, E3, G3, B3, C4
      [110.00, 164.81, 196.00, 246.94, 261.63],
      // Fmaj7: F2, C3, E3, A3, C4
      [87.31, 130.81, 164.81, 220.00, 261.63],
      // G6/Gsus4: G2, D3, G3, B3, E4
      [98.00, 146.83, 196.00, 246.94, 329.63]
    ];

    this.melodyNotes = [
      // Gentle lofi melody arpeggio frequencies (Hz)
      523.25, 587.33, 659.25, 783.99, 880.00, 987.77, 1046.50
    ];

    this.onProgressUpdate = null;
    this.currentTime = 0;
    this.totalDuration = 214; // simulated 3:34 length song
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Soft keypad click
  playKeyClick(freq = 600) {
    try {
      this.init();
      if (!this.ctx || this.isMuted) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.12 * this.volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {
      console.warn('Audio error:', e);
    }
  }

  // Soft gentle boop for passcode error
  playErrorBeep() {
    try {
      this.init();
      if (!this.ctx || this.isMuted) return;

      const now = this.ctx.currentTime;
      [220, 196].forEach((f, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = f;

        gain.gain.setValueAtTime(0.15 * this.volume, now + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.1);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.1);
      });
    } catch (e) {}
  }

  // Celebratory sweet chime for unlocked secret code
  playSuccessChime() {
    try {
      this.init();
      if (!this.ctx || this.isMuted) return;

      // C major arpeggio: C4, E4, G4, C5, E5, G5
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99];
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);

        gain.gain.setValueAtTime(0.2 * this.volume, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.6);
      });
    } catch (e) {}
  }

  // Cute bubble pop sound for tapping items / petals / gifts
  playPop() {
    try {
      this.init();
      if (!this.ctx || this.isMuted) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(850, this.ctx.currentTime + 0.07);

      gain.gain.setValueAtTime(0.18 * this.volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {}
  }

  // Magical sparkle sound for opening gift boxes
  playUnwrapSparkle() {
    try {
      this.init();
      if (!this.ctx || this.isMuted) return;

      const now = this.ctx.currentTime;
      const sparkleFreqs = [523, 659, 783, 1046, 1318, 1567, 2093];

      sparkleFreqs.forEach((f, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + idx * 0.06);

        gain.gain.setValueAtTime(0.15 * this.volume, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.35);
      });
    } catch (e) {}
  }

  // Synthesize background chord progression
  playWarmChord(freqs, duration) {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    freqs.forEach(freq => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // Soft electric piano / warm rhodes feel
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      // Lowpass filter to give warm cozy lofi warmth
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1100, now);

      // ADSR envelope
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.07 * this.volume, now + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    });

    // Gentle high octave sparkle note
    if (Math.random() > 0.3) {
      const melodyFreq = this.melodyNotes[Math.floor(Math.random() * this.melodyNotes.length)];
      const bellOsc = this.ctx.createOscillator();
      const bellGain = this.ctx.createGain();

      bellOsc.type = 'sine';
      bellOsc.frequency.setValueAtTime(melodyFreq, now + 0.5);

      bellGain.gain.setValueAtTime(0.001, now + 0.5);
      bellGain.gain.linearRampToValueAtTime(0.04 * this.volume, now + 0.7);
      bellGain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

      bellOsc.connect(bellGain);
      bellGain.connect(this.ctx.destination);

      bellOsc.start(now + 0.5);
      bellOsc.stop(now + 2.0);
    }
  }

  // Toggle Background Music
  toggleMusic() {
    this.init();
    if (this.isPlaying) {
      this.pauseMusic();
      return false;
    } else {
      this.startMusic();
      return true;
    }
  }

  startMusic() {
    this.init();
    if (this.isPlaying) return;

    if (this.customAudio) {
      this.customAudio.play().then(() => {
        this.isPlaying = true;
      }).catch(e => console.warn(e));
      return;
    }

    this.isPlaying = true;
    const beatDuration = (60 / this.bpm) * 4; // 1 measure in seconds

    const step = () => {
      if (!this.isPlaying) return;

      const chord = this.chords[this.currentStep % this.chords.length];
      this.playWarmChord(chord, beatDuration * 0.95);

      this.currentStep++;
      this.currentTime = (this.currentTime + Math.floor(beatDuration)) % this.totalDuration;
      if (this.onProgressUpdate) {
        this.onProgressUpdate(this.currentTime, this.totalDuration);
      }

      this.musicTimer = setTimeout(step, beatDuration * 1000);
    };

    step();
  }

  pauseMusic() {
    this.isPlaying = false;
    if (this.musicTimer) {
      clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
    if (this.customAudio) {
      this.customAudio.pause();
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.customAudio) {
      this.customAudio.volume = this.volume;
    }
  }

  loadCustomAudio(file) {
    if (this.customAudio) {
      this.customAudio.pause();
      if (this.customAudioUrl) {
        URL.revokeObjectURL(this.customAudioUrl);
      }
    }
    this.customAudioUrl = URL.createObjectURL(file);
    this.customAudio = new Audio(this.customAudioUrl);
    this.customAudio.volume = this.volume;
    this.customAudio.loop = true;

    this.customAudio.ontimeupdate = () => {
      if (this.onProgressUpdate && this.customAudio.duration) {
        this.onProgressUpdate(
          Math.floor(this.customAudio.currentTime),
          Math.floor(this.customAudio.duration)
        );
      }
    };
  }
}

// Global audio instance
window.romanticAudio = new RomanticAudioEngine();
