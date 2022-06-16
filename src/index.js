// import './componentsDomo/index'
import Editor from '@/editor'
import './style.styl'
Object.defineProperty(window, 'stringify', {
  value: (obj) => {
    let cache = []
    let res = JSON.stringify(obj, (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (cache.indexOf(value) !== -1) {
          // 移除
          return 'Circular reference'
        }
        // 收集所有的值
        cache.push(value)
      }
      return value
    })
    cache = null // 清空变量，便于垃圾回收机制回收
    return res
  },
  writable: false,
  enumerable: false,
  configurable: false,
})
window.editor = new Editor('editor-root')
