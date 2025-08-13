"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addComponent = addComponent;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
// A mapping of component names to their source paths within the templates directory
const AVAILABLE_COMPONENTS = {
    "post-card": "components/blog/blog-post-card.tsx",
    "post-list": "components/blog/blog-post-list.tsx",
    "post-detail": "components/blog/blog-post-detail.tsx",
    "admin-dashboard": "components/admin/admin-layout.tsx",
    "post-form": "components/admin/post-form.tsx",
    "stats-card": "components/admin/stats-card.tsx",
};
// Helper function to load and parse the components.json config
async function getProjectConfig() {
    const configPath = path_1.default.join(process.cwd(), "components.json");
    if (!fs_extra_1.default.existsSync(configPath)) {
        console.error(chalk_1.default.red("`components.json` not found. Please run `npx zeme-blog init` first."));
        process.exit(1);
    }
    return fs_extra_1.default.readJson(configPath);
}
async function addComponent(templatePath, options) {
    const spinner = (0, ora_1.default)(`Adding ${templatePath}...`).start();
    try {
        const config = await getProjectConfig();
        if (!config) {
            spinner.fail(chalk_1.default.red('Configuration file (components.json) not found. Please run `init` first.'));
            process.exit(1);
        }
        // The source path is relative to the `templates` directory in the package
        const sourcePath = path_1.default.resolve(__dirname, '..', '..', 'templates', templatePath);
        if (!(await fs_extra_1.default.pathExists(sourcePath))) {
            spinner.fail(chalk_1.default.red(`Template '${templatePath}' not found.`));
            process.exit(1);
        }
        let destPath;
        // Determine destination path based on template type
        if (templatePath.startsWith('components/')) {
            const componentAlias = config.aliases.components;
            const relativePath = templatePath.substring('components/'.length);
            destPath = path_1.default.join(process.cwd(), componentAlias, relativePath);
        }
        else if (templatePath.startsWith('lib/')) {
            const libAlias = config.aliases.lib;
            const relativePath = templatePath.substring('lib/'.length);
            destPath = path_1.default.join(process.cwd(), libAlias, relativePath);
        }
        else if (templatePath.startsWith('app/api/')) {
            // API routes are placed relative to the project root's `app` directory
            destPath = path_1.default.join(process.cwd(), templatePath);
        }
        else {
            spinner.fail(chalk_1.default.red(`Unsupported template type for path: ${templatePath}`));
            process.exit(1);
        }
        if ((await fs_extra_1.default.pathExists(destPath)) && !options.force) {
            spinner.warn(chalk_1.default.yellow(`File already exists at ${destPath}. Use --force to overwrite.`));
            return;
        }
        await fs_extra_1.default.ensureDir(path_1.default.dirname(destPath));
        await fs_extra_1.default.copy(sourcePath, destPath);
        spinner.succeed(chalk_1.default.green(`Successfully added ${templatePath} to ${destPath}`));
    }
    catch (error) {
        spinner.fail(chalk_1.default.red('An error occurred while adding the template.'));
        console.error(error.message);
        process.exit(1);
    }
}
