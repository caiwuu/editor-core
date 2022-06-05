import { createElement as h, formater, Content, createRef } from '@/model'
export class Table extends Content {
    render () {
        return (
            <table border='1' style='border-collapse:collapse;width:600px'>
                {formater.render(this.state.marks)}
            </table>
        )
    }
}
export class Row extends Content {
    render () {
        return <tr>{formater.render(this.state.marks)}</tr>
    }
}
export class Col extends Content {
    constructor(props) {
        super(props)
        this.state.elmRef = createRef()
    }
    render () {
        return (
            <td ref={this.state.elmRef} style='text-align:center;width:50%'>
                {this.contentLength ? formater.render(this.state.marks) : <br />}
            </td>
        )
    }
    afterUpdateState ({ range }) {
        if (!this.contentLength) {
            console.log(this.state.marks)
            range.setStart(this.state.elmRef.current, 1)
            range.collapse(true)
        }
    }
}