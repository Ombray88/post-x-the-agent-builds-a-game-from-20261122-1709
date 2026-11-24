import * as fs from 'node:fs';
import * as path from 'node:path';
import * as process from 'node:process';

const botDir = process.env.MAKEFUN_BOT_DIR || '/bot';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';

const srcPath = path.join(botDir, 'POST.json');
const destPath = path.join(outputDir, 'POST.json');

try {
  if (!fs.existsSync(srcPath)) {
    throw new Error(`POST.json not found at ${srcPath}`);
  }
  fs.mkdirSync(outputDir, { recursive: true });
  fs.copyFileSync(srcPath, destPath);
} catch (err: any) {
  console.error(`Failed to copy POST.json: ${err.message || err}`);
  process.exit(1);
}
