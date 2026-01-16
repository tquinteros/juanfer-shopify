'use server'

import { shopifyFetch } from '@/lib/shopify'
import {
  CREATE_CART,
  GET_CART,
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_CART_LINES,
  UPDATE_CART_BUYER_IDENTITY,
} from '@/lib/queries/cart'
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

// Create new cart
interface CreateCartParams {
  lines?: CartLineInput[]
  customerAccessToken?: string
  language?: string
}

export async function createCartAction(
  params: CreateCartParams = {}
): Promise<Cart | null> {
  const { lines = [], customerAccessToken, language = 'ES' } = params

  try {
    const input: {
      lines: CartLineInput[]
      buyerIdentity?: { customerAccessToken: string }
    } = { lines }

    if (customerAccessToken) {
      input.buyerIdentity = { customerAccessToken }
    }

    const data = await shopifyFetch<CartCreateResponse>({
      query: CREATE_CART,
      variables: { input },
      language,
    })

    if (data.cartCreate.userErrors.length > 0) {
      console.error('Cart creation errors:', data.cartCreate.userErrors)
      throw new Error(data.cartCreate.userErrors[0].message)
    }

    return data.cartCreate.cart
  } catch (error) {
    console.error('Error creating cart:', error)
    throw error
  }
}

// Get existing cart
interface GetCartParams {
  cartId: string
  language?: string
}

export async function getCartAction(
  params: GetCartParams
): Promise<Cart | null> {
  const { cartId, language = 'ES' } = params

  try {
    const data = await shopifyFetch<GetCartResponse>({
      query: GET_CART,
      variables: { id: cartId },
      language,
    })

    return data.cart
  } catch (error) {
    console.error('Error fetching cart:', error)
    throw error
  }
}

// Add items to cart
interface AddToCartParams {
  cartId: string
  lines: CartLineInput[]
  language?: string
}

export async function addToCartAction(
  params: AddToCartParams
): Promise<Cart | null> {
  const { cartId, lines, language = 'ES' } = params

  try {
    const data = await shopifyFetch<CartLinesAddResponse>({
      query: ADD_TO_CART,
      variables: {
        cartId,
        lines,
      },
      language,
    })

    if (data.cartLinesAdd.userErrors.length > 0) {
      console.error('Add to cart errors:', data.cartLinesAdd.userErrors)
      throw new Error(data.cartLinesAdd.userErrors[0].message)
    }

    return data.cartLinesAdd.cart
  } catch (error) {
    console.error('Error adding to cart:', error)
    throw error
  }
}

// Update cart lines
interface UpdateCartLinesParams {
  cartId: string
  lines: CartLineUpdateInput[]
  language?: string
}

export async function updateCartLinesAction(
  params: UpdateCartLinesParams
): Promise<Cart | null> {
  const { cartId, lines, language = 'ES' } = params

  try {
    const data = await shopifyFetch<CartLinesUpdateResponse>({
      query: UPDATE_CART_LINES,
      variables: {
        cartId,
        lines,
      },
      language,
    })

    if (data.cartLinesUpdate.userErrors.length > 0) {
      console.error('Update cart lines errors:', data.cartLinesUpdate.userErrors)
      throw new Error(data.cartLinesUpdate.userErrors[0].message)
    }

    return data.cartLinesUpdate.cart
  } catch (error) {
    console.error('Error updating cart lines:', error)
    throw error
  }
}

// Remove items from cart
interface RemoveFromCartParams {
  cartId: string
  lineIds: string[]
  language?: string
}

export async function removeFromCartAction(
  params: RemoveFromCartParams
): Promise<Cart | null> {
  const { cartId, lineIds, language = 'ES' } = params

  try {
    const data = await shopifyFetch<CartLinesRemoveResponse>({
      query: REMOVE_FROM_CART,
      variables: {
        cartId,
        lineIds,
      },
      language,
    })

    if (data.cartLinesRemove.userErrors.length > 0) {
      console.error('Remove from cart errors:', data.cartLinesRemove.userErrors)
      throw new Error(data.cartLinesRemove.userErrors[0].message)
    }

    return data.cartLinesRemove.cart
  } catch (error) {
    console.error('Error removing from cart:', error)
    throw error
  }
}

// Update cart buyer identity (associate cart with customer)
interface UpdateCartBuyerIdentityParams {
  cartId: string
  customerAccessToken: string
  language?: string
}

export async function updateCartBuyerIdentityAction(
  params: UpdateCartBuyerIdentityParams
): Promise<Cart | null> {
  const { cartId, customerAccessToken, language = 'ES' } = params

  try {
    const data = await shopifyFetch<CartBuyerIdentityUpdateResponse>({
      query: UPDATE_CART_BUYER_IDENTITY,
      variables: {
        cartId,
        buyerIdentity: {
          customerAccessToken,
        },
      },
      language,
    })

    if (data.cartBuyerIdentityUpdate.userErrors.length > 0) {
      console.error('Update buyer identity errors:', data.cartBuyerIdentityUpdate.userErrors)
      throw new Error(data.cartBuyerIdentityUpdate.userErrors[0].message)
    }

    return data.cartBuyerIdentityUpdate.cart
  } catch (error) {
    console.error('Error updating cart buyer identity:', error)
    throw error
  }
}

