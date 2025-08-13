"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initBlog = initBlog;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const prompts_1 = __importDefault(require("prompts"));
const ora_1 = __importDefault(require("ora"));
async function initBlog() {
    console.log(chalk_1.default.blue.bold("🔧 Initializing Blog Configuration\n"));
    const response = await (0, prompts_1.default)([
        {
            type: "text",
            name: "supabaseUrl",
            message: "Supabase Project URL:",
            validate: (value) => value.includes("supabase.co") || "Please enter a valid Supabase URL",
        },
        {
            type: "text",
            name: "supabaseAnonKey",
            message: "Supabase Anon Key:",
            validate: (value) => value.length > 0 || "Anon key is required",
        },
        {
            type: "text",
            name: "supabaseServiceKey",
            message: "Supabase Service Role Key (optional):",
        },
        {
            type: "text",
            name: "blogTitle",
            message: "Blog Title:",
            initial: "My Blog",
        },
        {
            type: "text",
            name: "blogDescription",
            message: "Blog Description:",
            initial: "A modern blog built with Next.js and Supabase",
        },
    ]);
    const spinner = (0, ora_1.default)("Creating configuration...").start();
    try {
        // Create or update .env.local
        const envPath = path_1.default.join(process.cwd(), ".env.local");
        let envContent = "";
        if (fs_extra_1.default.existsSync(envPath)) {
            envContent = await fs_extra_1.default.readFile(envPath, "utf-8");
        }
        // Add Supabase environment variables
        const supabaseEnvVars = `
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=${response.supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${response.supabaseAnonKey}
${response.supabaseServiceKey ? `SUPABASE_SERVICE_ROLE_KEY=${response.supabaseServiceKey}` : ""}

# Blog Configuration
NEXT_PUBLIC_BLOG_TITLE="${response.blogTitle}"
NEXT_PUBLIC_BLOG_DESCRIPTION="${response.blogDescription}"
`;
        // Remove existing Supabase config if present
        envContent = envContent.replace(/# Supabase Configuration[\s\S]*?(?=\n#|\n[A-Z]|$)/g, "");
        envContent = envContent.replace(/# Blog Configuration[\s\S]*?(?=\n#|\n[A-Z]|$)/g, "");
        envContent += supabaseEnvVars;
        await fs_extra_1.default.writeFile(envPath, envContent.trim());
        // Create blog config file
        const configPath = path_1.default.join(process.cwd(), "blog.config.js");
        const configContent = `
/** @type {import('@zemenay/modular-blog').BlogConfig} */
const blogConfig = {
  title: "${response.blogTitle}",
  description: "${response.blogDescription}",
  postsPerPage: 10,
  enableComments: false,
  enableSearch: true,
  enableCategories: true,
  enableTags: true,
  theme: {
    primaryColor: "#4318D1",
    darkMode: true
  },
  seo: {
    defaultMetaTitle: "${response.blogTitle}",
    defaultMetaDescription: "${response.blogDescription}",
    twitterHandle: "",
    ogImage: ""
  }
};

module.exports = blogConfig;
`;
        await fs_extra_1.default.writeFile(configPath, configContent.trim());
        spinner.succeed(chalk_1.default.green("✅ Blog configuration initialized!"));
        console.log(chalk_1.default.blue("\n📋 Configuration Files Created:"));
        console.log(chalk_1.default.gray("• .env.local - Environment variables"));
        console.log(chalk_1.default.gray("• blog.config.js - Blog configuration"));
        console.log(chalk_1.default.blue("\n🔑 Next Steps:"));
        console.log(chalk_1.default.gray("1. Review and update your configuration files"));
        console.log(chalk_1.default.gray("2. Run database migrations: npm run blog:migrate"));
        console.log(chalk_1.default.gray("3. Start your development server: npm run dev"));
    }
    catch (error) {
        spinner.fail(chalk_1.default.red("❌ Configuration failed"));
        console.error(error);
        process.exit(1);
    }
}
