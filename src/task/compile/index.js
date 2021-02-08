const { src, dest, task } = require('gulp');
const {program} = require('commander');
const compileLess = require('../../lib/less');
const compileTs = require('../../lib/ts');

const merge2 = require('merge2');
const compileJs = require('../../lib/js');
const plumber = require('gulp-plumber');

const registerCompileTask = ({ commonjs } = { commonjs: false }) => {
  task("compile", (done) => {
    console.log("Going to compile", program.opts().outDir);
    merge2([
      compileLess(
        src("src/**/*.less", { cwd: process.cwd() }).pipe(new plumber())
      ),
      compileTs(
        src(["src/**/*.tsx", "src/**/*.ts"], {
          cwd: process.cwd(),
        }).pipe(new plumber())
      ),
      compileJs(
        src(["src/**/*.jsx", "src/**/*.js"], {
          cwd: process.cwd(),
        }).pipe(new plumber()),
        { commonjs }
      ),
      src([
        "src/**/*.svg",
        "src/**/*.bmp",
        "src/**/*.gif",
        "src/**/*.jpe?g",
        "src/**/*.png",
      ]).pipe(new plumber()),
    ])
      .pipe(dest(program.opts().outDir || "dest/"))
      .on("finish", function () {
        console.log("compling done");
        done();
      });
  });
};

module.exports = registerCompileTask;
