/* eslint-disable no-unused-expressions */
import { BrowserWindow, dialog } from 'electron'
import '@babel/polyfill'
import * as path from 'path'
import * as url from 'url'

import { connectionInstance } from './main'

const loginWindowSize = { width: 700, height: 500 }
const windowSize = { width: 1280, height: 720, minWidth: 1100, minHeight: 600 }

class Window {
  window: Electron.BrowserWindow | null

  constructor () {
    this.window = new BrowserWindow({
      width: loginWindowSize.width,
      height: loginWindowSize.height,
      resizable: false,
      icon: '../src/assets/images/icon.png',
      webPreferences: {
        nodeIntegration: true
      }
    })
    this.loadContent()
    this.window.on('closed', () => {
      connectionInstance.connection?.end()
      this.window = null
    })
  }

  public onLogin (): void {
    this.window?.setSize(windowSize.width, windowSize.height)
    this.window?.setMinimumSize(windowSize.minWidth, windowSize.minHeight)
    this.window?.setResizable(true)
    this.window?.center()
  }

  public onLogout (): void {
    dialog.showMessageBox({
      title: 'Log Out and Exit',
      message: 'Log Out and Exit?',
      detail: 'This will close the application and its connection to the database.',
      buttons: ['Log Out and Exit', 'Cancel']
    })
      .then(({ response }) => { if (response === 0) this.window?.close() })
  }

  private loadContent () {
    if (process.env.NODE_ENV === 'development') {
      this.window?.loadURL('http://localhost:4000')
    } else {
      this.window?.loadURL(
        url.format({
          pathname: path.join(__dirname, 'renderer/index.html'),
          protocol: 'file:',
          slashes: true
        })
      )
    }
  }
}

export default Window
