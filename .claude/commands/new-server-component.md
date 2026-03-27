新建一个服务端组件（Server Component）。

用法：`/new-server-component ComponentName`

请在 `src/components/server/` 下创建组件，遵循以下规范：

1. **无需 `'use client'`**：服务端组件直接导出，不加该指令
2. **可以是 async**：可以直接 `await` 调用后端 API 或数据库
3. **样式**：使用 `css\`...\`` 从 `@/gen/styled/css` 导入，颜色必须使用 CSS 变量
4. **Props 类型**：用 TypeScript 接口明确定义

CSS 变量速查：
```
var(--background-color)       背景色（亮色 #fff，暗色 #121212）
var(--primary-color)          主色（亮色 #1976d2，暗色 #90caf9）
var(--text-primary-color)     主要文字色
var(--text-secondary-color)   次要文字色
var(--border-color)           边框色 #e0e0e0
var(--divider-color)          分割线色
var(--action-hover-color)     hover 背景色
```

参考模板：
```tsx
import React from "react";
import {css} from "@/gen/styled/css";

const styles = {
    container: css`
        padding: 1rem;
        border: 1px solid var(--border-color);
        border-radius: 8px;
        background-color: var(--background-color);

        &:hover {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
    `,
}

export async function MyComponent({lang}: { lang: string }) {
    // 可以直接 await 调用后端
    return <div className={styles.container}>
        {/* 内容 */}
    </div>
}
```

**注意**：修改 Panda CSS 样式后需运行 `npm run panda` 重新生成。
