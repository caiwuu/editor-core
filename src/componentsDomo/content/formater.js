import { createElement as h } from '../../createElement'
const defaultFormat = [
  {
    name: 'bold',
    type: 'inline',
    render: (h, vnode, value) => {
      const vn = <strong></strong>
      if (vnode) {
        vnode.children.push(vn)
      }
      return vn
    },
  },
  {
    name: 'underline',
    type: 'inline',
    render: (h, vnode, value) => {
      const vn = <u></u>
      if (vnode) {
        vnode.children.push(vn)
      }
      return vn
    },
  },
  {
    name: 'font-size',
    type: 'attribute',
    render: (h, vnode, value) => {
      if (vnode) {
        if (!vnode.props.style) vnode.props.style = {}
        vnode.props.style['font-size'] = value
      } else {
        return <span style={{ 'font-size': value }}></span>
      }
    },
  },
  {
    name: 'color',
    type: 'attribute',
    render: (h, vnode, value) => {
      if (vnode) {
        console.log(vnode)
        if (!vnode.props.style) vnode.props.style = {}
        vnode.props.style['color'] = value
      } else {
        return <span style={{ color: value }}></span>
      }
    },
  },
]
export default class Formater {
  formatMap = new Map()
  constructor() {
    defaultFormat.forEach((format) => {
      this.register(format)
    })
  }
  register(format) {
    this.formatMap.set(format.name, format)
  }
  render(marks, root = null) {
    const gs = this.group(
      {
        marks: marks,
        types: this.types,
        formats: [],
      },
      0
    )
    console.log(gs)
    const vn = this.generateVnode(gs, root)
    return vn
  }
  generateVnode(gs, root) {
    return gs.map((g) => {
      if (g.formats.length === 0) {
        const children = [
          g.children.reduce((prev, mark) => {
            return prev + mark.data
          }, ''),
        ]
        return h('text', {}, children)
      } else {
        let pv = null
        let vn = null
        const inlineQueue = []
        const attributeQueue = []
        const formatQuene = this.getFormats(g.formats)
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
          vn = current.fmt.render(h, vn, current.value)
          if (!pv) pv = vn
        }
        for (let index = 0; index < inlineQueue.length; index++) {
          const current = inlineQueue[index]
          vn = current.fmt.render(h, vn, current.value)
          if (!pv) pv = vn
        }
        for (let index = 0; index < attributeQueue.length; index++) {
          const current = attributeQueue[index]
          const res = current.fmt.render(h, vn, current.value)
          if (res) pv = vn = res
        }
        if (g.children[0].children) {
          vn.children = this.generateVnode(g.children)
        } else {
          const children = [
            g.children.reduce((prev, mark) => {
              return prev + mark.data
            }, ''),
          ]
          vn.children = [h('text', {}, children)]
        }
        return pv
      }
    })
  }
  get types() {
    return [...this.formatMap.keys()]
  }
  getFormats(objs) {
    return objs.map((obj) => {
      const key = Object.keys(obj)[0]
      return {
        fmt: this.formatMap.get(key),
        value: obj[key],
      }
    })
  }
  get(key) {
    return this.formatMap.get(key) || {}
  }
  canAdd(mark, prevMark, key) {
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
  group(group, index, r = []) {
    const res = { formats: [], children: [] }
    let retainkeys = []
    let prevMark = null
    let counter = {}
    let prevMaxCounter = 0
    for (index; index < group.marks.length; index++) {
      let cacheCounter = { ...counter }
      const mark = group.marks[index]
      group.types.forEach((key) => {
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
      if (prevMark && Object.keys(mark.formats).some((key) => this.get(key).type === 'block')) {
        prevMark = null
        break
      }
      if (prevMark && Object.keys(prevMark.formats).some((key) => this.get(key).type === 'block')) {
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
      res.children.push(mark)
      res.formats = Object.entries(counter)
        .filter((ele) => ele[1] && ele[1] === maxCounter)
        .map((ele) => ({ [ele[0]]: group.marks[index].formats[ele[0]] }))
      retainkeys = group.types.filter(
        (ele) =>
          !res.formats.some((i) => {
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
    if (res.formats.length > 0 && res.children.length > 1) {
      res.children = this.group(
        {
          marks: res.children,
          types: retainkeys,
          formats: [],
        },
        0
      )
    }
    r.push(res)
    if (index < group.marks.length) {
      this.group(group, index, r)
    }
    return r
  }
}
