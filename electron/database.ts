/* eslint-disable no-multi-str */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-expressions */
import { dialog, ipcMain } from 'electron'
import mariadb from 'mariadb'
import '@babel/polyfill'

import { windowInstance } from './main'

const DB_PING_INTERVAL = 60000
const connectionSettings = {
  host: '',
  port: 3306,
  database: 'dhicom_handalcargo',
  user: '',
  password: ''
}

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
      Connection.handleConnectionBreak()
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
      Connection.handleConnectionBreak()
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
    }, DB_PING_INTERVAL)
  }

  private static handleConnectionError (error: mariadb.SqlError) {
    if (error.code === 'ECONNREFUSED') {
      dialog.showMessageBoxSync({
        message: 'Connection Refused',
        detail: 'There was a problem connecting to the database server.'
      })
    } else {
      dialog.showMessageBoxSync({
        message: 'Fatal Error occured',
        detail: error.message
      })
    }
    windowInstance.window?.close()
  }

  private static handleConnectionBreak () {
    dialog.showMessageBoxSync({
      message: 'Connection ended',
      detail: 'Connection with database unexpectedly is no longer valid.'
    })
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
