// 目前，只支持css-module。适用于react
const babel = require('gulp-babel');

const compileJs = stream => {
  return stream
    .pipe(
      babel({
        presets: [
          // 目前只支持es
          [require.resolve('@babel/preset-env'), {modules: false, useBuiltIns: false}],
          require.resolve('@babel/preset-react')
        ],
        plugins: [
          [
            require.resolve('../babel/babel-css-module'),
            {
              module: false,
            }
          ],
          require.resolve('@babel/plugin-proposal-class-properties'),
          require.resolve('@babel/plugin-transform-runtime'),
          require.resolve('babel-plugin-typescript-to-proptypes'),
        ]
      })
    );
};

module.exports = compileJs;
