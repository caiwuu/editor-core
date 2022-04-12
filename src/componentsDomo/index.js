import { patch } from '../patch'
import { createElement as h } from '../createElement'
import ColorPicker from './colorPicker'
patch(test(h), document.getElementById('components-test'))

function test() {
  return <ColorPicker color='#36cabd'></ColorPicker>
}
