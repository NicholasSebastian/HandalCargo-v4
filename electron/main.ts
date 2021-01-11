import { app, ipcMain } from 'electron'

import Window from './window'
import Connection from './database'

export let windowInstance: Window
export let connectionInstance: Connection

app.on('ready', () => {
  windowInstance = new Window()

  ipcMain.on('connect', (event) => {
    connectionInstance = new Connection(event)

    // login/logout functionality
    ipcMain.on('login', (event, username, password) => connectionInstance.onLogin(event, username, password))
    ipcMain.once('logout', () => windowInstance.onLogout())

    // database query functionality
    ipcMain.on('query', (event, query, values, replyKey) => connectionInstance.query(event, query, values, replyKey))
    ipcMain.on('querySync', (event, query, values) => connectionInstance.querySync(event, query, values))
  })
})

app.allowRendererProcessReuse = true
