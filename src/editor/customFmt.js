import { createElement as h, Formater, Content, createRef } from '@/model'
export const formater = new Formater()
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
  constructor(props) {
    super(props)
    this.state.elmRef = createRef()
  }
  render() {
    console.log(this.contentLength)
    return (
      <td ref={this.state.elmRef} style='text-align:center;width:50%'>
        {this.contentLength ? formater.render(this.state.marks) : <br />}
      </td>
    )
  }
  get contentLength() {
    return this.state.marks
      .filter((ele) => typeof ele.data === 'string')
      .reduce((prev, curr) => {
        return prev + curr.data.length
      }, 0)
  }
  beforeUpdateState(editor, path) {
    const range = editor.selection.getRangeAt(0)
    if (!this.contentLength) {
      console.log(this.state.marks)
      // console.log(path)
      range.setStart(this.state.elmRef.current, 0)
      range.collapse(true)
    }
  }
}
class Paragraph extends Content {
  render() {
    return <div>{formater.render(this.state.marks)}</div>
  }
}

export const customFmt = [paragraph, del, sup, table, row, col]
