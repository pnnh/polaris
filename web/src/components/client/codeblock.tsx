import {useEffect} from 'react'
import Prism from 'prismjs'

// 好像必须得导出一个元素在需要的页面引用，否则上方自定义元素不会生效
export function RenderCodeBlock() {
    useEffect(() => {
        const elements = document.getElementsByTagName('polaris-codeblock')
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i]
            const innerHTML = element.textContent ?? ''
            let codeHtml = ''
            if (innerHTML) {
                codeHtml = Prism.highlight(innerHTML, Prism.languages.javascript, 'javascript')
            }
            element.innerHTML = `<pre>${codeHtml}</pre>`
        }
    }, [])
    return <></>
}
