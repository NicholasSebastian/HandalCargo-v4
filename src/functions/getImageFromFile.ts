import { remote } from 'electron'
const path = remote.require('path')
const fs = remote.require('fs')
const { dialog } = remote

const imageFilter = {
  filters: [{
    name: 'Images',
    extensions: ['png', 'jpeg', 'jpg']
  }]
}

const mimeTypes = {
  png: 'image/png',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg'
}

// function bufferToBlob (buffer: Buffer, extension: string): Blob {
//   const byteCharacters = []
//   for (const charCode of buffer) {
//     byteCharacters.push(charCode)
//   }

//   const byteArray = new Uint8Array(byteCharacters)
//   const blob = new Blob([byteArray], { type: mimeTypes[extension as never] })
//   return blob
// }

export default function retrieveImage (callback: (buffer: Buffer, mimetype: string) => void): void {
  dialog.showOpenDialog(imageFilter)
    .then(({ filePaths, canceled }) => {
      if (canceled) return

      const filePath = filePaths[0]
      fs.readFile(filePath, (err: NodeJS.ErrnoException | null, data: Buffer) => {
        if (err) {
          dialog.showErrorBox('Unable to read the selected file', err.message)
          return
        }
        const ext = path.extname(filePath).substr(1)
        const mimetype = mimeTypes[ext as never]
        callback(data, mimetype)
      })
    })
}
