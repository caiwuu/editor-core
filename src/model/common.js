import { stylesModule } from './modules/styles'
import { attributesModule } from './modules/attributes'
import { listenersModule } from './modules/listeners'
import { classesModule } from './modules/classes'
import { getElm } from './mappings'
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

export function createPath(current, paernt = null, prev = null, next = null, index = 0) {
  const position = paernt ? paernt.position + '-' + index : '0'
  current.position = position
  const path = {
    node: current,
    parent: paernt,
    position: position,
    prev: prev,
    next: next,
    childen: [],
  }
  if (current.data.marks) {
    let currPath = null
    current.data.marks.reduce((prevPath, currMark, index) => {
      currPath = createPath(currMark, path, prevPath, null, index)
      if (prevPath) {
        prevPath.next = currPath
      }
      currPath.prev = prevPath
      path.childen.push(currPath)
      return currPath
    }, null)
  }
  return path
}
export function queryPath(position, path) {
  position = position.position || position
  const posArr = position.split('-')
  return posArr.slice(1).reduce((prev, index) => {
    return prev.childen[index]
  }, path)
}
