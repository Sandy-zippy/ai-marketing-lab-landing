const puppeteer = require('/Users/sandy/Downloads/Claude Code/client-data/pilani-group/pitch-deck/node_modules/puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  const file = 'file://' + path.resolve(__dirname, 'og-card.html');
  await page.goto(file, { waitUntil: 'networkidle0' });
  // Give web fonts a moment to render
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({
    path: path.resolve(__dirname, 'aiml-og-1200x630.jpg'),
    type: 'jpeg',
    quality: 92,
    clip: { x: 0, y: 0, width: 1200, height: 630 }
  });
  await browser.close();
  console.log('OK aiml-og-1200x630.jpg');
})();
