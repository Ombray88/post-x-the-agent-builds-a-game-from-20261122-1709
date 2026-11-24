/**
 * @file main.ts
 * @description Entrypoint for the make.fun competition submission.
 * 
 * Design & Workflow:
 * 1. Read environment variables MAKEFUN_BOT_DIR (source directory) and MAKEFUN_OUTPUT_DIR (output directory),
 *    falling back to standard defaults if not provided.
 * 2. Locate POST.json within the source directory.
 * 3. Validate existence and ensure the file can be read.
 * 4. Parse the file content as JSON to ensure it is well-formed.
 * 5. Validate that the JSON object contains a valid X post URL (`url` property).
 * 6. Ensure the output directory exists (creating recursively if needed).
 * 7. Copy POST.json to the output directory so the submission platform can read the X post URL.
 * 8. Log success or catch and report any failure gracefully, exiting with code 1 on error.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import * as process from 'node:process';

// 1. Determine input and output directories from environment variables
const botDir = process.env.MAKEFUN_BOT_DIR || '/bot';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';

// 2. Construct file paths for source and destination POST.json
const srcPath = path.join(botDir, 'POST.json');
const destPath = path.join(outputDir, 'POST.json');

try {
  // 3. Verify source POST.json existence
  if (!fs.existsSync(srcPath)) {
    throw new Error(`POST.json not found at source path: ${srcPath}`);
  }

  // 4. Read and validate JSON format
  const rawData = fs.readFileSync(srcPath, 'utf8');
  let parsedJson: any;
  try {
    parsedJson = JSON.parse(rawData);
  } catch (parseError: any) {
    throw new Error(`Invalid JSON in POST.json: ${parseError.message}`);
  }

  // 5. Confirm POST.json carries a valid post URL
  if (!parsedJson || typeof parsedJson.url !== 'string' || !parsedJson.url.trim()) {
    throw new Error('POST.json is missing a valid "url" property pointing to the X post.');
  }

  // 6. Ensure destination directory exists
  fs.mkdirSync(outputDir, { recursive: true });

  // 7. Copy POST.json to output directory
  fs.copyFileSync(srcPath, destPath);

  // 8. Log success message
  console.log(`Successfully validated and copied POST.json to ${destPath}`);
} catch (err: any) {
  console.error(`Failed to process POST.json: ${err.message || err}`);
  process.exit(1);
}
