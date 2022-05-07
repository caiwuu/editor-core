import { getVn, getMark, queryPath } from '@/model'
export default function del([R]) {
  if (R.collapsed) {
    const { startContainer, startOffset } = R
    const marks = getMark(getVn(startContainer))
    console.log(marks)
    if (marks) {
      let path = queryPath(startContainer, this.path, startOffset)
      const component = path.parent.node.data.component
      if (startOffset === 0) {
        path = path.prev
        pos = path.node.data.length
      }
      path.node.data = path.node.data.slice(0, startOffset - 1) + path.node.data.slice(startOffset)
      component.updateState(this, path)

      R.startOffset -= 1
      R.collapse(true)
    }
  }
}
