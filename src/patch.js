import {
  createElm,
  updateProps,
  createElement as h,
  insertedInsQueue,
  domToVNode,
} from './createElement'
import { getVn, getElm, setVnElm, setVnIns } from './mappings'
import { isUndef, isDef } from './utils'
function sameVnode(vnode, oldVnode) {
  return vnode?.key === oldVnode?.key && vnode?.type === oldVnode?.type
}
function findIdxInOld(node, oldCh, start, end) {
  for (let i = start; i < end; i++) {
    const c = oldCh[i]
    if (isDef(c) && sameVnode(node, c)) return i
  }
}
function createKeyToOldIdx(children, beginIdx, endIdx) {
  const map = {}
  for (let i = beginIdx; i <= endIdx; ++i) {
    const key = children[i]?.key
    if (isDef(key)) {
      map[key] = i
    }
  }
  return map
}
function addVnodes(parentElm, before = null, vnodes, startIdx, endIdx) {
  for (; startIdx <= endIdx; ++startIdx) {
    const ch = vnodes[startIdx]
    if (ch != null) {
      parentElm.insertBefore(createElm(ch), before)
    }
  }
}
function invokeDestroyHook(vnode, destoryQueue) {
  const vn = vnode.ins ? getVn(vnode.ins) : vnode
  if (vn !== undefined) {
    const ins = getVn(vn)
    ins?.onBeforeUnmount?.()
    if (vn.children !== undefined) {
      for (let j = 0; j < vn.children.length; ++j) {
        const child = vn.children[j]
        if (child != null && typeof child !== 'string') {
          invokeDestroyHook(child, destoryQueue)
        }
      }
    }
    if (ins) destoryQueue.push(ins)
  }
}
function removeVnodes(parentElm, oldCh, startIdx, endIdx) {
  for (; startIdx <= endIdx; ++startIdx) {
    const vnode = oldCh[startIdx]
    if (vnode != null) {
      let destoryQueue = []
      invokeDestroyHook(vnode, destoryQueue)
      parentElm.removeChild(getElm(vnode))
      destoryQueue.forEach((ins) => {
        ins.onUnmounted?.()
      })
      destoryQueue = null
    }
  }
}
export function updateChildren(parentElm, newCh, oldCh) {
  let oldStartIdx = 0
  let newStartIdx = 0
  let oldEndIdx = oldCh.length - 1
  let newEndIdx = newCh.length - 1
  let oldStartVnode = oldCh[0]
  let newStartVnode = newCh[0]
  let oldEndVnode = oldCh[oldEndIdx]
  let newEndVnode = newCh[newEndIdx]
  let oldKeyToIdx
  let idxInOld
  let elmToMove
  let before
  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (oldStartVnode == null) {
      oldStartVnode = oldCh[++oldStartIdx] // Vnode might have been moved left
    } else if (oldEndVnode == null) {
      oldEndVnode = oldCh[--oldEndIdx]
    } else if (newStartVnode == null) {
      newStartVnode = newCh[++newStartIdx]
    } else if (newEndVnode == null) {
      newEndVnode = newCh[--newEndIdx]
      // 新头=旧头
    } else if (sameVnode(newStartVnode, oldStartVnode)) {
      patchVnode(newStartVnode, oldStartVnode)
      oldStartVnode = oldCh[++oldStartIdx]
      newStartVnode = newCh[++newStartIdx]
      // 新尾=旧尾
    } else if (sameVnode(newEndVnode, oldEndVnode)) {
      patchVnode(newEndVnode, oldEndVnode)
      oldEndVnode = oldCh[--oldEndIdx]
      newEndVnode = newCh[--newEndIdx]
      // 旧头=新尾
    } else if (sameVnode(newEndVnode, oldStartVnode)) {
      // Vnode moved right
      patchVnode(newEndVnode, oldStartVnode)
      parentElm.insertBefore(getElm(oldStartVnode), getElm(oldEndVnode).nextSibling)
      oldStartVnode = oldCh[++oldStartIdx]
      newEndVnode = newCh[--newEndIdx]
      // 新头=旧尾
    } else if (sameVnode(newStartVnode, oldEndVnode)) {
      // Vnode moved left
      patchVnode(newStartVnode, oldEndVnode)
      parentElm.insertBefore(getElm(oldEndVnode), getElm(oldStartVnode))
      oldEndVnode = oldCh[--oldEndIdx]
      newStartVnode = newCh[++newStartIdx]
    } else {
      if (oldKeyToIdx === undefined) {
        oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
      }
      idxInOld = isDef(newStartVnode.key)
        ? oldKeyToIdx[newStartVnode.key]
        : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)
      if (isUndef(idxInOld)) {
        // New element
        parentElm.insertBefore(createElm(newStartVnode), getElm(oldStartVnode))
      } else {
        elmToMove = oldCh[idxInOld]
        if (elmToMove.tagName !== newStartVnode.tagName) {
          parentElm.insertBefore(createElm(newStartVnode), getElm(oldStartVnode))
        } else {
          patchVnode(newStartVnode, elmToMove)
          oldCh[idxInOld] = undefined
          parentElm.insertBefore(getElm(elmToMove), getElm(oldStartVnode))
        }
      }
      newStartVnode = newCh[++newStartIdx]
    }
  }

  if (newStartIdx <= newEndIdx) {
    before = newCh[newEndIdx + 1] == null ? null : getElm(newCh[newEndIdx + 1])
    addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx)
  }
  if (oldStartIdx <= oldEndIdx) {
    removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
  }
}
function patchVnode(vnode, oldVnode) {
  if (oldVnode === vnode) return
  if (typeof vnode.type === 'function') {
    if (vnode.type.isComponent) {
      const ins = (vnode.ins = oldVnode.ins)
      const oldVn = getVn(ins)
      ins.props = vnode.props
      const newVn = ins.render(h)
      patchVnode(newVn, oldVn)
    } else {
      const oldVn = getVn(oldVnode)
      const newVn = vnode.type(h, vnode.props)
      setVnIns(vnode, newVn)
      patchVnode(newVn, oldVn)
    }
  } else if (vnode.type === 'text') {
    const elm = getElm(oldVnode)
    setVnElm(elm, vnode)
    updateProps(vnode, oldVnode)
  } else {
    const elm = getElm(oldVnode)
    const ins = getVn(oldVnode)
    if (ins) {
      setVnIns(ins, vnode)
      vnode.ins = ins
    }
    setVnElm(elm, vnode)
    const oldCh = oldVnode.children
    const ch = vnode.children
    updateProps(vnode, oldVnode)
    if (oldCh !== ch) updateChildren(elm, ch, oldCh)
  }
}
export function patch(vnode, oldVnode) {
  insertedInsQueue.length = 0
  // 没有oldvnode 直接创建新dom
  if (isUndef(oldVnode)) {
    const elm = createElm(vnode)
    setVnElm(elm, vnode)
    return elm
  }
  const isRealElment = isDef(oldVnode.nodeType)
  // oldvnode 是dom，先转化为虚拟节点
  if (isRealElment) {
    const elm = oldVnode
    oldVnode = domToVNode(oldVnode)
    setVnElm(elm, oldVnode)
  }
  // 相同节点则执行更新逻辑
  if (sameVnode(vnode, oldVnode)) {
    patchVnode(vnode, oldVnode)
  } else {
    let oldElm = getElm(oldVnode)
    const newElm = createElm(vnode)
    oldElm.parentNode.replaceChild(newElm, oldElm)
    oldElm = null
  }
  insertedInsQueue.forEach((ele) => {
    if (ele.onMounted) ele.onMounted()
  })
  insertedInsQueue.length = 0
  return getElm(vnode)
}
