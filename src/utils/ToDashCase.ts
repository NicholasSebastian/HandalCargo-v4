function toDashCase (text: string): string {
  return text.toLowerCase().replace(/ /g, '-')
}

export default toDashCase
