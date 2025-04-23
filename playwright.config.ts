import {defineConfig, devices} from '@playwright/test';

const isTest = process.env.RUN_MODE === 'test'

export default defineConfig({
    testDir: '.',
    fullyParallel: true,
    forbidOnly: isTest,
    retries: isTest ? 2 : 0,
    workers: isTest ? 1 : undefined,
    reporter: [
        ['list'],
        isTest ? ['json', {outputFile: 'test-results.json'}] : ['dot'],
    ],
    use: {
        trace: 'on-first-retry',
    },
    projects: [
        {
            name: 'chromium',
            use: {...devices['Desktop Chrome']},
        },
    ],
});
