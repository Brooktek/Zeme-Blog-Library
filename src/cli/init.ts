import fs from "fs-extra"
import path from "path"
import chalk from "chalk"
import prompts from "prompts"
import ora from "ora"

export async function initBlog() {
  console.log(chalk.blue.bold("🔧 Initializing Blog Configuration\n"))

  const response = await prompts([
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
  ])

  const spinner = ora("Creating configuration...").start()

  try {
    // Create or update .env.local
    const envPath = path.join(process.cwd(), ".env.local")
    let envContent = ""

    if (fs.existsSync(envPath)) {
      envContent = await fs.readFile(envPath, "utf-8")
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
`

    // Remove existing Supabase config if present
    envContent = envContent.replace(/# Supabase Configuration[\s\S]*?(?=\n#|\n[A-Z]|$)/g, "")
    envContent = envContent.replace(/# Blog Configuration[\s\S]*?(?=\n#|\n[A-Z]|$)/g, "")

    envContent += supabaseEnvVars

    await fs.writeFile(envPath, envContent.trim())

    // Create blog config file
    const configPath = path.join(process.cwd(), "blog.config.js")
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
`

    await fs.writeFile(configPath, configContent.trim())

    spinner.succeed(chalk.green("✅ Blog configuration initialized!"))

    console.log(chalk.blue("\n📋 Configuration Files Created:"))
    console.log(chalk.gray("• .env.local - Environment variables"))
    console.log(chalk.gray("• blog.config.js - Blog configuration"))

    console.log(chalk.blue("\n🔑 Next Steps:"))
    console.log(chalk.gray("1. Review and update your configuration files"))
    console.log(chalk.gray("2. Run database migrations: npm run blog:migrate"))
    console.log(chalk.gray("3. Start your development server: npm run dev"))
  } catch (error) {
    spinner.fail(chalk.red("❌ Configuration failed"))
    console.error(error)
    process.exit(1)
  }
}
