const pathSy = require('path');
const assert = require('assert');

const matchExtensions = stylePath => {
  return stylePath.includes('.less');
}

const babelTransformCssModule = function (babel) {
  const {types: t} = babel;

  return  {
    name: 'babelTransformCssModule',
    pre(state) {
      assert(!this.opts.module || typeof this.opts.module === 'object', 'module is required');
    },
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