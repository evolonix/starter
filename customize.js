#!/usr/bin/env node

/**
 * Run this script to customize the project files based on the provided
 * `customize.json` file. It processes all files in the current directory,
 * replacing placeholders with values from the `customize.json` file.
 * It also handles cleanup tasks such as renaming files and removing unnecessary directories.
 *
 * Usage: `node customize.js`
 */

function packageExists(packageName) {
  try {
    require.resolve(packageName);
    return true; // Package found
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
      return false; // Package not found
    }
    throw e; // Re-throw other errors
  }
}

if (!packageExists('mustache')) {
  console.error(
    '❌ Mustache package is not installed. Please run `npm install` and try again.',
  );
  process.exit(1);
}

const fs = require('fs');
const path = require('path');
const mustache = require('mustache');
const { spawn } = require('child_process');

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
  '.ico',
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

  // Cleanup and rename
  try {
    fs.rmSync('README.md', { force: true });
    fs.renameSync('README_TEMPLATE.md', 'README.md');
    fs.rmSync('.github', { recursive: true, force: true });
    fs.renameSync('github', '.github');
    fs.rmSync('customize.js', { force: true });
    fs.rmSync('customize-ci.js', { force: true });
    fs.rmSync('customize.json', { force: true });
    console.log('✅ Cleanup complete!');

    console.log('Preparing for first run...');
    fs.rmSync('libs/data/prisma/dev.db', { force: true }); // Remove in case it already exists so setup can regenerate

    const install = spawn('npm', ['install']);
    install.stdout.on('data', (data) => console.log(data.toString()));
    install.stderr.on('data', (data) => console.error(data.toString()));
    install.on('exit', (code) => {
      if (code !== 0) {
        console.error('❌ Installation failed');
        return;
      }

      console.log('✅ Dependencies installed successfully!');

      const setup = spawn('npm', ['run', 'setup']);
      setup.stdout.on('data', (data) => console.log(data.toString()));
      setup.stderr.on('data', (data) => console.error(data.toString()));
      setup.on('exit', (code) =>
        code === 0
          ? console.log('🚀 Your app is ready to run!')
          : console.error('❌ Setup failed'),
      );
    });
  } catch (e) {
    console.warn('❌ Cleanup warning:', e.message);
  }
}

main();
