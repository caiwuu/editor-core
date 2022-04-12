import { createElement, insertedInsQueue, VNElmMap, VNInsMap, createRef } from './createElement'
import Component from './component'
import { patch } from './patch'
import './componentsDomo/index'
import './style.styl'
function FunCom(h, props) {
  return <del>{props.children}</del>
}
class Child extends Component {
  constructor(props) {
    super(props)
    this.state = { name: 'caiwu', display: false }
    this.dialogRef = createRef()
  }
  render() {
    return (
      <span onClick={this.handleClick}>
        {this.state.name}
        <FunCom>22</FunCom>
        {this.state.display ? (
          <Dialog ref={this.dialogRef}>
            <div>111</div>
          </Dialog>
        ) : (
          ''
        )}
      </span>
    )
  }
  handleClick = () => {
    console.log(this.dialogRef)
    this.setState({ name: 'hhhha', display: !this.state.display })
    // this.dialogRef.current.toggle()
  }
}
export class Dialog extends Component {
  constructor(props) {
    super(props)
    this.state = { visiable: true, count: 0 }
  }
  render() {
    return (
      <div>
        {this.state.visiable ? (
          <div
            style={{
              background: '#ddd',
              height: '200px',
              position: 'absolute',
              top: '200px',
              width: '300px',
              'z-index': 1,
            }}
          >
            {this.props.children?.length ? this.props.children : 'dialog'}
            {this.state.count}
          </div>
        ) : (
          ''
        )}
      </div>
    )
  }
  onMounted() {
    console.log('dialog onMounted')
  }
  toggle() {
    this.state.count++
    this.setState({ visiable: !this.state.visiable })
  }
}
function render() {
  return (
    <div class='www ss' style={{ color: 'red' }} id='editor-root'>
      <span style={{ fontSize: '20px', color: 'cyan' }}>234</span>
      <Child name='this is a span' />
    </div>
  )
}
const vn = render(createElement)
console.log(vn)
// const elm = createElm(vn)
// const elm = patch(vn)
// mount(elm, '#editor-root')
patch(vn, document.getElementById('editor-root'))
// console.log(elm)
window.VNElmMap = VNElmMap
console.log(VNElmMap)
console.log(VNInsMap)
console.log(insertedInsQueue)
