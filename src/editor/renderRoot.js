/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-07-04 14:00:12
 */
import {
  createElement as h,
  patch,
  getVn,
  getElm,
  getMark,
  setVnElm,
  setVnIns,
  delVnElm,
  delVnIns,
  createPath,
  queryPath,
  formater,
} from '@/model'
import { mockData } from './data'
/**
 * @desc: 渲染根节点
 * @param {*} h
 * @return {*}
 */
function renderRoot(h) {
  return <div id='editor-root'>{formater.render([mockData])}</div>
}
/**
 * @desc: 挂载
 * @param {*} id
 * @param {*} editor
 * @return {*}
 */
function mountContent(id, editor) {
  editor.data = mockData
  window.utils.path = editor.path = createPath(mockData)
  createPath(mockData)
  patch(renderRoot(h), document.getElementById(id))
}
export { mountContent }

/**
 * ================TEST CODE===========
 */

window.utils = { getVn, getElm, setVnElm, setVnIns, delVnElm, delVnIns, queryPath, getMark }
