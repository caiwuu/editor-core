import insert from './insert'
import del from './delete.js'
export default function registerActions(editor) {
  // 内容插入
  editor.on('insert', insert.bind(editor))
  editor.on('delete', del.bind(editor))
}
