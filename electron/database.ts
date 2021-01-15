/* eslint-disable no-multi-str */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-expressions */

import { ipcMain, dialog } from 'electron'
import mariadb from 'mariadb'
import '@babel/polyfill'

import { windowInstance } from './main'

import connectionSettings from './Connection.json'
const DB_PING_INTERVAL = 60000

class Connection {
  connection: mariadb.Connection | undefined

  constructor (event: Electron.IpcMainEvent) {
    mariadb.createConnection(connectionSettings)
      .then(connection => {
        this.connection = connection
        this.connection.on('error', Connection.handleConnectionError)
        this.createConnectionHeartbeat()
        event.reply('connected')
      })
      .catch(Connection.handleConnectionError)
  }

  public query (event: Electron.IpcMainEvent, query: string, values: Array<string>, replyKey: string): void {
    if (this.connection?.isValid()) {
      this.connection.query(query, values)
        .then((data: Array<any>) => {
          event.reply(replyKey, data)
        })
        .catch(error => dialog.showErrorBox('Query failed', error.message))
    } else {
      Connection.handleConnectionError()
    }
  }

  public queryNoReply (query: string, values: Array<string>): void {
    if (this.connection?.isValid()) {
      this.connection.query(query, values)
        .catch(error => dialog.showErrorBox('Query failed', error.message))
    } else {
      Connection.handleConnectionError()
    }
  }

  public querySync (event: Electron.IpcMainEvent, query: string, values: Array<string>): void {
    if (this.connection?.isValid()) {
      this.connection.query(query, values)
        .then((data: Array<any>) => {
          event.returnValue = data
        })
        .catch(error => {
          dialog.showErrorBox('Query failed', error.message)
          event.returnValue = null
        })
    } else {
      Connection.handleConnectionError()
    }
  }

  public onLogin (event: Electron.IpcMainEvent, username: string, password: string): void {
    this.connection?.query('\
      SELECT * FROM `staff` \
      WHERE `staffid` = ? AND `pwd` = ?',
      [username, password]
    )
      .then(async data => {
        if (data.length > 0) {
          windowInstance.onLogin()
          ipcMain.removeAllListeners('login')
          const profileInfo =
            await this.connection?.query('\
              SELECT * FROM `staff` \
              LEFT JOIN `staffgroup` \
              ON `staff`.`groupcode` = `staffgroup`.`stfgrcode` \
              WHERE `staffid` = ?',
              [username]
            )
          event.reply('login-success', profileInfo[0])
        } else {
          dialog.showErrorBox('Invalid Login credentials', 'Incorrect username or password.')
          event.reply('login-failed')
        }
      })
      .catch(Connection.handleConnectionError)
  }

  private createConnectionHeartbeat () {
    setInterval(() => {
      console.log('Pinging the database server.')
      this.connection?.query('SELECT 1')
        .catch(Connection.handleConnectionError)
    }, DB_PING_INTERVAL)
  }

  private static handleConnectionError (error?: mariadb.SqlError) {
    if (error) {
      if (error.code === 'ECONNREFUSED') {
        dialog.showErrorBox('Connection Refused', 'There was a problem connecting to the database server.')
      } else {
        dialog.showErrorBox('Fatal Error occured', `${error.code}: ${error.message}`)
      }
    } else {
      dialog.showErrorBox('Connection ended', 'Connection with database unexpectedly is no longer valid.')
    }
    windowInstance.window?.close()
  }
}

export default Connection
