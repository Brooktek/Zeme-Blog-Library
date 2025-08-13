import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { exec } from 'child_process';

// Define the peer dependencies that may be required by the components.
// This list can be expanded as more components with specific dependencies are added.
const PEER_DEPENDENCIES = [
  '@supabase/supabase-js',
  'lucide-react', // Commonly used for icons in shadcn/ui
  'class-variance-authority',
  'clsx',
  'tailwind-merge',
];

type PackageManager = 'npm' | 'yarn' | 'pnpm';

// Function to detect the package manager by checking for lock files.
async function detectPackageManager(): Promise<PackageManager> {
  const cwd = process.cwd();
  if (await fs.pathExists(path.join(cwd, 'pnpm-lock.yaml'))) {
    return 'pnpm';
  }
  if (await fs.pathExists(path.join(cwd, 'yarn.lock'))) {
    return 'yarn';
  }
  return 'npm';
}

// Function to get the correct install command for the detected package manager.
function getInstallCommand(manager: PackageManager, packages: string[]): string {
  const packageList = packages.join(' ');
  switch (manager) {
    case 'yarn':
      return `yarn add ${packageList}`;
    case 'pnpm':
      return `pnpm add ${packageList}`;
    case 'npm':
    default:
      return `npm install ${packageList}`;
  }
}

export async function installDependencies() {
  console.log(chalk.blue.bold('\n📦 Checking and installing peer dependencies...'));

  const spinner = ora('Reading project configuration...').start();
  let missingDependencies: string[] = [];

  try {
    // 1. Read the user's package.json to find installed packages.
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (!await fs.pathExists(packageJsonPath)) {
      spinner.fail(chalk.red('`package.json` not found. Please run this in a valid project directory.'));
      process.exit(1);
    }
    const packageJson = await fs.readJson(packageJsonPath);
    const installedDependencies = new Set([
      ...Object.keys(packageJson.dependencies || {}),
      ...Object.keys(packageJson.devDependencies || {}),
    ]);

    // 2. Determine which dependencies are missing.
    missingDependencies = PEER_DEPENDENCIES.filter(
      (dep) => !installedDependencies.has(dep)
    );

    if (missingDependencies.length === 0) {
      spinner.succeed(chalk.green('✅ All peer dependencies are already installed.'));
      return;
    }

    spinner.text = 'Installing missing dependencies...';

    // 3. Detect the package manager and run the install command.
    const packageManager = await detectPackageManager();
    const installCommand = getInstallCommand(packageManager, missingDependencies);

    spinner.info(`Detected ${chalk.cyan(packageManager)}. Running command: ${chalk.gray(installCommand)}`);

    await new Promise<void>((resolve, reject) => {
      exec(installCommand, (error, stdout, stderr) => {
        if (error) {
          reject(new Error(stderr));
        } else {
          console.log(`\n${stdout}`);
          resolve();
        }
      });
    });

    spinner.succeed(chalk.green('✅ Successfully installed required dependencies!'));

  } catch (error: any) {
    spinner.fail(chalk.red('Failed to install dependencies.'));
    console.error(error.message);
    console.log(chalk.yellow('\nPlease try installing the following packages manually:'));
    console.log(chalk.gray(missingDependencies.join(' ')));
    process.exit(1);
  }
}
