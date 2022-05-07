export default function del(force = false) {
  if (this.inputState.isComposing && !force) return
  this.editor.emit('delete', this)
}
