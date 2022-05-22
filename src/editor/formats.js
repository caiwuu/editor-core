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

const bold = {
  name: 'bold',
  type: 'inline',
  render: (h, vnode, value) => {
    const vn = <strong></strong>
    if (vnode) {
      vnode.children.push(vn)
    }
    return vn
  },
}
const underline = {
  name: 'underline',
  type: 'inline',
  render: (h, vnode, value) => {
    const vn = <u></u>
    if (vnode) {
      vnode.children.push(vn)
    }
    return vn
  },
}
const fontSize = {
  name: 'font-size',
  type: 'attribute',
  render: (h, vnode, value) => {
    if (vnode) {
      if (!vnode.props.style) vnode.props.style = {}
      vnode.props.style['font-size'] = value
    } else {
      return <span style={{ 'font-size': value }}></span>
    }
  },
}
const color = {
  name: 'color',
  type: 'attribute',
  render: (h, vnode, value) => {
    if (vnode) {
      if (!vnode.props.style) vnode.props.style = {}
      vnode.props.style['color'] = value
    } else {
      return <span style={{ color: value }}></span>
    }
  },
}
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
const image = {
  name: 'image',
  isLeaf: true,
  type: 'component',
  render: (h, vnode, data) => {
    const vn = <Image data={data}></Image>
    if (vnode) {
      vnode.children.push(vn)
    }
    return vn
  },
}
class Image extends Content {
  render () {
    const { data: src, alt, height, width } = this.state.marks[0]
    return <img width={width} height={height} src={src} alt={alt}></img>
  }
}
class Table extends Content {
  render () {
    return (
      <table border='1' style='border-collapse:collapse;width:600px'>
        {formater.render(this.state.marks)}
      </table>
    )
  }
}
class Row extends Content {
  render () {
    return <tr>{formater.render(this.state.marks)}</tr>
  }
}
class Col extends Content {
  constructor(props) {
    super(props)
    this.state.elmRef = createRef()
  }
  render () {
    return (
      <td ref={this.state.elmRef} style='text-align:center;width:50%'>
        {this.contentLength ? formater.render(this.state.marks) : <br />}
      </td>
    )
  }
  afterUpdateState ({ range }) {
    if (!this.contentLength) {
      console.log(this.state.marks)
      range.setStart(this.state.elmRef.current, 1)
      range.collapse(true)
    }
  }
}
class Paragraph extends Content {
  render () {
    return <div>{this.contentLength ? formater.render(this.state.marks) : <br />}</div>
  }
}

export const formats = [
  bold,
  image,
  underline,
  fontSize,
  color,
  paragraph,
  del,
  sup,
  table,
  row,
  col,
]
