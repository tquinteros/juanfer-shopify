# Product Metafields - Usage Guide

## What Was Changed

### 1. **GraphQL Query** (`lib/queries.ts`)
Added metafields to the `GET_PRODUCT_BY_HANDLE_QUERY`:

```graphql
metafields(identifiers: [
  { namespace: "custom", key: "has_builder" }
]) {
  namespace
  key
  value
  type
}
```

**Note**: Currently fetching only `custom.has_builder`. To fetch ALL metafields, see "Fetching All Metafields" below.

### 2. **TypeScript Schema** (`lib/types/shopify.ts`)
Added `metafields` to `ProductSchema`:

```typescript
metafields: z.array(MetafieldSchema).optional(),
```

### 3. **Product Page** (`app/product/[handle]/page.tsx`)
Added helper function and example usage:

```typescript
// Helper function to get metafield value
const getMetafield = useCallback((namespace: string, key: string) => {
    return product?.metafields?.find(
        (m) => m?.namespace === namespace && m?.key === key
    )
}, [product?.metafields])

// Access specific metafields
const hasBuilder = useMemo(() => {
    const metafield = getMetafield('custom', 'has_builder')
    return metafield?.value === 'true'
}, [getMetafield])
```

## Fetching ALL Metafields

If you want to fetch **all metafields** (not just specific ones), update the query:

### Option 1: Fetch First N Metafields (Recommended)

```graphql
metafields(first: 20) {
  namespace
  key
  value
  type
}
```

### Option 2: Fetch All by Namespace

```graphql
metafields(first: 100, namespace: "custom") {
  namespace
  key
  value
  type
}
```

### Option 3: Fetch Multiple Specific Metafields

```graphql
metafields(identifiers: [
  { namespace: "custom", key: "has_builder" }
  { namespace: "custom", key: "another_field" }
  { namespace: "custom", key: "third_field" }
]) {
  namespace
  key
  value
  type
}
```

## Usage Examples

### Example 1: Access Boolean Metafield

```typescript
const hasBuilder = useMemo(() => {
    const metafield = getMetafield('custom', 'has_builder')
    return metafield?.value === 'true'
}, [getMetafield])

// Use in UI
{hasBuilder && (
    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded">
        Builder Available
    </div>
)}
```

### Example 2: Access String/Text Metafield

```typescript
const customTitle = useMemo(() => {
    const metafield = getMetafield('custom', 'custom_title')
    return metafield?.value || ''
}, [getMetafield])

// Use in UI
{customTitle && <h2>{customTitle}</h2>}
```

### Example 3: Access Number Metafield

```typescript
const customPrice = useMemo(() => {
    const metafield = getMetafield('custom', 'special_price')
    return metafield?.value ? parseFloat(metafield.value) : null
}, [getMetafield])

// Use in UI
{customPrice && (
    <span className="text-red-600">
        Special: ${customPrice.toFixed(2)}
    </span>
)}
```

### Example 4: Access JSON Metafield

```typescript
const customData = useMemo(() => {
    const metafield = getMetafield('custom', 'json_data')
    if (!metafield?.value) return null
    
    try {
        return JSON.parse(metafield.value)
    } catch {
        return null
    }
}, [getMetafield])

// Use in UI
{customData?.features && (
    <ul>
        {customData.features.map((feature: string, i: number) => (
            <li key={i}>{feature}</li>
        ))}
    </ul>
)}
```

### Example 5: Display All Metafields (Debug)

```typescript
// In your JSX
{product?.metafields && product.metafields.length > 0 && (
    <Card>
        <CardContent className="pt-6">
            <h3 className="font-semibold mb-3">Product Metafields</h3>
            <div className="space-y-2">
                {product.metafields.map((metafield, index) => (
                    metafield && (
                        <div key={index} className="text-sm border-b pb-2">
                            <div className="font-medium">
                                {metafield.namespace}.{metafield.key}
                            </div>
                            <div className="text-muted-foreground">
                                Type: {metafield.type}
                            </div>
                            <div className="text-muted-foreground break-all">
                                Value: {metafield.value}
                            </div>
                        </div>
                    )
                ))}
            </div>
        </CardContent>
    </Card>
)}
```

## Metafield Types

Shopify supports various metafield types:

- `single_line_text_field`
- `multi_line_text_field`
- `number_integer`
- `number_decimal`
- `boolean`
- `date`
- `date_time`
- `json`
- `url`
- `color`
- `file_reference`
- `product_reference`
- `collection_reference`
- And more...

## Best Practices

1. **Memoize metafield access** to prevent recalculations
2. **Use the helper function** (`getMetafield`) for cleaner code
3. **Handle null/undefined** values gracefully
4. **Parse JSON carefully** with try/catch
5. **Fetch only needed metafields** to reduce payload size
6. **Log metafields in development** to see what's available

## Current Implementation

The query currently fetches only `custom.has_builder`. To fetch more metafields, update the query in `lib/queries.ts`:

```typescript
// Change from:
metafields(identifiers: [
  { namespace: "custom", key: "has_builder" }
]) {

// To fetch all custom metafields:
metafields(first: 50, namespace: "custom") {
  namespace
  key
  value
  type
}
```

## Console Output

The product page now logs metafields to the console:
- `Product metafields:` - Array of all metafields
- `Has builder:` - Boolean value of `custom.has_builder`

Check your browser console to see the metafields structure.

