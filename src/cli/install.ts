import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import prompts from 'prompts';
import { exec } from 'child_process';

const PEER_DEPENDENCIES = [
  '@supabase/supabase-js',
  '@supabase/ssr',
  'lucide-react',
  'class-variance-authority',
  'clsx',
  'tailwind-merge',
  'react-hook-form',
  '@hookform/resolvers',
  'zod',
];

// --- Utility Functions ---

const isValidSupabaseUrl = (url: string) => /https?:\/\/.+\.supabase\.co/i.test(url);

type PackageManager = 'npm' | 'yarn' | 'pnpm';

async function detectPackageManager(): Promise<PackageManager> {
  const cwd = process.cwd();
  if (await fs.pathExists(path.join(cwd, 'pnpm-lock.yaml'))) return 'pnpm';
  if (await fs.pathExists(path.join(cwd, 'yarn.lock'))) return 'yarn';
  return 'npm';
}

function getInstallCommand(manager: PackageManager, packages: string[]): string {
  const packageList = packages.join(' ');
  switch (manager) {
    case 'yarn': return `yarn add ${packageList}`;
    case 'pnpm': return `pnpm add ${packageList}`;
    default: return `npm install ${packageList}`;
  }
}

// --- Core Logic ---

async function runPrompts() {
  console.log(chalk.blue.bold("\n🔧 Let's configure your Zeme Blog..."));
  const responses = await prompts([
    {
      type: 'text',
      name: 'supabaseUrl',
      message: 'Enter your Supabase project URL:',
      validate: (url) => isValidSupabaseUrl(url) || 'Please enter a valid Supabase URL.',
    },
    {
      type: 'password',
      name: 'supabaseAnonKey',
      message: 'Enter your Supabase anon key:',
    },
  ]);
  return responses;
}

async function updateEnvFile(vars: { supabaseUrl: string; supabaseAnonKey: string; }) {
  const spinner = ora('Updating .env.local...').start();
  const envPath = path.join(process.cwd(), '.env.local');
  try {
    let envContent = (await fs.pathExists(envPath)) ? await fs.readFile(envPath, 'utf-8') : '';
    if (!envContent.endsWith('\n') && envContent) envContent += '\n';
    envContent += `\n# Zeme Blog Configuration\nNEXT_PUBLIC_SUPABASE_URL=${vars.supabaseUrl}\nNEXT_PUBLIC_SUPABASE_ANON_KEY=${vars.supabaseAnonKey}\n`;
    await fs.writeFile(envPath, envContent);
    spinner.succeed(chalk.green('Successfully updated .env.local'));
  } catch (error) {
    spinner.fail(chalk.red('Failed to update .env.local'));
    console.error(error);
    process.exit(1);
  }
}

async function copyTemplateFiles() {
  const spinner = ora('Copying template files...').start();
  const sourceDir = path.join(__dirname, '..', '..', '..', 'templates');
  const targetDir = process.cwd();
  const skippedFiles: string[] = [];

  try {
    if (!await fs.pathExists(sourceDir)) {
      throw new Error(`Templates directory not found at ${sourceDir}`);
    }

    const copyRecursively = async (src: string, dest: string) => {
      const entries = await fs.readdir(src, { withFileTypes: true });
      await fs.mkdir(dest, { recursive: true });

      for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
          await copyRecursively(srcPath, destPath);
        } else {
          if (await fs.pathExists(destPath)) {
            skippedFiles.push(path.relative(targetDir, destPath));
          } else {
            await fs.copy(srcPath, destPath);
          }
        }
      }
    };

    await copyRecursively(sourceDir, targetDir);

    if (skippedFiles.length > 0) {
      spinner.warn(chalk.yellow('Some files already existed and were skipped.'));
      console.log(chalk.gray('The following files were not overwritten:'));
      skippedFiles.forEach(file => console.log(chalk.gray(`  - ${file.replace(/\\/g, '/')}`)));
    } else {
      spinner.succeed(chalk.green('Successfully copied all blog files.'));
    }
  } catch (error) {
    spinner.fail(chalk.red('Failed to copy template files.'));
    console.error(error);
    process.exit(1);
  }
}

async function installDependencies() {
  const spinner = ora('Installing dependencies...').start();
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (!await fs.pathExists(packageJsonPath)) {
      spinner.fail(chalk.red('`package.json` not found.'));
      process.exit(1);
    }
    const packageJson = await fs.readJson(packageJsonPath);
    const installed = new Set([...Object.keys(packageJson.dependencies || {}), ...Object.keys(packageJson.devDependencies || {})]);
    const missing = PEER_DEPENDENCIES.filter((dep) => !installed.has(dep));

    if (missing.length === 0) {
      spinner.succeed(chalk.green('All dependencies are already installed.'));
      return;
    }

    const manager = await detectPackageManager();
    const command = getInstallCommand(manager, missing);
    spinner.info(`Detected ${chalk.cyan(manager)}. Running: ${chalk.gray(command)}`);

    await new Promise<void>((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) reject(new Error(stderr));
        else {
          console.log(`\n${stdout}`);
          resolve();
        }
      });
    });
    spinner.succeed(chalk.green('Successfully installed dependencies!'));
  } catch (error) {
    spinner.fail(chalk.red('Failed to install dependencies.'));
    console.error(error);
    process.exit(1);
  }
}

export async function installBlog() {
  try {
    await copyTemplateFiles();

    const config = await runPrompts();
    if (!config.supabaseUrl || !config.supabaseAnonKey) {
      console.log(chalk.yellow('\n\nAborted installation.'));
      return;
    }

    await updateEnvFile(config as any);
    await installDependencies();

    console.log(chalk.green.bold("\n✅ Zeme Blog has been installed successfully!"));
    console.log(chalk.blue("\nNext Steps:"));
    console.log(chalk.gray("1. Go to your Supabase dashboard's SQL Editor."));
    console.log(chalk.gray("2. Copy the content from `templates/scripts/schema.sql` and run it to set up your database tables."));
    console.log(chalk.gray("3. Start your development server (`npm run dev`) and navigate to `/admin` to get started."));

  } catch (error) {
    console.error(chalk.red('\nAn unexpected error occurred during installation.'));
    console.error(error);
    process.exit(1);
  }
}
