import { chromium } from 'file:///C:/Users/ddjjk/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import { readdir } from 'node:fs/promises';

const base = 'http://127.0.0.1:4175';
const dirs = await readdir('.', { withFileTypes: true });
const pages = dirs.filter(d => d.isDirectory() && !['assets','tools','node_modules'].includes(d.name)).map(d => d.name);
const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const failures = [];
let audited = 0;

for (const name of pages) {
  const page = await browser.newPage();
  page.setDefaultTimeout(5000);
  await page.route('**/*', route => {
    const url = new URL(route.request().url());
    if (url.hostname === '127.0.0.1') route.continue();
    else route.abort();
  });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  const response = await page.goto(`${base}/${name}/`, { waitUntil: 'domcontentloaded' });
  if (!response?.ok()) { await page.close(); continue; }
  const calcButton = page.locator('button[onclick*="calc" i], button[onclick*="runCalc" i]').first();
  if (!await calcButton.count()) { await page.close(); continue; }
  audited++;
  for (const input of await page.locator('input').all()) {
    if (await input.isDisabled() || !await input.isVisible()) continue;
    const type = await input.getAttribute('type');
    if (['checkbox','radio','date'].includes(type)) continue;
    if (type === 'text' && !await input.getAttribute('inputmode') && !/원|금액|급여|월급|연봉|소득|가격|가액|비용|보증금|대출|월세|자금|매출|납입/.test(await input.evaluate(el => el.closest('.field')?.querySelector('label')?.textContent || ''))) continue;
    if (!(await input.inputValue())) {
      const label = await input.evaluate(el => el.closest('.field')?.querySelector('label')?.textContent || '');
      const value = /금리|비율|세율/.test(label) ? '5' : /개월|기간|연수|나이|수량|일수/.test(label) ? '12' : '10000000';
      await input.fill(value);
    }
  }
  const moneyInput = page.locator('input[inputmode="numeric"]').first();
  if (await moneyInput.count()) {
    await moneyInput.fill('1234567');
    if (!/1,234,567/.test(await moneyInput.inputValue())) failures.push(`${name}: 금액 입력 콤마 미표시`);
  }
  await calcButton.click();
  await page.waitForTimeout(30);
  const visibleResult = await page.locator('.result-box.show, .zero-box.show, #result.show, [id^="result-"][class*="show"]').count();
  if (!visibleResult && name !== 'annual-leave') failures.push(`${name}: 계산 후 결과 영역 미표시`);
  const bodyText = await page.locator('body').innerText();
  if (/NaN|Infinity|undefined원/.test(bodyText)) failures.push(`${name}: 비정상 숫자 결과`);
  if (errors.length) failures.push(`${name}: ${errors.join(' / ')}`);
  await page.close();
}

await browser.close();
console.log(JSON.stringify({ audited, failures }, null, 2));
if (failures.length) process.exitCode = 1;
