import { createElement as h, formater, Content, createRef } from '@/model'
import Block from './Block'
export class Table extends Content {
  render() {
    return (
      <table border='1' style='border-collapse:collapse;width:600px'>
        {formater.render(this.state.marks)}
      </table>
    )
  }
}
export class Row extends Content {
  render() {
    return <tr>{formater.render(this.state.marks)}</tr>
  }
}
export class Col extends Block {
  constructor(props) {
    super(props)
    this.state._$root = createRef()
  }
  render() {
    return (
      <td ref={this.state._$root} style='text-align:center;width:50%'>
        {this.contentLength ? formater.render(this.state.marks) : <br />}
      </td>
    )
  }
}
