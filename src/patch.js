import {
  VNElmMap,
  VNInsMap,
  createEml,
  updateProps,
  createElement as h,
  vnodeElmMap,
  vnodeInsMap,
} from './createElement'
import { isUndef, isDef } from '../share/utils'
let insertedVnodeQueue = []
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
      ch.vm && insertedVnodeQueue.push(ch)
    }
  }
}
function invokeDestroyHook(vnode) {
  const vm = vnode.vm
  if (vm !== undefined) {
    vm?.destroy?.(vnode)
    // for (let i = 0; i < cbs.destroy.length; ++i) cbs.destroy[i](vnode)
    if (vnode.children !== undefined) {
      for (let j = 0; j < vnode.children.length; ++j) {
        const child = vnode.children[j]
        if (child != null && typeof child !== 'string') {
          invokeDestroyHook(child)
        }
      }
    }
  }
}
function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
  for (; startIdx <= endIdx; ++startIdx) {
    const ch = vnodes[startIdx]
    if (ch != null) {
      invokeDestroyHook(ch)
      parentElm.removeChild(ch.elm)
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
  console.log(oldCh)
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
      console.log(oldStartVnode.isDirty)
      patchVnode(newStartVnode, oldStartVnode)
      oldStartVnode = oldCh[++oldStartIdx]
      newStartVnode = newCh[++newStartIdx]
      // 新尾=旧尾
    } else if (sameVnode(newEndVnode, oldEndVnode)) {
      console.log(oldEndVnode.isDirty)
      patchVnode(newEndVnode, oldEndVnode)
      oldEndVnode = oldCh[--oldEndIdx]
      newEndVnode = newCh[--newEndIdx]
      // 旧头=新尾
    } else if (sameVnode(newEndVnode, oldStartVnode)) {
      // Vnode moved right
      console.log(oldStartVnode.isDirty)
      patchVnode(newEndVnode, oldStartVnode)
      parentElm.insertBefore(VNElmMap.get(oldStartVnode), VNElmMap.get(oldEndVnode).nextSibling)
      oldStartVnode = oldCh[++oldStartIdx]
      newEndVnode = newCh[--newEndIdx]
      // 新头=旧尾
    } else if (sameVnode(newStartVnode, oldEndVnode)) {
      // Vnode moved left
      console.log(oldEndVnode.isDirty)
      patchVnode(newStartVnode, oldEndVnode)
      parentElm.insertBefore(VNElmMap.get(oldEndVnode), VNElmMap.get(oldStartVnode))
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
        parentElm.insertBefore(createElm(newStartVnode), VNElmMap.get(oldStartVnode))
        newStartVnode.vm && insertedVnodeQueue.push(newStartVnode)
      } else {
        elmToMove = oldCh[idxInOld]
        if (elmToMove.tagName !== newStartVnode.tagName) {
          parentElm.insertBefore(createElm(newStartVnode), VNElmMap.get(oldStartVnode))
          newStartVnode.vm && insertedVnodeQueue.push(newStartVnode)
        } else {
          patchVnode(newStartVnode, elmToMove)
          oldCh[idxInOld] = undefined
          parentElm.insertBefore(VNElmMap.get(elmToMove), VNElmMap.get(oldStartVnode))
        }
      }
      newStartVnode = newCh[++newStartIdx]
    }
  }

  if (newStartIdx <= newEndIdx) {
    before = newCh[newEndIdx + 1] == null ? null : VNElmMap.get(newCh[newEndIdx + 1])
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
      const ins = oldVnode.ins
      const oldVn = VNInsMap.get(vnode)
    }
  }

  const elm = VNElmMap.get(oldVnode)
  vnodeElmMap(elm, vnode)
  VNElmMap.delete(oldVnode)
  const oldCh = oldVnode.children
  const ch = vnode.children
  updateProps(vnode, oldVnode)
  if (oldCh !== ch) updateChildren(elm, ch, oldCh)
}
export function patch(vnode, oldVnode) {
  insertedVnodeQueue = []
  if (isUndef(oldVnode)) {
    return createElm(vnode)
  }
  let isInit = false
  const isRealElment = isDef(oldVnode.nodeType)
  if (isRealElment) {
    isInit = true
    const elm = oldVnode
    oldVnode = h(oldVnode.tagName.toLowerCase())
    vnodeElmMap(elm, oldVnode)
  }
  if (sameVnode(vnode, oldVnode)) {
    patchVnode(vnode, oldVnode)
    vnodeElmMap(VNElmMap.get(oldVnode), vnode)
    VNElmMap.delete(oldVnode)
    isInit && isDef(vnodeInsMap.get(vnode)) && insertedVnodeQueue.push(vnodeInsMap.get(vnode))
    isInit = false
  } else {
    vnodeElmMap(VNElmMap.get(oldVnode), vnode)
    VNElmMap.delete(oldVnode)
    isDef(vnodeInsMap.get(vnode)) && insertedVnodeQueue.push(vnodeInsMap.get(vnode))
  }
  return VNElmMap.get(vnode)
}
export { insertedVnodeQueue }
