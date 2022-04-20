import { createElement as h } from '../../createElement'
const defaultFormat = [
  {
    name: 'bold',
    type: 'node',
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
    type: 'node',
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
    type: 'style',
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
    type: 'style',
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
        const children = g.children.reduce((prev, mark) => {
          return prev + mark.content
        }, '')
        return h('text', {}, [children])
      } else {
        let pv = null
        let vn = null
        const styleQueue = []
        const formatQuene = this.getFormats(g.formats)
        console.log(formatQuene)
        for (let index = 0; index < formatQuene.length; index++) {
          const current = formatQuene[index]
          // 样式类型的格式放在最后处理
          if (current.fmt.type === 'style') {
            styleQueue.push(current)
            continue
          }
          vn = current.fmt.render(h, vn, current.value)
          if (!pv) pv = vn
        }
        for (let index = 0; index < styleQueue.length; index++) {
          const current = styleQueue[index]
          const res = current.fmt.render(h, vn, current.value)
          if (res) pv = vn = res
        }
        if (g.children[0].children) {
          vn.children = this.generateVnode(g.children)
        } else {
          const children = g.children.reduce((prev, mark) => {
            return prev + mark.content
          }, '')
          vn.children = [h('text', {}, [children])]
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
    return this.formatMap.get(key)
  }
  canAdd(mark, prevMark, key) {
    // 当前格式为false
    if (!mark.formats[key]) return false
    // 当前有值，上一个没值
    if (!prevMark.formats[key]) return true
    // 连续两个组件
    if (this.get(key).type === 'component') return false
    // 连续两个格式
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
      // 包含组件格式 不嵌套
      if (
        prevMark &&
        Object.keys(prevMark.formats).some((key) => this.get(key).type === 'component')
      ) {
        counter = cacheCounter
        break
      }
      // 上一个是纯文本,下一个有格式
      if (prevMark && prevMaxCounter === 0 && maxCounter > prevMaxCounter) {
        counter = cacheCounter
        break
      }
      // 上一个和当前比没有格式增长
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
    if (res.children.length > 1)
      res.children = this.group(
        {
          marks: res.children,
          types: retainkeys,
          formats: [],
        },
        0
      )
    r.push(res)
    if (index < group.marks.length) {
      this.group(group, index, r)
    }
    return r
  }
}
