import { getVn, getMark, queryPath } from '@/model'
export default function del([{ node, pos }, to]) {
  const marks = getMark(getVn(node))
  if (marks) {
    const R = this.selection.ranges[0]
    R.startOffset -= to
    R.collapse(true)
    const path = queryPath(getMark(getVn(node))[0], this.path)
    path.node.data = path.node.data.slice(0, pos - to) + path.node.data.slice(pos)
    const component = path.parent.node.data.component
    component.updateState(this, path)
  }
}
