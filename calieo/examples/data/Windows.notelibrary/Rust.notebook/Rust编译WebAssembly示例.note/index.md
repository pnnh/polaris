演示通过将Rust编译为WebAssembly、打包为npm包，并通过vite运行示例页面
首先根据 https://developer.mozilla.org/zh-CN/docs/WebAssembly/Rust_to_wasm 教程实现npm包的构建和运行
原教程中构建npm包之后是采用webpack dev服务器运行示例页面的，但这种方式在使用vite时无法运行，会报以下错误：
Uncaught TypeError: malloc is not a function
这时候需要修改下原文中调用wasm-pack命令的地方，加上--target web参数
wasm-pack build --scope yournpmusername --target web
同时修改index.js页面，采用es6 module的方式引用生成包里的方法
import init, {greet} from '@yournpmusername/hello-wasm'

init().then((_exports) => {
  greet('WebAssembly')
})
用这种方式修改后，可以正常通过vite运行演示页面
