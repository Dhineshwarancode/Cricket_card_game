class SoundManager {
  constructor() {
    this.sounds = {};
    this.isMuted = false;
    this.volume = 0.3;
    this.audioContext = null;
    this.initializeSounds();
  }

  async initializeSounds() {
    try {
      // Initialize audio context on first user interaction
      this.audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();

      // Pre-generate sound patterns
      this.soundPatterns = {
        packOpen: { frequency: 200, duration: 0.5, type: "sawtooth" },
        cardFlip: { frequency: 800, duration: 0.15, type: "square" },
        rareCard: { frequency: [400, 600, 800], duration: 1.5, type: "sine" },
        coin: { frequency: 1000, duration: 0.2, type: "triangle" },
        ui: { frequency: 600, duration: 0.1, type: "sine" },
      };
    } catch (error) {
      console.warn("Audio context initialization failed:", error);
    }
  }

  async ensureAudioContext() {
    if (!this.audioContext) {
      await this.initializeSounds();
    }

    if (this.audioContext && this.audioContext.state === "suspended") {
      try {
        await this.audioContext.resume();
      } catch (error) {
        console.warn("Failed to resume audio context:", error);
      }
    }
  }

  async playSound(soundType) {
    if (this.isMuted) return;

    try {
      await this.ensureAudioContext();

      if (!this.audioContext || !this.soundPatterns) return;

      const pattern = this.soundPatterns[soundType];
      if (!pattern) return;

      if (Array.isArray(pattern.frequency)) {
        // Play chord for rare cards
        pattern.frequency.forEach((freq, index) => {
          setTimeout(
            () => this.createTone(freq, pattern.duration / 3, pattern.type),
            index * 150
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

    try {
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
    } catch (error) {
      console.warn("Tone creation failed:", error);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
  }
}

export const soundManager = new SoundManager();

// Initialize audio context on first user interaction
document.addEventListener(
  "click",
  () => {
    soundManager.ensureAudioContext();
  },
  { once: true }
);
