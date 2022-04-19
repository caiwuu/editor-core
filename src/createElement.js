import { stylesModule } from './modules/styles'
import { attributesModule } from './modules/attributes'
import { listenersModule } from './modules/listeners'
import { classesModule } from './modules/classes'
import { isPrimitive, isUndef, toRawType } from './utils'
import { getElm, setVnElm, setVnIns } from './mappings'
const BUILTINPROPS = ['ref', 'key', 'ns']
const insertedInsQueue = []
export function createRef() {
  return { current: null }
}
function styleToObj(str) {
  str = str.trim()
  return str
    .split(';')
    .filter((ele) => ele)
    .reduce((prev, ele) => {
      const kv = ele.split(':')
      prev[kv[0].trim()] = kv[1].trim()
      return prev
    }, {})
}
export function domToVNode(node) {
  const type = node.tagName.toLowerCase() || 'text'
  if (type === 'text') {
    return createElement(type)
  }
  const config = {}
  const children = []
  const elmAttrs = node.attributes
  const elmChildren = node.childNodes
  for (let i = 0, n = elmAttrs.length; i < n; i++) {
    let name = elmAttrs[i].nodeName
    if (name === 'style' && isPrimitive(elmAttrs[i].nodeValue)) {
      config[name] = styleToObj(elmAttrs[i].nodeValue)
    } else {
      config[name] = elmAttrs[i].nodeValue
    }
  }
  for (let i = 0, n = elmChildren.length; i < n; i++) {
    children.push(domToVNode(elmChildren[i]))
  }
  return createElement(type, config, children)
}
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
export function createElm(vnode) {
  let elm
  if (vnode.type === 'text') {
    elm = document.createTextNode(vnode.children)
    setVnElm(elm, vnode)
    return elm
  }
  if (typeof vnode.type === 'function') {
    if (vnode.type.isComponent) {
      const ins = new vnode.type(vnode.props)
      const vn = ins.render(createElement)
      vnode.ins = ins
      setVnIns(ins, vn)
      if (vnode.ref) vnode.ref.current = ins
      elm = createElm(vn)
      insertedInsQueue.push(ins)
      setVnElm(elm, vn)
      updateProps(vn)
    } else {
      const vn = vnode.type(createElement, vnode.props)
      setVnIns(vnode, vn)
      elm = createElm(vn)
      if (vnode.ref) vnode.ref.current = elm
      setVnElm(elm, vn)
      updateProps(vnode)
    }
  } else {
    elm = vnode.ns
      ? document.createElementNS(vnode.ns, vnode.type)
      : document.createElement(vnode.type)
    if (vnode.ref) vnode.ref.current = elm
    setVnElm(elm, vnode)
    updateProps(vnode)
  }
  if (vnode.children.length === 1) {
    elm.appendChild(createElm(vnode.children[0]))
  } else if (vnode.children.length > 1) {
    const fragment = document.createDocumentFragment()
    for (let index = 0; index < vnode.children.length; index++) {
      const ch = vnode.children[index]
      fragment.appendChild(createElm(ch))
    }
    elm.appendChild(fragment)
  }
  return elm
}
export function createElement(type, config = {}, children = []) {
  const props = {}
  const ref = config.ref || null
  const key = config.key || null
  for (let propName in config) {
    if (!BUILTINPROPS.includes(propName)) {
      if (propName === 'style' && isPrimitive(config[propName])) {
        props[propName] = styleToObj(config[propName])
      } else {
        props[propName] = config[propName]
      }
    }
  }
  return Element(type, key, ref, props, children.flat())
}

function Element(type, key, ref, props, children) {
  let element
  if (type === 'text') {
    element = {
      type: 'text',
      children: children.join(''),
    }
  } else {
    element = {
      _isVnode: true,
      type,
      key,
      ref,
      props,
      children: children.map((ele) => {
        if (isPrimitive(ele) || isUndef(ele)) {
          return {
            type: 'text',
            children: ele,
          }
        } else {
          return ele
        }
      }),
    }
  }

  if (typeof type === 'function') {
    element.props.children = [...element.children]
    element.children = []
  }
  return element
}
export { insertedInsQueue }
