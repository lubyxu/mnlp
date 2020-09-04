const merge2 = require('merge2');
const typescript = require('gulp-typescript');
const compileJs = require('../js');

const defaultTsConfig = {
  baseUrl: './',
  rootDir: process.cwd(),
  module: 'esnext',
  lib: ['dom', 'esnext'],
  jsx: 'react',
  allowJs: true,
  esModuleInterop: true,
  noImplicitThis: true,
  suppressImplicitAnyIndexErrors: true,
  allowSyntheticDefaultImports: true,
  moduleResolution: 'node',
  target: 'ES2015',
  skipLibCheck: true,
  declaration: true
};

const compileTs = cssModule => stream => {
  const tsStream = stream
    .pipe(
      typescript(defaultTsConfig)
    );

  return merge2([
    tsStream.dts,
    compileJs(cssModule)(tsStream.js)
  ]);
};

module.exports = compileTs;
