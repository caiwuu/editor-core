import { getVn, getMark, queryPath } from '@/model'
export default function del([R]) {
  if (R.collapsed) {
    const { startContainer, startOffset } = R
    // 非文本
    if (startContainer.nodeType !== 3) {
      return
    } else {
      // 文本
      let path = queryPath(startContainer, this.path, startOffset)
      const component = path.component
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
