import { getVn, getElm, getMark, queryPath } from '@/model'
export default function insert([{ node, pos, R }, data]) {
  const marks = getMark(getVn(node))
  if (marks) {
    const path = queryPath(marks[0], this.path)
    const component = path.parent.node.data.component
    path.node.data = path.node.data.slice(0, pos) + data + path.node.data.slice(pos)
    component.updateState(this, path)
    console.log(component.state.marks)
    R.startOffset += data.length
    R.collapse(true)
  } else {
    const vn = getVn(node)
    const component = vn.ins
    const path = queryPath(vn.ins.state.marks[0], this.path)
    path.node.data = path.node.data.slice(0, pos) + data + path.node.data.slice(pos)
    component.updateState(this, path)
    const elm = getElm(getVn(path.node))
    R.setStart(elm, data.length)
    R.collapse(true)
  }
}
