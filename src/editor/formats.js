import { formater } from '@/model'
import { Table, Row, Col, Image, Paragraph, Root } from './components'
const root = {
  name: 'root',
  type: 'component',
  render: (h, vnode, data) => {
    return <Root data={data}></Root>
  },
}
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
  name: 'fontSize',
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
;[root, bold, image, underline, fontSize, color, paragraph, del, sup, table, row, col].forEach(
  (ele) => {
    formater.register(ele)
  }
)
