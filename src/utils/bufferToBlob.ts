export default function bufferToBlob (buffer: Buffer, extension: string): Blob {
  const byteCharacters = []
  for (const charCode of buffer) {
    byteCharacters.push(charCode)
  }

  const byteArray = new Uint8Array(byteCharacters)
  const blob = new Blob([byteArray], { type: `image/${extension}` })
  return blob
}
