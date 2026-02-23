# Contributing to nano-peaces

Thank you for your interest in contributing! This guide will help you get started.

## Development Setup

```bash
# Clone the repo
git clone https://github.com/ez-cook/nano-peaces.git
cd nano-peaces

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test
```

## Project Structure

```
nano-peaces/
├── packages/
│   ├── cli/          # CLI tool (@ez-cook/nano-peaces)
│   │   ├── src/
│   │   │   ├── adapters/     # Agent-specific output formatters
│   │   │   ├── commands/     # CLI commands (init, add, list, update)
│   │   │   ├── fingerprint/  # Project detection logic
│   │   │   ├── types/        # TypeScript interfaces
│   │   │   └── utils/        # Shared utilities
│   │   └── tests/            # Unit + E2E tests
│   └── skills/       # Skill content (source of truth)
│       ├── registry.json     # Layer 1 — skill metadata
│       └── shadcn-ui/        # Layer 2 + 3 — skill files
├── package.json      # Monorepo root
└── pnpm-workspace.yaml
```

## Available Scripts

| Script              | Description                                       |
| ------------------- | ------------------------------------------------- |
| `pnpm build`        | Build all packages                                |
| `pnpm test`         | Run all tests                                     |
| `pnpm lint`         | Run ESLint                                        |
| `pnpm lint:fix`     | Auto-fix lint issues                              |
| `pnpm format`       | Format code with Prettier                         |
| `pnpm format:check` | Check formatting                                  |
| `pnpm typecheck`    | TypeScript type checking                          |
| `pnpm check`        | Run all checks (lint + format + typecheck + test) |

## Adding a New Skill

1. Create a directory: `packages/skills/{skill-id}/`
2. Add `SKILL.md` (Layer 2 — core knowledge)
3. Add `chunks/*.md` (Layer 3 — detailed knowledge)
4. Register in `packages/skills/registry.json` (Layer 1)
5. Run `pnpm build && pnpm test`

### Skill File Format

**SKILL.md** should have YAML frontmatter:

```yaml
---
name: My Skill
description: Brief description
version: '1.0'
---
```

**Chunks** are standalone Markdown files with focused knowledge on one topic.

## Adding a New Agent Adapter

1. Create `packages/cli/src/adapters/{agent-name}.ts`
2. Implement the `SkillAdapter` interface
3. Register in `packages/cli/src/adapters/registry.ts`
4. Add the agent type to `AGENT_TYPES` in `constants.ts`
5. Add tests in `packages/cli/tests/`

## Pull Request Guidelines

1. **Fork & branch**: Create a feature branch from `main`
2. **Code quality**: Run `pnpm check` before submitting
3. **Tests**: Add tests for new features
4. **Commits**: Use [Conventional Commits](https://www.conventionalcommits.org/)
   - `feat:` — new feature
   - `fix:` — bug fix
   - `docs:` — documentation
   - `chore:` — maintenance
5. **PR description**: Explain what and why

## Code Style

- **Prettier** handles formatting (semi: false, singleQuote: true)
- **ESLint** catches errors (no-unused-vars, no-explicit-any)
- Run `pnpm check` to verify everything passes

## Reporting Issues

- Use GitHub Issues
- Include steps to reproduce
- Include your Node.js version and OS

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
