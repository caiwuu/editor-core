import { createElement as h, Content, getVn, getElm } from '@/model'
export default class Block extends Content {
  afterUpdateState({ range, path }) {
    const $root = this.getBlockRoot()
    if (!this.contentLength) {
      console.log(this.state.marks)
      console.log(path)
      //   path.delete()
      range.setStart($root, 1)
      range.collapse(true)
    }
  }
  getBlockRoot() {
    if (this.state._$root) return this.state._$root.current
    return getElm(getVn(this))
  }
}
