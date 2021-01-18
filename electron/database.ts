/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable brace-style */
/* eslint-disable no-multi-str */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-expressions */

import { ipcMain, dialog } from 'electron'
import mariadb from 'mariadb'
import '@babel/polyfill'

import { windowInstance } from './main'
import { customDecrypt } from './encryption'

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
    this.connection?.query('SELECT `pwd`, `pwd_iv`, `pwd_salt` FROM `staff` WHERE `staffid` = ?', [username])
      .then(async data => {
        if (Object.entries(data).length > 1) {
          const encryptedTruePassword = {
            cipherText: data[0].pwd,
            initializeVector: data[0].pwd_iv,
            salt: data[0].pwd_salt
          }
          const truePassword = customDecrypt(encryptedTruePassword)
          if (truePassword === password) {
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
          }
          else {
            dialog.showErrorBox('Invalid Login credentials', 'Invalid password.')
            event.reply('login-failed')
          }
        } else {
          dialog.showErrorBox('Invalid Login credentials', 'Invalid username.')
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
