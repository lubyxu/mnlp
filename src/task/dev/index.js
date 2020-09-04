const {task, dest, src} = require('gulp');
const fs = require('fs');
const path = require('path');
const watch = require('gulp-watch');
const compileLess = require('../../lib/less');
const compileJs = require('../../lib/js');
const compileTs = require('../../lib/ts');

const runDev = () => {
  task(
    'dev',
    series('compile', () => {
      watch('src', f => {
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
          stream = compileLess(src(relativePath));
        }
        else if (/.tsx?$/.test(ext)) {
          // 需要注册全局declaration，必须加上.d.ts
          stream = compileTs(src([relativePath, 'src/**/*.d.ts']));
        }
        else if (/.jsx?$/.test(ext)) {
          stream = compileJs(src(relativePath));
        }
  
        if (!stream) {
          console.log('格式只能是less,css,tsx?,jsx?');
          process.ext(1);
        }
  
        stream
          .pipe(
            dest('dest/' + path.dirname(destRelativePath))
          );
      });
    })
  )  
}

module.exports = runDev;