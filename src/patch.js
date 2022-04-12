import {
  VNElmMap,
  VNInsMap,
  createElm,
  updateProps,
  createElement as h,
  vnodeElmMap,
  vnodeInsMap,
  insertedInsQueue,
  domToVNode,
} from './createElement'
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
function invokeDestroyHook(vnode) {
  const vm = VNElmMap.get(vnode)
  if (vm !== undefined) {
    vm?.destroy?.(vnode)
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
      parentElm.removeChild(VNElmMap.get(ch))
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
      console.log(oldStartVnode.isDirty)
      patchVnode(newEndVnode, oldStartVnode)
      parentElm.insertBefore(VNElmMap.get(oldStartVnode), VNElmMap.get(oldEndVnode).nextSibling)
      oldStartVnode = oldCh[++oldStartIdx]
      newEndVnode = newCh[--newEndIdx]
      // 新头=旧尾
    } else if (sameVnode(newStartVnode, oldEndVnode)) {
      // Vnode moved left
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
      } else {
        elmToMove = oldCh[idxInOld]
        if (elmToMove.tagName !== newStartVnode.tagName) {
          parentElm.insertBefore(createElm(newStartVnode), VNElmMap.get(oldStartVnode))
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
      const ins = (vnode.ins = oldVnode.ins)
      const oldVn = VNInsMap.get(ins)
      ins.props = vnode.props
      const newVn = ins.render(h)
      patchVnode(newVn, oldVn)
    } else {
      const oldVn = VNInsMap.get(oldVnode)
      const newVn = vnode.type(h, vnode.props)
      vnodeInsMap(vnode, newVn)
      VNInsMap.delete(oldVnode)
      patchVnode(newVn, oldVn)
    }
  } else if (vnode.type === 'text') {
    const elm = VNElmMap.get(oldVnode)
    vnodeElmMap(elm, vnode)
    VNElmMap.delete(oldVnode)
    updateProps(vnode, oldVnode)
  } else {
    const elm = VNElmMap.get(oldVnode)
    const ins = VNInsMap.get(oldVnode)
    if (ins) {
      vnodeInsMap(ins, vnode)
      VNInsMap.delete(oldVnode)
      vnode.ins = ins
    }
    vnodeElmMap(elm, vnode)
    VNElmMap.delete(oldVnode)
    // update childen
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
    return createElm(vnode)
  }
  let isInit = false
  const isRealElment = isDef(oldVnode.nodeType)
  // oldvnode 是dom，先转化为虚拟节点
  if (isRealElment) {
    isInit = true
    const elm = oldVnode
    oldVnode = domToVNode(oldVnode)
    console.log(oldVnode)
    vnodeElmMap(elm, oldVnode)
  }
  // 相同节点则执行更新逻辑
  if (sameVnode(vnode, oldVnode)) {
    patchVnode(vnode, oldVnode)
  } else {
    const oldElm = VNElmMap.get(oldVnode)
    const newElm = createElm(vnode)
    const ins = VNInsMap.get(oldVnode)
    oldElm.parentNode.replaceChild(newElm, oldElm)
    if (ins) {
      VNInsMap.delete(ins)
      VNInsMap.delete(oldVnode)
    }
    VNElmMap.delete(oldVnode)
    VNElmMap.delete(oldElm)
    oldElm = null
  }
  isInit = false
  insertedInsQueue.forEach((ele) => {
    if (ele.mounted) ele.mounted()
  })
  return VNElmMap.get(vnode)
}
