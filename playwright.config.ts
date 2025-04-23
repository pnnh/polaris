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
        ['json', {outputFile: 'test-results.json'}],
        ['html', {host: '0.0.0.0', port: 9323, open: 'always'}],
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
