// 方法一：

// import {default as Module2} from 'polaris-wasm'

// const Module = {
//     locateFile: function (path: string, scriptDirectory: string) {
//         console.log('locateFile222', path, scriptDirectory)
//         return 'node_modules/polaris-wasm/polaris-wasm.wasm'
//     }
// }
// console.log('Module', Module2)

// const module2 = await Module2(Module)
// console.log('abc:', module2.lerp(1, 2, 0.5))


// 方法二：

import {MainModule} from 'polaris-wasm-server'

interface IModule {
    locateFile: (path: string, scriptDirectory: string) => string
}

const Module = {
    locateFile: function (path: string, scriptDirectory: string) {
        console.log('locateFile222', path, scriptDirectory)
        //return 'node_modules/polaris-wasm-server/polaris-wasm-server.wasm'
        return 'public/server/polaris-wasm-server.wasm'
    }
}
const MainModuleFactory = await import('polaris-wasm-server')
const abc = MainModuleFactory.default as (module: IModule) => Promise<MainModule>
console.log('abc server:', MainModuleFactory)
const module2 = await abc(Module)
console.log('default server', module2.lerp(1, 2, 0.5))


export function lerpServer(a: number, b: number, t: number): number {
    console.log('call from server')
    return module2.lerp(a, b, t)
}
