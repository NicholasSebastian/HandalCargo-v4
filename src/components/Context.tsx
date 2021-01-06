/* eslint-disable @typescript-eslint/ban-types */
import React, { useState, useEffect, createContext } from 'react'
import { DefaultTheme, ThemeProvider } from 'styled-components'

import data from '../Language.json'

const themes: Theme = {
  Light: {
    accent: '#028de0',
    fgStrong: '#2a445e',
    fgMid: '#70859a',
    fgWeak: '#d7dde3',
    bg: '#ffffff',
    bgDilute: '#f4f8f9',
    green: '#34b47e',
    yellow: '#f8964b',
    red: '#eb5756'
  },
  Dark: {
    accent: '',
    fgStrong: '',
    fgMid: '',
    fgWeak: '',
    bg: '',
    bgDilute: '',
    green: '#34b47e',
    yellow: '#f8964b',
    red: '#eb5756'
  }
}

export const Settings = createContext<Settings | null>(null)

const Context = ({ children }: ContextProps): JSX.Element => {
  const lastTheme = window.localStorage.getItem('Theme')
  const lastLang = window.localStorage.getItem('Language')

  const [theme, setTheme] = useState(lastTheme ?? 'Light')
  const [lang, setLang] = useState(lastLang ?? 'en')

  useEffect(() => window.localStorage.setItem('Theme', theme), [theme])
  useEffect(() => window.localStorage.setItem('Language', lang), [lang])

  function localize (text: string): string {
    return lang === 'en' ? text : data[text]
  }

  return (
    <Settings.Provider value={{ theme, setTheme, lang, setLang, localize }}>
      <ThemeProvider theme={themes[theme]}>{children}</ThemeProvider>
    </Settings.Provider>
  )
}

export default Context

interface Theme {
  [key: string]: DefaultTheme
}

interface ContextProps {
  children: React.ReactNode
}

interface Settings {
  theme: string,
  lang: string,
  setTheme: React.Dispatch<React.SetStateAction<string>>,
  setLang: React.Dispatch<React.SetStateAction<string>>,
  localize: Function
}
