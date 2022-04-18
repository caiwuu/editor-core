import Component from '../../component'
import { createElement } from '../../createElement'

export class Content extends Component {
  constructor(props) {
    super(props)
    this.state = {
      placeholder: (h) => {
        return <span style='color:#ddd'>placeholder</span>
      },
      marks: [
        {
          content: 'hello world',
          formts: { bold: true },
        },
      ],
    }
  }
  parser(mark) {
    return mark.content
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
