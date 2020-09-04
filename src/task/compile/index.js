const {task, parallel} = require('gulp');

const runCompile = () => {
  task(
    'compile',
    series('less', parallel('ts', 'js'))
  );
};

module.exports = runCompile;
