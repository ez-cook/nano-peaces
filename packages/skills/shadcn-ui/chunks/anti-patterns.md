# Anti-Patterns & Common Mistakes — shadcn/ui

## Critical Anti-Patterns Table

| ❌ Mistake                             | ✅ Correct                                    | Why                                           |
| -------------------------------------- | --------------------------------------------- | --------------------------------------------- |
| `npm install shadcn`                   | `npx shadcn@latest add button`                | shadcn is a CLI tool, not an npm package      |
| `import from "@radix-ui/react-dialog"` | `import { Dialog } from "radix-ui"`           | Unified package since Feb 2026                |
| `<Form><FormField>` pattern            | `<Controller><Field>` pattern                 | Old form API deprecated in 2026               |
| Template literal class merge           | `cn()` utility                                | tailwind-merge handles class conflicts        |
| Hardcode `@/components/ui`             | Read `aliases.ui` from components.json        | Path varies per project configuration         |
| Skip `"use client"`                    | Check `rsc` in components.json                | RSC won't render interactive components       |
| Style `default`                        | Style `new-york` or nova variants             | `default` style is deprecated                 |
| Manual validation in form              | Zod schema + zodResolver                      | Standard Schema + react-hook-form integration |
| `cursor: pointer` assumed              | Tailwind v4 uses `cursor: default` on buttons | Add CSS override if needed                    |
| Skip `data-invalid`/`aria-invalid`     | Required for accessible error states          | a11y compliance                               |

## Deprecated Patterns (2026)

### Old Radix Imports

```tsx
// ❌ Deprecated
import * as DialogPrimitive from '@radix-ui/react-dialog'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'

// ✅ Correct — unified package
import { Dialog as DialogPrimitive } from 'radix-ui'
import { DropdownMenu as DropdownMenuPrimitive } from 'radix-ui'

// Migration command:
// npx shadcn@latest migrate radix
```

### Old Form Pattern

```tsx
// ❌ Deprecated
<Form {...form}>
  <FormField
    control={form.control}
    name="username"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Username</FormLabel>
        <FormControl><Input {...field} /></FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
</Form>

// ✅ Correct (2026)
<form onSubmit={form.handleSubmit(onSubmit)}>
  <Controller
    name="username"
    control={form.control}
    render={({ field, fieldState }) => (
      <Field data-invalid={fieldState.invalid || undefined}>
        <FieldLabel>Username</FieldLabel>
        <Input {...field} aria-invalid={fieldState.invalid || undefined} />
        {fieldState.error && <FieldError errors={[fieldState.error]} />}
      </Field>
    )}
  />
</form>
```

## Common Runtime Errors

### Missing "use client"

**Error:** Component renders as empty or hydration mismatch
**Fix:** Add `"use client"` at top of file for any component using hooks, event handlers, or browser APIs

### Wrong Alias Path

**Error:** `Module not found: Can't resolve '@/components/ui/button'`
**Fix:** Check `components.json` → `aliases.ui` matches your tsconfig paths

### Missing DialogTitle

**Error:** Console warning about missing accessible name
**Fix:** Always include `<DialogTitle>` (use `<VisuallyHidden>` if you don't want visible title)

### className Conflicts

**Error:** Styles not applying or overriding unexpectedly
**Fix:** Always use `cn()` to merge classes — never concatenate strings

## Migration Commands

```bash
npx shadcn@latest migrate radix    # @radix-ui/react-* → radix-ui
npx shadcn@latest migrate rtl      # physical → logical CSS classes
npx shadcn@latest migrate icons    # switch icon library
```
