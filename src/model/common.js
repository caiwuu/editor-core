import { stylesModule } from './modules/styles'
import { attributesModule } from './modules/attributes'
import { listenersModule } from './modules/listeners'
import { classesModule } from './modules/classes'
import { getElm, getVn, getMark } from './mappings'
/**
 * @desc: 更新dom属性
 * @param {*} vnode
 * @param {*} oldVnode
 * @return {*}
 */
export function updateProps (vnode, oldVnode) {
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

/**
 * @desc: 创建ref
 * @return {*}
 */
export function createRef () {
  return { current: null }
}

/**
 * @desc: path mark的链表树
 * @return {*}
 */
class Path {
  constructor({ node, parent, position, prevSibling, nextSibling, children }) {
    this.node = node
    this.parent = parent
    this.position = position
    this.prevSibling = prevSibling
    this.nextSibling = nextSibling
    this.children = children
  }
  get component () {
    return this.node.data.component || this.parent.component
  }
  get elm () {
    return getElm(this.vn)
  }
  get vn () {
    return getVn(this.node)
  }
  get isLeaf () {
    return this.children.length === 0
  }
  get firstLeaf () {
    let path = this
    while (path.children && path.children.length) {
      path = path.children[0]
    }
    return path
  }
  get lastLeaf () {
    let path = this
    while (path.children && path.children.length) {
      path = path.children[path.children.length - 1]
    }
    return path
  }
  get index () {
    return this.position.split('-').slice(-1)[0] / 1
  }

  /**
   * @desc: 格式化内容和格式
   * @param {*} data
   * @param {*} formats
   * @return {*}
   */
  format ({ data = '', formats = {} } = {}) {
    this.node.data = data
    this.node.formats = formats
  }

  /**
   * @desc: path删除
   * @return {*}
   */
  delete () {
    if (!this.parent) {
      return
    }
    // 为了保持链表的连续性 marks长度不能为零
    if (this.parent.node.data.marks.length === 1) {
      this.format()
      return
    }
    this.prevSibling && (this.prevSibling.nextSibling = this.nextSibling)
    this.nextSibling && (this.nextSibling.prevSibling = this.prevSibling)
    this.parent.children.splice(this.index, 1)
    this.parent.node.data.marks.splice(this.index, 1)
    this.parent.resetPosition()
  }

  /**
   * @desc: 重新设置位置信息
   * @return {*}
   */
  resetPosition () {
    this.children.forEach((path, index) => {
      const oldPosition = path.position
      const newPosition = this.position + '-' + index
      if (oldPosition !== newPosition) {
        path.position = path.node.position = newPosition
        path.resetPosition()
      }
    })
  }

  /**
   * @desc: 深度优先遍历
   * @param {*} fn
   * @return {*}
   */
  traverse (fn) {
    fn(this)
    if (this.children && this.children.length) {
      for (let index = 0; index < this.children.length; index++) {
        const path = this.children[index]
        path.traverse(fn)
      }
    }
  }
  stop () { }
  skip () { }
}

/**
 * @desc: 创建path
 * @return {*}
 */
export function createPath (
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
/**
 * @desc:
 * @param {elm|mark|position} target
 * @param {path} path
 * @param {number} offset
 * @return {path}
 */
export function queryPath (target, path, offset = 0) {
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
