#!/usr/bin/env node

import { Command } from 'commander';
import { initBlog } from './cli/init';
import { addComponent } from './cli/add';
import { installDependencies } from './cli/install';

// A simple helper to get package info (if it exists)
const getPackageInfo = () => {
  try {
    // This needs to be a require statement for the built JS file to find package.json
    const packageJson = require('../package.json');
    return { version: packageJson.version };
  } catch (error) {
    // Fallback for when the CLI is run in a context where package.json is not available
    return { version: '1.0.0' };
  }
};

// Gracefully exit on interrupt signals
process.on('SIGINT', () => process.exit(0));
process.on('SIGTERM', () => process.exit(0));

async function main() {
  const packageInfo = getPackageInfo();

  const program = new Command()
    .name('zeme-blog')
    .description('A CLI for adding a modular blog system to your Next.js project.')
    .version(
      packageInfo.version,
      '-v, --version',
      'Display the current version'
    );

  program
    .command('init')
    .description('Initialize the project and create configuration files.')
    .action(initBlog);

  program
    .command('add <template-path>')
    .description('Add a template to your project (e.g., components/blog/blog-post-card).')
    .option('-f, --force', 'Overwrite existing file if it exists.', false)
    .action((templatePath: string, options: { force: boolean }) => {
      addComponent(templatePath, options);
    });

  program
    .command('install')
    .description('Install and check for required peer dependencies.')
    .action(installDependencies);

  program.parse();
}

main();