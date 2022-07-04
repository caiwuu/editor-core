/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-07-04 17:03:12
 */
import { createElement as h, formater, Content, createRef } from '@/model'
export default class Image extends Content {
  render() {
    const { data: src, alt, height, width } = this.state.marks[0]
    return <img width={width} height={height} src={src} alt={alt}></img>
  }

  /**
   * 箭头左动作
   * @param {*} path 路径
   * @param {*} range 区间
   * @param {*} editor 编辑器
   * @memberof Content
   */
  onArrowLeft(path, range, editor, shiftKey) {
    const prev = this.getPrevPath(path).lastLeaf
    range.setStart(prev, prev.node.data.length)
    console.log(prev, prev.node.data.length)
    range.collapse(true)
    this.updateState(prev, range, editor)
  }
}
