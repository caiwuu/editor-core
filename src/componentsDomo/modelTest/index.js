import { createElement as h, Formater, patch, Content } from '@/model/index'

// 自定义格式
const formater = new Formater()
const paragraph = {
  name: 'paragraph',
  type: 'component',
  render: (h, vnode, data) => {
    const vn = <Paragraph data={data}></Paragraph>
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
  type: 'component',
  render: (h, vnode, data) => {
    const vn = <Table data={data}></Table>
    if (vnode) {
      vnode.children.push(vn)
    }
    return vn
  },
}
const row = {
  name: 'row',
  type: 'component',
  render: (h, vnode, data) => {
    const vn = <Row data={data}></Row>
    if (vnode) {
      vnode.children.push(vn)
    }
    return vn
  },
}
const col = {
  name: 'col',
  type: 'component',
  render: (h, vnode, data) => {
    const vn = <Col data={data}></Col>
    if (vnode) {
      vnode.children.push(vn)
    }
    return vn
  },
}
class Table extends Content {
  render() {
    return (
      <table border='1' style='border-collapse:collapse;width:600px'>
        {formater.render(this.state.marks)}
      </table>
    )
  }
}
class Row extends Content {
  render() {
    return <tr>{formater.render(this.state.marks)}</tr>
  }
}
class Col extends Content {
  render() {
    return <td style='text-align:center'>{formater.render(this.state.marks)}</td>
  }
}
class Paragraph extends Content {
  render() {
    return <div>{formater.render(this.state.marks)}</div>
  }
}

export class Root extends Content {
  render() {
    return (
      <div>
        {this.state.marks.length ? formater.render(this.state.marks) : this.state.placeholder(h)}
      </div>
    )
  }
}

formater.register(del)
formater.register(sup)
formater.register(paragraph)
formater.register(table)
formater.register(row)
formater.register(col)

const data = {
  marks: [
    {
      data: 'hello',
      position: '0',
      formats: { del: true, color: 'red' },
    },
    {
      data: {
        position: '1',
        marks: [
          {
            data: 'this is Paragraph',
            position: '1-0',
            formats: { color: 'green' },
          },
        ],
      },
      position: '1',
      formats: { paragraph: true },
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
      data: {
        marks: [
          {
            data: {
              marks: [
                {
                  data: {
                    marks: [
                      {
                        data: '1111',
                        formats: { color: 'red' },
                      },
                    ],
                  },
                  formats: { col: true },
                },
                {
                  data: {
                    marks: [
                      {
                        data: '2222',
                        formats: { color: 'green' },
                      },
                    ],
                  },
                  formats: { col: true },
                },
              ],
            },
            formats: { row: true },
          },
        ],
      },
      formats: {
        table: true,
      },
    },
  ],
}

function modelTest(h) {
  return (
    <div id='editor-root'>
      <Root data={data}></Root>
    </div>
  )
}
patch(modelTest(h), document.getElementById('editor-root'))
