// Retro 8-bit Sound Effects and BGM Synthesizer via Web Audio API
class SoundManager {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.bgmPlaying = false;
    this.bgmInterval = null;
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

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted && this.bgmPlaying) {
      this.stopBGM();
    }
    return this.muted;
  }

  playTone(freq, type = 'square', duration = 0.1, gainVal = 0.15) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Audio autoplay policy catch
    }
  }

  playStep() {
    if (this.muted) return;
    this.playTone(180 + Math.random() * 40, 'triangle', 0.05, 0.04);
  }

  playInteract() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    [300, 450, 600].forEach((f, i) => {
      setTimeout(() => this.playTone(f, 'sine', 0.12, 0.1), i * 60);
    });
  }

  playCoin() {
    if (this.muted) return;
    this.init();
    this.playTone(987.77, 'square', 0.08, 0.15);
    setTimeout(() => this.playTone(1318.51, 'square', 0.25, 0.15), 80);
  }

  playLevelUp() {
    if (this.muted) return;
    this.init();
    const notes = [330, 392, 494, 659, 784, 987];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'triangle', 0.18, 0.18);
      }, idx * 75);
    });
  }

  playHurt() {
    if (this.muted) return;
    this.playTone(120, 'sawtooth', 0.2, 0.2);
  }

  playGateLocked() {
    if (this.muted) return;
    this.init();
    this.playTone(140, 'sawtooth', 0.12, 0.2);
    setTimeout(() => this.playTone(100, 'sawtooth', 0.18, 0.2), 120);
  }

  playFanfare() {
    if (this.muted) return;
    this.init();
    const fanfareNotes = [523.25, 659.25, 783.99, 1046.50, 880.00, 1046.50];
    fanfareNotes.forEach((f, i) => {
      setTimeout(() => this.playTone(f, 'triangle', 0.22, 0.25), i * 110);
    });
  }

  toggleBGM() {
    if (this.bgmPlaying) {
      this.stopBGM();
    } else {
      this.startBGM();
    }
    return this.bgmPlaying;
  }

  startBGM() {
    if (this.muted) return;
    this.init();
    this.bgmPlaying = true;
    const melody = [
      261.63, 293.66, 329.63, 392.00,
      329.63, 392.00, 440.00, 523.25,
      440.00, 392.00, 329.63, 293.66
    ];
    let step = 0;
    this.bgmInterval = setInterval(() => {
      if (!this.bgmPlaying || this.muted) return;
      const f = melody[step % melody.length];
      this.playTone(f, 'triangle', 0.14, 0.03);
      step++;
    }, 280);
  }

  stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
}

window.soundManager = new SoundManager();
