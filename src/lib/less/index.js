const thought2 = require('through2');
const fs = require('fs');
const less = require('less');
const postcss = require('gulp-postcss');

const compileLess = stream => {
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
              file.contents = Buffer.from(content);
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
        require('postcss-modules')({
          getJSON: function (cssFileName, json, outputFileName) {
            cssModuleJson[cssFileName] = json;
          }
        })
      ])
    );
};

module.exports = compileLess;
