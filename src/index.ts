#!/usr/bin/env node

import { Command } from 'commander';
import { installBlog } from './cli/install';

const getPackageInfo = () => {
  try {
    const packageJson = require('../package.json');
    return { version: packageJson.version, name: packageJson.name };
  } catch (error) {
    return { version: '0.2.2', name: 'zeme-blog-system' };
  }
};

process.on('SIGINT', () => process.exit(0));
process.on('SIGTERM', () => process.exit(0));

async function main() {
  const packageInfo = getPackageInfo();

  const program = new Command()
    .name(packageInfo.name)
    .description('A modular blog system for Next.js applications.')
    .version(packageInfo.version, '-v, --version', 'Display the current version');

  program
    .command('install')
    .description('Install and configure the Zeme Blog system in your project.')
    .action(installBlog);


  program.parse();
}

main();