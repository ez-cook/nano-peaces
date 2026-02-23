# Dialog, Sheet, Drawer, Alert Dialog — shadcn/ui

## Install

```bash
npx shadcn@latest add dialog sheet drawer alert-dialog
```

## Dialog (Modal)

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogDescription>Make changes to your profile here.</DialogDescription>
    </DialogHeader>
    {/* form content */}
    <DialogFooter>
      <Button type="submit">Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## Sheet (Slide-over Panel)

```tsx
<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">Open Menu</Button>
  </SheetTrigger>
  <SheetContent side="right">
    {' '}
    {/* "top" | "right" | "bottom" | "left" */}
    <SheetHeader>
      <SheetTitle>Menu</SheetTitle>
      <SheetDescription>Navigation</SheetDescription>
    </SheetHeader>
    {/* content */}
  </SheetContent>
</Sheet>
```

## Drawer (Mobile Bottom Sheet)

Based on `vaul`. Great for mobile-first interactions.

```tsx
<Drawer>
  <DrawerTrigger asChild>
    <Button variant="outline">Open</Button>
  </DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Settings</DrawerTitle>
      <DrawerDescription>Adjust your preferences.</DrawerDescription>
    </DrawerHeader>
    {/* content */}
    <DrawerFooter>
      <Button>Submit</Button>
      <DrawerClose asChild>
        <Button variant="outline">Cancel</Button>
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
```

## Alert Dialog (Non-dismissable)

Cannot be closed by clicking outside or pressing Escape. For destructive confirmations.

```tsx
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Delete</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

## Responsive: Dialog on Desktop, Drawer on Mobile

```tsx
import { useMediaQuery } from '@/hooks/use-media-query'

function ResponsiveModal({ children }) {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return <Dialog>{children}</Dialog>
  }

  return <Drawer>{children}</Drawer>
}
```

## Controlled State

```tsx
const [open, setOpen] = useState(false)
<Dialog open={open} onOpenChange={setOpen}>...</Dialog>
```

## Anti-patterns

- ❌ Don't skip `DialogTitle` — required for accessibility (screen readers)
- ❌ Don't nest Dialog inside Dialog — causes focus trap issues
- ❌ Don't use Dialog for destructive confirmations — use Alert Dialog
- ❌ Don't use Sheet on mobile — use Drawer instead
