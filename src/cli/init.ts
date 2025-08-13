import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import ora from "ora";
import prompts from "prompts";

// Helper to validate Supabase URL
const isValidSupabaseUrl = (url: string) => /https?:\/\/.+\.supabase\.co/i.test(url);

// Helper to update tsconfig.json with path aliases
async function updateTsConfig(aliases: { components: string; lib: string }) {
  const tsConfigPath = path.join(process.cwd(), "tsconfig.json");
  if (!fs.existsSync(tsConfigPath)) {
    console.warn(chalk.yellow("\\nNo `tsconfig.json` found. Skipping alias configuration. You may need to add aliases manually."));
    return;
  }

  try {
    const tsConfig = await fs.readJson(tsConfigPath, { throws: false }) || {};
    tsConfig.compilerOptions = tsConfig.compilerOptions || {};
    tsConfig.compilerOptions.paths = tsConfig.compilerOptions.paths || {};

    tsConfig.compilerOptions.paths["@/components/*"] = [`${aliases.components}/*`];
    tsConfig.compilerOptions.paths["@/lib/*"] = [`${aliases.lib}/*`];

    await fs.writeJson(tsConfigPath, tsConfig, { spaces: 2 });
  } catch (error) {
    console.warn(chalk.yellow("\\nCould not update `tsconfig.json`. Please add path aliases manually."));
  }
}

export async function initBlog() {
  console.log(chalk.blue.bold("\\n🔧 Initializing Zeme Blog..."));

  try {
    const spinner = ora('Gathering configuration details...').start();
    const responses = await prompts([
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

    const configSpinner = ora('Applying configuration...').start();

    // 1. Create components.json
    const componentsConfig = {
      "$schema": "https://raw.githubusercontent.com/Zeme-Inc/zeme-blog/main/schemas/components.json",
      "aliases": { "components": componentsPath, "lib": libPath },
    };
    await fs.writeJson(path.join(process.cwd(), "components.json"), componentsConfig, { spaces: 2 });
    configSpinner.text = 'Created components.json';

    // 2. Configure tsconfig.json aliases
    await updateTsConfig(componentsConfig.aliases);
    configSpinner.text = 'Configured path aliases in tsconfig.json';

    // 3. Create blog.config.js
    const blogConfigContent = `/** @type {import('zeme-blog').BlogConfig} */\\nconst blogConfig = {\\n  title: "${blogTitle}",\\n  description: "${blogDescription}",\\n};\\n\\nmodule.exports = blogConfig;`;
    await fs.writeFile(path.join(process.cwd(), "blog.config.js"), blogConfigContent.trim());
    configSpinner.text = 'Created blog.config.js';

    // 4. Update .env.local
    const envPath = path.join(process.cwd(), ".env.local");
    let envContent = fs.existsSync(envPath) ? await fs.readFile(envPath, "utf-8") : "";
    if (!envContent.endsWith('\\n') && envContent) envContent += '\\n';
    envContent += `# Zeme Blog Configuration\\nNEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}\\nNEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseAnonKey}\\n`;
    await fs.writeFile(envPath, envContent.trim());
    configSpinner.text = 'Updated .env.local';

    configSpinner.succeed(chalk.green("Configuration applied successfully!"));

    console.log(chalk.green.bold("\\n✅ Zeme Blog initialized successfully!"));
    console.log(chalk.blue("\\nNext steps:"));
    console.log(chalk.gray("1. Run `npx zeme-blog add <component-name>` to add components."));
    console.log(chalk.gray("2. Customize your blog settings in `blog.config.js`."));

  } catch (error: any) {
    // If prompts is aborted, error.name is undefined
    if (error.name === undefined) {
        console.log(chalk.yellow('\\n\\nAborted initialization.'));
        return;
    }
    console.error(chalk.red("\\nInitialization failed:"), error.message);
    process.exit(1);
  }
}