const gulp = require('gulp');
const path = require('path');
const fs = require('fs');
const compileLess = require('../../lib/less');
const compileTs = require('../../lib/ts');
const compileJs = require('../../lib/js');
const watch = require('gulp-watch');

function runWatch() {
  console.log('watching files under src');
  watch(path.join(process.cwd(), 'src'), f => {
    const relativePath = path.relative(process.cwd(), f.path);
    console.log(`${relativePath} is changed`);
    const destRelativePath = path.relative(path.join(process.cwd(), 'src'), f.path);

    const ext = path.extname(f.path);
    const basename = path.basename(f.path, ext);

    if (f.event === 'unlink') {
      const fileToDelete = path.resolve(
        'dest/',
        destRelativePath.replace(ext, /\.less|\.css$/.test(ext) ? '.css' : '.js')
      );
      if (fs.existsSync(fileToDelete)) {
        fs.unlinkSync(fileToDelete);
      }
      return;
    }

    let stream;

    if (/\.less|\.css$/.test(ext)) {
      stream = compileLess(src(relativePath, {cwd: process.cwd()}));
    }
    else if (/.tsx?$/.test(ext)) {
      // 需要注册全局declaration，必须加上.d.ts
      stream = compileTs(src([relativePath, 'src/**/*.d.ts'], {
        cwd: process.cwd(),
      }));
    }
    else if (/.jsx?$/.test(ext)) {
      stream = compileJs(src(relativePath, {
        cwd: process.cwd(),
      }));
    }

    if (!stream) {
      console.log('格式只能是less,css,tsx?,jsx?');
      process.ext(1);
    }

    stream
      .pipe(
        dest('dest/' + path.dirname(destRelativePath), {
          cwd: process.cwd(),
        })
      )
      .on('error', function (error) {
        console.log(error);
      });
  });
}

module.exports = runWatch;