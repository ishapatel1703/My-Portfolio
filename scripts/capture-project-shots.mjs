import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/Ishap/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/.pnpm/playwright@1.60.0/node_modules/playwright');

const outDir = path.resolve('assets/project-shots');
const projects = [
  { slug: 'banex-digital', url: 'https://banexdigital.com/' },
  { slug: 'real-estate-1', url: 'https://beautiful-churros-578dd5.netlify.app/' },
  { slug: 'real-estate-2', url: 'https://glittering-monstera-d43286.netlify.app/' },
  { slug: 'travels', url: 'https://spectacular-melomakarona-311c2d.netlify.app/' },
  { slug: 'ca', url: 'https://glittery-creponne-9b24ab.netlify.app/' },
  { slug: 'manufacturing', url: 'https://relaxed-blancmange-7ff0c0.netlify.app/' },
  { slug: 'event-management', url: 'https://sunny-treacle-82f422.netlify.app/' },
  { slug: 'doctor', url: 'https://rad-profiterole-75840e.netlify.app/' },
  { slug: 'dental-clinic', url: 'https://eclectic-licorice-2bfaa9.netlify.app/' },

];

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
const results = [];

for (const project of projects) {
  const saved = [];
  try {
    await page.goto(project.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(1600);

    const pageText = await page.locator('body').innerText({ timeout: 5000 }).catch(() => '');
    const blockedPreview = /checking your browser|just a moment|verify you are human|please wait up to/i.test(pageText);
    if (blockedPreview) {
      results.push({ slug: project.slug, skipped: 'Browser-check page detected' });
      continue;
    }

    for (let index = 1; index <= 5; index += 1) {
      if (index > 1) {
        await page.evaluate(() => window.scrollBy({ top: Math.round(window.innerHeight * 0.72), behavior: 'instant' }));
        await page.waitForTimeout(550);
      }

      const filename = `${project.slug}-${index}.jpg`;
      await page.screenshot({
        path: path.join(outDir, filename),
        type: 'jpeg',
        quality: 72,
        clip: { x: 0, y: 0, width: 1280, height: 720 },
      });
      saved.push(filename);
    }

    results.push({ slug: project.slug, saved });
  } catch (error) {
    results.push({ slug: project.slug, error: error.message });
  }
}

await browser.close();
console.log(JSON.stringify(results, null, 2));
