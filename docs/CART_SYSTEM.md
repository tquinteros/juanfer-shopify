# Shopping Cart System Documentation

## Overview
A complete Shopify cart management system with a drawer UI, allowing users to add items, update quantities, remove items, and proceed to checkout.

## Architecture

### 1. Cart Provider (`components/providers/cart-provider.tsx`)
Global cart state management using React Context API.

**Features:**
- Creates and manages Shopify cart
- Persists cart ID in localStorage
- Provides cart operations (add, remove, update)
- Controls cart drawer visibility
- Auto-initializes cart on app load

**Context Values:**
```typescript
{
  cart: Cart | null              // Current cart data
  isLoading: boolean             // Loading state
  isOpen: boolean                // Drawer open/closed
  openCart: () => void           // Open drawer
  closeCart: () => void          // Close drawer
  addToCart: (merchandiseId, quantity) => Promise<void>
  removeFromCart: (lineId) => Promise<void>
  updateCartLine: (lineId, quantity) => Promise<void>
  clearCart: () => void          // Create new empty cart
}
```

### 2. Cart GraphQL Queries (`lib/queries/cart.ts`)

**Mutations:**
- `CREATE_CART` - Create a new cart
- `ADD_TO_CART` - Add items to cart
- `UPDATE_CART_LINES` - Update item quantities
- `REMOVE_FROM_CART` - Remove items from cart

**Queries:**
- `GET_CART` - Fetch cart by ID

**Data Fetched:**
- Cart ID and checkout URL
- Total quantity and costs (subtotal, tax, total)
- Line items with product details
- Product images and prices

### 3. Cart Types (`lib/types/cart.ts`)
Zod schemas for type-safe cart data:
- `Cart` - Complete cart structure
- `CartLine` - Individual cart items
- `Money` - Price amounts
- `ProductVariant` - Variant/merchandise data

### 4. Cart Drawer Component (`components/cart/cart-drawer.tsx`)

**Features:**
- Slide-in drawer from bottom (mobile) or side (desktop)
- Real-time cart updates
- Quantity controls (+/- buttons)
- Remove item button
- Product images and details
- Price breakdown (subtotal, tax, total)
- "Proceed to Checkout" button (links to Shopify checkout)
- Empty state with call-to-action
- Loading skeletons

**UI Elements:**
- Product cards with images
- Inline quantity editor
- Trash icon for removal
- Total price summary
- Continue shopping button

### 5. Header Integration (`components/header.tsx`)
- Cart icon with live quantity badge
- Opens drawer on click
- Badge shows total items in cart
- Updates automatically when cart changes

### 6. Product Page Integration (`app/product/[id]/page.tsx`)

**Features:**
- Variant selector (if multiple variants)
- Quantity selector (+/- controls)
- "Add to Cart" button
- Visual feedback (loading, success states)
- Auto-opens drawer after adding
- Calculates total price (variant price × quantity)
- Disabled when out of stock

## Data Flow

### Adding to Cart:
1. User clicks "Add to Cart" on product page
2. `addToCart(variantId, quantity)` called
3. If no cart exists, creates new cart
4. Adds item using Shopify API
5. Updates cart state
6. Opens cart drawer
7. Shows success feedback

### Updating Quantity:
1. User clicks +/- in cart drawer
2. `updateCartLine(lineId, newQuantity)` called
3. If quantity = 0, removes item
4. Otherwise updates via Shopify API
5. Updates cart state
6. UI re-renders with new data

### Removing Item:
1. User clicks trash icon
2. `removeFromCart(lineId)` called
3. Removes via Shopify API
4. Updates cart state
5. UI re-renders

### Checkout:
1. User clicks "Proceed to Checkout"
2. Redirects to `cart.checkoutUrl` (Shopify hosted checkout)
3. Shopify handles payment and order completion

## Session Management

**Cart Persistence:**
- Cart ID stored in `localStorage` key: `shopify_cart_id`
- Cart survives page refreshes
- Cart persists across sessions
- Shopify maintains cart for ~10 days

**Cart Recovery:**
- On app load, checks for existing cart ID
- Fetches cart from Shopify
- If cart not found, creates new one
- Seamless user experience

## Integration Points

### Providers Setup:
```tsx
<QueryClientProvider>
  <AuthProvider>
    <CartProvider>      {/* Cart provider here */}
      {children}
    </CartProvider>
  </AuthProvider>
</QueryClientProvider>
```

### Using Cart in Components:
```tsx
import { useCart } from '@/components/providers/cart-provider'

function MyComponent() {
  const { cart, addToCart, openCart } = useCart()
  
  const handleAdd = async () => {
    await addToCart('gid://shopify/ProductVariant/123', 1)
  }
  
  return (
    <div>
      <p>Items: {cart?.totalQuantity || 0}</p>
      <button onClick={handleAdd}>Add to Cart</button>
    </div>
  )
}
```

## Features

✅ **Real-time Updates** - Cart updates immediately after actions
✅ **Persistent Cart** - Survives page refreshes and sessions
✅ **Quantity Management** - Inline +/- controls
✅ **Visual Feedback** - Loading states, success indicators
✅ **Price Breakdown** - Subtotal, tax, total displayed
✅ **Product Images** - Shows product thumbnails
✅ **Variant Support** - Handles different product variants
✅ **Empty States** - Friendly messages when cart is empty
✅ **Responsive Design** - Works on mobile and desktop
✅ **Type Safety** - Full TypeScript + Zod validation
✅ **Error Handling** - Graceful failure recovery
✅ **Optimistic Updates** - Fast UI feedback

## UI Components Used

- `Drawer` - Slide-in panel for cart
- `Button` - Actions and controls
- `Separator` - Visual dividers
- `Skeleton` - Loading placeholders
- `Card` - Product containers
- `Badge` - Quantity indicator (optional)

## Best Practices

1. **Always check cart exists** before operations
2. **Handle loading states** for better UX
3. **Show visual feedback** when adding items
4. **Validate quantities** (min: 1, max: available stock)
5. **Auto-open drawer** after adding to cart
6. **Persist cart ID** in localStorage
7. **Handle errors gracefully** with try-catch
8. **Use Shopify checkout** for payment (don't build custom)

## Future Enhancements

Possible additions:
- Discount code input
- Estimated shipping calculator
- Save for later functionality
- Cart item recommendations
- Multiple cart support (guest + logged-in)
- Cart abandonment tracking
- Mini cart preview (hover)
- Add to cart from anywhere (global action)

## Troubleshooting

**Cart not persisting:**
- Check localStorage is enabled
- Verify cart ID is being saved
- Check Shopify cart expiry settings

**Items not adding:**
- Verify variant IDs are correct (full GID format)
- Check product/variant availability
- Ensure cart exists before adding

**Drawer not opening:**
- Check `CartProvider` is wrapping app
- Verify `openCart()` is being called
- Check drawer component is rendered

**Prices incorrect:**
- Verify currency codes match
- Check tax calculation settings in Shopify
- Ensure using correct price fields (priceV2)

