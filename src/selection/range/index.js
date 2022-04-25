import Caret from './caret'
export default class Range {
  inputState = {
    // 输入框状态
    value: '',
    isComposing: false,
  }
  _d = 0
  constructor(nativeRange, editor) {
    const { startContainer, endContainer, startOffset, endOffset } = nativeRange
    this.endContainer = endContainer
    this.startContainer = startContainer
    this.endOffset = endOffset
    this.startOffset = startOffset
    this.editor = editor
    this.caret = new Caret(this)
  }
  get collapsed() {
    return this.endContainer === this.startContainer && this.endOffset === this.startOffset
  }
  setEnd(endContainer, endOffset) {
    this.endContainer = endContainer
    this.endOffset = endOffset
  }
  setStart(startContainer, startOffset) {
    this.startContainer = startContainer
    this.startOffset = startOffset
  }
  collapse(toStart) {
    if (toStart) {
      this.endContainer = this.startContainer
      this.endOffset = this.startOffset
    } else {
      this.startOffset = this.endOffset
      this.startContainer = this.endContainer
    }
  }
  updateCaret(drawCaret = true) {
    this.caret.update(this, drawCaret)
  }
  remove() {
    const index = this.editor.selection.ranges.findIndex((i) => i === this)
    this.caret.remove()
    this.editor.selection.ranges.splice(index, 1)
  }
}
