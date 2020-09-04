const compileJs = require('../../lib/js');
const compileTs = require('../../lib/ts');

const runJsTask = cssModule => {
  gulp.task(
    'js',
    done => {
      compileJs(cssModule)(src(['src/**/*.jsx', 'src/**/*.js']))
        .pipe(
          dest('dest/')
        )
        .on('finish', done);
    }
  );
};

const runTsTask = cssModule => {
  gulp.task(
    'ts',
    done => {
      compileTs(cssModule)(src(['src/**/*.tsx', 'src/**/*.ts']))
        .pipe(dest('dest/'))
        .on('finish', done);
        
    }
  );
};

module.exports = {
  runJsTask,
  runTsTask,
};
