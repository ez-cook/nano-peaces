---
name: shadcn-ui
description: 'Expert knowledge for building UI with shadcn/ui (2026). Activated when: project uses radix-ui or @base-ui-components/*, tailwindcss. Covers: component generation, theming, forms (Field+Controller pattern), data tables (TanStack Table), sidebar, accessibility, RTL, MCP, registry.'
metadata:
  version: 1.0.0
  tags: [ui, react, tailwind, shadcn, components, radix, base-ui, field, registry]
  requires: [react, tailwindcss]
---

# shadcn/ui Skill

## Mental Model

shadcn/ui is NOT a library. It's a code distribution platform.
You COPY components into your project and OWN them.
Never `npm install shadcn` — use `npx shadcn@latest add [component]`.
Since Feb 2026: imports use unified `radix-ui` (not `@radix-ui/react-*`).
Dual primitive support: Radix UI or Base UI — same API, different engine.

## Context Router

| User Intent                  | Load Chunk                      | When                                                 |
| ---------------------------- | ------------------------------- | ---------------------------------------------------- |
| Create button, card, badge   | chunks/components/button.md     | Mentions specific component name                     |
| Build form with validation   | chunks/components/form.md       | Mentions form, input, validation, zod, Field         |
| Add data table               | chunks/components/data-table.md | Mentions table, sorting, filtering, pagination       |
| Add dialog, sheet, drawer    | chunks/components/dialog.md     | Mentions modal, popup, overlay, sheet                |
| Build sidebar / navigation   | chunks/components/sidebar.md    | Mentions sidebar, nav, collapsible menu              |
| Setup/install shadcn         | chunks/installation.md          | New project or first shadcn mention                  |
| Theme, dark mode, colors     | chunks/theming.md               | Mentions theme, dark, colors, CSS variables, oklch   |
| components.json config       | chunks/config.md                | Mentions config, aliases, registry, monorepo setup   |
| Breadcrumb, tabs, pagination | chunks/patterns/navigation.md   | Mentions breadcrumb, tabs, nav-menu, pagination      |
| cn(), asChild, cva, extend   | chunks/patterns/composition.md  | Mentions composition, variants, extending components |
| Something went wrong         | chunks/anti-patterns.md         | User reports bug or unexpected behavior              |

## Quick Reference (Top Patterns)

### Add a component

```bash
npx shadcn@latest add button
```

### New project (choose Radix or Base UI)

```bash
npx shadcn@latest create
```

### Button variants & sizes

```tsx
<Button variant="default" />      // primary
<Button variant="destructive" />  // danger
<Button variant="outline" />      // bordered
<Button variant="secondary" />    // muted
<Button variant="ghost" />        // no border
<Button variant="link" />         // text link

// sizes: "default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"
<Button size="sm">Small</Button>
```

### cn() utility (ALWAYS use this for conditional classes)

```tsx
import { cn } from '@/lib/utils'
;<div className={cn('base-class', condition && 'conditional-class')} />
```

### Icon spacing (REQUIRED for icons in buttons/menu items)

```tsx
<Button>
  <IconGitBranch data-icon="inline-start" /> New Branch
</Button>
```

### Imports (2026 — unified package)

```tsx
// ✅ Correct (2026)
import { Dialog as DialogPrimitive } from 'radix-ui'
// ❌ Deprecated
import * as DialogPrimitive from '@radix-ui/react-dialog'
```

## Critical Rules

1. NEVER install shadcn as npm dependency — always use CLI `add`
2. ALWAYS use `cn()` for class merging (not template literals)
3. ALWAYS check components.json for project config before generating
4. Components go in the path specified by components.json `aliases.ui`
5. Use `asChild` prop (Radix Slot) for polymorphic rendering
6. Import from `radix-ui` unified package (not `@radix-ui/react-*`)
7. Use `data-icon="inline-start"|"inline-end"` on icons inside buttons
8. Use `data-invalid` on Field + `aria-invalid` on controls for error states
9. Tailwind v4: button has `cursor: default` — add CSS override if need pointer
10. `use client` directive required for interactive components when RSC is enabled
