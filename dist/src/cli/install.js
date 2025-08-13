"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.installDependencies = installDependencies;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const child_process_1 = require("child_process");
// Define the peer dependencies that may be required by the components.
// This list can be expanded as more components with specific dependencies are added.
const PEER_DEPENDENCIES = [
    '@supabase/supabase-js',
    'lucide-react', // Commonly used for icons in shadcn/ui
    'class-variance-authority',
    'clsx',
    'tailwind-merge',
];
// Function to detect the package manager by checking for lock files.
async function detectPackageManager() {
    const cwd = process.cwd();
    if (await fs_extra_1.default.pathExists(path_1.default.join(cwd, 'pnpm-lock.yaml'))) {
        return 'pnpm';
    }
    if (await fs_extra_1.default.pathExists(path_1.default.join(cwd, 'yarn.lock'))) {
        return 'yarn';
    }
    return 'npm';
}
// Function to get the correct install command for the detected package manager.
function getInstallCommand(manager, packages) {
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
async function installDependencies() {
    console.log(chalk_1.default.blue.bold('\n📦 Checking and installing peer dependencies...'));
    const spinner = (0, ora_1.default)('Reading project configuration...').start();
    let missingDependencies = [];
    try {
        // 1. Read the user's package.json to find installed packages.
        const packageJsonPath = path_1.default.join(process.cwd(), 'package.json');
        if (!await fs_extra_1.default.pathExists(packageJsonPath)) {
            spinner.fail(chalk_1.default.red('`package.json` not found. Please run this in a valid project directory.'));
            process.exit(1);
        }
        const packageJson = await fs_extra_1.default.readJson(packageJsonPath);
        const installedDependencies = new Set([
            ...Object.keys(packageJson.dependencies || {}),
            ...Object.keys(packageJson.devDependencies || {}),
        ]);
        // 2. Determine which dependencies are missing.
        missingDependencies = PEER_DEPENDENCIES.filter((dep) => !installedDependencies.has(dep));
        if (missingDependencies.length === 0) {
            spinner.succeed(chalk_1.default.green('✅ All peer dependencies are already installed.'));
            return;
        }
        spinner.text = 'Installing missing dependencies...';
        // 3. Detect the package manager and run the install command.
        const packageManager = await detectPackageManager();
        const installCommand = getInstallCommand(packageManager, missingDependencies);
        spinner.info(`Detected ${chalk_1.default.cyan(packageManager)}. Running command: ${chalk_1.default.gray(installCommand)}`);
        await new Promise((resolve, reject) => {
            (0, child_process_1.exec)(installCommand, (error, stdout, stderr) => {
                if (error) {
                    reject(new Error(stderr));
                }
                else {
                    console.log(`\n${stdout}`);
                    resolve();
                }
            });
        });
        spinner.succeed(chalk_1.default.green('✅ Successfully installed required dependencies!'));
    }
    catch (error) {
        spinner.fail(chalk_1.default.red('Failed to install dependencies.'));
        console.error(error.message);
        console.log(chalk_1.default.yellow('\nPlease try installing the following packages manually:'));
        console.log(chalk_1.default.gray(missingDependencies.join(' ')));
        process.exit(1);
    }
}
