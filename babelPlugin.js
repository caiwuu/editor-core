const babel = require('@babel/core')
const t = require('@babel/types')
const code = `
export class Content extends Component {
  constructor(props) {
    super(props)
    this.state = {
      placeholder: (qq) => {
        return <span style='color:#eee'>placeholder</span>
      },
      marks: [
        // {
        //   content: 'hello world',
        //   formts: { bold: true },
        // },
      ],
    }
  }
  parser(mark) {
    return mark.content
  }
  render() {
    return (
      <div>
        {this.state.marks.length
          ? this.state.marks.map((ele) => this.parser(ele))
          : this.state.placeholder(createElement)}
      </div>
    )
  }
}
`
const visitor = {
  'ClassMethod|FunctionDeclaration'(path, state) {
    const jsxChecker = {
      hasJsx: false,
    }
    path.traverse(
      {
        JSXElement(path) {
          this.hasJsx = true
          path.stop()
        },
      },
      jsxChecker
    )
    if (!jsxChecker.hasJsx) {
      return
    }
    if (isConvertable(path, state)) {
      if (
        !path.node.params.length ||
        (path.node.params.length &&
          path.node.params[0].name !== 'h' &&
          path.node.key.name !== 'constructor')
      ) {
        path
          .get('body')
          .unshiftContainer(
            'body',
            t.variableDeclaration('const', [
              t.variableDeclarator(
                t.identifier('h'),
                t.memberExpression(t.identifier('arguments'), t.numericLiteral(0), true)
              ),
            ])
          )
      }
      path.traverse({
        JSXElement(path, state) {
          path.replaceWith(converJSX(path))
        },
      })
    }
  },
}
function isConvertable(path, state) {
  if (state.opts.nameSpace) {
    return (
      path.node.params.length && path.node.params[path.node.params.length - 1].name === '__editor__'
    )
  } else {
    return true
  }
}
function convertAttrName(node) {
  if (t.isJSXNamespacedName(node.name)) {
    return t.stringLiteral(node.name.namespace.name + ':' + node.name.name.name)
  } else {
    return t.stringLiteral(node.name.name)
  }
}
function convertAttrValue(node) {
  return t.isJSXExpressionContainer(node.value)
    ? node.value.expression
    : node.value
    ? t.stringLiteral(node.value.value)
    : t.booleanLiteral(true)
}
function convertAttribute(attrs) {
  return t.ObjectExpression(
    attrs.map((i) => {
      if (t.isJSXAttribute(i)) {
        const name = convertAttrName(i)
        const value = convertAttrValue(i)
        return t.ObjectProperty(name, value)
      } else if (t.isJSXSpreadAttribute(i)) {
        return t.spreadElement(i.argument)
      }
    })
  )
}
function converJSX(path) {
  if (path.isJSXElement()) {
    const tagName = path.node.openingElement.name.name
    return t.callExpression(t.identifier('h'), [
      tagName.charCodeAt(0) < 96 ? t.identifier(tagName) : t.stringLiteral(tagName),
      convertAttribute(path.node.openingElement.attributes),
      t.ArrayExpression(
        path
          .get('children')
          .map((ele) => converJSX(ele))
          .filter((ele) => ele)
      ),
    ])
  } else if (path.isJSXText()) {
    return path.node.value.replace(/\n\s+/g, '')
      ? t.stringLiteral(path.node.value.replace(/\n\s+/g, ''))
      : null
  } else if (path.isJSXExpressionContainer()) {
    return path.node.expression
  }
}

const result = babel.transform(code, {
  plugins: [
    '@babel/plugin-syntax-jsx',
    [
      {
        visitor: visitor,
      },
      { nameSpace: false },
    ],
  ],
})

console.log(result.code)
