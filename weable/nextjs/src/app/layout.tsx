// 全局自定义样式引用
import './global.css'

import {Metadata} from 'next'
import {AppRouterCacheProvider} from '@mui/material-nextjs/v14-appRouter';
import {ThemeProvider} from '@mui/material/styles';
import theme from './theme';

// 隔几秒重新验证下数据
export const revalidate = 5
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: '唯宝智图'
}

export default async function RootLayout({children}: {
    children: React.ReactNode
}) {
    return (
        <html lang='zh'>
        <head>
            <base href="/"/>
            <meta charSet="utf-8"/>
            <meta name="viewport"
                  content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"/>
            <meta name="renderer" content="webkit"/>
            <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
            <meta name="robots" content="index,follow"/>
            <link rel="icon" href="/favicon.ico" type="image/x-icon"/>
            <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico"/>
        </head>
        <body>
        <AppRouterCacheProvider options={{key: 'css', prepend: true, enableCssLayer: true}}>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </AppRouterCacheProvider>
        </body>
        </html>
    )
}
