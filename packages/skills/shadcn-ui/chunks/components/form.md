# Form Patterns — shadcn/ui (2026 Field+Controller pattern)

## Stack

- `react-hook-form` (useForm + Controller)
- `zod` v3 (validation schema — Standard Schema compatible)
- `@hookform/resolvers` (connect zod ↔ RHF)
- `<Field />` component system (NOT the old `<Form>/<FormField>` pattern)

## Install

```bash
npx shadcn@latest add field input select textarea checkbox radio-group switch
npm i zod @hookform/resolvers
```

## Basic Pattern (2026 — Field + Controller)

```tsx
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.').max(32),
  email: z.string().email('Enter a valid email address.'),
})

export function MyForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: '', email: '' },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Controller
        name="title"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid || undefined}>
            <FieldLabel htmlFor={field.name}>Title</FieldLabel>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid || undefined}
              placeholder="Enter title"
              autoComplete="off"
            />
            <FieldDescription>A concise title.</FieldDescription>
            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Button type="submit">Submit</Button>
      <Button type="button" variant="outline" onClick={() => form.reset()}>
        Reset
      </Button>
    </form>
  )
}
```

## Field Types Binding Table

| Control    | Bind Method                                              |
| ---------- | -------------------------------------------------------- |
| Input      | `{...field}` spread directly                             |
| Textarea   | `{...field}` spread directly                             |
| Select     | `value={field.value} onValueChange={field.onChange}`     |
| Checkbox   | `checked={field.value} onCheckedChange={field.onChange}` |
| RadioGroup | `value={field.value} onValueChange={field.onChange}`     |
| Switch     | `checked={field.value} onCheckedChange={field.onChange}` |
| Combobox   | `value={field.value}` + `onSelect={field.onChange}`      |
| DatePicker | `selected={field.value}` + `onSelect={field.onChange}`   |

## Array Fields

```tsx
import { useFieldArray } from 'react-hook-form'

const { fields, append, remove } = useFieldArray({
  control: form.control,
  name: 'items',
})

{
  fields.map((item, index) => (
    <Controller
      key={item.id}
      name={`items.${index}.value`}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid || undefined}>
          <Input {...field} />
          <Button variant="ghost" size="icon-xs" onClick={() => remove(index)}>
            ×
          </Button>
        </Field>
      )}
    />
  ))
}
;<Button type="button" variant="outline" onClick={() => append({ value: '' })}>
  Add Item
</Button>
```

## FieldSet (Group Fields)

```tsx
<FieldSet>
  <FieldLegend>Address</FieldLegend>
  <FieldGroup>{/* street, city, zip Controllers here */}</FieldGroup>
</FieldSet>
```

## Validation Modes

```tsx
const form = useForm({
  resolver: zodResolver(schema),
  mode: 'onSubmit', // default — validate on submit
  // mode: "onChange",     // validate as user types
  // mode: "onBlur",      // validate when field loses focus
  // mode: "onTouched",   // validate after first blur, then onChange
  // mode: "all",         // onBlur + onChange combined
})
```

## Anti-patterns

- ❌ Don't use `useState` for form state — use `useForm`
- ❌ Don't validate manually — use zod schema + zodResolver
- ❌ Don't skip `<FieldError>` — it shows validation errors
- ❌ Don't forget `data-invalid` on `<Field>` + `aria-invalid` on control
- ❌ Don't use old `<Form>/<FormField>/<FormItem>` pattern — use `<Field>/<Controller>`
- ❌ Don't use `<form>` without `form.handleSubmit(onSubmit)` wrapper
