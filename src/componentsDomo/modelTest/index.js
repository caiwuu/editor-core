import { createElement as h, Formater, patch, Content, getVn, getElm, setVnElm, setVnIns, delVnElm, delVnIns } from '@/model/index'
import { customFmt, formater } from './customFmt'
import { data } from './data'
// 自定义格式
customFmt.forEach(ele => {
  formater.register(ele)
})

export class Root extends Content {
  render () {
    return (
      <div>
        {this.state.marks.length ? formater.render(this.state.marks) : this.state.placeholder(h)}
      </div>
    )
  }
}
function modelTest (h) {
  return (
    <div id='editor-root'>
      <Root data={data}></Root>
    </div>
  )
}
patch(modelTest(h), document.getElementById('editor-root'))

function queryNode (position) {
  const posArr = position.split('-')
  if (posArr.length === 1 && posArr[0] === '0') {
    return data
  } else {
    return posArr.slice(1).reduce((prev, index) => {
      return prev.data.marks[index]
    }, { data })
  }
}
console.log(queryNode('0-5-0'));

window.utils = { getVn, getElm, setVnElm, setVnIns, delVnElm, delVnIns, queryNode, formater }