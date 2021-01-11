/* eslint-disable no-multi-str */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-expressions */
import { dialog, ipcMain } from 'electron'
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
        .catch(Connection.handleQueryFailure)
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
          Connection.handleQueryFailure(error)
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
          dialog.showMessageBox({
            message: 'Invalid Login credentials',
            detail: 'Incorrect username or password.'
          })
          event.reply('login-failed')
        }
      })
      .catch(Connection.handleConnectionError)
  }

  private createConnectionHeartbeat () {
    setInterval(() => {
      console.log('Pinging the database server.')
      this.connection?.ping()
        .catch(Connection.handleConnectionError)
    }, DB_PING_INTERVAL)
  }

  private static handleConnectionError (error?: mariadb.SqlError) {
    if (error) {
      if (error.code === 'ECONNREFUSED') {
        dialog.showMessageBoxSync({
          message: 'Connection Refused',
          detail: 'There was a problem connecting to the database server.'
        })
      } else {
        dialog.showMessageBoxSync({
          message: 'Fatal Error occured',
          detail: `${error.code}: ${error.message}`
        })
      }
    } else {
      dialog.showMessageBoxSync({
        message: 'Connection ended',
        detail: 'Connection with database unexpectedly is no longer valid.'
      })
    }
    windowInstance.window?.close()
  }

  private static handleQueryFailure (error: any) {
    dialog.showMessageBox({
      message: 'Query failed',
      detail: error.message
    })
  }
}

export default Connection