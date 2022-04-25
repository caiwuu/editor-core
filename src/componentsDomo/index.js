import { createElement as h, patch } from '@/model'
import ColorPicker from './colorPicker'
patch(test(h), document.getElementById('components-test'))

function test() {
  return <ColorPicker color='#36cabdaa'></ColorPicker>
}
