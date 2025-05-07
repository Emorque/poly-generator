import { useRef } from 'react'
import './menu.css'

interface MenuInterface {
    colors: string[],
    settings: {
        duration: number, 
        maxCycles: number,
        soundEnabled: boolean, 
        pulseEnabled: boolean,
        instrument: string,
        volume: number
    },
    toggleMuted : () => void,
    updateDuration: (duration: number) => void,
    updateMaxCycles: (maxCycles: number) => void,
    togglePulse: () => void,
    updateVolume: (volume : number) => void
}

export const Menu = ({colors, settings, toggleMuted, updateDuration, updateMaxCycles, togglePulse, updateVolume} : MenuInterface) => {
    const maxCycles = useRef<HTMLInputElement>(null)


    
    return (
        <div id="menu_page">
            <button onClick={toggleMuted}>{settings.soundEnabled? "Unmuted" : "Muted"}</button>
            <input>
            </input>
        </div>
    )
}