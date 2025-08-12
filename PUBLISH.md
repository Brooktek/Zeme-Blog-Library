# Publishing Guide

## Prerequisites

1. **NPM Account**: Ensure you have an npm account and are logged in:
   ```bash
   npm login
   ```

2. **Package Access**: Make sure you have access to publish the `zeme-blog-system` package.

## Publishing Steps

### 1. Prepare for Publishing

```bash
# Install dependencies
npm install

# Build the package
npm run build

# Test the build
npm test
```

### 2. Version Management

Choose the appropriate version bump:

\`\`\`bash
# Patch version (1.0.0 -> 1.0.1) - Bug fixes
npm run version:patch

# Minor version (1.0.0 -> 1.1.0) - New features
npm run version:minor

# Major version (1.0.0 -> 2.0.0) - Breaking changes
npm run version:major
\`\`\`

### 3. Publish to NPM

\`\`\`bash
# Publish to npm registry
npm run publish:npm
\`\`\`

Or manually:
\`\`\`bash
npm publish --access public
\`\`\`

### 4. Verify Publication

Check that your package is available:
\`\`\`bash
npm view @zemenay/modular-blog
\`\`\`

## Testing Before Publishing

### Local Testing

1. **Pack the package locally**:
   \`\`\`bash
   npm pack
   \`\`\`

2. **Test in another project**:
   \`\`\`bash
   cd /path/to/test-project
   npm install /path/to/zemenay-modular-blog-1.0.0.tgz
   \`\`\`

### Beta Publishing

For testing with beta users:
\`\`\`bash
npm publish --tag beta
\`\`\`

Install beta version:
\`\`\`bash
npm install @zemenay/modular-blog@beta
\`\`\`

## Post-Publishing

1. **Update Documentation**: Ensure README.md reflects the latest version
2. **Create GitHub Release**: Tag the release on GitHub
3. **Announce**: Share the release with the community

## Troubleshooting

### Common Issues

1. **Permission Denied**: Ensure you're logged in and have org access
2. **Version Already Exists**: Bump version number before publishing
3. **Build Errors**: Check TypeScript compilation and fix errors

### Rollback

If you need to unpublish (within 24 hours):
\`\`\`bash
npm unpublish @zemenay/modular-blog@1.0.0
\`\`\`

**Note**: Unpublishing is discouraged and has restrictions.
