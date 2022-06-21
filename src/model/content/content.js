import Component from '../component'
import { isPrimitive } from '../../utils'
export default class Content extends Component {
  constructor(props) {
    super(props)
    this.initState()
  }
  initState () {
    this.props.data.component = this
    if (this.props.data) {
      this.state = { marks: this.props.data.marks }
    }
  }

  /**
   * 更新状态
   * @param {*} path
   * @param {*} range
   * @param {*} editor
   * @memberof Content
   */
  updateState (path, range, editor) {
    this.beforeUpdateState && this.beforeUpdateState({ path, range, editor })
    this._update_()
    this.afterUpdateState && this.afterUpdateState({ range, editor, path })
  }

  /**
   * 或内容长度
   * @readonly
   * @memberof Content
   */
  get contentLength () {
    return this.state.marks.reduce((prev, ele) => {
      return prev + computeLen(ele)
    }, 0)
  }

  /**
   *
   * 删除动作
   * @param {*} path
   * @param {*} range
   * @param {*} editor
   * @memberof Content
   */
  onBackspace (path, range, editor) {
    console.error('组件未实现onBackspace方法');
  }
}

function computeLen (mark) {
  if (!mark.formats) return 1
  if (isPrimitive(mark.data)) {
    return mark.data.length
  }
  return mark.data.marks.reduce((prev, ele) => {
    return prev + computeLen(ele)
  }, 0)
}