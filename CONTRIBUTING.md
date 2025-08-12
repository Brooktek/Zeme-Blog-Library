# Contributing to Modular Blog System

Thank you for your interest in contributing to the Modular Blog System! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git
- Supabase account (for testing)

### Local Development Setup

1. **Fork and clone the repository:**
\`\`\`bash
git clone https://github.com/your-username/modular-blog.git
cd modular-blog
\`\`\`

2. **Install dependencies:**
\`\`\`bash
npm install
\`\`\`

3. **Set up environment variables:**
\`\`\`bash
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
\`\`\`

4. **Run database migrations:**
\`\`\`bash
# Run the SQL scripts in your Supabase dashboard
\`\`\`

5. **Start development server:**
\`\`\`bash
npm run dev
\`\`\`

## 📋 Development Guidelines

### Code Style

- **TypeScript**: All new code must be written in TypeScript
- **ESLint**: Follow the existing ESLint configuration
- **Prettier**: Code is automatically formatted with Prettier
- **Naming**: Use descriptive names for variables, functions, and components

### Component Guidelines

- **React Components**: Use functional components with hooks
- **Props**: Define TypeScript interfaces for all props
- **Styling**: Use Tailwind CSS classes, avoid inline styles
- **Accessibility**: Ensure components are accessible (ARIA labels, keyboard navigation)

### API Guidelines

- **REST**: Follow RESTful conventions
- **Error Handling**: Provide meaningful error messages
- **Validation**: Validate all inputs
- **Documentation**: Document all endpoints

### Database Guidelines

- **Migrations**: All schema changes must be in migration files
- **Naming**: Use snake_case for database columns
- **Indexes**: Add appropriate indexes for performance
- **Constraints**: Use database constraints for data integrity

## 🧪 Testing

### Running Tests

\`\`\`bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# All tests
npm run test:all
\`\`\`

### Writing Tests

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test API endpoints and database operations
- **E2E Tests**: Test complete user workflows

### Test Structure

\`\`\`typescript
describe('BlogPostCard', () => {
  it('should render post title', () => {
    // Test implementation
  })
  
  it('should handle click events', () => {
    // Test implementation
  })
})
\`\`\`

## 📝 Documentation

### Code Documentation

- **JSDoc**: Add JSDoc comments for all public APIs
- **README**: Update README.md for new features
- **Examples**: Provide usage examples

### API Documentation

- **OpenAPI**: Update OpenAPI spec for API changes
- **Examples**: Include request/response examples
- **Error Codes**: Document all error codes

## 🔄 Pull Request Process

### Before Submitting

1. **Create an issue** describing the problem or feature
2. **Fork the repository** and create a feature branch
3. **Write tests** for your changes
4. **Update documentation** as needed
5. **Run all tests** and ensure they pass
6. **Check code style** with ESLint and Prettier

### Pull Request Template

\`\`\`markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests pass
\`\`\`

### Review Process

1. **Automated Checks**: CI/CD pipeline runs tests and checks
2. **Code Review**: Maintainers review code and provide feedback
3. **Approval**: At least one maintainer approval required
4. **Merge**: Squash and merge to main branch

## 🐛 Bug Reports

### Before Reporting

1. **Search existing issues** to avoid duplicates
2. **Try latest version** to see if bug is fixed
3. **Minimal reproduction** case if possible

### Bug Report Template

\`\`\`markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g. macOS 12.0]
- Browser: [e.g. Chrome 96]
- Node.js: [e.g. 18.0.0]
- Package Version: [e.g. 1.0.0]

## Additional Context
Screenshots, logs, etc.
\`\`\`

## 💡 Feature Requests

### Before Requesting

1. **Check existing issues** for similar requests
2. **Consider scope** - does it fit the project goals?
3. **Think about implementation** - how would it work?

### Feature Request Template

\`\`\`markdown
## Feature Description
Clear description of the feature

## Problem Statement
What problem does this solve?

## Proposed Solution
How should this work?

## Alternatives Considered
Other solutions you considered

## Additional Context
Mockups, examples, etc.
\`\`\`

## 🏷️ Release Process

### Versioning

We follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Steps

1. **Update version** in package.json
2. **Update CHANGELOG.md** with changes
3. **Create release tag** with git
4. **Publish to npm** (automated)
5. **Create GitHub release** with notes

## 🎯 Project Goals

### Core Principles

- **Simplicity**: Easy to install and use
- **Performance**: Fast and efficient
- **Accessibility**: Usable by everyone
- **Modularity**: Use only what you need
- **Type Safety**: Full TypeScript support

### Roadmap

- [ ] Comment system integration
- [ ] Advanced SEO features
- [ ] Multi-language support
- [ ] Plugin system
- [ ] Visual editor
- [ ] Analytics integration

## 📞 Getting Help

### Community

- **GitHub Discussions**: Ask questions and share ideas
- **Discord**: Real-time chat with maintainers and community
- **Stack Overflow**: Tag questions with `modular-blog`

### Maintainers

- **@zemenay-team**: Core maintainers
- **Response Time**: We aim to respond within 48 hours

## 🙏 Recognition

Contributors are recognized in:
- **README.md**: Contributors section
- **CHANGELOG.md**: Release notes
- **GitHub**: Contributor graph and stats

Thank you for contributing to the Modular Blog System! 🎉
