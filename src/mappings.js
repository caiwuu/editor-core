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
  VNElmMap.get(elm) && VNElmMap.delete(VNElmMap.get(elm))
  VNElmMap.get(vn) && VNElmMap.delete(VNElmMap.get(vn))
  VNElmMap.set(elm, vn).set(vn, elm)
}
function setVnIns(vn, ins) {
  VNInsMap.get(ins) && VNInsMap.delete(VNInsMap.get(ins))
  VNInsMap.get(vn) && VNInsMap.delete(VNInsMap.get(vn))
  VNInsMap.set(ins, vn).set(vn, ins)
}
window.VNElmMap = VNElmMap
window.VNInsMap = VNInsMap
export { getVn, getElm, setVnElm, setVnIns }
