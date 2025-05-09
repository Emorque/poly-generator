import { useState } from 'react'
import './menu.css'
import type { settingsType } from './utils/types'
import { HexColorPicker } from "react-colorful";

interface MenuInterface {
    color: string,
    settings: settingsType,
    updateSettings : (cycles: number, color: string, duration : number, volume : number) => void,
    updateBackground : (background : string) => void,
    handleReset : () => void,
    toggleAnimation: () => void,
    paused : boolean
}

export const Menu = ({color, settings, updateSettings, updateBackground, handleReset, toggleAnimation, paused} : MenuInterface) => {
    const [menuColor, setMenuColor] = useState<string>(color) 
    const [menuMaxCycle, setMenuMaxCycle] = useState<number>(settings.maxCycles)
    const [menuDuration, setMenuDuration] = useState<number>(settings.duration)
    const [menuVolume, setMenuVolume] = useState<number>(settings.volume)
    
    const handleNewSettings = () => {
        updateSettings(menuMaxCycle, menuColor, menuDuration, menuVolume)
    }

    const verifyUpload: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        if (!event.target.files || event.target.files.length === 0) return
        const background = event.target.files[0]
        updateBackground(URL.createObjectURL(background))
    }

    return (
        <div id="menu_page">
            <h2>Customize</h2>
            <div className='slider_div'>
                <label><span>Max Cycles</span>: {menuMaxCycle}</label>
                <input
                    className='slider'
                    type='range'
                    min={21}
                    max={99}
                    step={1}
                    value={menuMaxCycle}
                    onChange={(e) => setMenuMaxCycle(parseFloat(e.target.value))}
                >
                </input>
            </div>

            <div className='slider_div'>
                <label><span>Duration</span>: {menuDuration}</label>
                <input
                    className='slider'
                    type='range'
                    min={30}
                    max={999}
                    value={menuDuration}
                    onChange={(e) => setMenuDuration(parseFloat(e.target.value))}
                >
                </input>
            </div>

            <div className='slider_div'>
                <label><span>Volume</span>: {menuVolume}</label>
                <input
                    className='slider'
                    type='range'
                    min={1}
                    max={100}
                    step={1}
                    value={menuVolume}
                    onChange={(e) => setMenuVolume(parseInt(e.target.value))}
                >
                </input>
            </div>

            <div className='slider_div'>
                <label><span>Color</span>: {menuColor}</label>
                <HexColorPicker color={menuColor} onChange={setMenuColor} />
            </div>
            
            <div className='slider_div'>
                <label><span>Upload Background</span></label>
                <input
                    type='file'
                    accept="image/*"
                    onChange={verifyUpload}
                >
                </input>
            </div>

            <p id='message'>Press <span>Shift</span> to toggle UI</p>
            <button onClick={handleNewSettings} disabled={paused}>Set Settings</button>
            <button onClick={toggleAnimation}>{paused? "Unpause" : "Pause"}</button>
            <button onClick={handleReset}>Reset to Start</button>
        </div>
    )
}