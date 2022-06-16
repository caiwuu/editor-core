import { createElement as h, formater, createRef } from '@/model'
import Block from './Block'
export default class Paragraph extends Block {
  render() {
    return <div>{this.contentLength ? formater.render(this.state.marks) : <br />}</div>
  }
}
