import {test, expect} from '@playwright/test';
import {useServerConfig} from "@/services/server/config";

// ── 登录页面 ──────────────────────────────────────────────────────────────────

test('登录页面加载（英文）', async ({page}) => {
    const {PUBLIC_SELF_URL} = useServerConfig()
    await page.goto(`${PUBLIC_SELF_URL}/en/account/signin`);
    await expect(page).toHaveTitle(/HUABLE|希波/);
    await expect(page.locator('text=Login Page')).toBeVisible();
});

test('登录页面加载（中文）', async ({page}) => {
    const {PUBLIC_SELF_URL} = useServerConfig()
    await page.goto(`${PUBLIC_SELF_URL}/zh/account/signin`);
    await expect(page).toHaveTitle(/HUABLE|希波/);
    await expect(page.locator('text=登录页面')).toBeVisible();
});

test('登录表单包含账号和密码输入框', async ({page}) => {
    const {PUBLIC_SELF_URL} = useServerConfig()
    await page.goto(`${PUBLIC_SELF_URL}/en/account/signin`);

    const usernameInput = page.locator('input[name="username"]');
    const passwordInput = page.locator('input[name="password"]');

    await expect(usernameInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toHaveAttribute('type', 'password');
});

test('登录页面包含跳转注册的链接', async ({page}) => {
    const {PUBLIC_SELF_URL} = useServerConfig()
    await page.goto(`${PUBLIC_SELF_URL}/en/account/signin`);

    // 页面应包含 "No account yet?" 文本及指向 signup 的链接
    await expect(page.locator('text=No account yet?')).toBeVisible();
    const signupLink = page.locator(`a[href*="/account/signup"]`);
    await expect(signupLink).toBeVisible();
});

test('登录表单空值提交时显示用户名校验错误', async ({page}) => {
    const {PUBLIC_SELF_URL} = useServerConfig()
    await page.goto(`${PUBLIC_SELF_URL}/en/account/signin`);

    // 不填写任何内容，直接点击登录按钮
    const submitBtn = page.locator('button[type="button"]').filter({hasText: /Sign In/i});
    await submitBtn.click();

    // 应出现用户名校验提示
    await expect(page.locator('text=Invalid Username')).toBeVisible();
});

test('登录表单填写用户名但不填密码时显示密码校验错误', async ({page}) => {
    const {PUBLIC_SELF_URL} = useServerConfig()
    await page.goto(`${PUBLIC_SELF_URL}/en/account/signin`);

    await page.locator('input[name="username"]').fill('testuser');
    // 密码保持为空
    const submitBtn = page.locator('button[type="button"]').filter({hasText: /Sign In/i});
    await submitBtn.click();

    await expect(page.locator('text=Invalid Password')).toBeVisible();
});

// ── 注册页面 ──────────────────────────────────────────────────────────────────

test('注册页面加载（英文）', async ({page}) => {
    const {PUBLIC_SELF_URL} = useServerConfig()
    await page.goto(`${PUBLIC_SELF_URL}/en/account/signup`);
    await expect(page).toHaveTitle(/HUABLE|希波/);
    await expect(page.locator('text=Registration Page')).toBeVisible();
});

test('注册页面加载（中文）', async ({page}) => {
    const {PUBLIC_SELF_URL} = useServerConfig()
    await page.goto(`${PUBLIC_SELF_URL}/zh/account/signup`);
    await expect(page).toHaveTitle(/HUABLE|希波/);
    await expect(page.locator('text=注册页面')).toBeVisible();
});

test('注册表单包含必填输入框', async ({page}) => {
    const {PUBLIC_SELF_URL} = useServerConfig()
    await page.goto(`${PUBLIC_SELF_URL}/en/account/signup`);

    await expect(page.locator('input[name="username"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('input[name="confirmPassword"]')).toBeVisible();
    await expect(page.locator('input[name="nickname"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
});

test('注册页面包含跳转登录的链接', async ({page}) => {
    const {PUBLIC_SELF_URL} = useServerConfig()
    await page.goto(`${PUBLIC_SELF_URL}/en/account/signup`);

    await expect(page.locator('text=Already have an account?')).toBeVisible();
    const signinLink = page.locator(`a[href*="/account/signin"]`);
    await expect(signinLink).toBeVisible();
});

test('注册表单空值提交时显示用户名校验错误', async ({page}) => {
    const {PUBLIC_SELF_URL} = useServerConfig()
    await page.goto(`${PUBLIC_SELF_URL}/en/account/signup`);

    const submitBtn = page.locator('button[type="button"]').filter({hasText: /Sign Up/i});
    await submitBtn.click();

    await expect(page.locator('text=Invalid username')).toBeVisible();
});

test('注册表单填写用户名但密码不一致时显示密码校验错误', async ({page}) => {
    const {PUBLIC_SELF_URL} = useServerConfig()
    await page.goto(`${PUBLIC_SELF_URL}/en/account/signup`);

    await page.locator('input[name="username"]').fill('testuser');
    await page.locator('input[name="password"]').fill('password123');
    await page.locator('input[name="confirmPassword"]').fill('different456');

    const submitBtn = page.locator('button[type="button"]').filter({hasText: /Sign Up/i});
    await submitBtn.click();

    await expect(page.locator('text=Passwords do not match')).toBeVisible();
});
