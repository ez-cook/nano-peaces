# Installation — shadcn/ui

## Methods

| Method                | Command                    | When                                    |
| --------------------- | -------------------------- | --------------------------------------- |
| Init existing project | `npx shadcn@latest init`   | Already have a React project            |
| Create new project    | `npx shadcn@latest create` | Starting fresh (picks Radix or Base UI) |

## Framework Matrix

| Framework          | Notes                                                                   |
| ------------------ | ----------------------------------------------------------------------- |
| Next.js            | App Router default, RSC support. Most common setup.                     |
| Next.js (Monorepo) | Select "Next.js (Monorepo)" during init. Creates apps/web + packages/ui |
| Vite               | No RSC. Set `rsc: false` in components.json                             |
| Remix              | Differs in CSS setup                                                    |
| Astro              | Requires React integration first                                        |
| Laravel            | Inertia.js + React manual setup                                         |

## Prerequisites

- React 19+
- Tailwind CSS v4
- TypeScript 5+ (recommended)

## Post-Install Checklist

1. Verify `components.json` was created with correct aliases
2. Test: `npx shadcn@latest add button` — should create `components/ui/button.tsx`
3. Check path aliases resolve: `@/components/ui/button` imports correctly
4. If monorepo: both `apps/web` and `packages/ui` need `components.json`

## Primitive Choice

- **Radix UI** — Default. Battle-tested, largest community. Choose this unless you need Base UI.
- **Base UI** — MUI's unstyled primitive layer. Choose if your team prefers MUI ecosystem.
- Both provide same shadcn component API. Only internal primitives differ.
- Styles: `new-york` (Radix default), `radix-nova`, `base-nova`
- `default` style is **deprecated** — use `new-york` or nova variants
