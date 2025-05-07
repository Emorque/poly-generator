import { useEffect, useState } from 'react'
import './App.css'
import { Poly } from './poly'
import { Menu } from './menu'

function App() {
  const [muted, setMuted] = useState<boolean>(false)
  const [colors, setColors] = useState<string[]>([])
  const [settings, setSettings]  = useState<{
    duration: number, 
    maxCycles: number,
    soundEnabled: boolean, 
    pulseEnabled: boolean,
    instrument: string,
    volume: number
  }>({
    duration: 0, 
    maxCycles: 0,
    soundEnabled: false, 
    pulseEnabled: false,
    instrument: "",
    volume: 0
})

  useEffect(() => {
    console.log("colors & settings Set")
    setColors(Array(21).fill("#A6C48A"));
    setSettings(
      {
        duration: 60, // Total time for all dots to realign at the starting point
        maxCycles: Math.max(colors.length, 21), // Must be above colors.length or else...
        soundEnabled: false, // User still must interact with screen first
        pulseEnabled: true, // Pulse will only show if sound is enabled as well
        instrument: "wave", // "default" | "wave" | "vibraphone"
        volume: 0.2
    }
    )
  }, [])

  useEffect(() => {
    console.log("Component mounted");
    return () => console.log("Component unmounted");
  }, []);

  const toggleMuted = () => {
    setSettings(
      prevSettings => (
        {...prevSettings, soundEnabled: !prevSettings.soundEnabled}
      )
    )
  }

  const updateDuration = (duration: number) => {
    console.log(duration)
  }

  const updateMaxCycles = (maxCycles: number) => {
    console.log(maxCycles)
  }

  const togglePulse = () => {

  }
  
  const updateVolume = () => {

  }

  const muteVolume = () => {
    setSettings(
      prevSettings => (
        {...prevSettings, soundEnabled: false}
      )
    )
  }

  return (
    <div id='main_page'>
      <div id='background_image'></div>
      <div id='background_filter'></div>
      <Menu colors={colors} settings={settings} 
      toggleMuted={toggleMuted} 
      updateDuration={updateDuration} 
      updateMaxCycles={updateMaxCycles}
      togglePulse={togglePulse}
      updateVolume={updateVolume}
      />
      <Poly colors={colors} settings={settings} muteVolume={muteVolume}/>
    </div>
  )
}

export default App
