class SoundManager {
  constructor() {
    this.sounds = {};
    this.isMuted = false;
    this.volume = 0.3;
    this.audioContext = null;
    this.isInitialized = false;
  }

  async initializeAudio() {
    if (this.isInitialized) return;

    try {
      this.audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();

      // Resume audio context if it's suspended
      if (this.audioContext.state === "suspended") {
        await this.audioContext.resume();
      }

      this.isInitialized = true;
      console.log("Audio initialized successfully");
    } catch (error) {
      console.warn("Audio initialization failed:", error);
    }
  }

  async playSound(soundType) {
    if (this.isMuted) return;

    // Initialize audio on first interaction
    if (!this.isInitialized) {
      await this.initializeAudio();
    }

    if (!this.audioContext) return;

    try {
      const patterns = {
        packOpen: { frequency: 200, duration: 0.5, type: "sawtooth" },
        cardFlip: { frequency: 800, duration: 0.15, type: "square" },
        rareCard: { frequencies: [400, 600, 800], duration: 1.5, type: "sine" },
        coin: { frequency: 1200, duration: 0.2, type: "triangle" },
        ui: { frequency: 600, duration: 0.1, type: "sine" },
      };

      const pattern = patterns[soundType];
      if (!pattern) return;

      if (pattern.frequencies) {
        // Play chord for rare cards
        pattern.frequencies.forEach((freq, index) => {
          setTimeout(
            () => this.createTone(freq, pattern.duration / 3, pattern.type),
            index * 100
          );
        });
      } else {
        this.createTone(pattern.frequency, pattern.duration, pattern.type);
      }
    } catch (error) {
      console.warn("Audio playback failed:", error);
    }
  }

  createTone(frequency, duration, type) {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(
      frequency,
      this.audioContext.currentTime
    );
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(
      this.volume,
      this.audioContext.currentTime + 0.01
    );
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      this.audioContext.currentTime + duration
    );

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    console.log("Sound muted:", this.isMuted);
    return this.isMuted;
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
  }
}

export const soundManager = new SoundManager();

// Initialize audio on first user interaction
document.addEventListener(
  "click",
  () => {
    soundManager.initializeAudio();
  },
  { once: true }
);
