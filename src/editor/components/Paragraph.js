import { createElement as h, formater, Content, createRef } from '@/model'
export default class Paragraph extends Content {
    render () {
        return <div>{this.contentLength ? formater.render(this.state.marks) : <br />}</div>
    }
}