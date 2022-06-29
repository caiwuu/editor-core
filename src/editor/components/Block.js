import { createElement as h, Content, getVn, getElm } from '@/model'
export default class Block extends Content {
  getBlockRoot() {
    if (this.state._$root) return this.state._$root.current
    return getElm(getVn(this))
  }
  onBackspace(path, range, editor) {
    path.node.data =
      path.node.data.slice(0, range.startOffset - 1) + path.node.data.slice(range.startOffset)
    if (!this.contentLength) {
      const $root = this.getBlockRoot()
      path.delete()
      range.setStart($root, 0)
    } else if (path.node.data === '') {
      path.delete()
      let prev = path.prev.lastLeaf
      range.setStart(prev, prev.node.data.length)
    } else {
      range.startOffset -= 1
    }
    range.collapse(true)
    this.updateState(path, range, editor)
  }
}
