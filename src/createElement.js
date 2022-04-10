import Component from "./component"
import { stylesModule } from './modules/styles'
import { attributesModule } from './modules/attributes'
import { listenersModule } from './modules/listeners'
import { classesModule } from './modules/classes'
const BUILTINPROPS = ['ref','key','ns']
class Child extends Component{
    render(){
        return <span onClick={()=>console.log(22)}>{this.props.name}</span>
    }
}
function updateProps(elm,vnode,oldVnode){
    stylesModule.update(elm,vnode,oldVnode)
    classesModule.update(elm,vnode,oldVnode)
    listenersModule.update(elm,vnode,oldVnode)
    attributesModule.update(elm,vnode,oldVnode)
}
function createElm(vnode){
    let elm;
    if(vnode.type==='text'){
        return document.createTextNode(vnode.children)
    }
    if(typeof vnode.type==='function'){
        if(vnode.type.isComponent){
            const ins = new vnode.type(vnode.props)
            const vn = ins.render(createElement)
            elm = createElm(vn)
        }else{
            const vn = vnode.type(createElement,vnode.props)
            elm = createElm(vn)
        }
    }else{
        elm = vnode.ns
      ? document.createElementNS(vnode.ns, vnode.type)
      : document.createElement(vnode.type)
    }
    if(vnode.children.length===1){
        elm.appendChild(createElm(vnode.children[0]))
    }else if(vnode.children.length>1){
        const fragment = document.createDocumentFragment()
        for (let index = 0; index < vnode.children.length; index++) {
            const ch = vnode.children[index];
            fragment.appendChild(createElm(ch))
        }
        elm.appendChild(fragment)
    }
    updateProps(elm,vnode)
    return elm
}
export function createElement(type,config,children){
    const props = {}
    const ref = config.ref||null
    const key = config.key||null
    for(let propName in config){
        if(!BUILTINPROPS.includes(propName)){
            props[propName] = config[propName]
        }
    }
    return Element(type,key ,ref,props,children)
}

function Element(type,key ,ref,props,children){
    const element = {
        type,
        key,
        ref,
        props,
        children:children.map(ele=>{
            if(typeof ele==='string'||!ele){
                return {
                    type:'text',
                    children:ele
                }
            }else{
                return ele
            }
        })
    }
    if(Object.freeze){
        Object.freeze(element.props)
        Object.freeze(element.children)
        Object.freeze(element)
    }
    return element
}
function mount(elm,container){
    document.querySelector(container).appendChild(elm)
}
// test
function render(){
    console.log(arguments);
    return <div  class="www ss"  style={{color:'red'}} id="ids" ref="qq"><span  style={{'fontSize':'20px',color:'cyan'}}>234</span><Child name='this is a span'></Child></div>
}
const vn = render(createElement)
console.log(vn);
const elm = createElm(vn)
mount(elm,'#editor-root')
console.log(createElm(vn));