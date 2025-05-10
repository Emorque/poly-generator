import * as Tone from "tone";

class AudioManager {
    context: AudioContext;
    buffers: Map<string, AudioBuffer> = new Map();
  
    constructor() {
      this.context = new AudioContext();
    }
  
    async load(id: string, url: string): Promise<void> {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
      this.buffers.set(id, audioBuffer);
    }
  
    async loadAll(files: { id: string; url: string }[]) {
      await Promise.all(files.map(f => this.load(f.id, f.url)));
    }
  
    play(id: string, volume: number) {
      const buffer = this.buffers.get(id);
      if (!buffer) throw new Error(`Audio "${id}" not loaded.`);
      const source = this.context.createBufferSource();
      source.buffer = buffer;
      const gainNode = this.context.createGain()
      gainNode.gain.value = volume
      source.connect(gainNode)
      gainNode.connect(this.context.destination)
      source.start(0);
    }

    async pitchUp(id: string, volume: number, audioURL: string) {
      const gainNode = new Tone.Gain(volume).toDestination();

      const player = new Tone.GrainPlayer({
        url: audioURL,
        playbackRate: 1,
        detune: parseFloat(id)*100, 
        grainSize: 0.2, 
        overlap: 0.1,         
        loop: false         
      }).connect(gainNode)
      await Tone.loaded();

      player.start();
    }
  
    resumeContext() {
      if (this.context.state === "suspended") {
        this.context.resume();
      }
    }
  }
  
  export const audioManager = new AudioManager();
  