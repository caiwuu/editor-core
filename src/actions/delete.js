export default function del({ range }) {
  if (range.collapsed) {
    const { startContainer, startOffset } = range
    // 非文本
    if (startContainer.nodeType !== 3) {
      return
    } else {
      // 文本
      let path = this.queryPath(startContainer, startOffset)
      const component = path.component
      // if (startOffset === 0) {
      //   path = path.prev
      //   pos = path.node.data.length
      // }

      path.node.data = path.node.data.slice(0, startOffset - 1) + path.node.data.slice(startOffset)
      component.updateState(this, path)

      range.startOffset -= 1
      range.collapse(true)
    }
  }
}
