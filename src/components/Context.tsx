/* eslint-disable @typescript-eslint/ban-types */
import React, { useState, useEffect, createContext, memo } from 'react'
import { DefaultTheme, ThemeProvider } from 'styled-components'

import themes from '../Themes.json'
import data from '../Language.json'

export const Settings = createContext<Settings | null>(null)

const Context = ({ children }: ContextProps): JSX.Element => {
  const lastTheme = window.localStorage.getItem('Theme') as ThemeType
  const lastLang = window.localStorage.getItem('Language') as LangType

  const [theme, setTheme] = useState<ThemeType>(lastTheme ?? 'Light')
  const [lang, setLang] = useState<LangType>(lastLang ?? 'en')

  useEffect(() => window.localStorage.setItem('Theme', theme), [theme])
  useEffect(() => window.localStorage.setItem('Language', lang), [lang])

  function localize (key: string): string {
    const local = (data as LangData)[key]
    return local ? local[lang] : key
  }

  return (
    <Settings.Provider value={{ theme, setTheme, lang, setLang, localize }}>
      <ThemeProvider theme={(themes as Theme)[theme]}>{children}</ThemeProvider>
    </Settings.Provider>
  )
}

export default memo(Context)

type ThemeType = 'Light' | 'Dark'
type LangType = 'en' | 'id'

interface Theme {
  Light: DefaultTheme,
  Dark: DefaultTheme
}

interface LangData {
  [key: string]: {
    en: string,
    id: string
  }
}

interface ContextProps {
  children: React.ReactNode
}

interface Settings {
  theme: string,
  lang: string,
  setTheme: React.Dispatch<React.SetStateAction<ThemeType>>,
  setLang: React.Dispatch<React.SetStateAction<LangType>>,
  localize: Function
}
