import { createElement as h } from './createElement'
import { getVn } from './mappings'
import patch from './patch'
import enqueueSetState from './enqueueSetState'
export default class Component {
  static isComponent = true
  constructor(props) {
    this.props = Object.freeze({ ...props })
  }
  render (h) {
    throw Error('Component does not implement a required interface "render"')
  }
  setState (partialState = {}) {
    enqueueSetState(partialState, this)
  }
  _update_ () {
    const oldVn = getVn(this)
    const newVn = this.render(h)
    patch(newVn, oldVn)
  }
}
