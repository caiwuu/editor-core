/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-07-04 16:36:23
 */
export default function caretMove({ direction, drawCaret, shiftKey }) {
  switch (direction) {
    case 'left':
      this.selection.ranges.forEach((range) => {
        console.log(range)
        if (range.collapsed) {
          const { startContainer, startOffset } = range
          // 非文本
          if (startContainer.nodeType !== 3) {
            const parentPath = this.queryPath(startContainer, startOffset)
            const imagePath = this.queryPath(parentPath.children[startOffset - 1])
            imagePath.component.onArrowLeft(imagePath, range, this, shiftKey)
          } else {
            // 文本
            let path = this.queryPath(startContainer, startOffset)
            const component = path.component
            component.onArrowLeft(path, range, this, shiftKey)
          }
        } else {
          range.collapse()
        }
      })
      break

    default:
      console.log(direction, drawCaret, shiftKey)
      break
  }
  Promise.resolve().then(() => {
    this.selection.ranges.forEach((range) => {
      range.updateCaret(drawCaret)
    })
  })
}
