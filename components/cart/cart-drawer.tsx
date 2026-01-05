"use client"

import { useCart } from "@/components/providers/cart-provider"
import { useAuth } from "@/components/providers/auth-provider"
import { getCustomerToken } from "@/lib/auth"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { ShoppingCart, X, Plus, Minus, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

export function CartDrawer() {
  const { cart, isLoading, isOpen, closeCart, removeFromCart, updateCartLine } = useCart()
  const { isAuthenticated } = useAuth()
  const [updatingLines, setUpdatingLines] = useState<Set<string>>(new Set())

  // Get checkout URL with customer token if logged in
  const getCheckoutUrl = () => {
    if (!cart?.checkoutUrl) return "#"
    
    const customerToken = getCustomerToken()
    if (customerToken && isAuthenticated) {
      // Append customer access token to checkout URL
      const url = new URL(cart.checkoutUrl)
      url.searchParams.set("customer_access_token", customerToken)
      return url.toString()
    }
    
    return cart.checkoutUrl
  }

  const handleUpdateQuantity = async (lineId: string, newQuantity: number) => {
    setUpdatingLines((prev) => new Set(prev).add(lineId))
    try {
      await updateCartLine(lineId, newQuantity)
    } catch (error) {
      console.error("Failed to update quantity:", error)
    } finally {
      setUpdatingLines((prev) => {
        const next = new Set(prev)
        next.delete(lineId)
        return next
      })
    }
  }

  const handleRemoveItem = async (lineId: string) => {
    setUpdatingLines((prev) => new Set(prev).add(lineId))
    try {
      await removeFromCart(lineId)
    } catch (error) {
      console.error("Failed to remove item:", error)
    } finally {
      setUpdatingLines((prev) => {
        const next = new Set(prev)
        next.delete(lineId)
        return next
      })
    }
  }

  const cartLines = cart?.lines.edges.map((edge) => edge.node) || []
  const isEmpty = cartLines.length === 0

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && closeCart()} direction="right">
      <DrawerContent className="h-full w-full sm:w-[420px] flex flex-col">
        <DrawerHeader className="border-b shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              <DrawerTitle>Shopping Cart</DrawerTitle>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-5 w-5" />
              </Button>
            </DrawerClose>
          </div>
          <DrawerDescription>
            {cart?.totalQuantity
              ? `${cart.totalQuantity} ${cart.totalQuantity === 1 ? "item" : "items"} in your cart`
              : "Your cart is empty"}
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-4 py-6 min-h-0">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-24 w-24 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : isEmpty ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-6">
                Start shopping to add items to your cart
              </p>
              <Button asChild onClick={closeCart}>
                <Link href="/products">Browse Products</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartLines.map((line) => {
                const { merchandise } = line
                const isUpdating = updatingLines.has(line.id)

                return (
                  <div
                    key={line.id}
                    className={`flex gap-4 p-4 border rounded-lg ${
                      isUpdating ? "opacity-50 pointer-events-none" : ""
                    }`}
                  >
                    {/* Product Image */}
                    <Link
                      href={`/product/${merchandise.product.id.split("/").pop()}`}
                      onClick={closeCart}
                      className="shrink-0"
                    >
                      {merchandise.product.featuredImage ? (
                        <Image
                          src={merchandise.product.featuredImage.url}
                          alt={merchandise.product.featuredImage.altText || merchandise.product.title}
                          width={96}
                          height={96}
                          className="h-24 w-24 object-cover rounded"
                        />
                      ) : (
                        <div className="h-24 w-24 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No image</span>
                        </div>
                      )}
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/product/${merchandise.product.id.split("/").pop()}`}
                        onClick={closeCart}
                      >
                        <h3 className="font-semibold text-sm mb-1 hover:underline">
                          {merchandise.product.title}
                        </h3>
                      </Link>
                      {merchandise.title !== "Default Title" && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {merchandise.title}
                        </p>
                      )}
                      <p className="font-bold text-sm mb-3">
                        ${parseFloat(line.cost.totalAmount.amount).toFixed(2)}{" "}
                        {line.cost.totalAmount.currencyCode}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border rounded">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleUpdateQuantity(line.id, line.quantity - 1)}
                            disabled={isUpdating || line.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="px-3 text-sm font-medium">{line.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleUpdateQuantity(line.id, line.quantity + 1)}
                            disabled={isUpdating}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleRemoveItem(line.id)}
                          disabled={isUpdating}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {!isEmpty && cart && (
          <>
            <Separator />
            <DrawerFooter className="border-t shrink-0">
              <div className="space-y-4">
                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">
                      ${parseFloat(cart.cost.subtotalAmount.amount).toFixed(2)}{" "}
                      {cart.cost.subtotalAmount.currencyCode}
                    </span>
                  </div>
                  {cart.cost.totalTaxAmount && parseFloat(cart.cost.totalTaxAmount.amount) > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="font-medium">
                        ${parseFloat(cart.cost.totalTaxAmount.amount).toFixed(2)}{" "}
                        {cart.cost.totalTaxAmount.currencyCode}
                      </span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>
                      ${parseFloat(cart.cost.totalAmount.amount).toFixed(2)}{" "}
                      {cart.cost.totalAmount.currencyCode}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button
                  className="w-full bg-gray-800 hover:bg-gray-700"
                  size="lg"
                  asChild
                >
                  <a href={getCheckoutUrl()} target="_blank" rel="noopener noreferrer">
                    Proceed to Checkout
                  </a>
                </Button>

                <Button variant="outline" className="w-full" onClick={closeCart}>
                  Continue Shopping
                </Button>
              </div>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  )
}

