"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { getCustomerToken } from '@/lib/auth'
import { useLanguage } from '@/lib/contexts/language-context'
import { translations } from '@/lib/i18n/translations'
import {
  createCartAction,
  getCartAction,
  addToCartAction,
  removeFromCartAction,
  updateCartLinesAction,
  updateCartBuyerIdentityAction,
} from '@/lib/server/cart'
import type {
  Cart,
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
  const { language } = useLanguage()
  const t = translations[language]
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

  // Associate cart with customer
  const associateCartWithCustomer = useCallback(async (cartId: string) => {
    const customerToken = getCustomerToken()
    if (!customerToken) return

    try {
      const cart = await updateCartBuyerIdentityAction({
        cartId,
        customerAccessToken: customerToken,
        language,
      })

      if (cart) {
        setCart(cart)
      }
    } catch (error) {
      console.error('Error associating cart with customer:', error)
    }
  }, [language])

  // Create new cart
  const createNewCart = useCallback(async () => {
    try {
      const customerToken = getCustomerToken()
      const cart = await createCartAction({
        lines: [],
        customerAccessToken: customerToken || undefined,
        language,
      })

      if (cart) {
        setCart(cart)
        saveCartId(cart.id)
        // Associate cart with customer if logged in (if not already associated)
        if (customerToken) {
          await associateCartWithCustomer(cart.id)
        }
      }
    } catch (error) {
      console.error(t.cart.errorUpdatingCart || 'Error creating cart:', error)
    }
  }, [associateCartWithCustomer, t, language])

  // Fetch existing cart or create new one
  const initializeCart = useCallback(async () => {
    setIsLoading(true)
    try {
      const existingCartId = getCartId()

      if (existingCartId) {
        // Try to fetch existing cart
        const cart = await getCartAction({
          cartId: existingCartId,
          language,
        })

        if (cart) {
          setCart(cart)
          // Associate cart with customer if logged in
          await associateCartWithCustomer(cart.id)
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
      console.error(t.cart.errorUpdatingCart || 'Error initializing cart:', error)
      // Try to create new cart on error
      await createNewCart()
    } finally {
      setIsLoading(false)
    }
  }, [associateCartWithCustomer, createNewCart, t, language])

  // Initialize cart on mount
  useEffect(() => {
    initializeCart()
  }, [initializeCart])

  // Refetch cart when language changes (if cart already exists)
  useEffect(() => {
    if (cart?.id && !isLoading) {
      const existingCartId = getCartId()
      if (existingCartId) {
        getCartAction({
          cartId: existingCartId,
          language,
        })
          .then((cart) => {
            if (cart) {
              setCart(cart)
            }
          })
          .catch((error) => {
            console.error(t.cart.errorUpdatingCart || 'Error refetching cart:', error)
          })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language])

  // Associate cart with customer when cart changes (if customer is logged in)
  useEffect(() => {
    if (cart?.id) {
      const customerToken = getCustomerToken()
      if (customerToken) {
        associateCartWithCustomer(cart.id)
      }
    }
  }, [cart?.id, associateCartWithCustomer])

  // Add item to cart
  const addToCart = async (merchandiseId: string, quantity: number) => {
    try {
      let currentCartId: string | undefined = cart?.id

      // Create cart if it doesn't exist
      if (!currentCartId) {
        await createNewCart()
        const cartId = getCartId()
        currentCartId = cartId || undefined
      }

      if (!currentCartId) {
        throw new Error(t.cart.failedToCreateCart || 'Failed to create cart')
      }

      const lines: CartLineInput[] = [
        {
          merchandiseId,
          quantity,
        },
      ]

      const updatedCart = await addToCartAction({
        cartId: currentCartId,
        lines,
        language,
      })

      if (updatedCart) {
        setCart(updatedCart)
        // Associate cart with customer if logged in
        await associateCartWithCustomer(updatedCart.id)
        setIsOpen(true) // Open cart drawer after adding item
      }
    } catch (error) {
      console.error(t.cart.errorAddingToCart || 'Error adding to cart:', error)
      throw error
    }
  }

  // Remove item from cart
  const removeFromCart = async (lineId: string) => {
    if (!cart?.id) return

    try {
      const updatedCart = await removeFromCartAction({
        cartId: cart.id,
        lineIds: [lineId],
        language,
      })

      if (updatedCart) {
        setCart(updatedCart)
      }
    } catch (error) {
      console.error(t.cart.errorRemovingFromCart || 'Error removing from cart:', error)
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

      const updatedCart = await updateCartLinesAction({
        cartId: cart.id,
        lines,
        language,
      })

      if (updatedCart) {
        setCart(updatedCart)
      }
    } catch (error) {
      console.error(t.cart.errorUpdatingCart || 'Error updating cart line:', error)
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

