// playwright.config.js
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
    use: {
        baseURL: 'http://localhost:3000',
    },
    // This tells Playwright to start your app before testing
    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000,
    },
});