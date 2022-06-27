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
      console.log(getVn(path.parent.node))
      console.log(getElm(getVn(path.parent.node)))
      const $root = this.getBlockRoot()
      path.delete()
      range.setStart($root, 0)
    } else if (path.node.data === '') {
      path.delete()
      let prev = path.prev
      if (prev.children.length > 0) {
        prev = prev.children[prev.children.length - 1]
      }
      range.setStart(prev, prev.node.data.length)
    } else {
      range.startOffset -= 1
    }
    range.collapse(true)
    this.updateState(path, range, editor)
  }
}
