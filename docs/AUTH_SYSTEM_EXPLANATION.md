# Shopify Customer Authentication System - Complete Explanation

## 🏗️ Architecture Overview

The authentication system uses **Shopify's Storefront API** with GraphQL mutations and queries to handle customer authentication. It's a **client-side authentication** system that stores tokens in the browser's localStorage.

---

## 🔄 How It Works - Step by Step

### 1. **Registration Flow**

```
User fills form → POST to Shopify → Create Customer → Auto-login → Store Token
```

**Step-by-step:**
1. User submits registration form (`components/auth/register-form.tsx`)
2. `register()` function in `lib/auth.ts` is called
3. Sends GraphQL mutation `CUSTOMER_CREATE` to Shopify:
   ```graphql
   mutation customerCreate($input: CustomerCreateInput!) {
     customerCreate(input: $input) {
       customer { id, email, firstName, lastName }
       customerUserErrors { message }
     }
   }
   ```
4. Shopify creates the customer account
5. **Auto-login**: Automatically calls `login()` with the same credentials
6. Token is stored in localStorage
7. User is redirected to `/account`

---

### 2. **Login Flow**

```
User fills form → POST to Shopify → Get Access Token → Store Token → Fetch Customer Data
```

**Step-by-step:**
1. User submits login form (`components/auth/login-form.tsx`)
2. `login()` function in `lib/auth.ts` is called
3. Sends GraphQL mutation `CUSTOMER_ACCESS_TOKEN_CREATE`:
   ```graphql
   mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
     customerAccessTokenCreate(input: $input) {
       customerAccessToken {
         accessToken    # JWT-like token
         expiresAt      # ISO date string
       }
       customerUserErrors { message }
     }
   }
   ```
4. Shopify validates credentials and returns:
   - `accessToken`: A secure token (like a JWT)
   - `expiresAt`: When the token expires (usually 1 year)
5. Token is stored in localStorage:
   ```javascript
   localStorage.setItem('shopify_customer_token', token)
   localStorage.setItem('shopify_customer_token_expiry', expiresAt)
   ```
6. `AuthProvider` automatically fetches customer data
7. User is redirected to `/account`

---

### 3. **Session Management**

#### **Token Storage (localStorage)**
```javascript
// Stored in browser's localStorage:
{
  shopify_customer_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  shopify_customer_token_expiry: "2025-12-31T23:59:59Z"
}
```

#### **Token Validation**
Every time `getCustomerToken()` is called:
1. Checks if token exists in localStorage
2. Checks if token is expired (compares `expiresAt` with current date)
3. If expired → automatically clears token
4. Returns token only if valid

#### **Auto-Fetch on App Load**
When the app loads (`AuthProvider`):
1. Checks localStorage for token
2. If token exists → Fetches customer data from Shopify
3. Updates global state with customer info
4. All components can access customer via `useAuth()` hook

---

### 4. **Fetching Customer Data**

**How it works:**
```javascript
// In AuthProvider, on mount:
const fetchCustomer = async () => {
  const token = getCustomerToken()  // Get from localStorage
  
  if (!token) {
    setCustomer(null)  // No token = not logged in
    return
  }
  
  // Send GraphQL query to Shopify
  const customerData = await getCustomer(token)
  setCustomer(customerData)  // Update global state
}
```

**GraphQL Query:**
```graphql
query getCustomer($customerAccessToken: String!) {
  customer(customerAccessToken: $customerAccessToken) {
    id
    email
    firstName
    lastName
    displayName
    phone
  }
}
```

**Important:** The token is sent as a **variable** in the GraphQL query, not in headers. Shopify validates the token and returns customer data.

---

### 5. **Logout Flow**

```
User clicks logout → Delete token on Shopify → Clear localStorage → Clear state
```

**Step-by-step:**
1. User clicks logout button
2. `logout()` function is called
3. Sends GraphQL mutation `CUSTOMER_ACCESS_TOKEN_DELETE`:
   ```graphql
   mutation customerAccessTokenDelete($customerAccessToken: String!) {
     customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
       deletedAccessToken
       deletedCustomerAccessTokenId
     }
   }
   ```
4. Shopify invalidates the token on their side
5. Clears localStorage
6. Clears React state (sets `customer` to `null`)

---

## 🔌 How It Interacts with Shopify

### **API Endpoint**
All requests go to:
```
https://{your-store}.myshopify.com/api/2024-01/graphql.json
```

### **Authentication Method**
- **Storefront API Access Token**: Used in headers for all requests
  ```javascript
  headers: {
    'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN
  }
  ```
- **Customer Access Token**: Used as a GraphQL variable for customer-specific queries
  ```javascript
  variables: {
    customerAccessToken: token  // From localStorage
  }
  ```

### **Two Types of Authentication:**

1. **Storefront API Token** (Public)
   - Used to make ANY GraphQL request
   - Stored in environment variables
   - Allows: products, collections, customer mutations

2. **Customer Access Token** (Private)
   - Generated when customer logs in
   - Required to fetch customer data
   - Stored in localStorage
   - Expires after a set time

---

## 📦 Session Management Details

### **Where Tokens Are Stored**
- **Location**: Browser's `localStorage`
- **Keys**: 
  - `shopify_customer_token`
  - `shopify_customer_token_expiry`

### **Token Expiration**
- Tokens typically expire after **1 year** (Shopify default)
- System automatically checks expiration before using token
- Expired tokens are automatically cleared

### **State Management**
- **Global State**: React Context API (`AuthProvider`)
- **Available everywhere**: `useAuth()` hook
- **Auto-sync**: Fetches customer data on app load if token exists

### **Security Considerations**

✅ **What's Secure:**
- Tokens are stored client-side (standard for SPAs)
- Tokens expire automatically
- Tokens are invalidated on logout (both client and server)
- All API calls go through Shopify's secure endpoints

⚠️ **Important Notes:**
- Tokens are accessible via JavaScript (localStorage)
- Use HTTPS in production
- Tokens can be stolen if XSS attack occurs
- Consider adding token refresh logic for better security

---

## 🔄 Complete Flow Diagram

```
┌─────────────────┐
│  User Opens App │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│  AuthProvider Mounts    │
│  Checks localStorage    │
└────────┬────────────────┘
         │
    ┌────┴────┐
    │         │
   Yes       No
    │         │
    ▼         ▼
┌─────────┐ ┌──────────────┐
│ Token   │ │ No Customer  │
│ Exists? │ │ State = null  │
└────┬────┘ └──────────────┘
     │
     ▼
┌─────────────────────┐
│ Fetch Customer Data │
│ from Shopify        │
└────────┬────────────┘
         │
    ┌────┴────┐
    │         │
  Success   Error
    │         │
    ▼         ▼
┌─────────┐ ┌──────────────┐
│ Update  │ │ Clear Token  │
│ State   │ │ State = null │
└─────────┘ └──────────────┘
```

---

## 🛠️ Key Functions Explained

### **`login(credentials)`**
- Sends email/password to Shopify
- Returns access token + expiry
- Stores token in localStorage
- Returns token object

### **`register(data)`**
- Creates new customer in Shopify
- Auto-logs in after registration
- Returns customer object

### **`getCustomer(token)`**
- Fetches customer data from Shopify
- Requires valid access token
- Returns customer object or null

### **`logout()`**
- Invalidates token on Shopify
- Clears localStorage
- Clears React state

### **`getCustomerToken()`**
- Reads token from localStorage
- Validates expiration
- Returns token or null

---

## 🎯 Usage in Components

### **Accessing Auth State**
```typescript
import { useAuth } from '@/components/providers/auth-provider'

function MyComponent() {
  const { customer, isAuthenticated, isLoading, logout } = useAuth()
  
  if (isLoading) return <div>Loading...</div>
  if (!isAuthenticated) return <div>Please login</div>
  
  return <div>Welcome {customer.firstName}!</div>
}
```

### **Protected Routes**
```typescript
// In app/account/page.tsx
useEffect(() => {
  if (!isLoading && !isAuthenticated) {
    router.push("/login")  // Redirect if not logged in
  }
}, [isLoading, isAuthenticated])
```

---

## 🔐 Security Best Practices

1. **Always use HTTPS** in production
2. **Validate tokens** before making requests
3. **Handle expired tokens** gracefully
4. **Clear tokens** on logout
5. **Don't store sensitive data** in localStorage
6. **Use environment variables** for API keys

---

## 📝 Summary

- **Authentication**: Uses Shopify Storefront API GraphQL mutations
- **Session Storage**: localStorage (browser)
- **State Management**: React Context API
- **Token Type**: Customer Access Token (JWT-like)
- **Expiration**: Automatic (1 year default)
- **Auto-login**: After registration
- **Auto-fetch**: Customer data on app load

The system is **stateless on the server** - all authentication happens client-side, which is perfect for Next.js client components and SPAs!

