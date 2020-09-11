const { src, dest, task } = require('gulp');
const compileLess = require('../../lib/less');
const compileTs = require('../../lib/ts');

const merge2 = require('merge2');
const compileJs = require('../../lib/js');

const registerCompileTask = () => {
  task('compile', done => {
    console.log('Going to compile')
    merge2([
      compileLess(src('src/**/*.less', {cwd: process.cwd()})),
      compileTs(src(['src/**/*.tsx', 'src/**/*.ts'], {
        cwd: process.cwd(),
      })),
      compileJs(src(['src/**/*.jsx', 'src/**/*.js'], {
        cwd: process.cwd(),
      }))
    ]).pipe(dest('dest/')).on('finish', function () {
      console.log('compling done');
      done();
    });
  });
};

module.exports = registerCompileTask;
