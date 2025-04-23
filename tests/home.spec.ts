import {test, expect} from '@playwright/test';
import {useServerConfig} from "@/services/server/config";

test('首页标题', async ({page}) => {
    const serverConfig = useServerConfig()
    const selfUrl = serverConfig.PUBLIC_SELF_URL
    await page.goto(selfUrl);

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/希波万象/);
});
