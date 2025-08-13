"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.installBlog = installBlog;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const prompts_1 = __importDefault(require("prompts"));
async function installBlog(options = {}) {
    console.log(chalk_1.default.blue.bold("🚀 Installing Modular Blog System\n"));
    // Check if we're in a Next.js project
    const packageJsonPath = path_1.default.join(process.cwd(), "package.json");
    if (!fs_extra_1.default.existsSync(packageJsonPath)) {
        console.error(chalk_1.default.red("❌ No package.json found. Please run this command in a Next.js project root."));
        process.exit(1);
    }
    const packageJson = await fs_extra_1.default.readJson(packageJsonPath);
    if (!packageJson.dependencies?.next && !packageJson.devDependencies?.next) {
        console.error(chalk_1.default.red("❌ This doesn't appear to be a Next.js project."));
        process.exit(1);
    }
    // Get installation preferences
    const response = await (0, prompts_1.default)([
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
        },
    ]);
    const spinner = (0, ora_1.default)("Installing blog components...").start();
    try {
        // Copy core components
        await copyComponents(options.force);
        spinner.text = "Components installed...";
        // Copy API routes
        await copyApiRoutes(options.force);
        spinner.text = "API routes installed...";
        // Copy admin dashboard if requested
        if (response.includeAdmin) {
            await copyAdminComponents(options.force);
            spinner.text = "Admin dashboard installed...";
        }
        // Update configuration files
        await updateConfigFiles(response.blogPath);
        spinner.text = "Configuration updated...";
        // Install dependencies
        if (!options.skipDeps) {
            await installDependencies();
            spinner.text = "Dependencies installed...";
        }
        // Set up database if requested
        if (response.setupDatabase) {
            await setupDatabase();
            spinner.text = "Database schema created...";
        }
        spinner.succeed(chalk_1.default.green("✅ Modular Blog System installed successfully!"));
        // Show next steps
        console.log(chalk_1.default.blue("\n📋 Next Steps:"));
        console.log(chalk_1.default.gray("1. Set up your Supabase project and add environment variables"));
        console.log(chalk_1.default.gray("2. Run the database migration scripts"));
        console.log(chalk_1.default.gray("3. Start your development server: npm run dev"));
        console.log(chalk_1.default.gray(`4. Visit ${response.blogPath} to see your blog`));
        if (response.includeAdmin) {
            console.log(chalk_1.default.gray("5. Visit /admin to access the admin dashboard"));
        }
    }
    catch (error) {
        spinner.fail(chalk_1.default.red("❌ Installation failed"));
        console.error(error);
        process.exit(1);
    }
}
async function copyComponents(force = false) {
    const templatesDir = path_1.default.join(__dirname, "../../templates");
    const targetDir = process.cwd();
    const componentFiles = [
        "components/blog/blog-post-card.tsx",
        "components/blog/blog-post-list.tsx",
        "components/blog/blog-post-detail.tsx",
        "lib/blog-api.ts",
        "lib/supabase/client.ts",
        "lib/api-client.ts",
    ];
    for (const file of componentFiles) {
        const sourcePath = path_1.default.join(templatesDir, file);
        const targetPath = path_1.default.join(targetDir, file);
        if (fs_extra_1.default.existsSync(targetPath) && !force) {
            console.warn(chalk_1.default.yellow(`⚠️  ${file} already exists, skipping...`));
            continue;
        }
        await fs_extra_1.default.ensureDir(path_1.default.dirname(targetPath));
        await fs_extra_1.default.copy(sourcePath, targetPath);
    }
}
async function copyApiRoutes(force = false) {
    const templatesDir = path_1.default.join(__dirname, "../../templates");
    const targetDir = process.cwd();
    const apiFiles = [
        "app/api/blog/posts/route.ts",
        "app/api/blog/posts/[id]/route.ts",
        "app/api/blog/posts/slug/[slug]/route.ts",
        "app/api/blog/categories/route.ts",
        "app/api/blog/categories/[id]/route.ts",
        "app/api/blog/tags/route.ts",
        "app/api/blog/tags/[id]/route.ts",
        "app/api/admin/stats/route.ts",
    ];
    for (const file of apiFiles) {
        const sourcePath = path_1.default.join(templatesDir, file);
        const targetPath = path_1.default.join(targetDir, file);
        if (fs_extra_1.default.existsSync(targetPath) && !force) {
            console.warn(chalk_1.default.yellow(`⚠️  ${file} already exists, skipping...`));
            continue;
        }
        await fs_extra_1.default.ensureDir(path_1.default.dirname(targetPath));
        await fs_extra_1.default.copy(sourcePath, targetPath);
    }
}
async function copyAdminComponents(force = false) {
    const templatesDir = path_1.default.join(__dirname, "../../templates");
    const targetDir = process.cwd();
    const adminFiles = [
        "components/admin/admin-layout.tsx",
        "components/admin/stats-card.tsx",
        "components/admin/post-form.tsx",
        "app/admin/layout.tsx",
        "app/admin/page.tsx",
        "app/admin/posts/page.tsx",
        "app/admin/posts/new/page.tsx",
    ];
    for (const file of adminFiles) {
        const sourcePath = path_1.default.join(templatesDir, file);
        const targetPath = path_1.default.join(targetDir, file);
        if (fs_extra_1.default.existsSync(targetPath) && !force) {
            console.warn(chalk_1.default.yellow(`⚠️  ${file} already exists, skipping...`));
            continue;
        }
        await fs_extra_1.default.ensureDir(path_1.default.dirname(targetPath));
        await fs_extra_1.default.copy(sourcePath, targetPath);
    }
}
async function updateConfigFiles(blogPath) {
    // Update or create blog pages
    const blogPagePath = path_1.default.join(process.cwd(), `app${blogPath}/page.tsx`);
    const blogSlugPath = path_1.default.join(process.cwd(), `app${blogPath}/[slug]/page.tsx`);
    await fs_extra_1.default.ensureDir(path_1.default.dirname(blogPagePath));
    await fs_extra_1.default.ensureDir(path_1.default.dirname(blogSlugPath));
    // Copy blog page templates
    const templatesDir = path_1.default.join(__dirname, "../../templates");
    await fs_extra_1.default.copy(path_1.default.join(templatesDir, "app/blog/page.tsx"), blogPagePath);
    await fs_extra_1.default.copy(path_1.default.join(templatesDir, "app/blog/[slug]/page.tsx"), blogSlugPath);
}
async function installDependencies() {
    const dependencies = ["@supabase/supabase-js", "lucide-react"];
    (0, child_process_1.execSync)(`npm install ${dependencies.join(" ")}`, { stdio: "inherit" });
}
async function setupDatabase() {
    // Copy database scripts
    const templatesDir = path_1.default.join(__dirname, "../../templates");
    const scriptsDir = path_1.default.join(process.cwd(), "scripts");
    await fs_extra_1.default.ensureDir(scriptsDir);
    await fs_extra_1.default.copy(path_1.default.join(templatesDir, "scripts"), scriptsDir);
    console.log(chalk_1.default.blue("\n📊 Database scripts copied to ./scripts/"));
    console.log(chalk_1.default.gray("Run these scripts in your Supabase SQL editor or use the Supabase CLI"));
}
