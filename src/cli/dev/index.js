#!/usr/bin/env node

const { series, src, dest, task, start } = require('gulp');
const watch = require('gulp-watch');
const path = require('path');
const thought2 = require('through2');
const fs = require('fs');
const compileLess = require('../../lib/less');
const compileTs = require('../../lib/ts');

const merge2 = require('merge2');
const compileJs = require('../../lib/js');

function dev() {
  task('dev', done => {
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
  

  task(
    'dev-watch',
    series('dev', () => {
      watch(path.join(process.cwd(), 'src'), f => {
        const relativePath = path.relative(process.cwd(), f.path);
        console.log(`${relativePath} is changed`);
        const destRelativePath = path.relative(path.join(process.cwd(), 'src'), f.path);
  
        const ext = path.extname(f.path);
        const basename = path.basename(f.path, ext);
  
        if (f.event === 'unlink') {
          const fileToDelete = path.resolve(
            'dest/',
            destRelativePath.replace(ext, ext === '.less' ? '.css' : '.js')
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
    })
  );
}

dev();

series('dev-watch')();