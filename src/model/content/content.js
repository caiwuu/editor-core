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
    // 重置选区
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
    path.node.data = path.node.data.slice(0, range.startOffset - 1) + path.node.data.slice(range.startOffset)
    this.updateState(path, range, editor)
    range.startOffset -= 1
    range.collapse(true)
  }

  /**
   *
   * 状态更新之后钩子
   * @param {*} { range, path }
   * @memberof Content
   */
  afterUpdateState ({ range, path }) {
    if (!this.contentLength) {
      console.log(this.state.marks)
      console.log(path)
      const prev = path.prev
      path.delete()
      range.setStart($root, 1)
      range.collapse(true)
    }
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