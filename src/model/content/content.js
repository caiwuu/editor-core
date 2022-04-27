import Component from '../component'
export default class Content extends Component {
  constructor(props) {
    super(props)
    this.initState()
  }
  initState() {
    this.props.data.component = this
    let { position, marks } = this.props.data
    if (position === undefined) {
      this.props.data.position = position = '0'
    }
    if (marks) {
      this.state = { marks: this.props.data.marks }
      marks.forEach((ele, index) => {
        ele.position = position + '-' + index
        if (typeof ele.data === 'object') {
          ele.data.position = ele.position
        }
      })
    }
  }
}
