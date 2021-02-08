#! /usr/bin/env node

const {series} = require('gulp');
const {program} = require('commander');
const registerCompileTask = require('../task/compile');
const registerWatchTask = require('../task/watch');
const package = require('../../package.json');


program
  .version(package.version)
  .option("-c, --compile", "编译文件")
  .option("-w, --watch", "监听文件")
  .option("-o, --outDir <file>", "输出")
  .option("--cms, --commonjs", "是否转成commonjs")
  .parse();

console.log('Options:', program.opts());
console.log('Remaining arguments: ', program.args);


const { compile, watch, outDir, commonjs } = program.opts();

registerCompileTask({ commonjs });
registerWatchTask();

let task = [];
if (compile) {
  task.push('compile');
}

if (watch) {
  task.push('watch');
}

series(...task)();