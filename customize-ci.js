#!/usr/bin/env node

/**
 * Run this script to customize the project files based on the provided
 * `customize.json` file. It processes all files in the current directory,
 * replacing placeholders with values from the `customize.json` file.
 * It also handles cleanup tasks such as renaming files and removing unnecessary directories.
 *
 * Usage: `node customize.js`
 */

const fs = require('fs');
const path = require('path');
const mustache = require('mustache');

const IGNORE_PATTERNS = [
  '.git',
  '.nx',
  'node_modules',
  'README.md',
  'customize.js',
  'customize-ci.js',
  'customize.json',
  '.png',
  '.jpg',
  '.jpeg',
  '.github',
];

const CUSTOMIZE_FILE = 'customize.json';
const LEFT_DELIM = '~~_';
const RIGHT_DELIM = '_~~';

// Load template data
const starter = JSON.parse(fs.readFileSync(CUSTOMIZE_FILE, 'utf8'));

// Utility: Check if path should be ignored
const isIgnored = (filePath) =>
  IGNORE_PATTERNS.some((pattern) => filePath.includes(pattern));

// Recursively collect files
function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (isIgnored(fullPath)) continue;

    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

// Process and render a file
function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const rendered = mustache.render(
    content,
    { starter },
    {},
    {
      tags: [LEFT_DELIM, RIGHT_DELIM],
    },
  );

  fs.writeFileSync(filePath, rendered, 'utf8');

  console.log(`✅ Processed file: ${filePath}`);
}

// Main execution
function main() {
  const files = walk('.');

  for (const file of files) {
    processFile(file);
  }
}

main();
