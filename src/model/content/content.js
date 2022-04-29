import Component from '../component'
export default class Content extends Component {
  constructor(props) {
    super(props)
    this.initState()
  }
  initState() {
    this.props.data.component = this
    if (this.props.data) {
      this.state = { marks: this.props.data.marks }
    }
  }
  updateState(editor, path) {
    this.beforeUpdateState && this.beforeUpdateState(editor, path)
    this._update_()
  }
}
