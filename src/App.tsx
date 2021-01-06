import React from 'react'
import { render } from 'react-dom'

import GlobalStyles from './components/Normalize'
import Context from './components/Context'
import Login from './pages/Login'

document.addEventListener('dragover', event => event.preventDefault())
document.addEventListener('drop', event => event.preventDefault())

const mainElement = document.createElement('div')
mainElement.setAttribute('id', 'root')
mainElement.style.width = '100vw'
mainElement.style.height = '100vh'
document.body.appendChild(mainElement)

render(
  <Context>
    <GlobalStyles />
    <Login />
  </Context>,
  mainElement
)
