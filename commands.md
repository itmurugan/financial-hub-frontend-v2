# Financial Hub AI - Commands Reference

This document contains all essential commands for developing, testing, building, and deploying the Financial Hub AI application.

## 📋 Table of Contents
- [Development Commands](#development-commands)
- [Testing Commands](#testing-commands)
- [Build Commands](#build-commands)
- [Docker Commands](#docker-commands)
- [Git Commands](#git-commands)
- [CI/CD Commands](#cicd-commands)
- [Troubleshooting Commands](#troubleshooting-commands)

---

## 🚀 Development Commands

### Project Setup
```bash
# Clone the repository
git clone https://github.com/itmurugan/financial-hub-frontend-v2.git
cd financial-hub-frontend-v2

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
```

### Development Server
```bash
# Start development server (default port: 3000)
npm start

# Start with specific port
PORT=3001 npm start

# Start with environment variables
REACT_APP_API_BASE_URL=http://localhost:8000 npm start
```

### Code Quality
```bash
# Run ESLint
npm run lint

# Fix ESLint issues automatically
npm run lint -- --fix

# Check TypeScript types
npx tsc --noEmit

# Format code with Prettier (if configured)
npx prettier --write src/**/*.{ts,tsx,js,jsx}
```

---

## 🧪 Testing Commands

### Running Tests
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in CI mode (no watch)
npm run test:ci

# Run specific test file
npm test -- FileUpload.test.tsx

# Run tests matching pattern
npm test -- --testPathPattern="components"

# Run tests in verbose mode
npm test -- --verbose

# Run tests with specific timeout
npm test -- --testTimeout=10000
```

### Test Development
```bash
# Run tests in watch mode (default)
npm test

# Update test snapshots
npm test -- --updateSnapshot

# Run tests with coverage and generate HTML report
npm run test:coverage --open

# Debug tests
npm test -- --detectOpenHandles --forceExit
```

### Coverage Commands
```bash
# Generate coverage report
npm run test:coverage

# View coverage in browser (after generating)
open coverage/lcov-report/index.html

# Check coverage thresholds
npm run test:ci
```

---

## 🏗️ Build Commands

### Production Build
```bash
# Build for production
npm run build

# Build with specific environment
REACT_APP_API_BASE_URL=https://api.financialhub.com npm run build

# Analyze bundle size
npm install -g source-map-explorer
npm run build
npx source-map-explorer 'build/static/js/*.js'
```

### Build Verification
```bash
# Serve production build locally
npx serve -s build

# Serve on specific port
npx serve -s build -l 3000

# Test production build
npm run build && npx serve -s build
```

---

## 🐳 Docker Commands

### Development Environment
```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up

# Start with rebuild
docker-compose -f docker-compose.dev.yml up --build

# Stop development environment
docker-compose -f docker-compose.dev.yml down

# View logs
docker-compose -f docker-compose.dev.yml logs -f frontend-dev
```

### Production Environment
```bash
# Build and start production environment
docker-compose up --build

# Start in background
docker-compose up -d

# Stop production environment
docker-compose down

# View production logs
docker-compose logs -f frontend
```

### Docker Image Management
```bash
# Build production image
docker build -t financial-hub-frontend .

# Build development image
docker build -f Dockerfile.dev -t financial-hub-frontend:dev .

# Run container directly
docker run -p 3000:80 financial-hub-frontend

# Run development container
docker run -p 3000:3000 -v $(pwd):/app financial-hub-frontend:dev

# Remove unused images
docker image prune -f

# View container logs
docker logs <container-id>
```

### Multi-platform Builds
```bash
# Build for multiple platforms
docker buildx build --platform linux/amd64,linux/arm64 -t financial-hub-frontend .

# Push multi-platform image
docker buildx build --platform linux/amd64,linux/arm64 --push -t your-registry/financial-hub-frontend .
```

---

## 🔄 Git Commands

### Branch Management
```bash
# Create and switch to new branch
git checkout -b feature/new-feature

# Switch branches
git checkout main
git checkout feature/new-feature

# List all branches
git branch -a

# Delete local branch
git branch -d feature/old-feature

# Delete remote branch
git push origin --delete feature/old-feature
```

### Committing Changes
```bash
# Check status
git status

# Add all changes
git add .

# Add specific files
git add src/components/NewComponent.tsx

# Commit with message
git commit -m "feat: add new component"

# Commit with detailed message
git commit -m "feat: add comprehensive testing suite

- Add unit tests for all components
- Implement integration tests
- Achieve 73% test coverage
- Add CI/CD pipeline

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

### Syncing Changes
```bash
# Push current branch
git push

# Push new branch
git push -u origin feature/new-feature

# Pull latest changes
git pull

# Pull and rebase
git pull --rebase

# Fetch all branches
git fetch --all
```

---

## 🚀 CI/CD Commands

### GitHub Actions (Local Testing)
```bash
# Install act (GitHub Actions local runner)
brew install act  # macOS
# or
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

# Run GitHub Actions locally
act

# Run specific workflow
act -j test

# Run with secrets
act --secret-file .secrets
```

### GitHub CLI Commands
```bash
# Install GitHub CLI
brew install gh  # macOS

# Create pull request
gh pr create --title "feat: new feature" --body "Description of changes"

# List pull requests
gh pr list

# View PR details
gh pr view 1

# Merge pull request
gh pr merge 1 --merge

# Create release
gh release create v1.0.0 --notes "Release notes"
```

### Deployment Commands
```bash
# Deploy to staging (example)
npm run build
aws s3 sync build/ s3://staging-bucket --delete

# Deploy to production (example)
npm run build
aws s3 sync build/ s3://production-bucket --delete
aws cloudfront create-invalidation --distribution-id EXAMPLE --paths "/*"
```

---

## 🔧 Troubleshooting Commands

### Node.js Issues
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version
npm --version

# Use specific Node.js version (with nvm)
nvm use 18
nvm install 18.17.0
```

### Development Server Issues
```bash
# Kill processes on port 3000
lsof -ti:3000 | xargs kill -9

# Clear React cache
rm -rf node_modules/.cache

# Reset development server
npm start -- --reset-cache
```

### Docker Issues
```bash
# Remove all containers
docker container prune -f

# Remove all images
docker image prune -a -f

# Remove all volumes
docker volume prune -f

# System cleanup
docker system prune -a --volumes -f

# View Docker disk usage
docker system df
```

### Test Issues
```bash
# Clear Jest cache
npx jest --clearCache

# Run tests with no cache
npm test -- --no-cache

# Debug failing tests
npm test -- --verbose --no-coverage

# Run single test file
npm test -- --testNamePattern="specific test name"
```

### Build Issues
```bash
# Clear build cache
rm -rf build/

# Increase memory for build
NODE_OPTIONS="--max-old-space-size=4096" npm run build

# Debug build process
npm run build -- --verbose

# Check bundle analyzer
npm install -g webpack-bundle-analyzer
npx webpack-bundle-analyzer build/static/js/*.js
```

---

## 🔍 Monitoring Commands

### Performance Analysis
```bash
# Lighthouse audit
npm install -g lighthouse
lighthouse http://localhost:3000 --output html --output-path ./lighthouse-report.html

# Bundle analysis
npm run build
npx webpack-bundle-analyzer build/static/js/*.js
```

### Health Checks
```bash
# Check if app is running
curl http://localhost:3000/

# Check API connectivity (if applicable)
curl http://localhost:8000/api/health

# Docker health check
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

### Log Analysis
```bash
# View application logs
npm start 2>&1 | tee app.log

# View Docker logs
docker-compose logs -f --tail=100

# Search logs for errors
grep -i error app.log
```

---

## 📚 Useful Aliases

Add these to your shell profile (`.bashrc`, `.zshrc`, etc.):

```bash
# Development aliases
alias fh-start='npm start'
alias fh-test='npm run test:coverage'
alias fh-build='npm run build'
alias fh-lint='npm run lint'

# Docker aliases  
alias fh-dev='docker-compose -f docker-compose.dev.yml up'
alias fh-prod='docker-compose up -d'
alias fh-logs='docker-compose logs -f'
alias fh-down='docker-compose down'

# Git aliases
alias gs='git status'
alias ga='git add .'
alias gc='git commit -m'
alias gp='git push'
alias gl='git pull'

# Utility aliases
alias serve-build='npx serve -s build'
alias clean-install='rm -rf node_modules package-lock.json && npm install'
```

---

## 🆘 Emergency Commands

### Quick Reset
```bash
# Complete project reset
git stash
git checkout main
git pull
rm -rf node_modules package-lock.json
npm install
npm start
```

### Production Hotfix
```bash
# Quick hotfix workflow
git checkout main
git pull
git checkout -b hotfix/urgent-fix
# Make changes
git add .
git commit -m "hotfix: urgent production fix"
git push -u origin hotfix/urgent-fix
gh pr create --title "HOTFIX: Urgent production fix" --base main
```

### Recovery Commands
```bash
# Recover accidentally deleted files
git checkout HEAD -- filename.tsx

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Restore specific file from another branch
git checkout feature/other-branch -- src/components/Component.tsx
```

---

*📝 Keep this file updated as the project evolves. Add new commands and remove obsolete ones regularly.*