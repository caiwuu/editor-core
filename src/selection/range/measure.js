import { multiplication } from '@/utils'
export default class Measure {
  dom = null
  instance = null
  constructor() {
    if (!Measure.instance) {
      this.dom = document.createElement('text')
      Measure.instance = this
    } else {
      return Measure.instance
    }
  }
  measure (container, offset) {
    // splitText(0)会使原dom销毁造成startContainer向上逃逸， nodeName = '#text'
    let temp
    if (container.nodeName === '#text') {
      if (!offset) {
        container.parentNode.insertBefore(this.dom, container)
      } else {
        temp = container.splitText(offset)
        container.parentNode.insertBefore(this.dom, temp)
      }
    } else {
      if (container.childNodes[offset - 1] && container.childNodes[offset - 1].nodeName === 'BR') {
        container.insertBefore(this.dom, container.childNodes[offset - 1])
      } else if (container.childNodes[offset]) {
        container.insertBefore(this.dom, container.childNodes[offset])
      } else {
        container.appendChild(this.dom)
      }
    }
    return this._getRect(container, offset, temp)
  }
  computeOffset (dom, res = { x: 0, y: 0, h: null }) {
    res.h = res.h ?? dom.offsetHeight
    res.x += dom.offsetLeft
    res.y += dom.offsetTop
    if (dom.offsetParent && dom.offsetParent.tagName !== 'BODY') {
      return this.computeOffset(dom.offsetParent, res)
    }
    return res
  }
  _getRect (container, offset, temp) {
    let con = container
    if (!(container instanceof Element)) {
      con = container.parentNode
    }
    const copyStyle = getComputedStyle(con)
    const h = multiplication(copyStyle.fontSize, 1.3) / 1
    const rect = { ...this.computeOffset(this.dom), h }
    this.dom.remove()
    if (container.nodeName === '#text' && offset) {
      if (!container.data && container.nextSibling) {
        container.nextSibling.remove()
      } else {
        container.data += temp.data
        temp.remove()
      }
    }
    return rect
  }
}
