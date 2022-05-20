import {
  createElement as h,
  patch,
  Content,
  getVn,
  getElm,
  getMark,
  setVnElm,
  setVnIns,
  delVnElm,
  delVnIns,
  createPath,
  queryPath,
} from '@/model'
import { formats, formater } from './formats'
import { mark } from './data'
// 注册自定义格式
formats.forEach((ele) => {
  formater.register(ele)
})

// 根组件
class Root extends Content {
  render() {
    return (
      <div id='editor-content'>
        {this.state.marks.length ? formater.render(this.state.marks) : this.state.placeholder(h)}
      </div>
    )
  }
}
function renderRoot(h) {
  return (
    <div id='editor-root'>
      <Root data={mark.data}></Root>
    </div>
  )
}

function mountContent(id, editor) {
  editor.data = mark
  editor.path = createPath(mark)
  createPath(mark)
  patch(renderRoot(h), document.getElementById(id))
}
export { mountContent }

/**
 * ================TEST CODE===========
 */
const path = createPath(mark)
console.log(path)

console.log(queryPath('0-1', path))

window.utils = { getVn, getElm, setVnElm, setVnIns, delVnElm, delVnIns, queryPath, getMark }
