const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './tests/browser',
  workers: 1,
  use: {
    baseURL: 'http://127.0.0.1:3013',
    headless: true,
    launchOptions: process.platform === 'darwin' ? {
      executablePath: process.env.PLAYWRIGHT_CHROME_EXECUTABLE_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    } : {},
  },
  webServer: {
    command: 'python3 -m http.server 3013 --bind 127.0.0.1 --directory out',
    url: 'http://127.0.0.1:3013',
    reuseExistingServer: false,
  },
});
