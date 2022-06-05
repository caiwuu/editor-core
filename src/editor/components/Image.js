import { createElement as h, formater, Content, createRef } from '@/model'
export default class Image extends Content {
    render () {
        const { data: src, alt, height, width } = this.state.marks[0]
        return <img width={width} height={height} src={src} alt={alt}></img>
    }
}