import fs from "fs-extra"
import path from "path"
import chalk from "chalk"
import ora from "ora"
import prompts from "prompts"

// A mapping of component names to their source paths within the templates directory
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

// Helper function to load and parse the components.json config
async function getProjectConfig() {
  const configPath = path.join(process.cwd(), "components.json");
  if (!fs.existsSync(configPath)) {
    console.error(chalk.red("`components.json` not found. Please run `npx zeme-blog init` first."));
    process.exit(1);
  }
  return fs.readJson(configPath);
}

export async function addComponent(templatePath: string, options: { force: boolean }) {
  const spinner = ora(`Adding ${templatePath}...`).start();

  try {
    const config = await getProjectConfig();
    if (!config) {
      spinner.fail(
        chalk.red(
          'Configuration file (components.json) not found. Please run `init` first.'
        )
      );
      process.exit(1);
    }

    // The source path is relative to the `templates` directory in the package
    const sourcePath = path.resolve(__dirname, '..', '..', 'templates', templatePath);
    if (!(await fs.pathExists(sourcePath))) {
      spinner.fail(chalk.red(`Template '${templatePath}' not found.`));
      process.exit(1);
    }

    let destPath: string;

    // Determine destination path based on template type
    if (templatePath.startsWith('components/')) {
      const componentAlias = config.aliases.components;
      const relativePath = templatePath.substring('components/'.length);
      destPath = path.join(process.cwd(), componentAlias, relativePath);
    } else if (templatePath.startsWith('lib/')) {
        const libAlias = config.aliases.lib;
        const relativePath = templatePath.substring('lib/'.length);
        destPath = path.join(process.cwd(), libAlias, relativePath);
    } else if (templatePath.startsWith('app/api/')) {
      // API routes are placed relative to the project root's `app` directory
      destPath = path.join(process.cwd(), templatePath);
    } else {
      spinner.fail(chalk.red(`Unsupported template type for path: ${templatePath}`));
      process.exit(1);
    }

    if ((await fs.pathExists(destPath)) && !options.force) {
      spinner.warn(
        chalk.yellow(`File already exists at ${destPath}. Use --force to overwrite.`)
      );
      return;
    }

    await fs.ensureDir(path.dirname(destPath));
    await fs.copy(sourcePath, destPath);

    spinner.succeed(chalk.green(`Successfully added ${templatePath} to ${destPath}`));
  } catch (error: any) {
    spinner.fail(chalk.red('An error occurred while adding the template.'));
    console.error(error.message);
    process.exit(1);
  }
}
