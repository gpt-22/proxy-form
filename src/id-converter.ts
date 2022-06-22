export class CaseConverter {
  toCamel(str: string) {
    const s = str.split('-')
    return s[0] + s[1][0].toUpperCase() + s[1].slice(1)
  }
  toSnake(str: string) {
    return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
  }
}

const caseConverter = new CaseConverter()

export default  caseConverter