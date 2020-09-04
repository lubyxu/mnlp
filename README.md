目前主流的打包工具是：`webpack`、`rollup`、`gulp`。（不要告诉我`fis`，我不会。。。）。其中`webpack`适合打包应用。`rollup`适合打包`js`的`sdk`。

如果，我想打包一个组件，他的输出格式和我开发时候的目录格式一致。同时支持css-module。那我该怎么办？显然`webpack`不满足我的需求。`rollup`是将多个pieces of code into something larger and more complex。显然也不太合适。同时，开发的时候发现，`rollup`开发大型组件的时候，不太适合，因为每次编译，都会把多个js写入一个js，这个比较耗时。参考`antd-tools`，结合`gulp`，做了此工具。

那为什么不能用`antd-tools`呢？
- `antd-tools`强依赖目录结构。
- 不支持css-module

那么`mn-bundle`解决了什么问题：
- 支持css-module
- 保留开发的目录结构
- 开发时，增量编译，加快开发效率。