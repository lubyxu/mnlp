const gulp = require('gulp');
const path = require('path');
const { program } = require("commander");
const fs = require('fs');
const compileLess = require('../../lib/less');
const compileTs = require('../../lib/ts');
const compileJs = require('../../lib/js');
const watch = require('gulp-watch');
const plumber = require('gulp-plumber');

const { src, dest } = gulp;

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
      stream = compileLess(src(relativePath, {cwd: process.cwd()}).pipe(new plumber()));
    }
    else if (/.tsx?$/.test(ext)) {
      // 需要注册全局declaration，必须加上.d.ts
      stream = compileTs(src([relativePath, 'src/**/*.d.ts'], {
        cwd: process.cwd(),
      }).pipe(new plumber()));
    }
    else if (/.jsx?$/.test(ext)) {
      stream = compileJs(src(relativePath, {
        cwd: process.cwd(),
      }).pipe(new plumber()));
    }

    if (!stream) {
      console.log('格式只能是less,css,tsx?,jsx?');
      process.ext(1);
    }

    stream
      .pipe(
        dest(
          path.join(
            process.cwd(),
            program.opts().outDir || "dest",
            path.dirname(destRelativePath)
          )
        )
      )
      .on("error", function (error) {
        console.log(error);
      });
  });
}

function registerWatchTask() {
  gulp.task(
    'watch',
    runWatch
  );
}

module.exports = registerWatchTask;