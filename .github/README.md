# GitHub Configuration for Solus

This directory contains GitHub configurations, workflows, and templates for the Solus project.

## Directory Structure

- `workflows/`: GitHub Actions workflows
- `ISSUE_TEMPLATE/`: Issue templates for bug reports, feature requests, etc.
- `CODEOWNERS`: Defines code ownership for the repository
- `dependabot.yml`: Configuration for Dependabot automated dependency updates
- `pull_request_template.md`: Template for pull requests
- `changelog.json`: Configuration for changelog generation
- `SECURITY.md`: Security policy and vulnerability reporting guidelines
- `release-please-config.json`: Configuration for Release Please automation

## Important Note

The actual React application is in the `/Solus` subdirectory, not in the root. All workflows are configured to account for this structure.

## Workflows

### Build and Test

- `build-test.yml`: Builds the application and runs tests
- Runs on push to main/develop branches and on PRs

### Code Quality

- `code-quality.yml`: Runs linting and type checking
- Runs on push to main/develop branches and on PRs

### Security Scanning

- `security-scan.yml`: Performs security scans using npm audit and CodeQL
- Runs on push, PRs, and weekly schedule

### Stale Issue Management

- `stale.yml`: Automatically marks and closes stale issues and PRs
- Runs on a daily schedule

### Vercel Deployment

- `vercel-deploy.yml`: Handles deployment to Vercel
- Deploys production on push to main
- Can create preview deployments using manual workflow dispatch

### Conventional Commits Checks

- `conventional-commits.yml`: Ensures PR titles follow conventional commit format
- Runs when PRs are opened/edited/synchronized

### Commitlint

- `commitlint.yml`: Validates commit messages against the commitlint rules
- Uses the .commitlintrc.json file in the root

### Release Management

- `release-please.yml`: Automates versioning and changelog generation
- Uses the changelog.json format for structured changelogs

### Changelog Generation

- `generate-changelog.yml`: Manual workflow to generate changelog for a specific tag
- Useful for creating release notes

## Local Testing

You can test these workflows locally using [act](https://github.com/nektos/act):

```bash
# Install act
brew install act

# Test build workflow (from Solus directory)
cd Solus
npm run test-build-workflow

# Test lint workflow (from Solus directory)
cd Solus
npm run test-lint-workflow
```

## Adding Secrets

Many workflows require GitHub Secrets to be configured:

1. Go to Repository Settings > Secrets and Variables > Actions
2. Add the following secrets:
   - `FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, etc.
   - `OPENAI_API_KEY`
   - `VERCEL_TOKEN`

## Issues and PRs

- Issue templates are available when creating new issues
- Use the PR template to ensure your changes include all necessary information
