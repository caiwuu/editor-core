import { getVn, getMark, queryPath } from '@/model'
export default function del([{ node, pos }, to]) {
  console.log(pos, to)
  const path = queryPath(getMark(getVn(node))[0], this.path)
  path.node.data = path.node.data.slice(0, pos - to) + path.node.data.slice(pos)
  const ins = path.parent.node.data.component
  // ins.setState()
  // Promise.resolve().then(() => {
  //   const R = this.selection.ranges[0]
  //   R.endOffset -= to
  //   R.startOffset -= to
  //   R.updateCaret()
  // })
}
