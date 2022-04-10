export default class Component{
    static isComponent=true
    constructor(props){
        this.props = Object.freeze({ ...props })
    }
    render(h) {
        throw Error('Component does not implement a required interface "render"')
    }
}