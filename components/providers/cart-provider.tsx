"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { shopifyFetch } from '@/lib/shopify'
import { getCustomerToken } from '@/lib/auth'
import { CREATE_CART, GET_CART, ADD_TO_CART, REMOVE_FROM_CART, UPDATE_CART_LINES, UPDATE_CART_BUYER_IDENTITY } from '@/lib/queries/cart'
import type {
  Cart,
  CartCreateResponse,
  CartLinesAddResponse,
  CartLinesRemoveResponse,
  CartLinesUpdateResponse,
  CartBuyerIdentityUpdateResponse,
  GetCartResponse,
  CartLineInput,
  CartLineUpdateInput,
} from '@/lib/types/cart'

interface CartContextType {
  cart: Cart | null
  isLoading: boolean
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  addToCart: (merchandiseId: string, quantity: number) => Promise<void>
  removeFromCart: (lineId: string) => Promise<void>
  updateCartLine: (lineId: string, quantity: number) => Promise<void>
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_ID_KEY = 'shopify_cart_id'

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)

  // Get cart ID from localStorage
  const getCartId = (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(CART_ID_KEY)
    }
    return null
  }

  // Save cart ID to localStorage
  const saveCartId = (cartId: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CART_ID_KEY, cartId)
    }
  }

  // Clear cart ID from localStorage
  const clearCartId = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CART_ID_KEY)
    }
  }

  // Fetch existing cart or create new one
  const initializeCart = async () => {
    setIsLoading(true)
    try {
      const existingCartId = getCartId()

      if (existingCartId) {
        // Try to fetch existing cart
        const data = await shopifyFetch<GetCartResponse>({
          query: GET_CART,
          variables: { id: existingCartId },
        })

        if (data.cart) {
          setCart(data.cart)
          // Associate cart with customer if logged in
          await associateCartWithCustomer(data.cart.id)
        } else {
          // Cart not found, create new one
          clearCartId()
          await createNewCart()
        }
      } else {
        // No cart ID, create new cart
        await createNewCart()
      }
    } catch (error) {
      console.error('Error initializing cart:', error)
      // Try to create new cart on error
      await createNewCart()
    } finally {
      setIsLoading(false)
    }
  }

  // Associate cart with customer
  const associateCartWithCustomer = async (cartId: string) => {
    const customerToken = getCustomerToken()
    if (!customerToken) return

    try {
      const data = await shopifyFetch<CartBuyerIdentityUpdateResponse>({
        query: UPDATE_CART_BUYER_IDENTITY,
        variables: {
          cartId,
          buyerIdentity: {
            customerAccessToken: customerToken,
          },
        },
      })

      if (data.cartBuyerIdentityUpdate.cart) {
        setCart(data.cartBuyerIdentityUpdate.cart)
      }
    } catch (error) {
      console.error('Error associating cart with customer:', error)
    }
  }

  // Create new cart
  const createNewCart = async () => {
    try {
      const data = await shopifyFetch<CartCreateResponse>({
        query: CREATE_CART,
        variables: {
          input: {
            lines: [],
          },
        },
      })

      if (data.cartCreate.cart) {
        setCart(data.cartCreate.cart)
        saveCartId(data.cartCreate.cart.id)
        // Associate cart with customer if logged in
        await associateCartWithCustomer(data.cartCreate.cart.id)
      }
    } catch (error) {
      console.error('Error creating cart:', error)
    }
  }

  // Initialize cart on mount
  useEffect(() => {
    initializeCart()
  }, [])

  // Associate cart with customer when cart changes (if customer is logged in)
  useEffect(() => {
    if (cart?.id) {
      const customerToken = getCustomerToken()
      if (customerToken) {
        associateCartWithCustomer(cart.id)
      }
    }
  }, [cart?.id])

  // Add item to cart
  const addToCart = async (merchandiseId: string, quantity: number) => {
    try {
      let currentCartId = cart?.id

      // Create cart if it doesn't exist
      if (!currentCartId) {
        await createNewCart()
        currentCartId = getCartId()
      }

      if (!currentCartId) {
        throw new Error('Failed to create cart')
      }

      const lines: CartLineInput[] = [
        {
          merchandiseId,
          quantity,
        },
      ]

      const data = await shopifyFetch<CartLinesAddResponse>({
        query: ADD_TO_CART,
        variables: {
          cartId: currentCartId,
          lines,
        },
      })

      if (data.cartLinesAdd.userErrors.length > 0) {
        throw new Error(data.cartLinesAdd.userErrors[0].message)
      }

      if (data.cartLinesAdd.cart) {
        setCart(data.cartLinesAdd.cart)
        // Associate cart with customer if logged in
        await associateCartWithCustomer(data.cartLinesAdd.cart.id)
        setIsOpen(true) // Open cart drawer after adding item
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      throw error
    }
  }

  // Remove item from cart
  const removeFromCart = async (lineId: string) => {
    if (!cart?.id) return

    try {
      const data = await shopifyFetch<CartLinesRemoveResponse>({
        query: REMOVE_FROM_CART,
        variables: {
          cartId: cart.id,
          lineIds: [lineId],
        },
      })

      if (data.cartLinesRemove.userErrors.length > 0) {
        throw new Error(data.cartLinesRemove.userErrors[0].message)
      }

      if (data.cartLinesRemove.cart) {
        setCart(data.cartLinesRemove.cart)
      }
    } catch (error) {
      console.error('Error removing from cart:', error)
      throw error
    }
  }

  // Update cart line quantity
  const updateCartLine = async (lineId: string, quantity: number) => {
    if (!cart?.id) return

    try {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        await removeFromCart(lineId)
        return
      }

      const lines: CartLineUpdateInput[] = [
        {
          id: lineId,
          quantity,
        },
      ]

      const data = await shopifyFetch<CartLinesUpdateResponse>({
        query: UPDATE_CART_LINES,
        variables: {
          cartId: cart.id,
          lines,
        },
      })

      if (data.cartLinesUpdate.userErrors.length > 0) {
        throw new Error(data.cartLinesUpdate.userErrors[0].message)
      }

      if (data.cartLinesUpdate.cart) {
        setCart(data.cartLinesUpdate.cart)
      }
    } catch (error) {
      console.error('Error updating cart line:', error)
      throw error
    }
  }

  // Clear cart (create new empty cart)
  const clearCart = () => {
    clearCartId()
    createNewCart()
  }

  // Open/close cart drawer
  const openCart = () => setIsOpen(true)
  const closeCart = () => setIsOpen(false)

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        isOpen,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateCartLine,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

