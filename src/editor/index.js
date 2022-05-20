import Selection from '@/selection'
import { EventProxy } from '@/eventProxy'
import emit from 'mitt'
import { mountContent } from './renderRoot'
import registerActions from '@/actions'
import { getVn, getMark, queryPath } from '@/model'
export default class Editor {
  ui = {
    body: null,
  }
  constructor(id) {
    mountContent(id, this)
    this.emitter = emit()
    this.ui.body = document.getElementById(id)
    new EventProxy(this)
    this.selection = new Selection(this)
    registerActions(this)
  }
  on(eventName, fn) {
    this.emitter.on(eventName, fn)
  }
  emit(eventName, args) {
    this.emitter.emit(eventName, args)
  }
  focus() {
    this.emitter.emit('focus')
  }
  queryPath(elm, offset = 0) {
    return queryPath(elm, this.path, offset)
  }
}
