import { createGlobalStyle } from 'styled-components'
import Montserrat from '../assets/fonts/Montserrat.ttf'

const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'Montserrat';
    src: url(${Montserrat}) format('truetype');
  }

  * {
    font-family: 'Montserrat';
    box-sizing: border-box;
    user-select: none;
  }

  img, a {
    user-select: none;
    -webkit-user-select: none;
    -webkit-user-drag: none;
  }

  input, button {
    color: ${({ theme }) => theme.fgStrong};
    &:focus {
      outline: none;
    }
  }

  body {
    background-color: ${({ theme }) => theme.bg};
    margin: 0;
    padding: 0;
  }
`

export default GlobalStyles
