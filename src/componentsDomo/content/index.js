import Component from '../../component'
import { createElement as h } from '../../createElement'
import Formater from './formater'
const formater = new Formater()
const del = {
  name: 'del',
  type: 'node',
  render: (h, element, value) => {
    return <del></del>
  },
}
formater.register(del)
export class Content extends Component {
  constructor(props) {
    super(props)
    this.state = {
      placeholder: (h) => {
        return <span style='color:#ddd'>placeholder</span>
      },
      marks: [
        {
          content: 'hello',
          formats: { del: true },
        },
        {
          content: 'world',
          formats: { bold: true, 'font-size': '20px' },
        },
        {
          content: 'hhhha',
          formats: { color: '#456aec' },
        },
      ],
    }
  }
  toVnode(gs) {
    return gs.map((g) => {
      if (g.formats.length === 0) {
        const children = g.children.reduce((prev, mark) => {
          return prev + mark.content
        }, '')
        return h('text', {}, [children])
      } else {
        const laterQueue = []
        const firstQuene = g.formats
        const formats = formater.getFormats(g.formats)
        const valueMap = g.children[0].formats

        const vn = formater.render(g.formats[0], g.children[0].formats[g.formats[0]])
        if (g.children[0].children) {
          console.log(g.children)
          vn.children = this.toVnode(g.children)
        } else {
          const children = g.children.reduce((prev, mark) => {
            return prev + mark.content
          }, '')
          vn.children = [h('text', {}, [children])]
        }
        return vn
      }
    })
  }
  parser() {
    const gs = this.group(
      {
        marks: this.state.marks,
        types: formater.types,
        formats: [],
      },
      0
    )
    const vn = this.toVnode(gs)
    console.log(vn)
    return vn
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
        } else if (
          (mark.formats[key] && mark.formats[key] === prevMark.formats[key]) ||
          (mark.formats[key] && !prevMark.formats[key])
        ) {
          counter[key]++
        }
      })
      const maxCounter = Math.max(...Object.values(counter))
      if (prevMark && prevMaxCounter === 0 && maxCounter > prevMaxCounter) {
        counter = cacheCounter
        break
      }
      if (prevMark && maxCounter === prevMaxCounter && maxCounter !== 0) {
        counter = cacheCounter
        break
      }
      res.children.push(mark)
      res.formats = Object.entries(counter)
        .filter((ele) => ele[1] && ele[1] === maxCounter)
        .map((ele) => ele[0])
      retainkeys = group.types.filter((ele) => !res.formats.includes(ele))
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
  render() {
    return <div>{this.state.marks.length ? this.parser() : this.state.placeholder(h)}</div>
  }
}
