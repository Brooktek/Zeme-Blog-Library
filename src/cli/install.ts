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
      validate: (value: string) => value.startsWith('/') ? true : 'Path must start with a /'
    },
  ])

  if (!response.blogPath) {
    console.log(chalk.yellow("Installation cancelled."))
    process.exit(0)
  }

  const spinner = ora("Installing blog components...").start()

  try {
    await copyComponents(options.force)
    spinner.text = "Components installed..."

    await copyApiRoutes(options.force)
    spinner.text = "API routes installed..."

    if (response.includeAdmin) {
      await copyAdminComponents(options.force)
      spinner.text = "Admin dashboard installed..."
    }

    await updateConfigFiles(response.blogPath)
    spinner.text = "Page routes configured..."

    await updateTsConfig()
    spinner.text = "TypeScript config updated..."

    if (!options.skipDeps) {
      await installDependencies()
      spinner.text = "Dependencies installed..."
    }

    if (response.setupDatabase) {
      await setupDatabase()
      spinner.text = "Database schema created..."
    }

    spinner.succeed(chalk.green("✅ Modular Blog System installed successfully!"))

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
    const packageRoot = path.resolve(__dirname, "../../../");
  const templatesDir = path.join(packageRoot, "templates");
  const targetDir = process.cwd()

  const componentFiles = [
    "components/blog/blog-post-card.tsx",
    "components/blog/blog-post-list.tsx",
    "components/blog/blog-post-detail.tsx",
    "components/blog/category-badge.tsx",
    "components/blog/tag-badge.tsx",
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
    const packageRoot = path.resolve(__dirname, "../../../");
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
    const packageRoot = path.resolve(__dirname, "../../../");
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
    "app/admin/categories/page.tsx",
    "app/admin/tags/page.tsx",
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

  const blogPagePath = path.join(process.cwd(), `app${blogPath}/page.tsx`)
  const blogSlugPath = path.join(process.cwd(), `app${blogPath}/[slug]/page.tsx`)
  const categoryPagePath = path.join(process.cwd(), `app${blogPath}/category/[slug]/page.tsx`)
  const tagPagePath = path.join(process.cwd(), `app${blogPath}/tag/[slug]/page.tsx`)

  await fs.ensureDir(path.dirname(blogPagePath))
  await fs.ensureDir(path.dirname(blogSlugPath))
  await fs.ensureDir(path.dirname(categoryPagePath))
  await fs.ensureDir(path.dirname(tagPagePath))

    const packageRoot = path.resolve(__dirname, "../../../");
  const templatesDir = path.join(packageRoot, "templates");
  await fs.copy(path.join(templatesDir, "app/blog/page.tsx"), blogPagePath)
  await fs.copy(path.join(templatesDir, "app/blog/[slug]/page.tsx"), blogSlugPath)
  await fs.copy(path.join(templatesDir, "app/blog/category/[slug]/page.tsx"), categoryPagePath)
  await fs.copy(path.join(templatesDir, "app/blog/tag/[slug]/page.tsx"), tagPagePath)
}

async function installDependencies() {
  const dependencies = [
    "@supabase/supabase-js",
    "lucide-react",
    "@hookform/resolvers",
    "@radix-ui/react-accordion",
    "@radix-ui/react-alert-dialog",
    "@radix-ui/react-aspect-ratio",
    "@radix-ui/react-avatar",
    "@radix-ui/react-checkbox",
    "@radix-ui/react-collapsible",
    "@radix-ui/react-context-menu",
    "@radix-ui/react-dialog",
    "@radix-ui/react-dropdown-menu",
    "@radix-ui/react-hover-card",
    "@radix-ui/react-label",
    "@radix-ui/react-menubar",
    "@radix-ui/react-navigation-menu",
    "@radix-ui/react-popover",
    "@radix-ui/react-progress",
    "@radix-ui/react-radio-group",
    "@radix-ui/react-scroll-area",
    "@radix-ui/react-select",
    "@radix-ui/react-separator",
    "@radix-ui/react-slider",
    "@radix-ui/react-slot",
    "@radix-ui/react-switch",
    "@radix-ui/react-tabs",
    "@radix-ui/react-toast",
    "@radix-ui/react-toggle",
    "@radix-ui/react-toggle-group",
    "@radix-ui/react-tooltip",
    "class-variance-authority",
    "clsx",
    "cmdk",
    "date-fns",
    "embla-carousel-react",
    "input-otp",
    "next-themes",
    "react-day-picker",
    "react-hook-form",
    "react-resizable-panels",
    "recharts",
    "sonner",
    "tailwind-merge",
    "tailwindcss-animate",
    "vaul"
  ];

  execSync(`npm install ${dependencies.join(" ")}`, { stdio: "inherit" });
}

async function setupDatabase() {
    const packageRoot = path.resolve(__dirname, "../../../");
  const templatesDir = path.join(packageRoot, "templates");
  const scriptsDir = path.join(process.cwd(), "scripts")

  await fs.ensureDir(scriptsDir)
  await fs.copy(path.join(templatesDir, "scripts"), scriptsDir)

  console.log(chalk.blue("\n📊 Database scripts copied to ./scripts/"))
  console.log(chalk.gray("Run these scripts in your Supabase SQL editor or use the Supabase CLI"))
}

async function updateTsConfig() {
  const tsConfigPath = path.join(process.cwd(), "tsconfig.json");
  if (!fs.existsSync(tsConfigPath)) {
    console.warn(chalk.yellow("⚠️  tsconfig.json not found, skipping..."));
    return;
  }

  const tsConfig = await fs.readJson(tsConfigPath);
  
  tsConfig.compilerOptions = tsConfig.compilerOptions || {};
  tsConfig.compilerOptions.baseUrl = ".";
  tsConfig.compilerOptions.paths = tsConfig.compilerOptions.paths || {};
  tsConfig.compilerOptions.paths["@/*"] = ["./*"];

  await fs.writeJson(tsConfigPath, tsConfig, { spaces: 2 });
}
