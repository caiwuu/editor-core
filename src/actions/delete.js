export default function del({ range }) {
  if (range.collapsed) {
    const { startContainer, startOffset } = range
    // 非文本
    if (startContainer.nodeType !== 3) {
      console.log(this.queryPath(startContainer.childNodes[startOffset - 1]))
      return
    } else {
      // 文本
      let path = this.queryPath(startContainer, startOffset)
      const component = path.component
      component.onBackspace(path, range, this)
    }
  }
}
