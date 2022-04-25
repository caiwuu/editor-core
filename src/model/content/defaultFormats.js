import { createElement as h } from '../createElement'
export default [
  {
    name: 'bold',
    type: 'inline',
    render: (h, vnode, value) => {
      const vn = <strong></strong>
      if (vnode) {
        vnode.children.push(vn)
      }
      return vn
    },
  },
  {
    name: 'underline',
    type: 'inline',
    render: (h, vnode, value) => {
      const vn = <u></u>
      if (vnode) {
        vnode.children.push(vn)
      }
      return vn
    },
  },
  {
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
  },
  {
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
  },
]
