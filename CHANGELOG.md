# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [0.1.0] - 2026-02-23

### Added

- **CLI tool** (`@ez-cook/nano-peaces`) with commands: `init`, `add`, `list`, `update`
- **3-Layer skill architecture**: registry.json → SKILL.md → chunks/\*.md
- **Project fingerprinting**: auto-detect framework, UI libraries, styling, router, state management
- **4 agent adapters**: Antigravity, Claude Code, Cursor, Generic
- **shadcn-ui skill**: comprehensive knowledge pack with 12 chunks covering installation, theming, components, forms, data tables, sidebar, navigation, composition, and anti-patterns
- **Config management**: `.nano-peaces/config.json` + `.nano-peaces/context.json`
- **Auto .gitignore**: updates .gitignore with nano-peaces paths
- Full test suite (34 tests): fingerprint detection, adapter transforms, E2E pipeline
