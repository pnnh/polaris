新建一个客户端组件（Client Component）。

用法：`/new-client-component ComponentName`

请在 `src/components/client/` 下创建组件，遵循以下规范：

1. **必须加 `'use client'`**：文件第一行
2. **不能 async**：客户端组件不能是异步函数
3. **不能直接访问服务端资源**：不能直接调用数据库或服务端 API
4. **状态管理**：使用 React hooks 或 Jotai atoms
5. **样式**：可以使用 Panda CSS（`css\`...\``）或 Tailwind 工具类

参考模板：
```tsx
'use client';

import React, {useState} from "react";
import {css} from "@/gen/styled/css";

const styles = {
    container: css`
        display: flex;
        align-items: center;
        gap: 0.5rem;
    `,
}

export function MyClientComponent({lang}: { lang: string }) {
    const [state, setState] = useState(false);

    return <div className={styles.container}>
        {/* 交互内容 */}
    </div>
}
```

**常见陷阱**：
- 不要在客户端组件中导入服务端专用模块（如 `next/headers`、`next/cookies`）
- 事件处理函数（`onClick` 等）必须在客户端组件中使用
- 如需服务端数据，通过 props 从父级服务端组件传入，或使用 SWR 客户端获取
