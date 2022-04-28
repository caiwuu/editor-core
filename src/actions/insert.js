import { getVn, getMark, queryPath } from '@/model'
export default function insert([{ node, pos, R }, data]) {
  const path = queryPath(getMark(getVn(node))[0], this.path)
  path.node.data = path.node.data.slice(0, pos) + data + path.node.data.slice(pos)
  const ins = path.parent.node.data.component
  ins._update_()
  R.endOffset += data.length
  R.startOffset += data.length
  // R.updateCaret()
}
