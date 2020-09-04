const {task} = require('gulp');
const compileLess = require('../../lib/less');

const runLess = () => {
  task(
    'less',
    (done) => {
      compileLess(src('src/**/*.less'))
        .pipe(
          dest('dest/')
        )
        .on('finish', done);
    }
  );
};


module.exports = runLess;