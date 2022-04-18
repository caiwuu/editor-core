const defaultFormat = [
  {
    name: 'bold',
    value: true,
    render: (mark, value) => {
      mark.bold = true
    },
  },
  {
    name: 'font-size',
    value: true,
    render: (mark, value) => {
      mark.bold = true
    },
  },
  {
    name: 'color',
    value: true,
    render: (mark, value) => {
      mark.bold = true
    },
  },
]
export default class Formater {
  formatMap = new Map()
  constructor() {
    defaultFormat.forEach((format) => {
      this.register(format)
    })
  }
  register(format) {
    this.formatMap.set(format.name, format)
  }
  get keys() {
    return [...this.formatMap.keys()]
  }
}
