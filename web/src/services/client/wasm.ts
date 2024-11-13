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

import {MainModule} from 'polaris-wasm-browser'

interface IModule {
    locateFile: (path: string, scriptDirectory: string) => string
}

// console.log('default browser', module2.lerp(1, 2, 0.5))


export async function lerpBrowser(a: number, b: number, t: number): Promise<number> {
    console.log('call from browser')

    const Module = {
        locateFile: function (path: string, scriptDirectory: string) {
            console.log('locateFile222', path, scriptDirectory)
            // return 'workspaces/polaris-wasm-browser/polaris-wasm-browser.wasm'
            return '/browser/polaris-wasm-browser.wasm'
        }
    }
    const MainModuleFactory = await import('polaris-wasm-browser')
    const abc = MainModuleFactory.default as (module: IModule) => Promise<MainModule>
    console.log('abc browser:', MainModuleFactory)
    const module2 = await abc(Module)

    return module2.lerp(a, b, t)
}
