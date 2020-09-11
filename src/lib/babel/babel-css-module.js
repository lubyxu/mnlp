const pathSy = require('path');
const assert = require('assert');

const matchExtensions = stylePath => {
  return stylePath.includes('.less');
}

const babelTransformCssModule = function (babel) {
  const {types: t} = babel;

  return  {
    name: 'babelTransformCssModule',
    visitor: {
      // import c from './style.less';
      ImportDefaultSpecifier(path, { file, opts }) {
        const parentNode = path.parentPath.node;
        const stylePath = parentNode.source.value;

        if (!matchExtensions(stylePath)) {
          return;
        }
        const cssFileName = parentNode.source.value.replace('.less', '.css');
        const fileName = pathSy.join(pathSy.dirname(file.opts.filename), cssFileName);

        let jsonDeclaration = null;
        if (opts.module && opts.module[fileName]) {
          const moduleName = path.node.local.name;
          const json = opts.module[fileName];

          jsonDeclaration = t.variableDeclaration(
            'const',
            [
              t.variableDeclarator(
                t.identifier(moduleName),
                t.objectExpression(
                  Object.entries(json).map(([key, value]) => {
                    return t.objectProperty(t.identifier(key), t.stringLiteral(value))
                  })
                )
              )
            ]
          );
        }
        else {
          jsonDeclaration = t.variableDeclaration(
            'const',
            [
              t.variableDeclarator(
                t.identifier('c'),
                t.newExpression(
                  t.identifier('Proxy'),
                  [
                    t.objectExpression([]),
                    t.objectExpression([
                      t.objectMethod(
                        'method',
                        t.identifier('get'),
                        [
                          t.identifier('target'),
                          t.identifier('key'),
                          t.identifier('value')
                        ],
                        t.blockStatement(
                          [
                            t.returnStatement(t.identifier('key'))
                          ]
                        )
                      )
                    ])
                  ]
                )
              )
            ]
          )
        }
 
        const lines = [
          t.ImportDeclaration(
            [],
            t.stringLiteral(cssFileName)
          ) 
        ].concat(jsonDeclaration ? [jsonDeclaration] : []);

        path.parentPath.replaceWithMultiple(lines);
      }
    }
  };
};

module.exports = babelTransformCssModule;