import React from 'react'
import { render } from 'react-dom'

import './Styles.scss'
import Greetings from './components/greetings'

const mainElement = document.createElement('div')
mainElement.setAttribute('id', 'root')
document.body.appendChild(mainElement)

const App = () => {
  return (
    <>
      <Greetings />
    </>
  )
}

render(<App />, mainElement)
