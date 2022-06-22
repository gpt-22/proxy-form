class CaseConverter {
  toCamel(str: string) {
    const s = str.split('-')
    return s[0] + s[1][0].toUpperCase() + s[1].slice(1)
  }
  toKebab(str: string) {
    return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
  }
}

export const caseConverter = new CaseConverter()

export function getEmailValid(email: string): boolean {
  return (
    email.includes('@') &&
    email.split('@')[0].length >= 3 &&
    (email.includes('.ru') || email.includes('.com'))
  )
}

export function getPasswordValid(password: string): boolean {
  return /.{6,}/.test(password)
}
