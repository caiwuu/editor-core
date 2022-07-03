import { stylesModule } from './modules/styles'
import { attributesModule } from './modules/attributes'
import { listenersModule } from './modules/listeners'
import { classesModule } from './modules/classes'
import { getElm, getVn, getMark } from './mappings'
export function updateProps(vnode, oldVnode) {
  if (typeof vnode.type === 'function') return
  const elm = getElm(vnode)
  if (vnode.type === 'text') {
    if (vnode.children !== oldVnode.children) {
      elm.data = vnode.children
    }
  } else {
    stylesModule.update(elm, vnode, oldVnode)
    classesModule.update(elm, vnode, oldVnode)
    listenersModule.update(elm, vnode, oldVnode)
    attributesModule.update(elm, vnode, oldVnode)
  }
}
export function createRef() {
  return { current: null }
}

class Path {
  constructor({ node, parent, position, prevSibling, nextSibling, children }) {
    this.node = node
    this.parent = parent
    this.position = position
    this.prevSibling = prevSibling
    this.nextSibling = nextSibling
    this.children = children
  }
  get component() {
    return this.node.data.component || this.parent.component
  }
  get elm() {
    return getElm(this.vn)
  }
  get vn() {
    return getVn(this.node)
  }
  get isLeaf() {
    return this.children.length === 0
  }
  get firstLeaf() {
    let path = this
    while (path.children && path.children.length) {
      path = path.children[0]
    }
    return path
  }
  get lastLeaf() {
    let path = this
    while (path.children && path.children.length) {
      path = path.children[path.children.length - 1]
    }
    return path
  }
  format({ data = '', formats = {} } = {}) {
    this.node.data = data
    this.node.formats = formats
  }
  delete() {
    const index = this.position.split('-').slice(-1)[0]
    if (!this.parent) {
      return
    }
    if (this.parent.node.data.marks.length === 1) {
      this.format()
      return
    }
    this.prevSibling && (this.prevSibling.nextSibling = this.nextSibling)
    this.nextSibling && (this.nextSibling.prevSibling = this.prevSibling)
    this.parent.children.splice(index, 1)
    this.parent.node.data.marks.splice(index, 1)
    this.parent.resetPosition()
  }
  resetPosition() {
    this.children.forEach((path, index) => {
      const oldPosition = path.position
      const newPosition = this.position + '-' + index
      if (oldPosition !== newPosition) {
        path.position = path.node.position = newPosition
        path.resetPosition()
      }
    })
  }
  traverse(fn) {
    fn(this)
    if (this.children && this.children.length) {
      for (let index = 0; index < this.children.length; index++) {
        const path = this.children[index]
        path.traverse(fn)
      }
    }
  }
  stop() {}
  skip() {}
}
export function createPath(
  current,
  parent = null,
  prevSibling = null,
  nextSibling = null,
  index = 0
) {
  const position = parent ? parent.position + '-' + index : '0'
  current.position = position
  const config = {
    node: current,
    parent: parent,
    position: position,
    prevSibling: prevSibling,
    nextSibling: nextSibling,
    children: [],
  }
  const path = new Path(config)
  if (current.data.marks) {
    let currPath = null
    current.data.marks.reduce((prevPath, currMark, index) => {
      currPath = createPath(currMark, path, prevPath, null, index)
      if (prevPath) {
        prevPath.nextSibling = currPath
      }
      currPath.prevSibling = prevPath
      path.children.push(currPath)
      return currPath
    }, null)
  }
  return path
}
export function queryPath(target, path, offset = 0) {
  let position
  if (!target) return
  // 通过elm查询
  if (target.nodeType) {
    const vn = getVn(target)
    if (!vn) return null
    const marks = getMark(vn)
    if (!marks) return null
    if (vn.type === 'text') {
      let index = 0
      let count = 0
      for (index; index < marks.length; index++) {
        const mark = marks[index]
        const newCount = count + mark.data.length
        if (count <= offset && offset <= newCount) {
          break
        } else {
          count = newCount
        }
      }
      position = marks[index].position
    } else {
      position = marks[0].position
    }
  } else {
    // 通过mark或者position查询
    position = target.position || target
  }
  const posArr = position.split('-')
  return posArr.slice(1).reduce((prev, index) => {
    return prev.children[index]
  }, path)
}
