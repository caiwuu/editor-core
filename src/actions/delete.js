import { getVn, getMark, queryPath } from '@/model'
export default function del([{ node, pos }, to]) {
  const marks = getMark(getVn(node))
  if (marks) {
    const R = this.selection.ranges[0]
    let path = queryPath(node, this.path, R.startOffset)
    if (R.startOffset === 0) {
      path = path.prev
      pos = path.node.data.length
    }
    path.node.data = path.node.data.slice(0, pos - to) + path.node.data.slice(pos)
    const component = path.parent.node.data.component
    component.updateState(this, path)

    R.startOffset -= to
    R.collapse(true)
  }
}
