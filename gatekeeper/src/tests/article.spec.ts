import {test, expect} from '@playwright/test';
import {useServerConfig} from "@/services/server/config";

// ── 文章列表 ──────────────────────────────────────────────────────────────────

test('文章列表页加载（英文）', async ({page}) => {
    const {PUBLIC_SELF_URL} = useServerConfig()
    const articlesUrl = `${PUBLIC_SELF_URL}/en/articles`
    await page.goto(articlesUrl);
    await expect(page).toHaveTitle(/HUABLE|希波/);
});

test('文章列表页加载（中文）', async ({page}) => {
    const {PUBLIC_SELF_URL} = useServerConfig()
    const articlesUrl = `${PUBLIC_SELF_URL}/zh/articles`
    await page.goto(articlesUrl);
    await expect(page).toHaveTitle(/HUABLE|希波/);
});

test('手书笔记卡片', async ({page}) => {
    const serverConfig = useServerConfig()
    const articlesUrl = `${serverConfig.PUBLIC_SELF_URL}/en/articles`
    await page.goto(articlesUrl);

    const articleList = page.locator("[data-article]");

    const firstArticle = articleList.first();
    await expect(firstArticle).toBeVisible();
});

test('源码笔记卡片', async ({page}) => {
    const serverConfig = useServerConfig()
    const articlesUrl = `${serverConfig.PUBLIC_SELF_URL}/zh/articles`
    await page.goto(articlesUrl);

    const articleList = page.locator("[data-article]");

    const firstArticle = articleList.first();
    await expect(firstArticle).toBeVisible();
});

test('文章卡片包含标题链接', async ({page}) => {
    const {PUBLIC_SELF_URL} = useServerConfig()
    await page.goto(`${PUBLIC_SELF_URL}/en/articles`);

    const firstCard = page.locator('[data-article]').first();
    await expect(firstCard).toBeVisible();

    // 卡片内部应有标题链接
    const titleLink = firstCard.locator('a').first();
    await expect(titleLink).toBeVisible();
    const href = await titleLink.getAttribute('href');
    expect(href).toBeTruthy();
    expect(href).toContain('/articles/');
});

test('点击文章卡片标题跳转到详情页', async ({page}) => {
    const {PUBLIC_SELF_URL} = useServerConfig()
    await page.goto(`${PUBLIC_SELF_URL}/en/articles`);

    const firstCard = page.locator('[data-article]').first();
    const titleLink = firstCard.locator('a').first();
    const href = await titleLink.getAttribute('href');
    expect(href).toBeTruthy();

    // 跳转到文章详情
    await page.goto(`${PUBLIC_SELF_URL}/${href}`);
    await expect(page).toHaveTitle(/HUABLE|希波/);
    // 详情页不应渲染错误提示
    await expect(page.locator('text=遇到错误2')).not.toBeVisible();
});

test('文章详情页内容正常渲染', async ({page}) => {
    const {PUBLIC_SELF_URL} = useServerConfig()
    await page.goto(`${PUBLIC_SELF_URL}/en/articles`);

    const firstCard = page.locator('[data-article]').first();
    const titleLink = firstCard.locator('a').first();
    const href = await titleLink.getAttribute('href');
    expect(href).toBeTruthy();

    await page.goto(`${PUBLIC_SELF_URL}/${href}`);

    // 详情页标题应匹配站点标识
    await expect(page).toHaveTitle(/HUABLE|希波/);
    // 不应出现错误提示文字
    await expect(page.locator('text=遇到错误2')).not.toBeVisible();
    // 不应渲染 404 页面
    await expect(page.locator('text=Page Not Found')).not.toBeVisible();
});

// ── 文章列表筛选栏 ─────────────────────────────────────────────────────────────

test('文章列表页包含排序和筛选链接', async ({page}) => {
    const {PUBLIC_SELF_URL} = useServerConfig()
    await page.goto(`${PUBLIC_SELF_URL}/en/articles`);

    await expect(page.locator('text=Latest')).toBeVisible();
    await expect(page.locator('text=Read Rank')).toBeVisible();
    await expect(page.locator('text=Last Month')).toBeVisible();
    await expect(page.locator('text=Last Year')).toBeVisible();
    await expect(page.locator('text=All')).toBeVisible();
});

test('点击"Read Rank"排序后页面文章列表正常加载', async ({page}) => {
    const {PUBLIC_SELF_URL} = useServerConfig()
    await page.goto(`${PUBLIC_SELF_URL}/en/articles`);

    await page.locator('text=Read Rank').click();
    await expect(page).toHaveTitle(/HUABLE|希波/);

    const articleList = page.locator('[data-article]');
    await expect(articleList.first()).toBeVisible();
});

test('点击"Last Year"筛选后页面文章列表正常加载', async ({page}) => {
    const {PUBLIC_SELF_URL} = useServerConfig()
    await page.goto(`${PUBLIC_SELF_URL}/en/articles`);

    await page.locator('text=Last Year').click();
    await expect(page).toHaveTitle(/HUABLE|希波/);

    const articleList = page.locator('[data-article]');
    await expect(articleList.first()).toBeVisible();
});
