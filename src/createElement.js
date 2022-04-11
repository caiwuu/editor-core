import { stylesModule } from './modules/styles'
import { attributesModule } from './modules/attributes'
import { listenersModule } from './modules/listeners'
import { classesModule } from './modules/classes'
const VNElmMap = new WeakMap()
const VNInsMap = new WeakMap()
const BUILTINPROPS = ['ref', 'key', 'ns']
export function createRef() {
  return { current: null }
}
export function mutualMap(map) {
  return (elm, vnode) => map.set(elm, vnode).set(vnode, elm)
}
export const vnodeElmMap = mutualMap(VNElmMap)
export const vnodeInsMap = mutualMap(VNInsMap)

export function updateProps(vnode, oldVnode) {
  const elm = VNElmMap.get(vnode)
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
export function createElm(vnode, position = '0') {
  vnode.position = position
  let elm
  if (vnode.type === 'text') {
    elm = document.createTextNode(vnode.children)
    vnodeElmMap(elm, vnode)
    return elm
  }
  if (typeof vnode.type === 'function') {
    if (vnode.type.isComponent) {
      const ins = new vnode.type(vnode.props)
      const vn = ins.render(createElement)
      vnode.ins = ins
      vnodeInsMap(ins, vn)
      if (vnode.ref) vnode.ref.current = ins
      elm = createElm(vn)
    } else {
      const vn = vnode.type(createElement, vnode.props)
      elm = createElm(vn)
      if (vnode.ref) vnode.ref.current = elm
    }
  } else {
    elm = vnode.ns
      ? document.createElementNS(vnode.ns, vnode.type)
      : document.createElement(vnode.type)
    if (vnode.ref) vnode.ref.current = elm
  }
  if (vnode.children.length === 1) {
    const position = vnode.position + '-' + '0'
    elm.appendChild(createElm(vnode.children[0], position))
  } else if (vnode.children.length > 1) {
    const fragment = document.createDocumentFragment()
    for (let index = 0; index < vnode.children.length; index++) {
      const ch = vnode.children[index]
      const position = vnode.position + '-' + index
      fragment.appendChild(createElm(ch, position))
    }
    elm.appendChild(fragment)
  }
  vnodeElmMap(elm, vnode)
  updateProps(vnode)
  return elm
}
export function createElement(type, config, children) {
  const props = {}
  const ref = config.ref || null
  const key = config.key || null
  for (let propName in config) {
    if (!BUILTINPROPS.includes(propName)) {
      props[propName] = config[propName]
    }
  }
  return Element(type, key, ref, props, children)
}

function Element(type, key, ref, props, children) {
  const element = {
    type,
    key,
    ref,
    props,
    children: children.map((ele) => {
      if (typeof ele === 'string' || !ele) {
        return {
          type: 'text',
          children: ele,
        }
      } else {
        return ele
      }
    }),
  }
  if (Object.freeze) {
    Object.freeze(element.props)
    Object.freeze(element.children)
  }
  return element
}
export function mount(elm, container) {
  document.querySelector(container).appendChild(elm)
}
export { VNElmMap, VNInsMap }
