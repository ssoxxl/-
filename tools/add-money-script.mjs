import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
for (const entry of await readdir(root, { withFileTypes: true })) {
  if (!entry.isDirectory() || ['assets', 'node_modules', 'tools'].includes(entry.name)) continue;
  const path = join(root, entry.name, 'index.html');
  let html;
  try { html = await readFile(path, 'utf8'); } catch { continue; }
  if (!/function calc\(|data-calc=/.test(html) || html.includes('assets/money-inputs.js')) continue;
  html = html.replace('</body>', '<script src="../assets/money-inputs.js"></script>\n</body>');
  await writeFile(path, html);
}
