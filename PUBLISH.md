# Publishing Guide

This guide provides the steps to publish new versions of the `zeme-blog-system` package to npm.

## Prerequisites

- You must have an npm account.
- You must be logged into your npm account via the CLI:
  ```bash
  npm login
  ```
- You must have publish access to the `zeme-blog-system` package on npm.

## Publishing Process

### Step 1: Build the Package

Before publishing, you must compile the TypeScript source code into JavaScript. This is a critical step that bundles the CLI for production.

```bash
npm run build:all
```

This command creates a `dist` directory with the compiled files.

### Step 2: Version the Package

Use the `npm version` command to bump the package version in `package.json` and create a git tag.

Choose one of the following based on the nature of your changes:

- **Patch (for bug fixes):**
  ```bash
  npm version patch
  ```
- **Minor (for new, non-breaking features):**
  ```bash
  npm version minor
  ```
- **Major (for breaking changes):**
  ```bash
  npm version major
  ```

### Step 3: Publish to npm

After building and versioning, publish the package to the npm registry.

```bash
npm publish
```

This command will publish the files specified in the `files` array of your `package.json`.

## Local Testing Before Publishing

To avoid publishing broken versions, you should always test your package locally first.

1.  **Build the package:**
    ```bash
    npm run build:all
    ```

2.  **Create a local tarball:**
    ```bash
    npm pack
    ```
    This will create a `.tgz` file in your project root (e.g., `zeme-blog-system-0.1.7.tgz`).

3.  **Test in another project:**
    Navigate to a separate test project and install the package from the local tarball:
    ```bash
    cd /path/to/your/test-project
    npm install /path/to/your/Zeme-Blog-Library/zeme-blog-system-0.1.7.tgz
    ```

4.  **Verify the installation** by running the CLI commands (`install`, `init`, `add`) in your test project.

### Rollback

If you need to unpublish (within 24 hours):
\`\`\`bash
npm unpublish @zemenay/modular-blog@1.0.0
\`\`\`

**Note**: Unpublishing is discouraged and has restrictions.
