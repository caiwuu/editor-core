import Component from '../../component'
import { createElement as h } from '../../createElement'
import Formater from './formater'

// 注册格式
const formater = new Formater()
const del = {
  name: 'del',
  type: 'node',
  // type: 'component',
  render: (h, vnode, value) => {
    const vn = <del></del>
    if (vnode) {
      vnode.children.push(vn)
    }
    return vn
  },
}
const sup = {
  name: 'sup',
  type: 'node',
  // type: 'component',
  render: (h, vnode, value) => {
    const vn = <sup></sup>
    if (vnode) {
      vnode.children.push(vn)
    }
    return vn
  },
}
formater.register(del)
formater.register(sup)

export class Content extends Component {
  constructor(props) {
    super(props)
    this.state = {
      placeholder: (h) => {
        return <span style='color:#ddd'>placeholder</span>
      },
      marks: [
        {
          content: 'hello',
          formats: { bold: true, del: true, color: 'red', 'font-size': '36px' },
        },
        {
          content: 'world',
          formats: { del: true, color: 'red' },
        },
        {
          content: 'hhhha',
          formats: { sup: true, color: 'green', 'font-size': '12px' },
        },
      ],
    }
  }

  render() {
    return (
      <div>
        {this.state.marks.length ? formater.render(this.state.marks) : this.state.placeholder(h)}
      </div>
    )
  }
}
