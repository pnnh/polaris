// 全局自定义样式引用
import './global.scss'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import React from "react";

// 隔几秒重新验证下数据
export const revalidate = 1
export const dynamic = 'force-dynamic'

export default async function RootLayout({children}: {
    children: React.ReactNode
}) {
    return children
}
