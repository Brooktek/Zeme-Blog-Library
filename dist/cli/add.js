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
const AVAILABLE_COMPONENTS = {
    "post-card": "components/blog/blog-post-card.tsx",
    "post-list": "components/blog/blog-post-list.tsx",
    "post-detail": "components/blog/blog-post-detail.tsx",
    "admin-dashboard": "components/admin/admin-layout.tsx",
    "post-form": "components/admin/post-form.tsx",
    "stats-card": "components/admin/stats-card.tsx",
};
async function addComponent(componentName, options = {}) {
    console.log(chalk_1.default.blue.bold(`📦 Adding ${componentName} component\n`));
    if (!AVAILABLE_COMPONENTS[componentName]) {
        console.error(chalk_1.default.red(`❌ Component "${componentName}" not found.`));
        console.log(chalk_1.default.blue("\n📋 Available components:"));
        Object.keys(AVAILABLE_COMPONENTS).forEach((name) => {
            console.log(chalk_1.default.gray(`• ${name}`));
        });
        process.exit(1);
    }
    const spinner = (0, ora_1.default)(`Installing ${componentName}...`).start();
    try {
        const templatePath = AVAILABLE_COMPONENTS[componentName];
        const sourcePath = path_1.default.join(__dirname, "../../templates", templatePath);
        const targetPath = path_1.default.join(process.cwd(), templatePath);
        if (fs_extra_1.default.existsSync(targetPath) && !options.force) {
            spinner.warn(chalk_1.default.yellow(`⚠️  ${componentName} already exists. Use --force to overwrite.`));
            return;
        }
        await fs_extra_1.default.ensureDir(path_1.default.dirname(targetPath));
        await fs_extra_1.default.copy(sourcePath, targetPath);
        spinner.succeed(chalk_1.default.green(`✅ ${componentName} component added successfully!`));
        console.log(chalk_1.default.blue("\n📍 Component Location:"));
        console.log(chalk_1.default.gray(`• ${templatePath}`));
    }
    catch (error) {
        spinner.fail(chalk_1.default.red(`❌ Failed to add ${componentName}`));
        console.error(error);
        process.exit(1);
    }
}
