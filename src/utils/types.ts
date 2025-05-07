export type settingsType = {
    duration: number, 
    maxCycles: number,
    soundEnabled: boolean, 
    pulseEnabled: boolean,
    instrument: string,
    volume: number
} 

export type Arc = {
    color: string,
    velocity: number,
    lastImpactTime: number,
    nextImpactTime: number,
}