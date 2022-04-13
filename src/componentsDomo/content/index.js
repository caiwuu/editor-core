import Component from '../../component'
import { createRef } from '../../createElement'

export class Content extends Component {
  constructor(props) {
    super(props)
    this.setState = {}
  }
  render() {
    return <span>content</span>
  }
}
