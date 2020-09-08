const thought2 = require('through2');
const fs = require('fs');
const less = require('less');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');

const compileLess = stream => {
  console.log('compiling less');
  return stream
    .pipe(
      thought2.obj(function (file, encoding, next) {
        const that = this;
        fs.readFile(file.path, {encoding: 'utf8'}, function (error, data) {
          if (error) {
            console.log(error);
            process.exit(1);
          }

          less.render(data, {javascriptEnabled: true})
            .then(content => {
              file.contents = Buffer.from(content.css);
              file.path = file.path.replace(/\.less$/, '.css');
              that.push(file);
              next();
            })
            .catch(e => {
              console.log(e);
              process.exit(1);
            });
        });
      })
    )
    .pipe(
      postcss([
        autoprefixer({overrideBrowserslist: ['last 3 version']}),
      ])
    );
};

module.exports = compileLess;
