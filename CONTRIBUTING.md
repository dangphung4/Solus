# Contributing to Solus

Here is a quickstart guide on how to contribute to this repository.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or newer)
- [npm](https://www.npmjs.com/)
- [Git](https://git-scm.com/downloads)
- React 19
- Tailwind CSS v3 (Note: We avoid v4 due to stability issues)

### Environment Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/dangphung4/Solus
   cd Solus
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```
   Note: We use the `--legacy-peer-deps` flag due to React 19 compatibility requirements.

3. **Configure environment variables**
   ```bash
   cd Solus/
   cp .env.example .env.local
   # Edit .env.local with your API keys
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. The application will be available at [http://localhost:5173](http://localhost:5173)

## Code Process

### Ticket Process

1. **Ticket Assignment**
   - All work must be associated with a GitHub issue
   - Self-assign the issue you're working on
   - Move the issue to "In Progress" on the project board

2. **Implementation Requirements**
   - Code must include appropriate tests
   - All code must pass linting and type checking
   - UI changes must be responsive and follow design system
   - New features require documentation updates

3. **Code Review Requirements**
   - PRs require at least one approving review
   - All CI checks must pass
   - PR author is responsible for resolving merge conflicts
   - I will provide feedback within 48 hours(most likely 1)

4. **Release Process**
   - Releases are made from the `main` branch
   - Release candidates are tagged with `rc-` prefix
   - Production releases follow semantic versioning

## Development Workflow

### Branch Organization

- `main` - Production-ready code
- `develop` - Integration branch for features
- `{your-name}/feature*` - Feature branches
- `{your-name}/fix*` - Bug fix branches

### Creating a New Feature or Fix

1. **Create a new branch from `develop`**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-you-are-fixing
   ```

2. **Make your changes**

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add user profile page"
   ```

4. **Push your branch**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request on GitHub**
   - Navigate to the repository on GitHub
   - Click "Pull requests" > "New pull request"
   - Select your branch and fill out the PR template

## Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) for structured, readable commit messages.

### Format

## `NOTE: PULL REQUESTS WILL NOT BE ACCEPTED IF COMMITS DO NOT FOLLOW THIS CONVENTION`

```
type(optional scope): description

[optional body]

[optional footer(s)]
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, whitespace)
- `refactor`: Code changes that neither fix bugs nor add features
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Changes to the build process, tools, etc.

### Examples

```
feat: add user authentication
fix(ui): resolve button alignment issue on mobile
docs: update API documentation
style: format code with prettier
refactor: simplify decision algorithm
test: add test cases for quick decision flow
```

## Code Standards

### TypeScript

- Follow the ESLint configuration
- Use TypeScript for type safety
- Use Interfaces instead of Types
- Avoid using TS Eslint Ignore tags
- Use functional components with hooks for React

### React Guidelines

- One component per file
- Follow the existing project structure:
  ```
  src/
  ├── components/
  │   ├── common/
  │   ├── features/
  │   └── layouts/
  ├── hooks/
  ├── pages/
  ├── services/
  ├── store/
  ├── types/
  └── utils/
  ```
- Keep components small and focused
- Use Suspense and Error Boundaries for data loading and error handling
- No **console logs** on Pull Request

### Styling

- We are **Mobile First**
- Use Tailwind CSS for styling (Use a cheatsheet to help)
- Follow the design system
- Use shadcn/ui components when available
- [21rst](https://21st.dev/) has very good design systems with Shadcn, you can use them when applicable
- Maintain responsive design principles

## Testing

Before submitting a PR, ensure:

1. **All tests pass**
   ```bash
   npm run test
   ```

2. **Linting passes**
   ```bash
   npm run lint
   ```

3. **Your code is formatted**
   ```bash
   npm run format
   ```

4. For new features, add appropriate tests, integration tests and **functional** tests are preffered

## Pull Request Process

1. Update the README.md if necessary
2. Include screenshots for UI changes
3. Link to related issues
4. Request a review from me
5. PR titles should follow the same convention as commit messages

## Code Review

- Address all comments before requesting re-review
- Use the GitHub "Resolve conversation" feature
- All comments must be resolved before re-review

## Development Tools

### Recommended VS Code Extensions

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- GitLens

### Useful Commands

```bash
# Lint code
npm run lint

# Automatically fix linting issues
npm run lint:fix

# Format code
npm run format

# Build for production
npm run build

# Preview production build
npm run preview
```

## Firebase Guidelines

- Keep security rules restrictive
- Test security rules locally
- Follow collections structure:
  ```
  users/
  decisions/
  feedback/
  ```

## Getting Help

If you have questions or need assistance:

- Shoot me a DM, I can get on call with you 

## Learning Resources

These resources may be helpful while working on the project:

- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Conventional Commits Specification](https://www.conventionalcommits.org/)
