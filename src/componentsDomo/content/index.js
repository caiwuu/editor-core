import Component from '../../component'
import { createElement } from '../../createElement'
import Formater from './formater'
const formater = new Formater()
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
          formats: { bold: true },
        },
        {
          content: 'world',
          formats: { bold: true, 'font-size': '20px' },
        },
        {
          content: 'hhhha',
          formats: { color: 'red' },
        },
      ],
    }
    const g = this.group(
      {
        marks: this.state.marks,
        keys: formater.keys,
        formats: [],
      },
      0
    )
    console.log(g)
  }
  parser(mark) {
    return mark.content
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
      group.keys.forEach((key) => {
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
      retainkeys = group.keys.filter((ele) => !res.formats.includes(ele))
      prevMaxCounter = maxCounter
      prevMark = mark
    }
    if (res.children.length > 1)
      res.children = this.group(
        {
          marks: res.children,
          keys: retainkeys,
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
    return (
      <div>
        {this.state.marks.length
          ? this.state.marks.map((ele) => this.parser(ele))
          : this.state.placeholder(createElement)}
      </div>
    )
  }
}
