#!/usr/bin/env node

const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');
const mustache = require('mustache');

const IGNORE_PATTERNS = [
  '.git',
  '.nx',
  'node_modules',
  'README.md',
  'customize.js',
  'customize.json',
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

// Preprocess template to strip leading dot from keys like `.starter.foo` so they can be used in Mustache
function preprocess(content) {
  // Replace ~~_.starter.foo_~~ with ~~_starter.foo_~~ for example.
  return content.replace(/~~_\s*\.(starter\.[^~\]]+)~~/g, (_, path) => {
    return `~~_${path}~~`;
  });
}

// Process and render a file
function processFile(filePath) {
  console.log(`Processing file: ${filePath}`);

  const content = fs.readFileSync(filePath, 'utf8');
  const preprocessed = preprocess(content);

  const rendered = mustache.render(
    preprocessed,
    { starter },
    {},
    {
      tags: [LEFT_DELIM, RIGHT_DELIM],
    },
  );

  fs.writeFileSync(filePath, rendered, 'utf8');
}

// Main execution
function main() {
  const files = walk('.');

  for (const file of files) {
    processFile(file);
  }

  // Cleanup and rename
  try {
    fs.rmSync('README.md', { force: true });
    fs.renameSync('README_TEMPLATE.md', 'README.md');
    if (fs.existsSync('.github')) {
      fsExtra.removeSync('.github'); // Recursively delete
    }
    fs.renameSync('github', '.github');
    fs.rmSync('customize.jh', { force: true });
    fs.rmSync('customize.json', { force: true });
  } catch (e) {
    console.warn('Cleanup warning:', e.message);
  }
}

main();
