import 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
    fgStrong: string,
    fgMid: string,
    fgWeak: string,
    bg: string,
    bgDilute: string,
    accent: string,
    green: string,
    yellow: string,
    red: string
  }
}
