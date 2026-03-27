新建一个 Next.js App Router 页面。

用法：`/new-page [lang]/some/route`

请根据以下规范创建页面：

1. **服务端组件**（默认）：`async function Page({params, searchParams})` 形式，无需 `'use client'`
2. **路径**：在 `src/app/[lang]/` 下创建对应的 `page.tsx`
3. **布局**：使用 `ContentLayout` 组件包裹内容，传入 `lang`、`searchParams`、`pathname`、`userInfo={SymbolUnknown}`
4. **样式**：使用 Panda CSS 的 `css\`...\`` 模板字面量编写样式（从 `@/gen/styled/css` 导入），颜色使用 CSS 变量（如 `var(--text-primary-color)`）而非硬编码值
5. **国际化**：通过 `params.lang` 获取语言参数，用 `getTargetLang(lang, unknownLanguage)` 验证，无效时 `notFound()`
6. **动态路由**：如需强制动态渲染，添加 `export const dynamic = "force-dynamic"`

参考模板：
```tsx
import React from 'react'
import ContentLayout from '@/components/server/content/layout'
import {getPathname} from "@/components/server/pathname";
import {SymbolUnknown} from "@pnnh/atom";
import {getTargetLang, unknownLanguage} from "@/components/common/language";
import {notFound} from "next/navigation";
import {css} from "@/gen/styled/css";

export const dynamic = "force-dynamic";

export default async function Page({params, searchParams}: {
    params: Promise<{ lang: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const searchParamsValue = await searchParams
    const paramsValue = await params
    const lang = paramsValue.lang
    if (!lang || getTargetLang(lang, unknownLanguage) === unknownLanguage) {
        notFound()
    }
    return <ContentLayout lang={lang} searchParams={searchParamsValue}
                          pathname={pathname} userInfo={SymbolUnknown}>
        {/* 页面内容 */}
    </ContentLayout>
}
```

创建后提醒：修改样式需运行 `npm run panda` 重新生成 Panda CSS 类名。
