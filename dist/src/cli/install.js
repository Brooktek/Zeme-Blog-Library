"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.installBlog = installBlog;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const prompts_1 = __importDefault(require("prompts"));
const child_process_1 = require("child_process");
const PEER_DEPENDENCIES = [
    '@supabase/supabase-js',
    'lucide-react',
    'class-variance-authority',
    'clsx',
    'tailwind-merge',
    'react-hook-form',
    '@hookform/resolvers',
    'zod',
];
// --- Utility Functions ---
const isValidSupabaseUrl = (url) => /https?:\/\/.+\.supabase\.co/i.test(url);
async function detectPackageManager() {
    const cwd = process.cwd();
    if (await fs_extra_1.default.pathExists(path_1.default.join(cwd, 'pnpm-lock.yaml')))
        return 'pnpm';
    if (await fs_extra_1.default.pathExists(path_1.default.join(cwd, 'yarn.lock')))
        return 'yarn';
    return 'npm';
}
function getInstallCommand(manager, packages) {
    const packageList = packages.join(' ');
    switch (manager) {
        case 'yarn': return `yarn add ${packageList}`;
        case 'pnpm': return `pnpm add ${packageList}`;
        default: return `npm install ${packageList}`;
    }
}
// --- Core Logic ---
async function runPrompts() {
    console.log(chalk_1.default.blue.bold("\n🔧 Let's configure your Zeme Blog..."));
    const responses = await (0, prompts_1.default)([
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
        {
            type: 'password',
            name: 'supabaseServiceKey',
            message: 'Enter your Supabase service_role key:',
        }
    ]);
    return responses;
}
async function updateEnvFile(vars) {
    const spinner = (0, ora_1.default)('Updating .env.local...').start();
    const envPath = path_1.default.join(process.cwd(), '.env.local');
    try {
        let envContent = (await fs_extra_1.default.pathExists(envPath)) ? await fs_extra_1.default.readFile(envPath, 'utf-8') : '';
        if (!envContent.endsWith('\n') && envContent)
            envContent += '\n';
        envContent += `\n# Zeme Blog Configuration\nNEXT_PUBLIC_SUPABASE_URL=${vars.supabaseUrl}\nNEXT_PUBLIC_SUPABASE_ANON_KEY=${vars.supabaseAnonKey}\nSUPABASE_SERVICE_ROLE_KEY=${vars.supabaseServiceKey}\n`;
        await fs_extra_1.default.writeFile(envPath, envContent);
        spinner.succeed(chalk_1.default.green('Successfully updated .env.local'));
    }
    catch (error) {
        spinner.fail(chalk_1.default.red('Failed to update .env.local'));
        console.error(error);
        process.exit(1);
    }
}
async function copyTemplateFiles() {
    const spinner = (0, ora_1.default)('Copying template files...').start();
    const sourceDir = path_1.default.resolve(__dirname, '..', '..', 'templates');
    const targetDir = process.cwd();
    const directoriesToCopy = ['app', 'components', 'lib'];
    try {
        for (const dir of directoriesToCopy) {
            const sourcePath = path_1.default.join(sourceDir, dir);
            const targetPath = path_1.default.join(targetDir, dir);
            if (await fs_extra_1.default.pathExists(sourcePath)) {
                await fs_extra_1.default.ensureDir(targetPath);
                await fs_extra_1.default.copy(sourcePath, targetPath, { overwrite: true });
            }
        }
        // Copy the schema file separately to the project root
        const schemaSource = path_1.default.join(sourceDir, 'scripts', 'schema.sql');
        const schemaTarget = path_1.default.join(targetDir, 'schema.sql');
        if (await fs_extra_1.default.pathExists(schemaSource)) {
            await fs_extra_1.default.copy(schemaSource, schemaTarget, { overwrite: true });
        }
        spinner.succeed(chalk_1.default.green('Successfully copied all blog files.'));
    }
    catch (error) {
        spinner.fail(chalk_1.default.red('Failed to copy template files.'));
        console.error(error);
        process.exit(1);
    }
}
async function installDependencies() {
    const spinner = (0, ora_1.default)('Installing dependencies...').start();
    try {
        const packageJsonPath = path_1.default.join(process.cwd(), 'package.json');
        if (!await fs_extra_1.default.pathExists(packageJsonPath)) {
            spinner.fail(chalk_1.default.red('`package.json` not found.'));
            process.exit(1);
        }
        const packageJson = await fs_extra_1.default.readJson(packageJsonPath);
        const installed = new Set([...Object.keys(packageJson.dependencies || {}), ...Object.keys(packageJson.devDependencies || {})]);
        const missing = PEER_DEPENDENCIES.filter((dep) => !installed.has(dep));
        if (missing.length === 0) {
            spinner.succeed(chalk_1.default.green('All dependencies are already installed.'));
            return;
        }
        const manager = await detectPackageManager();
        const command = getInstallCommand(manager, missing);
        spinner.info(`Detected ${chalk_1.default.cyan(manager)}. Running: ${chalk_1.default.gray(command)}`);
        await new Promise((resolve, reject) => {
            (0, child_process_1.exec)(command, (error, stdout, stderr) => {
                if (error)
                    reject(new Error(stderr));
                else {
                    console.log(`\n${stdout}`);
                    resolve();
                }
            });
        });
        spinner.succeed(chalk_1.default.green('Successfully installed dependencies!'));
    }
    catch (error) {
        spinner.fail(chalk_1.default.red('Failed to install dependencies.'));
        console.error(error);
        process.exit(1);
    }
}
async function installBlog() {
    try {
        const config = await runPrompts();
        if (!config.supabaseUrl || !config.supabaseAnonKey) {
            console.log(chalk_1.default.yellow('\n\nAborted installation.'));
            return;
        }
        await updateEnvFile(config);
        await copyTemplateFiles();
        await installDependencies();
        console.log(chalk_1.default.green.bold("\n✅ Zeme Blog has been installed successfully!"));
        console.log(chalk_1.default.blue("\nNext Steps:"));
        console.log(chalk_1.default.gray("1. Go to your Supabase dashboard's SQL Editor."));
        console.log(chalk_1.default.gray("2. Copy the content from `templates/scripts/schema.sql` and run it to set up your database tables."));
        console.log(chalk_1.default.gray("3. Start your development server (`npm run dev`) and navigate to `/admin` to get started."));
    }
    catch (error) {
        console.error(chalk_1.default.red('\nAn unexpected error occurred during installation.'));
        console.error(error);
        process.exit(1);
    }
}
