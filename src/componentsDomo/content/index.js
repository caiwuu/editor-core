import Component from '../../component'
import { createElement as h } from '../../createElement'
import Formater from './formater'

// 注册格式
const formater = new Formater()
const paragraph = {
  name: 'paragraph',
  type: 'block',
  render: (h, vnode) => {
    const vn = <Paragraph></Paragraph>
    if (vnode) {
      vnode.children.push(vn)
    }
    return vn
  },
}

// 通过标签实现
const del = {
  name: 'del',
  type: 'inline',
  render: (h, vnode) => {
    const vn = <del></del>
    if (vnode) {
      vnode.children.push(vn)
    }
    return vn
  },
}

// 通过css实现
// const del = {
//   name: 'del',
//   type: 'attribute',
//   render: (h, vnode, value) => {
//     if (vnode) {
//       if (!vnode.props.style) vnode.props.style = {}
//       vnode.props.style['text-decoration'] = 'line-through'
//     } else {
//       return <span style='text-decoration:line-through'></span>
//     }
//   },
// }
const sup = {
  name: 'sup',
  type: 'inline',
  render: (h, vnode) => {
    const vn = <sup></sup>
    if (vnode) {
      vnode.children.push(vn)
    }
    return vn
  },
}
formater.register(del)
formater.register(sup)
formater.register(paragraph)
class Paragraph extends Component {
  constructor(props) {
    super(props)
    console.log(this.props)
    this.state = {
      marks: [
        {
          data: 'this is Paragraph',
          formats: { color: 'green' },
        },
      ],
    }
  }
  render() {
    return (
      <div>
        {formater.render(this.state.marks)}
        {this.props.children}
      </div>
    )
  }
}
export class Content extends Component {
  constructor(props) {
    super(props)
    this.state = {
      placeholder: (h) => {
        return <span style='color:#ddd'>placeholder</span>
      },
      marks: [
        {
          data: 'hello',
          formats: { del: true, color: 'red' },
        },
        {
          data: 'paragraph',
          formats: { paragraph: true, del: true, 'font-size': '36px' },
        },
        {
          data: 'world',
          formats: { del: true, color: 'red' },
        },
        {
          data: 'world',
          formats: { del: true, color: 'red' },
        },
        {
          data: 'hhhha',
          formats: { sup: true, del: true, color: 'green', 'font-size': '12px' },
        },
      ],
    }
  }

  render() {
    return (
      <div>
        {this.state.marks.length ? formater.render(this.state.marks) : this.state.placeholder(h)}
        {/* <span>{this.props.children}</span> */}
      </div>
    )
  }
}
