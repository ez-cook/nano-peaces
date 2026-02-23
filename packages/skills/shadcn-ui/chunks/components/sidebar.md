# Sidebar — shadcn/ui

## Install

```bash
npx shadcn@latest add sidebar
```

## Component Hierarchy

```
SidebarProvider
  └── Sidebar (side: left|right, variant: sidebar|floating|inset, collapsible: offcanvas|icon|none)
      ├── SidebarHeader (sticky top)
      ├── SidebarContent (scrollable)
      │   └── SidebarGroup
      │       ├── SidebarGroupLabel
      │       ├── SidebarGroupAction
      │       └── SidebarGroupContent
      │           └── SidebarMenu
      │               └── SidebarMenuItem
      │                   ├── SidebarMenuButton (isActive, asChild, tooltip)
      │                   ├── SidebarMenuAction
      │                   ├── SidebarMenuBadge
      │                   └── SidebarMenuSub
      │                       └── SidebarMenuSubItem
      │                           └── SidebarMenuSubButton
      ├── SidebarFooter (sticky bottom)
      └── SidebarRail (thin toggle rail)
```

## Basic Setup

```tsx
// app/layout.tsx
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'

export default function Layout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}
```

## Menu Items

```tsx
<SidebarMenu>
  {items.map((item) => (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton asChild isActive={item.isActive} tooltip={item.title}>
        <a href={item.url}>
          <item.icon data-icon="inline-start" />
          <span>{item.title}</span>
        </a>
      </SidebarMenuButton>
    </SidebarMenuItem>
  ))}
</SidebarMenu>
```

## Collapsible Sub-menu

```tsx
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
;<Collapsible defaultOpen className="group/collapsible">
  <SidebarMenuItem>
    <CollapsibleTrigger asChild>
      <SidebarMenuButton>
        <span>Settings</span>
        <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
      </SidebarMenuButton>
    </CollapsibleTrigger>
    <CollapsibleContent>
      <SidebarMenuSub>
        <SidebarMenuSubItem>
          <SidebarMenuSubButton asChild>
            <a href="/settings/general">General</a>
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>
      </SidebarMenuSub>
    </CollapsibleContent>
  </SidebarMenuItem>
</Collapsible>
```

## useSidebar Hook

```tsx
const { state, open, setOpen, openMobile, setOpenMobile, isMobile, toggleSidebar } = useSidebar()
// state: "expanded" | "collapsed"
// Keyboard shortcut: cmd+b (Mac) / ctrl+b (Windows)
```

## Variants

- `sidebar` — default, standard sidebar with border
- `floating` — floats over content with shadow, rounded border
- `inset` — sidebar is inset, main content in `<SidebarInset>`

For `inset`: wrap content in `<SidebarInset>` instead of plain `<main>`

## Anti-patterns

- ❌ Don't forget `<SidebarProvider>` — all sidebar components need it
- ❌ Don't skip `<SidebarRail>` — users need the drag-to-resize handle
- ❌ Don't forget `tooltip` prop on `SidebarMenuButton` — shown when sidebar is collapsed
- ❌ Don't use fixed widths — sidebar handles responsive sizing automatically
