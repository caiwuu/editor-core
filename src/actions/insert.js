import { getVn, getElm, getMark, queryPath } from '@/model'
export default function insert({ range, data }) {
  const { startOffset: pos, startContainer: node } = range
  const marks = getMark(getVn(node))
  if (marks) {
    const path = queryPath(marks[0], this.path)
    const component = path.parent.node.data.component
    path.node.data = path.node.data.slice(0, pos) + data + path.node.data.slice(pos)
    component.updateState(this, path)
    console.log(component.state.marks)
    console.log(path)
    range.startOffset += data.length
    range.collapse(true)
  } else {
    const vn = getVn(node)
    const component = vn.ins
    const path = queryPath(component.state.marks[0], this.path)
    console.log(stringify(path))
    path.node.data = path.node.data.slice(0, pos) + data + path.node.data.slice(pos)
    component.updateState(this, path)
    const elm = getElm(getVn(path.node))
    range.setStart(elm, data.length)
    range.collapse(true)
  }
}
