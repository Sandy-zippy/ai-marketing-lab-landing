const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  const file = 'file://' + path.resolve(__dirname, 'og-card.html');
  await page.goto(file, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: path.resolve(__dirname, 'aiml-og-1200x630.jpg'),
    type: 'jpeg',
    quality: 92
  });
  await browser.close();
  console.log('OK aiml-og-1200x630.jpg');
})();
