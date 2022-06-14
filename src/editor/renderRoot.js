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
  formater
} from '@/model'
import { mockData } from './data'

function renderRoot (h) {
  return (
    <div id='editor-root'>
      {formater.render([mockData])}
    </div>
  )
}

function mountContent (id, editor) {
  editor.data = mockData
  editor.path = createPath(mockData)
  createPath(mockData)
  patch(renderRoot(h), document.getElementById(id))
}
export { mountContent }

/**
 * ================TEST CODE===========
 */
const path = createPath(mockData)
console.log(path)

console.log(queryPath('0-1', path))

window.utils = { getVn, getElm, setVnElm, setVnIns, delVnElm, delVnIns, queryPath, getMark }
