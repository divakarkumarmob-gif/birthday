/**
 * 3D Birthday Celebration - Web Audio Synthesizer & Sound FX Engine
 * Zero external dependencies - pure procedural audio synthesis!
 */

class BirthdayAudio {
  constructor() {
    this.ctx = null;
    this.isPlayingMusic = false;
    this.isDiscoPlaying = false;
    this.isMuted = false;
    this.musicTimeout = null;
    this.discoInterval = null;
    this.currentNoteIndex = 0;
    this.masterGain = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Note frequency helper
  getFreq(note) {
    const notes = {
      'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
      'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
      'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77,
      'C6': 1046.50
    };
    return notes[note] || 440;
  }

  // Play a bell / chime synthesizer note with harmonic overtones
  playChimeTone(freq, time, duration = 0.5, volume = 0.35) {
    if (!this.ctx || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const oscHarmonic = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    oscHarmonic.type = 'sine';

    osc.frequency.setValueAtTime(freq, time);
    oscHarmonic.frequency.setValueAtTime(freq * 2.02, time);

    gain.gain.setValueAtTime(0.001, time);
    gain.gain.exponentialRampToValueAtTime(volume, time + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(gain);
    oscHarmonic.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    oscHarmonic.start(time);
    osc.stop(time + duration);
    oscHarmonic.stop(time + duration);
  }

  // Happy Birthday Melody & Chord arrangement
  getBirthdayScore() {
    return [
      { note: 'G4', dur: 0.35, pause: 0.1, bass: 'C4' },
      { note: 'G4', dur: 0.35, pause: 0.1 },
      { note: 'A4', dur: 0.7, pause: 0.15 },
      { note: 'G4', dur: 0.7, pause: 0.15 },
      { note: 'C5', dur: 0.7, pause: 0.15, bass: 'E4' },
      { note: 'B4', dur: 1.2, pause: 0.3, bass: 'G4' },

      { note: 'G4', dur: 0.35, pause: 0.1, bass: 'G4' },
      { note: 'G4', dur: 0.35, pause: 0.1 },
      { note: 'A4', dur: 0.7, pause: 0.15 },
      { note: 'G4', dur: 0.7, pause: 0.15 },
      { note: 'D5', dur: 0.7, pause: 0.15, bass: 'F4' },
      { note: 'C5', dur: 1.2, pause: 0.3, bass: 'E4' },

      { note: 'G4', dur: 0.35, pause: 0.1, bass: 'C4' },
      { note: 'G4', dur: 0.35, pause: 0.1 },
      { note: 'G5', dur: 0.7, pause: 0.15, bass: 'C5' },
      { note: 'E5', dur: 0.7, pause: 0.15, bass: 'G4' },
      { note: 'C5', dur: 0.7, pause: 0.15, bass: 'E4' },
      { note: 'B4', dur: 0.7, pause: 0.15, bass: 'D4' },
      { note: 'A4', dur: 1.1, pause: 0.25, bass: 'C4' },

      { note: 'F5', dur: 0.35, pause: 0.1, bass: 'F4' },
      { note: 'F5', dur: 0.35, pause: 0.1 },
      { note: 'E5', dur: 0.7, pause: 0.15, bass: 'G4' },
      { note: 'C5', dur: 0.7, pause: 0.15, bass: 'E4' },
      { note: 'D5', dur: 0.7, pause: 0.15, bass: 'G4' },
      { note: 'C5', dur: 1.6, pause: 0.8, bass: 'C4' },
    ];
  }

  toggleMusic() {
    this.init();
    if (this.isPlayingMusic) {
      this.stopMusic();
      return false;
    } else {
      this.playBirthdaySong();
      return true;
    }
  }

  playBirthdaySong() {
    this.init();
    this.isPlayingMusic = true;
    const score = this.getBirthdayScore();

    const playSequence = () => {
      if (!this.isPlayingMusic) return;

      const now = this.ctx.currentTime + 0.05;
      let accumTime = 0;

      for (let i = 0; i < score.length; i++) {
        const item = score[i];
        const noteTime = now + accumTime;
        
        this.playChimeTone(this.getFreq(item.note), noteTime, item.dur * 1.5, 0.4);

        if (item.bass) {
          this.playChimeTone(this.getFreq(item.bass) / 2, noteTime, item.dur * 2.2, 0.25);
        }

        accumTime += item.dur + item.pause;
      }

      this.musicTimeout = setTimeout(() => {
        if (this.isPlayingMusic) {
          playSequence();
        }
      }, accumTime * 1000);
    };

    playSequence();
  }

  stopMusic() {
    this.isPlayingMusic = false;
    if (this.musicTimeout) {
      clearTimeout(this.musicTimeout);
      this.musicTimeout = null;
    }
  }

  // Disco Party Groove Synth
  toggleDiscoBeat(enable) {
    this.init();
    if (!enable) {
      this.isDiscoPlaying = false;
      if (this.discoInterval) clearInterval(this.discoInterval);
      return;
    }

    this.isDiscoPlaying = true;
    let step = 0;
    const bassline = ['C3', 'C3', 'Eb3', 'F3', 'G3', 'G3', 'Bb3', 'G3'];
    const chordChimes = [
      ['C4', 'E4', 'G4'],
      ['C4', 'E4', 'G4'],
      ['Eb4', 'G4', 'Bb4'],
      ['F4', 'A4', 'C5'],
      ['G4', 'B4', 'D5'],
      ['G4', 'B4', 'D5'],
      ['Bb4', 'D5', 'F5'],
      ['G4', 'B4', 'D5']
    ];

    const playBeat = () => {
      if (!this.isDiscoPlaying || !this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const now = this.ctx.currentTime;

      // 4-on-the-floor Punchy Kick
      const kickOsc = this.ctx.createOscillator();
      const kickGain = this.ctx.createGain();
      kickOsc.frequency.setValueAtTime(160, now);
      kickOsc.frequency.exponentialRampToValueAtTime(35, now + 0.14);
      kickGain.gain.setValueAtTime(0.8, now);
      kickGain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);
      kickOsc.connect(kickGain);
      kickGain.connect(this.masterGain);
      kickOsc.start(now);
      kickOsc.stop(now + 0.14);

      // Hi-hat on off-beats
      if (step % 2 === 1) {
        const hatBuf = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.05, this.ctx.sampleRate);
        const data = hatBuf.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.35;
        const hat = this.ctx.createBufferSource();
        hat.buffer = hatBuf;
        const hatFilter = this.ctx.createBiquadFilter();
        hatFilter.type = 'highpass';
        hatFilter.frequency.value = 6500;
        hat.connect(hatFilter);
        hatFilter.connect(this.masterGain);
        hat.start(now);
      }

      // Funky Bass synth
      const bassNote = bassline[step % bassline.length];
      const bassFreq = this.getFreq(bassNote);
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassOsc.type = 'sawtooth';
      bassOsc.frequency.setValueAtTime(bassFreq, now);
      bassGain.gain.setValueAtTime(0.35, now);
      bassGain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
      bassOsc.connect(bassGain);
      bassGain.connect(this.masterGain);
      bassOsc.start(now);
      bassOsc.stop(now + 0.22);

      // Disco synth chord stabs on off-beats (step 2 & 6)
      if (step % 4 === 2) {
        const chord = chordChimes[step % chordChimes.length];
        chord.forEach(n => {
          this.playChimeTone(this.getFreq(n), now, 0.2, 0.2);
        });
      }

      step++;
    };

    if (this.discoInterval) clearInterval(this.discoInterval);
    playBeat();
    this.discoInterval = setInterval(playBeat, 240);
  }

  // FX: Balloon Pop Sound
  playBalloonPop() {
    this.init();
    if (this.isMuted) return;

    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.06;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.Q.setValueAtTime(3.0, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.08);

    oscGain.gain.setValueAtTime(0.5, now);
    oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.connect(oscGain);
    oscGain.connect(this.masterGain);

    whiteNoise.start(now);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  // FX: Firework Launch & Burst
  playFirework() {
    this.init();
    if (this.isMuted) return;

    const now = this.ctx.currentTime;

    const whoosh = this.ctx.createOscillator();
    const whooshGain = this.ctx.createGain();
    whoosh.type = 'sine';
    whoosh.frequency.setValueAtTime(300, now);
    whoosh.frequency.exponentialRampToValueAtTime(1400, now + 0.25);

    whooshGain.gain.setValueAtTime(0.15, now);
    whooshGain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    whoosh.connect(whooshGain);
    whooshGain.connect(this.masterGain);
    whoosh.start(now);
    whoosh.stop(now + 0.25);

    const boomTime = now + 0.26;
    const boomOsc = this.ctx.createOscillator();
    const boomGain = this.ctx.createGain();
    boomOsc.type = 'triangle';
    boomOsc.frequency.setValueAtTime(120, boomTime);
    boomOsc.frequency.exponentialRampToValueAtTime(25, boomTime + 0.6);

    boomGain.gain.setValueAtTime(0.8, boomTime);
    boomGain.gain.exponentialRampToValueAtTime(0.001, boomTime + 0.7);

    boomOsc.connect(boomGain);
    boomGain.connect(this.masterGain);
    boomOsc.start(boomTime);
    boomOsc.stop(boomTime + 0.7);

    for (let i = 0; i < 6; i++) {
      const crackleTime = boomTime + 0.1 + Math.random() * 0.4;
      const crackleFreq = 1800 + Math.random() * 1600;
      this.playChimeTone(crackleFreq, crackleTime, 0.08, 0.15);
    }
  }

  // FX: Sparkler Crackle
  playSparklerCrackle() {
    this.init();
    if (this.isMuted) return;
    const now = this.ctx.currentTime;
    for (let i = 0; i < 3; i++) {
      this.playChimeTone(2400 + Math.random() * 2000, now + i * 0.03, 0.04, 0.12);
    }
  }

  // FX: Cake Knife Slice
  playSliceSound() {
    this.init();
    if (this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.35);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.35);

    this.playChimeTone(1046.5, now + 0.15, 0.6, 0.3);
  }

  // FX: Arcade Combo Reward
  playComboBonus(combo = 1) {
    this.init();
    if (this.isMuted) return;
    const baseFreq = 523.25; // C5
    const multiplier = Math.min(2.5, 1 + combo * 0.15);
    this.playChimeTone(baseFreq * multiplier, this.ctx.currentTime, 0.3, 0.35);
  }

  // FX: Game Over Fanfare
  playGameOverFanfare() {
    this.init();
    if (this.isMuted) return;
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((f, idx) => {
      this.playChimeTone(f, now + idx * 0.15, 0.5, 0.4);
    });
  }

  // FX: Sky Lantern Release
  playLanternRelease() {
    this.init();
    if (this.isMuted) return;
    const now = this.ctx.currentTime;
    this.playChimeTone(440, now, 1.2, 0.3);
    this.playChimeTone(659.25, now + 0.2, 1.4, 0.25);
  }

  // FX: Gift Box Open Fanfare
  playGiftOpen() {
    this.init();
    if (this.isMuted) return;
    const now = this.ctx.currentTime;
    const arpeggio = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
    arpeggio.forEach((freq, idx) => {
      this.playChimeTone(freq, now + idx * 0.07, 0.6, 0.35);
    });
  }

  // FX: Candle Puff / Blow Out
  playCandleBlow() {
    this.init();
    if (this.isMuted) return;
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1);
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, now);
    filter.frequency.linearRampToValueAtTime(200, now + 0.4);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.4, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(now);
  }

  // FX: Party Horn Buzzer
  playPartyHorn() {
    this.init();
    if (this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.linearRampToValueAtTime(460, now + 0.15);
    osc.frequency.linearRampToValueAtTime(390, now + 0.4);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.45);
  }
}

window.birthdayAudio = new BirthdayAudio();
