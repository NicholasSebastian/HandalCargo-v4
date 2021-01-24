interface FullName {
  firstName: string
  lastName: string
}

export default function getFirstLastName (fullName: string): FullName {
  return fullName && fullName.includes(' ')
    ? {
      firstName: fullName.substr(0, fullName.lastIndexOf(' ')),
      lastName: fullName.substr(fullName.lastIndexOf(' ') + 1)
    }
    : {
      firstName: fullName,
      lastName: ''
    }
}
