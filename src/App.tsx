import { useEffect, useReducer, useRef, useState } from 'react'
import './App.css'
import { Poly } from './poly'
import { Menu } from './menu'
import type { settingsType } from './utils/types'

function App() {
  const [colors, setColors] = useState<string[]>([])
  const [settings, setSettings]  = useState<settingsType>({
    duration: 0, 
    maxCycles: 0,
    soundEnabled: false, 
    pulseEnabled: false,
    instrument: "",
    volume: 0
  })

  const [viewUI, setViewUI] = useState<boolean>(true)
  const [menuVisible, setMenuVisible] = useState<boolean>(false)
  const [menuActive, setMenuActive] = useState<boolean>(false)

  const background_ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setColors(Array(21).fill("#FFC432"));
    setSettings(
      {
        duration: 120, // Total time for all dots to realign at the starting point
        maxCycles: Math.max(colors.length, 21), // Must be above colors.length or else...
        soundEnabled: false, // User still must interact with screen first
        pulseEnabled: true, // Pulse will only show if sound is enabled as well
        instrument: "wave", // "default" | "wave" | "vibraphone"
        volume: 100
    }
    )
  }, [])

  const toggleMenu = () => {
    setMenuActive(!menuActive)
    if (menuActive) {
      setTimeout(() => {
        setMenuVisible(false)
      }, 1000)
    }
    else {
      setMenuVisible(true)
    }
  }

  const muteVolume = () => {
    setSettings(
      prevSettings => (
        {...prevSettings, soundEnabled: false}
      )
    )
  }

  useEffect(() => {
    document.addEventListener('visibilitychange', muteVolume);
    return () => {
        document.removeEventListener('visibilitychange', muteVolume)
    }
  }, [])

  useEffect(() => {
    const updateUI = (event: { shiftKey: boolean; repeat : boolean}) => {
      if (event.repeat) return
      if (event.shiftKey){
        setViewUI(!viewUI)
      }
    }
    document.addEventListener('keydown', updateUI);
    return () => {
      document.removeEventListener('keydown', updateUI)
    }
  }, [viewUI])

  const updateSettings = (cycles: number, color: string, duration : number, volume : number) => {
    console.log(cycles, color, duration, volume)
    setSettings(
      prevSettings => (
        {...prevSettings, 
          maxCycles: Math.max(colors.length, cycles), // Must be above colors.length or else...
          duration: duration,
          volume: volume,
          soundEnabled: false
        }
      )
    )
    if (color !== colors[0]) {
      setColors(Array(21).fill(color));
      document.documentElement.style.setProperty('--userColor', color);
    }
  }

  const ui_style = {
    opacity: viewUI? 1 : 0,
    visibility: viewUI? "visible" : "hidden"
  } as React.CSSProperties

  const toggleSound = () => {
    setSettings(
      prevSettings => (
        {...prevSettings, soundEnabled: !prevSettings.soundEnabled}
      )
    )
  }

  return (
    <div id='main_page'>
      <div id='background_image' ref={background_ref}></div>
      <div id='background_filter'></div>
      <button id='mute_btn' onClick={toggleSound} style={ui_style}>
        {
          settings.soundEnabled? 
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-volume-up-fill" viewBox="0 0 16 16">
            <path d="M11.536 14.01A8.47 8.47 0 0 0 14.026 8a8.47 8.47 0 0 0-2.49-6.01l-.708.707A7.48 7.48 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303z"/>
            <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.48 5.48 0 0 1 11.025 8a5.48 5.48 0 0 1-1.61 3.89z"/>
            <path d="M8.707 11.182A4.5 4.5 0 0 0 10.025 8a4.5 4.5 0 0 0-1.318-3.182L8 5.525A3.5 3.5 0 0 1 9.025 8 3.5 3.5 0 0 1 8 10.475zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06"/>
          </svg>
          :
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-volume-mute-fill" viewBox="0 0 16 16">
            <path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06m7.137 2.096a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0"/>
          </svg>
        }
        </button>
      <div id='menu_wrapper' style={ui_style} className={menuActive? 'active_menu' : 'unactive_menu'}>
        <button id='back_btn' onClick={toggleMenu} disabled={!menuActive && menuVisible}>
          {
              menuActive?
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-caret-right-square-fill" viewBox="0 0 16 16">
                  <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm5.5 10a.5.5 0 0 0 .832.374l4.5-4a.5.5 0 0 0 0-.748l-4.5-4A.5.5 0 0 0 5.5 4z"/>
              </svg>
              :
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-caret-left-square-fill" viewBox="0 0 16 16">
                  <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm10.5 10V4a.5.5 0 0 0-.832-.374l-4.5 4a.5.5 0 0 0 0 .748l4.5 4A.5.5 0 0 0 10.5 12"/>
              </svg>
          }
        </button>
        {menuVisible && 
          <Menu color={colors[0]} settings={settings} 
          updateSettings={updateSettings}
          />
        }
      </div>
      <Poly colors={colors} settings={settings}/>
    </div>
  )
}

export default App
