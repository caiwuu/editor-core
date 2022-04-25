import { createElement as h } from '../createElement'
import defaultFormats from './defaultFormats'

export default class Formater {
  formatMap = new Map()
  constructor(VNMarkMap) {
    this.VNMarkMap = VNMarkMap
    defaultFormats.forEach((format) => {
      this.register(format)
    })
  }
  register (format) {
    this.formatMap.set(format.name, format)
  }
  render (marks, root = null) {
    const gs = this.group(
      {
        marks: marks,
        restFormats: this.types,
      },
      0
    )
    const vn = this.generateVnode(gs, root)
    return vn
  }
  invokeRender (vn, current) {
    return current.fmt.render(h, vn, current.value)
  }
  generateVnode (gs, root) {
    return gs.map((g) => {
      let componentQuene
      const formatQuene = this.getFormats(g.commonFormats)
      if (g.commonFormats.length === 0) {
        const markList = []
        const children = [
          g.children.reduce((prev, mark) => {
            // console.log(mark.data)
            markList.push(mark)
            return prev + mark.data
          }, ''),
        ]
        const text = h('text', {}, children)
        this.VNMarkMap.set(text, markList)
        return text
      } else if (
        (componentQuene = formatQuene.filter((ele) => ele.fmt.type === 'component')).length
      ) {
        const mark = g.children[0]
        return componentQuene[0].fmt.render(h, null, mark.data)
      } else {
        let pv = null
        let vn = null
        const inlineQueue = []
        const attributeQueue = []
        for (let index = 0; index < formatQuene.length; index++) {
          const current = formatQuene[index]
          // 属性类型的格式放在最后处理
          if (current.fmt.type === 'inline') {
            inlineQueue.push(current)
            continue
          }
          // 属性类型的格式放在最后处理
          if (current.fmt.type === 'attribute') {
            attributeQueue.push(current)
            continue
          }
          vn = this.invokeRender(vn, current)
          if (!pv) pv = vn
        }
        for (let index = 0; index < inlineQueue.length; index++) {
          const current = inlineQueue[index]
          vn = this.invokeRender(vn, current)
          if (!pv) pv = vn
        }
        for (let index = 0; index < attributeQueue.length; index++) {
          const current = attributeQueue[index]
          const res = this.invokeRender(vn, current)
          if (res) vn = res
          if (!pv) pv = res
        }
        if (g.children[0].commonFormats) {
          vn.children = this.generateVnode(g.children)
        } else {
          const markList = []
          const children = [
            g.children.reduce((prev, mark) => {
              // console.log(mark.data)
              markList.push(mark)
              return prev + mark.data
            }, ''),
          ]
          const text = h('text', {}, children)
          this.VNMarkMap.set(text, markList)
          vn.children = [text]
        }
        return pv
      }
    })
  }
  get types () {
    return [...this.formatMap.keys()]
  }
  getFormats (objs) {
    return objs.map((obj) => {
      const key = Object.keys(obj)[0]
      return {
        fmt: this.formatMap.get(key),
        value: obj[key],
      }
    })
  }
  get (key) {
    return this.formatMap.get(key) || {}
  }
  canAdd (mark, prevMark, key) {
    /**
     * 当前无格式
     */
    if (!mark.formats[key]) return false
    /**
     * 当前有格式，上一个没格式
     */
    if (!prevMark.formats[key]) return true
    /**
     * 当前格式和上一个相同
     */
    if (mark.formats[key] === prevMark.formats[key]) return true
  }
  group (group, index, r = []) {
    const grouped = { commonFormats: [], children: [] }
    let restFormats = []
    let prevMark = null
    let counter = {}
    let prevMaxCounter = 0
    for (index; index < group.marks.length; index++) {
      let cacheCounter = { ...counter }
      const mark = group.marks[index]
      group.restFormats.forEach((key) => {
        if (!prevMark) {
          counter[key] = 0
          if (mark.formats[key]) counter[key]++
        } else if (this.canAdd(mark, prevMark, key)) {
          counter[key]++
        }
      })
      const maxCounter = Math.max(...Object.values(counter))
      /**
       * 块格式 不嵌套
       */
      if (
        prevMark &&
        Object.keys(mark.formats).some((key) => ['block', 'component'].includes(this.get(key).type))
      ) {
        prevMark = null
        break
      }
      if (
        prevMark &&
        Object.keys(prevMark.formats).some((key) =>
          ['block', 'component'].includes(this.get(key).type)
        )
      ) {
        prevMark = null
        break
      }
      /**
       * 上一个是纯文本,下一个有格式
       */
      if (prevMark && prevMaxCounter === 0 && maxCounter > prevMaxCounter) {
        counter = cacheCounter
        break
      }
      /**
       * 上一个和当前比没有格式增长
       */
      if (prevMark && maxCounter === prevMaxCounter && maxCounter !== 0) {
        counter = cacheCounter
        break
      }
      grouped.children.push(mark)
      grouped.commonFormats = Object.entries(counter)
        .filter((ele) => ele[1] && ele[1] === maxCounter)
        .map((ele) => ({ [ele[0]]: group.marks[index].formats[ele[0]] }))
      restFormats = group.restFormats.filter(
        (ele) =>
          !grouped.commonFormats.some((i) => {
            return i[ele]
          })
      )
      prevMaxCounter = maxCounter
      prevMark = mark
    }
    /**
     * 递归边界
     * 1.非空格式集长度小于1
     * 2.空格式集
     */
    if (grouped.commonFormats.length > 0 && grouped.children.length > 1) {
      grouped.children = this.group(
        {
          marks: grouped.children,
          restFormats,
        },
        0
      )
    }
    r.push(grouped)
    if (index < group.marks.length) {
      this.group(group, index, r)
    }
    return r
  }
}