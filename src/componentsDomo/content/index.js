import Component from '../../component'
import { createElement as h } from '../../createElement'
import Formater from './formater'
const formater = new Formater()
const del = {
  name: 'del',
  type: 'node',
  render: (h, vnode, value) => {
    const vn = <del></del>
    if (vnode) {
      vnode.children.push(vn)
    }
    return vn
  },
}
formater.register(del)
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
          formats: { bold: true, underline: true, color: 'red' },
        },
        {
          content: 'world',
          formats: { bold: true, del: false, 'font-size': '36px', color: 'red' },
        },
        {
          content: 'hhhha',
          formats: { color: 'green', 'font-size': '12px' },
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
