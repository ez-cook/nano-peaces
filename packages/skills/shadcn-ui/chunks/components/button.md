# Button — shadcn/ui

## Install

```bash
npx shadcn@latest add button
```

## Variants

```tsx
<Button variant="default" />      // primary — solid background
<Button variant="destructive" />  // danger — red
<Button variant="outline" />      // bordered — transparent bg
<Button variant="secondary" />    // muted — subtle background
<Button variant="ghost" />        // no border, hover only
<Button variant="link" />         // looks like a text link
```

## Sizes

```tsx
<Button size="default" />   // h-9 px-4 py-2
<Button size="xs" />        // h-7 px-2.5 text-xs
<Button size="sm" />        // h-8 px-3
<Button size="lg" />        // h-10 px-6
<Button size="icon" />      // h-9 w-9 (square)
<Button size="icon-xs" />   // h-7 w-7
<Button size="icon-sm" />   // h-8 w-8
<Button size="icon-lg" />   // h-10 w-10
```

## Icon Usage (REQUIRED pattern)

```tsx
// data-icon adds correct spacing automatically
<Button>
  <IconPlus data-icon="inline-start" />
  Add Item
</Button>

<Button>
  Settings
  <IconChevronRight data-icon="inline-end" />
</Button>

// Icon-only button
<Button size="icon" aria-label="Settings">
  <IconSettings />
</Button>
```

## Button as Link (asChild)

```tsx
<Button asChild>
  <Link href="/dashboard">Go to Dashboard</Link>
</Button>
```

## Loading State

```tsx
<Button disabled>
  <Spinner data-icon="inline-start" />
  Saving...
</Button>
```

## Button Group

```tsx
<ButtonGroup>
  <Button variant="outline">Left</Button>
  <Button variant="outline">Center</Button>
  <Button variant="outline">Right</Button>
</ButtonGroup>
```

## Cursor Override (Tailwind v4)

Tailwind v4 sets `cursor: default` on buttons. If you need pointer cursor:

```css
/* globals.css */
button:not(:disabled) {
  cursor: pointer;
}
```

## Anti-patterns

- ❌ Don't merge classNames with template literals — use `cn()`
- ❌ Don't wrap Button in `<a>` — use `asChild` with `<Link>`
- ❌ Don't forget `aria-label` on icon-only buttons
- ❌ Don't forget `data-icon` on icons — spacing will be wrong without it
