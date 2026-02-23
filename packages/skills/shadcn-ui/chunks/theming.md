# Theming — shadcn/ui

## Color System

- Format: **oklch** (Tailwind v4)
- Convention: every color has `background` + `foreground` pair
- Defined as CSS variables in `:root` and `.dark`

## CSS Variables (Complete)

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --chart-1 through --chart-5;
  --sidebar-background, --sidebar-foreground, --sidebar-primary,
  --sidebar-primary-foreground, --sidebar-accent,
  --sidebar-accent-foreground, --sidebar-border, --sidebar-ring;
  --radius: 0.625rem;
}
```

## Add Custom Color

```css
/* 1. Define in :root and .dark */
:root {
  --warning: oklch(0.84 0.16 84);
  --warning-foreground: oklch(0.15 0.05 84);
}
.dark {
  --warning: oklch(0.41 0.11 46);
  --warning-foreground: oklch(0.95 0.03 84);
}

/* 2. Register with Tailwind v4 */
@theme inline {
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
}
```

Usage: `<div className="bg-warning text-warning-foreground" />`

## Dark Mode Setup (Next.js)

```bash
npm i next-themes
```

```tsx
// app/layout.tsx
import { ThemeProvider } from 'next-themes'

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

Toggle: `const { setTheme } = useTheme()`

## Base Colors

`neutral` | `gray` | `zinc` | `stone` | `slate` — set in components.json `tailwind.baseColor`

## Anti-patterns

- ❌ Don't use hex/rgb — use oklch CSS variables
- ❌ Don't hardcode colors — use semantic tokens (--primary, --muted, etc.)
- ❌ Don't forget `.dark` variant when adding custom colors
- ❌ Don't skip `@theme inline` — Tailwind v4 won't recognize custom colors without it
