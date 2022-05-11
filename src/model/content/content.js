import Component from '../component'
import { isPrimitive } from '../../utils'
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
    // 重置选区
    if (this.resetRange) {
      const range = editor.selection.getRangeAt(0)
      this.resetRange(range, editor, path)
    }
  }
  get contentLength() {
    return this.state.marks.reduce((prev, ele) => {
      return prev + this.computeLen(ele)
    }, 0)
  }
  computeLen(mark) {
    if (!mark.formats) return 1
    if (isPrimitive(mark.data)) {
      return mark.data.length
    }
    return mark.data.marks.reduce((prev, ele) => {
      return prev + this.computeLen(ele)
    }, 0)
  }
}
