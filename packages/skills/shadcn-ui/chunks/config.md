# components.json Reference

The central config file for shadcn/ui. AI agents MUST read this before generating any component.

## Full Schema

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "registries": {
    "@acme": "https://registry.acme.com/{name}.json"
  }
}
```

## Key Fields for AI Agents

| Field                   | Impact                                                | Details                             |
| ----------------------- | ----------------------------------------------------- | ----------------------------------- |
| `rsc`                   | `true` → add `"use client"` to interactive components | Default true for Next.js App Router |
| `tsx`                   | `false` → generate `.jsx` instead of `.tsx`           | Default true                        |
| `aliases.ui`            | Path where components are placed                      | DO NOT hardcode `@/components/ui`   |
| `tailwind.cssVariables` | `true` = CSS vars, `false` = utility classes          | Affects theming approach            |
| `tailwind.prefix`       | Prefix for all Tailwind classes (e.g. `tw-`)          | Must be used in all generated code  |
| `tailwind.config: ""`   | Empty = Tailwind v4 (no config file needed)           | Non-empty = Tailwind v3             |
| `style`                 | `new-york` (default), `radix-nova`, `base-nova`       | `default` is DEPRECATED             |
| `baseColor`             | neutral \| gray \| zinc \| stone \| slate             | Affects color palette               |
| `iconLibrary`           | `lucide` (default) \| `@tabler/icons-react`           | Affects icon imports                |

## Monorepo Config

Both workspaces need `components.json` with matching `style`, `iconLibrary`, `baseColor`:

- `apps/web/components.json` — for the app
- `packages/ui/components.json` — for shared UI package
- Import pattern: `import { Button } from "@workspace/ui/components/button"`
