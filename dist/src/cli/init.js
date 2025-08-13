"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initBlog = initBlog;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const prompts_1 = __importDefault(require("prompts"));
// Helper to validate Supabase URL
const isValidSupabaseUrl = (url) => /https?:\/\/.+\.supabase\.co/i.test(url);
// Helper to update tsconfig.json with path aliases
async function updateTsConfig(aliases) {
    const tsConfigPath = path_1.default.join(process.cwd(), "tsconfig.json");
    if (!fs_extra_1.default.existsSync(tsConfigPath)) {
        console.warn(chalk_1.default.yellow("\\nNo `tsconfig.json` found. Skipping alias configuration. You may need to add aliases manually."));
        return;
    }
    try {
        const tsConfig = await fs_extra_1.default.readJson(tsConfigPath, { throws: false }) || {};
        tsConfig.compilerOptions = tsConfig.compilerOptions || {};
        tsConfig.compilerOptions.paths = tsConfig.compilerOptions.paths || {};
        tsConfig.compilerOptions.paths["@/components/*"] = [`${aliases.components}/*`];
        tsConfig.compilerOptions.paths["@/lib/*"] = [`${aliases.lib}/*`];
        await fs_extra_1.default.writeJson(tsConfigPath, tsConfig, { spaces: 2 });
    }
    catch (error) {
        console.warn(chalk_1.default.yellow("\\nCould not update `tsconfig.json`. Please add path aliases manually."));
    }
}
async function initBlog() {
    console.log(chalk_1.default.blue.bold("\\n🔧 Initializing Zeme Blog..."));
    try {
        const spinner = (0, ora_1.default)('Gathering configuration details...').start();
        const responses = await (0, prompts_1.default)([
            {
                type: "text",
                name: "componentsPath",
                message: "Enter the path to your components directory (e.g., src/components):",
                initial: "src/components",
            },
            {
                type: "text",
                name: "libPath",
                message: "Enter the path to your lib/utils directory (e.g., src/lib):",
                initial: "src/lib",
            },
            {
                type: "text",
                name: "supabaseUrl",
                message: "Enter your Supabase project URL:",
                validate: (url) => isValidSupabaseUrl(url) || "Please enter a valid Supabase URL.",
            },
            {
                type: "password",
                name: "supabaseAnonKey",
                message: "Enter your Supabase anon key:",
            },
            {
                type: "text",
                name: "blogTitle",
                message: "Enter the title for your blog:",
                initial: "My Awesome Blog",
            },
            {
                type: "text",
                name: "blogDescription",
                message: "Enter a short description for your blog:",
                initial: "A blog about interesting things.",
            },
        ]);
        spinner.stop();
        const { componentsPath, libPath, supabaseUrl, supabaseAnonKey, blogTitle, blogDescription } = responses;
        const configSpinner = (0, ora_1.default)('Applying configuration...').start();
        // 1. Create components.json
        const componentsConfig = {
            "$schema": "https://raw.githubusercontent.com/Zeme-Inc/zeme-blog/main/schemas/components.json",
            "aliases": { "components": componentsPath, "lib": libPath },
        };
        await fs_extra_1.default.writeJson(path_1.default.join(process.cwd(), "components.json"), componentsConfig, { spaces: 2 });
        configSpinner.text = 'Created components.json';
        // 2. Configure tsconfig.json aliases
        await updateTsConfig(componentsConfig.aliases);
        configSpinner.text = 'Configured path aliases in tsconfig.json';
        // 3. Create blog.config.js
        const blogConfigContent = `/** @type {import('zeme-blog').BlogConfig} */\\nconst blogConfig = {\\n  title: "${blogTitle}",\\n  description: "${blogDescription}",\\n};\\n\\nmodule.exports = blogConfig;`;
        await fs_extra_1.default.writeFile(path_1.default.join(process.cwd(), "blog.config.js"), blogConfigContent.trim());
        configSpinner.text = 'Created blog.config.js';
        // 4. Update .env.local
        const envPath = path_1.default.join(process.cwd(), ".env.local");
        let envContent = fs_extra_1.default.existsSync(envPath) ? await fs_extra_1.default.readFile(envPath, "utf-8") : "";
        if (!envContent.endsWith('\\n') && envContent)
            envContent += '\\n';
        envContent += `# Zeme Blog Configuration\\nNEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}\\nNEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseAnonKey}\\n`;
        await fs_extra_1.default.writeFile(envPath, envContent.trim());
        configSpinner.text = 'Updated .env.local';
        configSpinner.succeed(chalk_1.default.green("Configuration applied successfully!"));
        console.log(chalk_1.default.green.bold("\\n✅ Zeme Blog initialized successfully!"));
        console.log(chalk_1.default.blue("\\nNext steps:"));
        console.log(chalk_1.default.gray("1. Run `npx zeme-blog add <component-name>` to add components."));
        console.log(chalk_1.default.gray("2. Customize your blog settings in `blog.config.js`."));
    }
    catch (error) {
        // If prompts is aborted, error.name is undefined
        if (error.name === undefined) {
            console.log(chalk_1.default.yellow('\\n\\nAborted initialization.'));
            return;
        }
        console.error(chalk_1.default.red("\\nInitialization failed:"), error.message);
        process.exit(1);
    }
}
