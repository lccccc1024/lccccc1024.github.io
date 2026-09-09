const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './tests', fullyParallel: false, workers: 1,
  use: { baseURL: 'http://localhost:4321', channel: 'chrome' },
  webServer: { command: 'npm run preview -- --host 127.0.0.1 --port 4321', url: 'http://localhost:4321', reuseExistingServer: !process.env.CI },
});
