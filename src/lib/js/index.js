// 目前，只支持css-module。适用于react
const babel = require('gulp-babel');

const compileJs = cssModuleJson => stream => {
  return stream
    .pipe(
      babel({
        presets: [
          // 目前只支持es
          [require.resolve('@babel/env'), {modules: false, useBuiltIns: false}],
          require.resolve('@babel/react')
        ],
        plugins: [
          require.resolve('@babel/plugin-proposal-class-properties'),
          [
            require.resolve('../babel/babel-css-module'),
            {
              module: cssModuleJson,
            },
            require.resolve('@babel/plugin-transform-runtime')
          ]
        ]
      })
    );
};

module.exports = compileJs;
