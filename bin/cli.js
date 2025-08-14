#!/usr/bin/env node

const { program } = require("commander")
const path = require("path")

// Check if dist files exist
try {
  const { installBlog } = require("../dist/cli/install")

  program
    .name("zeme-blog-system")
    .description("A modular blog system for Next.js applications.")
    .version("0.2.2")

  program
    .command("install")
    .description("Install and configure the Zeme Blog system in your project.")
    .action(installBlog)


  program.parse()
} catch (error) {
  console.error("Error: CLI commands not found. Please run 'npm run build:all' first.")
  console.error("If you're developing, make sure the package is properly built.")
  process.exit(1)
}
