import fs from "fs-extra"
import path from "path"
import chalk from "chalk"
import ora from "ora"

const AVAILABLE_COMPONENTS = {
  "post-card": "components/blog/blog-post-card.tsx",
  "post-list": "components/blog/blog-post-list.tsx",
  "post-detail": "components/blog/blog-post-detail.tsx",
  "admin-dashboard": "components/admin/admin-layout.tsx",
  "post-form": "components/admin/post-form.tsx",
  "stats-card": "components/admin/stats-card.tsx",
}

interface AddOptions {
  force?: boolean
}

export async function addComponent(componentName: string, options: AddOptions = {}) {
  console.log(chalk.blue.bold(`📦 Adding ${componentName} component\n`))

  if (!AVAILABLE_COMPONENTS[componentName as keyof typeof AVAILABLE_COMPONENTS]) {
    console.error(chalk.red(`❌ Component "${componentName}" not found.`))
    console.log(chalk.blue("\n📋 Available components:"))
    Object.keys(AVAILABLE_COMPONENTS).forEach((name) => {
      console.log(chalk.gray(`• ${name}`))
    })
    process.exit(1)
  }

  const spinner = ora(`Installing ${componentName}...`).start()

  try {
    const templatePath = AVAILABLE_COMPONENTS[componentName as keyof typeof AVAILABLE_COMPONENTS]
    const sourcePath = path.join(__dirname, "../../templates", templatePath)
    const targetPath = path.join(process.cwd(), templatePath)

    if (fs.existsSync(targetPath) && !options.force) {
      spinner.warn(chalk.yellow(`⚠️  ${componentName} already exists. Use --force to overwrite.`))
      return
    }

    await fs.ensureDir(path.dirname(targetPath))
    await fs.copy(sourcePath, targetPath)

    spinner.succeed(chalk.green(`✅ ${componentName} component added successfully!`))

    console.log(chalk.blue("\n📍 Component Location:"))
    console.log(chalk.gray(`• ${templatePath}`))
  } catch (error) {
    spinner.fail(chalk.red(`❌ Failed to add ${componentName}`))
    console.error(error)
    process.exit(1)
  }
}
