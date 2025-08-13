import fs from "fs-extra"
import path from "path"
import { execSync } from "child_process"
import chalk from "chalk"
import ora from "ora"
import prompts from "prompts"

interface InstallOptions {
  force?: boolean
  skipDeps?: boolean
}

export async function installBlog(options: InstallOptions = {}) {
  console.log(chalk.blue.bold("🚀 Installing Modular Blog System\n"))

  // Check if we're in a Next.js project
  const packageJsonPath = path.join(process.cwd(), "package.json")
  if (!fs.existsSync(packageJsonPath)) {
    console.error(chalk.red("❌ No package.json found. Please run this command in a Next.js project root."))
    process.exit(1)
  }

  const packageJson = await fs.readJson(packageJsonPath)
  if (!packageJson.dependencies?.next && !packageJson.devDependencies?.next) {
    console.error(chalk.red("❌ This doesn't appear to be a Next.js project."))
    process.exit(1)
  }

  // Get installation preferences
  const response = await prompts([
    {
      type: "confirm",
      name: "includeAdmin",
      message: "Include admin dashboard?",
      initial: true,
    },
    {
      type: "confirm",
      name: "setupDatabase",
      message: "Set up database schema automatically?",
      initial: true,
    },
    {
      type: "text",
      name: "blogPath",
      message: "Blog route path (e.g., /blog):",
      initial: "/blog",
    },
  ])

  const spinner = ora("Installing blog components...").start()

  try {
    // Copy core components
    await copyComponents(options.force)
    spinner.text = "Components installed..."

    // Copy API routes
    await copyApiRoutes(options.force)
    spinner.text = "API routes installed..."

    // Copy admin dashboard if requested
    if (response.includeAdmin) {
      await copyAdminComponents(options.force)
      spinner.text = "Admin dashboard installed..."
    }

    // Update configuration files
    await updateConfigFiles(response.blogPath)
    spinner.text = "Configuration updated..."

    // Install dependencies
    if (!options.skipDeps) {
      await installDependencies()
      spinner.text = "Dependencies installed..."
    }

    // Set up database if requested
    if (response.setupDatabase) {
      await setupDatabase()
      spinner.text = "Database schema created..."
    }

    spinner.succeed(chalk.green("✅ Modular Blog System installed successfully!"))

    // Show next steps
    console.log(chalk.blue("\n📋 Next Steps:"))
    console.log(chalk.gray("1. Set up your Supabase project and add environment variables"))
    console.log(chalk.gray("2. Run the database migration scripts"))
    console.log(chalk.gray("3. Start your development server: npm run dev"))
    console.log(chalk.gray(`4. Visit ${response.blogPath} to see your blog`))

    if (response.includeAdmin) {
      console.log(chalk.gray("5. Visit /admin to access the admin dashboard"))
    }
  } catch (error) {
    spinner.fail(chalk.red("❌ Installation failed"))
    console.error(error)
    process.exit(1)
  }
}

async function copyComponents(force = false) {
    const packageRoot = path.resolve(__dirname, "../..");
  const templatesDir = path.join(packageRoot, "templates");
  const targetDir = process.cwd()

  const componentFiles = [
    "components/blog/blog-post-card.tsx",
    "components/blog/blog-post-list.tsx",
    "components/blog/blog-post-detail.tsx",
    "lib/blog-api.ts",
    "lib/supabase/client.ts",
    "lib/api-client.ts",
  ]

  for (const file of componentFiles) {
    const sourcePath = path.join(templatesDir, file)
    const targetPath = path.join(targetDir, file)

    if (fs.existsSync(targetPath) && !force) {
      console.warn(chalk.yellow(`⚠️  ${file} already exists, skipping...`))
      continue
    }

    await fs.ensureDir(path.dirname(targetPath))
    await fs.copy(sourcePath, targetPath)
  }
}

async function copyApiRoutes(force = false) {
    const packageRoot = path.resolve(__dirname, "../..");
  const templatesDir = path.join(packageRoot, "templates");
  const targetDir = process.cwd()

  const apiFiles = [
    "app/api/blog/posts/route.ts",
    "app/api/blog/posts/[id]/route.ts",
    "app/api/blog/posts/slug/[slug]/route.ts",
    "app/api/blog/categories/route.ts",
    "app/api/blog/categories/[id]/route.ts",
    "app/api/blog/tags/route.ts",
    "app/api/blog/tags/[id]/route.ts",
    "app/api/admin/stats/route.ts",
  ]

  for (const file of apiFiles) {
    const sourcePath = path.join(templatesDir, file)
    const targetPath = path.join(targetDir, file)

    if (fs.existsSync(targetPath) && !force) {
      console.warn(chalk.yellow(`⚠️  ${file} already exists, skipping...`))
      continue
    }

    await fs.ensureDir(path.dirname(targetPath))
    await fs.copy(sourcePath, targetPath)
  }
}

async function copyAdminComponents(force = false) {
    const packageRoot = path.resolve(__dirname, "../..");
  const templatesDir = path.join(packageRoot, "templates");
  const targetDir = process.cwd()

  const adminFiles = [
    "components/admin/admin-layout.tsx",
    "components/admin/stats-card.tsx",
    "components/admin/post-form.tsx",
    "app/admin/layout.tsx",
    "app/admin/page.tsx",
    "app/admin/posts/page.tsx",
    "app/admin/posts/new/page.tsx",
  ]

  for (const file of adminFiles) {
    const sourcePath = path.join(templatesDir, file)
    const targetPath = path.join(targetDir, file)

    if (fs.existsSync(targetPath) && !force) {
      console.warn(chalk.yellow(`⚠️  ${file} already exists, skipping...`))
      continue
    }

    await fs.ensureDir(path.dirname(targetPath))
    await fs.copy(sourcePath, targetPath)
  }
}

async function updateConfigFiles(blogPath: string) {
  // Update or create blog pages
  const blogPagePath = path.join(process.cwd(), `app${blogPath}/page.tsx`)
  const blogSlugPath = path.join(process.cwd(), `app${blogPath}/[slug]/page.tsx`)

  await fs.ensureDir(path.dirname(blogPagePath))
  await fs.ensureDir(path.dirname(blogSlugPath))

  // Copy blog page templates
    const packageRoot = path.resolve(__dirname, "../..");
  const templatesDir = path.join(packageRoot, "templates");
  await fs.copy(path.join(templatesDir, "app/blog/page.tsx"), blogPagePath)
  await fs.copy(path.join(templatesDir, "app/blog/[slug]/page.tsx"), blogSlugPath)
}

async function installDependencies() {
  const dependencies = ["@supabase/supabase-js", "lucide-react"]

  execSync(`npm install ${dependencies.join(" ")}`, { stdio: "inherit" })
}

async function setupDatabase() {
  // Copy database scripts
    const packageRoot = path.resolve(__dirname, "../..");
  const templatesDir = path.join(packageRoot, "templates");
  const scriptsDir = path.join(process.cwd(), "scripts")

  await fs.ensureDir(scriptsDir)
  await fs.copy(path.join(templatesDir, "scripts"), scriptsDir)

  console.log(chalk.blue("\n📊 Database scripts copied to ./scripts/"))
  console.log(chalk.gray("Run these scripts in your Supabase SQL editor or use the Supabase CLI"))
}
