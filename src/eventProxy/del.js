export default function del(force = false) {
  if (this.inputState.isComposing && !force) return
  const from = { node: this.endContainer, pos: this.endOffset }
  const to = this.collapsed ? 1 : { node: this.startContainer, pos: this.startOffset }
  this.editor.emit('delete', from, to)
}
