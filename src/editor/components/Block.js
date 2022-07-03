import { createElement as h, Content, getVn, getElm } from '@/model'
export default class Block extends Content {
  getBlockRoot() {
    if (this.state._$root) return this.state._$root.current
    return getElm(getVn(this))
  }
  onBackspace(path, range, editor) {
    const startOffset = range.startOffset
    if (startOffset > 0) {
      path.node.data = path.node.data.slice(0, startOffset - 1) + path.node.data.slice(startOffset)
      if (!this.contentLength) {
        const $root = this.getBlockRoot()
        path.delete()
        range.setStart($root, 0)
      } else if (path.node.data === '') {
        const prevSibling = this.getPrevPath(path)?.lastLeaf
        path.delete()
        if (prevSibling) {
          range.setStart(prevSibling, prevSibling.node.data.length)
        }
      } else {
        range.startOffset -= 1
      }
    } else {
      console.log(path.prevSibling)
      const prevSibling = this.getPrevPath(path)?.lastLeaf
      if (prevSibling) {
        range.setStart(prevSibling, prevSibling.node.data.length)
      }
    }
    range.collapse(true)
    this.updateState(path, range, editor)
  }
}
