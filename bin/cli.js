#!/usr/bin/env node

const { program } = require("commander")
const path = require("path")

// Check if dist files exist
try {
  const { installBlog } = require("../dist/cli/install")
  const { initBlog } = require("../dist/cli/init")
  const { addComponent } = require("../dist/cli/add")

  program.name("modular-blog").description("A modular blog system for Next.js applications").version("1.0.0")

  program
    .command("install")
    .description("Install the modular blog system in your Next.js project")
    .option("-f, --force", "Force installation even if files exist")
    .option("--skip-deps", "Skip dependency installation")
    .action(installBlog)

  program.command("init").description("Initialize blog configuration and database").action(initBlog)

  program
    .command("add <component>")
    .description("Add specific blog components")
    .option("-f, --force", "Force overwrite existing files")
    .action(addComponent)

  program.parse()
} catch (error) {
  console.error("Error: CLI commands not found. Please run 'npm run build:all' first.")
  console.error("If you're developing, make sure the package is properly built.")
  process.exit(1)
}
