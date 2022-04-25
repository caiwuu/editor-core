const VNElmMap = new WeakMap()
const VNInsMap = new WeakMap()
function getVn(key) {
  if (key.nodeType) return VNElmMap.get(key)
  return VNInsMap.get(key)
}
function getElm(key) {
  return VNElmMap.get(key)
}
function setVnElm(vn, elm) {
  delVnElm(vn)
  VNElmMap.set(elm, vn).set(vn, elm)
}
function setVnIns(vn, ins) {
  delVnIns(vn)
  VNInsMap.set(ins, vn).set(vn, ins)
}
function delVnElm(key) {
  const vnOrElm = VNElmMap.get(key)
  VNElmMap.delete(key)
  VNElmMap.delete(vnOrElm)
}
function delVnIns(key) {
  const vnOrIns = VNInsMap.get(key)
  VNInsMap.delete(key)
  VNInsMap.delete(vnOrIns)
}
window.VNElmMap = VNElmMap
window.VNInsMap = VNInsMap
export { getVn, getElm, setVnElm, setVnIns, delVnElm, delVnIns }
