# Commit and Branch Guidelines - Upgraide

## About This Guide

This guide standardizes branch naming and commit conventions at Upgraide - Artificial Intelligence, Lda., facilitating collaborative development, continuous integration, and efficient project management across our software development and AI solutions portfolio.

## Branch Naming Rules

Branches must follow the patterns below, always including the GitHub issue number with a `#`, except for specific cases where no issue exists (e.g., initial project release):

| Type | Example | Description |
|------|---------|-------------|
| Feature | `feature/#123-user-authentication` | New functionalities or features |
| Bugfix | `bugfix/#456-api-error-handling` | Bug fixes reported in issues |
| Hotfix | `hotfix/#789-critical-security-patch` | Critical urgent fixes in production |
| Chore | `chore/#101-update-dependencies` | General maintenance, administrative updates |
| Docs | `docs/#202-api-documentation` | Documentation updates |
| Refactor | `refactor/#303-optimize-database-queries` | Code refactoring without changing functionality |
| Test | `test/#404-add-integration-tests` | Adding or updating tests |
| Style | `style/#505-update-ui-components` | UI/UX updates, styling changes |

### Practical Examples:
- New feature for issue #123:
  - `feature/#123-payment-integration`
- Bug fix for API issue #456:
  - `bugfix/#456-cors-configuration`
- Documentation update:
  - `docs/#789-setup-instructions`

## Commit Message Rules

Commits should be clear, concise, and follow this format:

```
[#ISSUE-NUMBER] Brief objective description of the change
```

### Examples:
- `[#123] Add user authentication endpoint`
- `[#456] Fix CORS configuration for external API calls`
- `[#789] Update setup documentation with Docker instructions`

For cases without an associated issue (e.g., initial release):
```
[vX.X.X] Brief objective description of the change
```

Example: `[v1.0.0] Initial project release`

## General Rules

1. **Never commit directly** to `main` (production) or `develop` (development) branches
2. **Always associate** branches and commits with corresponding GitHub issue numbers
3. **Delete branches** locally and remotely after successful merge
4. **Pull requests are mandatory** for code review before merging into main branches
5. **Keep commits atomic** - one logical change per commit
6. **Write descriptive PR descriptions** explaining the what, why, and how of your changes

## Complete Workflow Example

```bash
# Create branch
$ git checkout -b feature/#123-payment-integration

# Make changes and commit
$ git add .
$ git commit -m "[#123] Implement Stripe payment integration"

# Push branch to remote
$ git push origin feature/#123-payment-integration

# Create pull request via GitHub UI
# After review and merge, clean up branches

$ git checkout develop
$ git pull origin develop
$ git branch -d feature/#123-payment-integration
$ git push origin --delete feature/#123-payment-integration
```

## Commit Message Best Practices

### Good Examples:
- `[#234] Add user dashboard with analytics`
- `[#567] Fix memory leak in data processing service`
- `[#890] Refactor authentication middleware for better performance`
- `[#111] Update React to version 18.2.0`
- `[#222] Implement WebSocket connection for real-time updates`
- `[#333] Add unit tests for payment service`

### Bad Examples:
- `fix bug` ❌ (too vague, no issue reference)
- `WIP` ❌ (uninformative)
- `[#123] Fixed stuff and added things` ❌ (unclear description)
- `changes` ❌ (completely uninformative)

## Technology-Specific Guidelines

### Frontend Development
- `[#XXX] Add {component_name} component for {feature}`
- `[#XXX] Update UI for {page/section} improving {metric}`
- `[#XXX] Fix responsive layout in {component/page}`

### Backend Development
- `[#XXX] Add {endpoint} endpoint for {resource}`
- `[#XXX] Optimize {query/operation} reducing response time`
- `[#XXX] Implement {service_name} service for {functionality}`

### Database Changes
- `[#XXX] Add migration for {table/schema} changes`
- `[#XXX] Create index on {table.column} for performance`
- `[#XXX] Update {model} schema to support {feature}`

### DevOps & Infrastructure
- `[#XXX] Configure {service} for {environment}`
- `[#XXX] Add CI/CD pipeline for {process}`
- `[#XXX] Update Docker configuration for {service}`

## Questions or Suggestions?

Contact the Upgraide development team or open a discussion in the project's GitHub repository.

---
*Last updated: January 2025*
*Upgraide - Artificial Intelligence, Lda.*