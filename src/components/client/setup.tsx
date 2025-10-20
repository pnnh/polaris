'use client'

export function ClientSetup({children}: { children: React.ReactNode }) {
    if (typeof window !== "undefined") {
        (window as any).isClient = true
        window.Prism = window.Prism || {};
        window.Prism.manual = true;     // 禁止Prism自动高亮代码块，否则会导致服务端和客户端渲染结果不一致错误
    }
    return <>
        {children}
    </>
}
