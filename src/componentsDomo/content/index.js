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
const table = {
  name: 'table',
  type: 'block',
  render: (h, vnode) => {
    const vn = <Table></Table>
    if (vnode) {
      vnode.children.push(vn)
    }
    return vn
  },
}
formater.register(del)
formater.register(sup)
formater.register(paragraph)
formater.register(table)
class Table extends Component {
  constructor(props) {
    super(props)
    this.state = { marks: this.props.data.marks, tableSize: this.props.data.tableSize }
  }
  render() {
    return (
      <table border='1' style='border-collapse:collapse;width:600px'>
        {this.state.marks.map((ele, rowIdx) => (
          <tr>
            {ele.map((i, colIdx) => (
              <td style='padding:4px;text-align:center'>
                {formater.render(this.state.marks[rowIdx][colIdx])}
              </td>
            ))}
          </tr>
        ))}
      </table>
    )
  }
}
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
          data: '111111',
          formats: { paragraph: true, color: '#eee', 'font-size': '36px' },
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
        {
          data: 'ppppp',
          formats: {
            table: {
              tableSize: { row: 2, col: 2 },
              marks: [
                [
                  [
                    {
                      data: 'this is data1',
                      formats: {},
                    },
                  ],
                  [
                    {
                      data: 'this is data2',
                      formats: { del: true, color: 'red' },
                    },
                  ],
                ],
                [
                  [
                    {
                      data: 'this is data3',
                      formats: {},
                    },
                  ],
                  [
                    {
                      data: 'this is data4444',
                      formats: {},
                    },
                  ],
                ],
              ],
            },
          },
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
