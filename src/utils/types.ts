export type settingsType = {
    duration: number, 
    maxCycles: number,
    soundEnabled: boolean, 
    pulseEnabled: boolean,
    instrument: string,
    volume: number,
    usingUploadedAudio: boolean
} 

export type Arc = {
    color: string,
    velocity: number,
    lastImpactTime: number,
    nextImpactTime: number,
}