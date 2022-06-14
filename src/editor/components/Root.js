import { createElement as h, formater, Content } from '@/model'
// 根组件
export default class Root extends Content {
    render () {
        return (
            <div id='editor-content'>
                {this.state.marks.length ? formater.render(this.state.marks) : this.state.placeholder(h)}
            </div>
        )
    }
}