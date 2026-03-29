import {test, expect} from '@playwright/test';
import {useServerConfig} from "@/services/server/config";

test('搜索页面加载（英文）', async ({page}) => {
    const {PUBLIC_SELF_URL} = useServerConfig()
    await page.goto(`${PUBLIC_SELF_URL}/en/search?keyword=note`);
    await expect(page).toHaveTitle(/HUABLE|希波/);
});

test('搜索页面加载（中文）', async ({page}) => {
    const {PUBLIC_SELF_URL} = useServerConfig()
    await page.goto(`${PUBLIC_SELF_URL}/zh/search?keyword=笔记`);
    await expect(page).toHaveTitle(/HUABLE|希波/);
});

test('搜索页面显示当前搜索关键词', async ({page}) => {
    const {PUBLIC_SELF_URL} = useServerConfig()
    const keyword = 'note'
    await page.goto(`${PUBLIC_SELF_URL}/en/search?keyword=${keyword}`);

    // 页面包含 "搜索关键词:" 标签及传入的关键词
    await expect(page.locator('text=搜索关键词:')).toBeVisible();
    await expect(page.locator(`text=${keyword}`).first()).toBeVisible();
});

test('搜索结果页有内容区域', async ({page}) => {
    const {PUBLIC_SELF_URL} = useServerConfig()
    await page.goto(`${PUBLIC_SELF_URL}/en/search?keyword=note`);

    // 无论是否有结果，页面主区域应正常渲染（标题匹配且无崩溃）
    await expect(page).toHaveTitle(/HUABLE|希波/);
    // 搜索关键词标签始终存在
    await expect(page.locator('text=搜索关键词:')).toBeVisible();
});

test('搜索到文章时页面展示文章卡片', async ({page}) => {
    const {PUBLIC_SELF_URL} = useServerConfig()
    // 使用常见关键词，期望数据库中存在相关文章
    await page.goto(`${PUBLIC_SELF_URL}/en/search?keyword=note`);

    const articleList = page.locator('[data-article]');
    const count = await articleList.count();
    if (count > 0) {
        await expect(articleList.first()).toBeVisible();
    }
});

test('搜索无结果关键词页面正常渲染不报错', async ({page}) => {
    const {PUBLIC_SELF_URL} = useServerConfig()
    // 使用不太可能有结果的随机字符串
    await page.goto(`${PUBLIC_SELF_URL}/en/search?keyword=xyznotfound12345`);
    // 页面不应崩溃，标题应正常
    await expect(page).toHaveTitle(/HUABLE|希波/);
});
