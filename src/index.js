import { createElement as h, insertedInsQueue } from './createElement'
import { patch } from './patch'
import './componentsDomo/index'
import './style.styl'
import { Content } from './componentsDomo/content/index'
function Test() {
  return (
    <div id='editor-root'>
      <Content></Content>
    </div>
  )
}
patch(Test(h), document.getElementById('editor-root'))
