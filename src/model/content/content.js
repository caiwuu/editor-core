import Component from '../component'
import { isPrimitive } from '../../utils'
export default class Content extends Component {
  constructor(props) {
    super(props)
    this.initState()
  }
  /**
   * 初始化状态
   */
  initState() {
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
  updateState(path, range, editor) {
    this.beforeUpdateState && this.beforeUpdateState({ path, range, editor })
    // 同步更新
    // this.syncUpdate()
    // 异步更新
    return this.setState().then(() => {
      this.afterUpdateState && this.afterUpdateState({ range, editor, path })
    })
  }

  /**
   * 内容长度
   * @readonly
   * @memberof Content
   */
  get contentLength() {
    return this.state.marks.reduce((prev, ele) => {
      return prev + computeLen(ele)
    }, 0)
  }

  /**
   *
   * 删除动作
   * @param {*} path 路径
   * @param {*} range 区间
   * @param {*} editor 编辑器
   * @memberof Content
   */
  onBackspace(path, range, editor) {
    const startOffset = range.startOffset
    if (startOffset > 0) {
      path.node.data = path.node.data.slice(0, startOffset - 1) + path.node.data.slice(startOffset)
      if (path.node.data === '') {
        const prev = getPrevPath(path).lastLeaf
        path.delete()
        if (prev) {
          range.setStart(prev, prev.node.data.length)
        }
      } else {
        range.startOffset -= 1
      }
    } else {
      const prev = getPrevPath(path).lastLeaf
      if (prev) {
        range.setStart(prev, prev.node.data.length)
      }
    }
    range.collapse(true)
    this.updateState(path, range, editor)
  }
  /**
   *
   * 箭头上动作
   * @param {*} path 路径
   * @param {*} range 区间
   * @param {*} editor 编辑器
   * @memberof Content
   */
  onArrowUp(path, range, editor) {
    console.error('组件未实现onArrowUp方法')
  }
  /**
   *
   * 箭头右动作
   * @param {*} path 路径
   * @param {*} range 区间
   * @param {*} editor 编辑器
   * @memberof Content
   */
  onArrowRight(path, range, editor) {
    console.error('组件未实现onArrowRight方法')
  }
  /**
   *
   * 箭头下动作
   * @param {*} path 路径
   * @param {*} range 区间
   * @param {*} editor 编辑器
   * @memberof Content
   */
  onArrowDown(path, range, editor) {
    console.error('组件未实现onArrowDown方法')
  }
  /**
   *
   * 箭头左动作
   * @param {*} path 路径
   * @param {*} range 区间
   * @param {*} editor 编辑器
   * @memberof Content
   */
  onArrowLeft(path, range, editor, shiftKey) {
    if (range.startOffset === 0) {
      let prev = this.getPrevPath(path).lastLeaf
      if (isImage(prev)) {
        console.log(prev.parent.parent)
        console.log(prev.parent.index)
        range.setStart(prev.parent.parent, prev.parent.index + 1)
      } else {
        range.setStart(prev, prev.node.data.length)
      }
    } else {
      range.startOffset -= 1
    }
    range.collapse(true)
    this.updateState(path, range, editor)
  }
  /**
   *
   * 回车动作
   * @param {*} path 路径
   * @param {*} range 区间
   * @param {*} editor 编辑器
   * @memberof Content
   */
  onEnter(path, range, editor) {
    console.error('组件未实现onEnter方法')
  }
  /**
   * @desc: 获取前一个路径
   * @param {*} path
   * @return {*}
   */
  getPrevPath(path) {
    return path.prevSibling || this.getPrevPath(path.parent)
  }
  /**
   * @desc: 获取下一个路径
   * @param {*} path
   * @return {*}
   */
  getNextPath(path) {
    return path.NextSibling || this.getNextPath(path.parent)
  }
}
/**
 * @desc: 计算mark长度
 * @param {*} mark
 * @return {*}
 */
function computeLen(mark) {
  if (!mark.formats) return 1
  if (isPrimitive(mark.data)) {
    return mark.data.length
  }
  return mark.data.marks.reduce((prevSibling, ele) => {
    return prevSibling + computeLen(ele)
  }, 0)
}
/**
 * @desc: 判断是否为图片
 * @param {*} path
 * @return {*}
 */
function isImage(path) {
  return !path.node.formats
}
