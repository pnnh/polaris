新建一个 Playwright E2E 测试文件。

用法：`/new-test feature-name`

请在 `src/tests/` 目录下创建 `feature-name.spec.ts` 文件，遵循以下规范：

## 测试模板

```typescript
import {test, expect} from '@playwright/test';
import {useServerConfig} from "@/services/server/config";

const {PUBLIC_SELF_URL} = useServerConfig();

test.describe('功能模块名称', () => {
    // 英文路由测试
    test('页面加载（英文）', async ({page}) => {
        await page.goto(`${PUBLIC_SELF_URL}/en/feature-path`);
        await expect(page).toHaveTitle(/HUABLE|希波/);
    });

    // 中文路由测试
    test('页面加载（中文）', async ({page}) => {
        await page.goto(`${PUBLIC_SELF_URL}/zh/feature-path`);
        await expect(page).toHaveTitle(/HUABLE|希波/);
    });

    // UI 元素测试
    test('页面包含核心元素', async ({page}) => {
        await page.goto(`${PUBLIC_SELF_URL}/en/feature-path`);
        // 优先使用 data-* 属性定位
        await expect(page.locator('[data-feature-item]').first()).toBeVisible();
    });
});
```

## 规范要求

1. **双语覆盖**：每个功能场景都要有 `/en` 和 `/zh` 两条路径的测试
2. **选择器优先级**：
   - ✅ `data-*` 属性（如 `[data-article]`）
   - ✅ 语义化的表单属性（如 `input[name="username"]`）
   - ⚠️ 文本内容（适合验证 UI 文字）
   - ❌ CSS 类名（避免，样式变更会导致测试失效）
3. **错误验证**：检查页面不包含错误提示文字（如 "遇到错误"、"Error"）
4. **表单测试**：测试空值提交、非法输入的验证错误信息

## 运行测试

```bash
# 本地运行（需服务栈已启动）
npx playwright test src/tests/feature-name.spec.ts

# Docker 完整环境
docker compose up -d postgres portal stargate polaris
npx playwright test src/tests/feature-name.spec.ts
```

## 环境变量

- `PUBLIC_SELF_URL`：测试目标 URL（默认 `http://localhost:7100`）
- `RUN_MODE=test`：CI 模式（重试 2 次，串行执行）
