# UI Components

A comprehensive UI component library built with **Tailwind CSS v4** and **Framer Motion** for the Startup Benefits Platform.

## Components

### Button
Multi-variant button with loading states and animations.
```tsx
<Button variant="primary" size="md" isLoading={false}>
  Click Me
</Button>
```
**Variants:** `primary`, `secondary`, `outline`, `ghost`, `danger`
**Sizes:** `sm`, `md`, `lg`

### Input
Form input with label, error states, and focus animations.
```tsx
<Input
  label="Email"
  type="email"
  error="Invalid email"
  helperText="We'll never share your email"
/>
```

### Card
Container with header, body, and footer sections. Includes hover animations.
```tsx
<Card hover>
  <CardHeader>Title</CardHeader>
  <CardBody>Content</CardBody>
  <CardFooter>Actions</CardFooter>
</Card>
```

### Badge
Status indicators with multiple variants.
```tsx
<Badge variant="success" size="md">Active</Badge>
```
**Variants:** `success`, `warning`, `error`, `info`, `neutral`

### Skeleton
Loading placeholder with pulse animation.
```tsx
<Skeleton width="100%" height={20} circle={false} />
```

### Modal
Overlay modal with backdrop blur and slide-in animation.
```tsx
<Modal isOpen={true} onClose={() => {}} title="Title" size="md">
  <p>Content</p>
  <ModalFooter>
    <Button>Close</Button>
  </ModalFooter>
</Modal>
```

## Design Tokens

All components use consistent design tokens from `globals.css`:
- **Colors:** Primary (blue), secondary (purple), grays, semantic colors
- **Spacing:** `xs` (4px) to `2xl` (48px)
- **Border Radius:** `sm` to `full`
- **Shadows:** `sm` to `xl`
- **Transitions:** Fast (150ms), base (200ms), slow (300ms)
- **Animations:** fadeIn, slideUp

## Demo

Visit http://localhost:3000 to see all components in action with interactive examples.
