import {test, expect} from '@playwright/test';
import {useServerConfig} from "@/services/server/config";

test('手书笔记卡片', async ({page}) => {
    const serverConfig = useServerConfig()
    const articlesUrl = `${serverConfig.PUBLIC_SELF_URL}/articles`
    await page.goto(articlesUrl);

    const articleList = page.locator("[data-article]");

    const firstArticle = articleList.first();
    await expect(firstArticle).toBeVisible();
});

test('源码笔记卡片', async ({page}) => {
    const serverConfig = useServerConfig()
    const articlesUrl = `${serverConfig.PUBLIC_SELF_URL}/articles/dir2`
    await page.goto(articlesUrl);

    const articleList = page.locator("[data-article]");

    const firstArticle = articleList.first();
    await expect(firstArticle).toBeVisible();
});
