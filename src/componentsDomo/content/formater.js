import { createElement as h } from '../../createElement'
const defaultFormat = [
  {
    name: 'bold',
    type: 'node',
    render: (h, element, value) => {
      return <strong></strong>
    },
  },
  {
    name: 'font-size',
    type: 'style',
    render: (h, element, value) => {
      return <span style={{ 'font-size': value }}></span>
    },
  },
  {
    name: 'color',
    type: 'style',
    render: (h, element, value) => {
      console.log(value)
      return <span style={{ color: value }}></span>
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
  render(name, value) {
    return this.formatMap.get(name).render(h, null, value)
  }
  get types() {
    return [...this.formatMap.keys()]
  }
  getFormats(keys) {
    return keys.map((key) => this.formatMap.get(key))
  }
}
