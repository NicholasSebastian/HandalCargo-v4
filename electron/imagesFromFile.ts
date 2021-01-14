/* eslint-disable quotes */

import { dialog } from 'electron'
import fs from 'fs'
import path from 'path'

const imageFilter = {
  filters: [{
    name: 'Images',
    extensions: ['png', 'jpg']
  }]
}

export default function retrieveImage (event: Electron.IpcMainEvent): void {
  dialog.showOpenDialog(imageFilter)
    .then(({ filePaths, canceled }) => {
      if (canceled) return

      const filePath = filePaths[0]
      fs.readFile(filePath, (err, data) => {
        if (err) {
          dialog.showErrorBox('Unable to read the selected file', err.message)
          return
        }
        const ext = path.extname(filePath).substr(1)
        event.reply('imageRetrieved', data, ext)
      })
    })
}
