# React Hook Form + Zod Integration Guide

## Table of Contents
1. [What is React Hook Form?](#what-is-react-hook-form)
2. [Why Use React Hook Form?](#why-use-react-hook-form)
3. [Basic Setup](#basic-setup)
4. [The `useForm` Hook](#the-useform-hook)
5. [Zod Schema Validation](#zod-schema-validation)
6. [Resolver Integration](#resolver-integration)
7. [Complete Example](#complete-example)
8. [Common Patterns](#common-patterns)
9. [Best Practices](#best-practices)

---

## What is React Hook Form?

React Hook Form is a **lightweight, performant library** for building forms in React. It uses uncontrolled components and leverages React's built-in capabilities to minimize re-renders and improve performance.

### Key Features:
- ✅ **Minimal re-renders** - Only re-renders when necessary
- ✅ **Better performance** - Uses uncontrolled components by default
- ✅ **Easy validation** - Integrates seamlessly with validation libraries
- ✅ **TypeScript support** - Full type safety
- ✅ **Small bundle size** - ~9KB minified + gzipped

---

## Why Use React Hook Form?

### Traditional Form Approach (Controlled Components)
```tsx
// ❌ Every keystroke causes a re-render
const [firstName, setFirstName] = useState('')
const [lastName, setLastName] = useState('')

<input 
  value={firstName} 
  onChange={(e) => setFirstName(e.target.value)} // Re-render on every change
/>
```

### React Hook Form Approach (Uncontrolled Components)
```tsx
// ✅ Minimal re-renders, better performance
const { register } = useForm()

<input {...register('firstName')} /> // No re-render until validation/submit
```

---

## Basic Setup

### Installation
```bash
pnpm add react-hook-form zod @hookform/resolvers
```

### Import
```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
```

---

## The `useForm` Hook

The `useForm` hook is the core of React Hook Form. It returns an object with methods and properties to manage your form.

### Basic Usage
```tsx
const {
  register,        // Function to register inputs
  handleSubmit,    // Function to handle form submission
  formState,       // Object containing form state (errors, isSubmitting, etc.)
  reset,           // Function to reset form
  watch,           // Function to watch field values
  setValue,        // Function to programmatically set values
  getValues,       // Function to get current form values
} = useForm()
```

### Configuration Options

```tsx
const form = useForm({
  // Validation resolver (Zod, Yup, etc.)
  resolver: zodResolver(schema),
  
  // Default values for form fields
  defaultValues: {
    firstName: '',
    lastName: '',
    email: '',
  },
  
  // Validation mode: 'onSubmit' | 'onBlur' | 'onChange' | 'onTouched' | 'all'
  mode: 'onSubmit', // Default
  
  // Re-validation mode: 'onBlur' | 'onChange' | 'onSubmit' | 'all'
  reValidateMode: 'onChange',
  
  // Should form validate on mount
  shouldValidate: false,
  
  // Should form focus on first error
  shouldFocusError: true,
})
```

---

## Zod Schema Validation

Zod is a **TypeScript-first schema validation library** that provides runtime type checking.

### Basic Zod Schema
```tsx
import * as z from 'zod'

// Simple schema
const schema = z.object({
  firstName: z.string(),
  email: z.string().email(),
  age: z.number().min(18),
})
```

### Common Zod Validators

```tsx
const schema = z.object({
  // String validators
  firstName: z.string()
    .min(2, 'Must be at least 2 characters')
    .max(50, 'Must be less than 50 characters'),
  
  // Email validation
  email: z.string()
    .email('Invalid email address')
    .toLowerCase(), // Transform to lowercase
  
  // Number validators
  age: z.number()
    .min(18, 'Must be 18 or older')
    .max(120, 'Invalid age'),
  
  // Optional fields
  middleName: z.string().optional(),
  
  // Nullable fields
  phone: z.string().nullable(),
  
  // Custom validation
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain uppercase letter')
    .regex(/[0-9]/, 'Password must contain a number'),
  
  // Conditional validation
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], // Error appears on confirmPassword field
})
```

### Inferring TypeScript Types
```tsx
// Automatically infer TypeScript type from Zod schema
type FormValues = z.infer<typeof schema>

// Now you can use FormValues in useForm
const form = useForm<FormValues>({
  resolver: zodResolver(schema),
})
```

---

## Resolver Integration

The **resolver** connects React Hook Form with your validation library (Zod, Yup, etc.).

### How It Works

```tsx
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
  email: z.string().email(),
})

const form = useForm({
  resolver: zodResolver(schema), // Connects Zod to React Hook Form
})
```

### What the Resolver Does

1. **Validates on submit** - Runs Zod schema validation when form is submitted
2. **Maps errors** - Converts Zod errors to React Hook Form error format
3. **Type safety** - Ensures form values match Zod schema types

---

## Complete Example

Here's a complete example from your ContactForm:

```tsx
"use client"

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

// 1. Define Zod Schema
const contactFormSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  reason: z.string().min(10, 'Please provide at least 10 characters for your message'),
})

// 2. Infer TypeScript type from schema
type ContactFormValues = z.infer<typeof contactFormSchema>

const ContactForm = () => {
  // 3. Initialize useForm with resolver
  const {
    register,           // Register form inputs
    handleSubmit,       // Handle form submission
    reset,              // Reset form
    formState: { errors, isSubmitting }, // Access form state
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema), // Connect Zod to React Hook Form
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      reason: '',
    },
  })

  // 4. Submit handler
  const onSubmit = (data: ContactFormValues) => {
    // Data is automatically validated and typed!
    console.log('Form submitted with values:', data)
    reset() // Clear form after submission
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* 5. Register inputs */}
      <input
        {...register('firstName')} // Registers field with React Hook Form
      />
      
      {/* 6. Display errors */}
      {errors.firstName && (
        <p>{errors.firstName.message}</p>
      )}
      
      <button type="submit">Submit</button>
    </form>
  )
}
```

### Step-by-Step Breakdown

1. **Define Schema** - Create Zod schema with validation rules
2. **Infer Type** - Get TypeScript type from schema
3. **Setup Form** - Initialize `useForm` with `zodResolver`
4. **Register Fields** - Use `register()` to connect inputs
5. **Handle Submit** - Use `handleSubmit()` wrapper
6. **Display Errors** - Access errors from `formState.errors`

---

## Common Patterns

### Pattern 1: Registering Inputs

```tsx
// Basic registration
<input {...register('firstName')} />

// With validation options
<input 
  {...register('email', {
    required: 'Email is required',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Invalid email address'
    }
  })} 
/>

// Note: With Zod resolver, validation is handled by schema, not register()
```

### Pattern 2: Accessing Form State

```tsx
const { formState } = useForm()

// Available properties:
formState.errors        // Object with field errors
formState.isSubmitting  // Boolean - form is submitting
formState.isValid       // Boolean - form is valid
formState.isDirty       // Boolean - form has been modified
formState.touchedFields // Object - fields that have been touched
formState.dirtyFields   // Object - fields that have been modified
```

### Pattern 3: Watching Field Values

```tsx
const { watch } = useForm()

// Watch single field
const firstName = watch('firstName')

// Watch multiple fields
const { firstName, lastName } = watch(['firstName', 'lastName'])

// Watch all fields
const allValues = watch()
```

### Pattern 4: Programmatic Control

```tsx
const { setValue, getValues, reset } = useForm()

// Set value programmatically
setValue('firstName', 'John')

// Get current values
const values = getValues()

// Reset form
reset() // Reset to defaultValues
reset({ firstName: 'John' }) // Reset with new values
```

### Pattern 5: Conditional Validation

```tsx
const schema = z.object({
  hasPhone: z.boolean(),
  phone: z.string().optional(),
}).refine((data) => {
  // If hasPhone is true, phone is required
  if (data.hasPhone) {
    return data.phone && data.phone.length > 0
  }
  return true
}, {
  message: 'Phone is required',
  path: ['phone'],
})
```

---

## Best Practices

### 1. Always Use TypeScript Types
```tsx
// ✅ Good - Type inferred from schema
type FormValues = z.infer<typeof schema>
const form = useForm<FormValues>({ resolver: zodResolver(schema) })

// ❌ Bad - No type safety
const form = useForm()
```

### 2. Define Schema Outside Component
```tsx
// ✅ Good - Schema defined outside (no re-creation on re-render)
const schema = z.object({ ... })

const Component = () => {
  const form = useForm({ resolver: zodResolver(schema) })
}

// ❌ Bad - Schema recreated on every render
const Component = () => {
  const schema = z.object({ ... }) // Recreated every render!
  const form = useForm({ resolver: zodResolver(schema) })
}
```

### 3. Use Default Values
```tsx
// ✅ Good - Provides initial values
const form = useForm({
  defaultValues: {
    firstName: '',
    email: '',
  }
})

// ❌ Bad - No default values (can cause issues)
const form = useForm()
```

### 4. Handle Async Operations
```tsx
const onSubmit = async (data: FormValues) => {
  try {
    setIsSubmitting(true)
    await submitToAPI(data)
    reset()
    toast.success('Form submitted!')
  } catch (error) {
    toast.error('Submission failed')
  } finally {
    setIsSubmitting(false)
  }
}
```

### 5. Access Errors Safely
```tsx
// ✅ Good - Safe error access
{errors.firstName && (
  <p>{errors.firstName.message}</p>
)}

// ❌ Bad - May cause runtime error
<p>{errors.firstName.message}</p> // Error if firstName is undefined
```

---

## How It All Works Together

### Flow Diagram

```
1. User types in input
   ↓
2. React Hook Form captures value (uncontrolled)
   ↓
3. User clicks submit
   ↓
4. handleSubmit() is called
   ↓
5. zodResolver runs Zod schema validation
   ↓
6. If valid → onSubmit() called with typed data
   If invalid → errors populated in formState.errors
   ↓
7. Component re-renders with errors (if any)
```

### Key Concepts

1. **Uncontrolled Components**: React Hook Form uses refs to access form values, minimizing re-renders
2. **Validation on Submit**: By default, validation runs when form is submitted (not on every keystroke)
3. **Type Safety**: Zod schema provides both runtime validation and TypeScript types
4. **Error Mapping**: Resolver converts Zod errors to React Hook Form format

---

## Common Issues & Solutions

### Issue 1: Type Errors
```tsx
// Problem: Type mismatch
const form = useForm<FormValues>({ ... })
<input {...register('wrongField')} /> // ❌ Type error

// Solution: Ensure field names match schema
<input {...register('firstName')} /> // ✅ Matches schema
```

### Issue 2: Validation Not Running
```tsx
// Problem: Validation not triggering
const form = useForm({ mode: 'onSubmit' }) // Only validates on submit

// Solution: Change mode if needed
const form = useForm({ 
  mode: 'onChange', // Validates on every change
  resolver: zodResolver(schema),
})
```

### Issue 3: Errors Not Showing
```tsx
// Problem: Errors not displaying
{errors.email} // ❌ Wrong - errors.email is an object

// Solution: Access message property
{errors.email?.message} // ✅ Correct
```

---

## Resources

- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [@hookform/resolvers](https://github.com/react-hook-form/resolvers)

---

## Summary

React Hook Form + Zod provides:
- ✅ **Type-safe** form handling
- ✅ **Performant** - minimal re-renders
- ✅ **Validated** - runtime validation with TypeScript types
- ✅ **Developer-friendly** - simple API, great DX

The combination of React Hook Form's performance and Zod's type safety makes it an excellent choice for modern React applications!

