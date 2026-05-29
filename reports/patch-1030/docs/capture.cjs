const puppeteer = require('puppeteer');
const HOST = 'http://172.29.160.1:5173';
const BASE = '/mnt/c/Users/Boris/apps_ai/snake/reports/patch-1030/screenshots';
(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  try {
    console.log('Capturing title_default...');
    await page.goto(HOST + '/', { waitUntil: 'networkidle2', timeout: 15000 });
    await new Promise(r => setTimeout(r, 3000));
    await page.screenshot({ path: BASE + '/title_default.png' });
    console.log('OK title_default.png');
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: BASE + '/worldmap_default_progression.png' });
    console.log('OK worldmap_default_progression.png');
    console.log('Capturing unlock_all...');
    await page.goto(HOST + '/?unlockAll=1', { waitUntil: 'networkidle2', timeout: 15000 });
    await new Promise(r => setTimeout(r, 3000));
    await page.screenshot({ path: BASE + '/worldmap_unlock_all.png' });
    console.log('OK worldmap_unlock_all.png');
    console.log('Capturing after_reset...');
    await page.goto(HOST + '/?resetProgress=1', { waitUntil: 'networkidle2', timeout: 15000 });
    await new Promise(r => setTimeout(r, 2000));
    await page.goto(HOST + '/', { waitUntil: 'networkidle2', timeout: 15000 });
    await new Promise(r => setTimeout(r, 3000));
    await page.screenshot({ path: BASE + '/worldmap_after_reset.png' });
    console.log('OK worldmap_after_reset.png');
  } catch (err) { console.error('ERROR:', err.message); await browser.close(); process.exit(1); }
  await browser.close();
  console.log('Done.');
})();
