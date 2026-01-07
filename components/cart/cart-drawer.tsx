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
import { useLanguage } from "@/lib/contexts/language-context"
import { translations } from "@/lib/i18n/translations"

export function CartDrawer() {
  const { language } = useLanguage()
  const t = translations[language]
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
        <DrawerHeader className="border-b shrink-0 px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
              <DrawerTitle className="text-base sm:text-lg">{t.cart.shoppingCart}</DrawerTitle>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10 touch-manipulation">
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </DrawerClose>
          </div>
          <DrawerDescription className="text-xs sm:text-sm mt-1 sm:mt-2">
            {cart?.totalQuantity
              ? `${cart.totalQuantity} ${cart.totalQuantity === 1 ? t.cart.item : t.cart.items} ${t.cart.inYourCart}`
              : t.cart.yourCartIsEmpty}
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 sm:py-6 min-h-0">
          {isLoading ? (
            <div className="space-y-3 sm:space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex gap-3 sm:gap-4">
                  <Skeleton className="h-20 w-20 sm:h-24 sm:w-24 rounded shrink-0" />
                  <div className="flex-1 space-y-2 min-w-0">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : isEmpty ? (
            <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center px-4">
              <ShoppingCart className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mb-4" />
              <h3 className="text-base sm:text-lg font-semibold mb-2">{t.cart.yourCartIsEmpty}</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-6">
                {t.cart.startShopping}
              </p>
              <Button asChild onClick={closeCart} size="sm" className="sm:size-default">
                <Link href="/products">{t.cart.browseProducts}</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {cartLines.map((line) => {
                const { merchandise } = line
                const isUpdating = updatingLines.has(line.id)

                return (
                  <div
                    key={line.id}
                    className={`flex gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg ${
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
                          className="h-20 w-20 sm:h-24 sm:w-24 object-cover rounded"
                        />
                      ) : (
                        <div className="h-20 w-20 sm:h-24 sm:w-24 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-400 text-xs">{t.common.noImage}</span>
                        </div>
                      )}
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/product/${merchandise.product.id.split("/").pop()}`}
                          onClick={closeCart}
                        >
                          <h3 className="font-semibold text-xs sm:text-sm mb-1 hover:underline line-clamp-2">
                            {merchandise.product.title}
                          </h3>
                        </Link>
                        {merchandise.title !== "Default Title" && (
                          <p className="text-xs sm:text-sm text-muted-foreground mb-2 line-clamp-1">
                            {merchandise.title}
                          </p>
                        )}
                        <p className="font-bold text-sm sm:text-base mb-2 sm:mb-3">
                          ${parseFloat(line.cost.totalAmount.amount).toFixed(2)}{" "}
                          {line.cost.totalAmount.currencyCode}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-auto">
                        <div className="flex items-center border rounded">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 sm:h-8 sm:w-8 touch-manipulation"
                            onClick={() => handleUpdateQuantity(line.id, line.quantity - 1)}
                            disabled={isUpdating || line.quantity <= 1}
                          >
                            <Minus className="h-3.5 w-3.5 sm:h-3 sm:w-3" />
                          </Button>
                          <span className="px-2 sm:px-3 text-sm font-medium min-w-8 text-center">{line.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 sm:h-8 sm:w-8 touch-manipulation"
                            onClick={() => handleUpdateQuantity(line.id, line.quantity + 1)}
                            disabled={isUpdating}
                          >
                            <Plus className="h-3.5 w-3.5 sm:h-3 sm:w-3" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 sm:h-8 sm:w-8 text-destructive hover:text-destructive touch-manipulation"
                          onClick={() => handleRemoveItem(line.id)}
                          disabled={isUpdating}
                        >
                          <Trash2 className="h-4 w-4 sm:h-4 sm:w-4" />
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
            <DrawerFooter className="border-t shrink-0 px-3 sm:px-4 pb-3 sm:pb-4 pt-3 sm:pt-4">
              <div className="space-y-3 sm:space-y-4 w-full">
                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-muted-foreground">{t.cart.subtotal}</span>
                    <span className="font-medium">
                      ${parseFloat(cart.cost.subtotalAmount.amount).toFixed(2)}{" "}
                      {cart.cost.subtotalAmount.currencyCode}
                    </span>
                  </div>
                  {cart.cost.totalTaxAmount && parseFloat(cart.cost.totalTaxAmount.amount) > 0 && (
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-muted-foreground">{t.cart.tax}</span>
                      <span className="font-medium">
                        ${parseFloat(cart.cost.totalTaxAmount.amount).toFixed(2)}{" "}
                        {cart.cost.totalTaxAmount.currencyCode}
                      </span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-base sm:text-lg font-bold">
                    <span>{t.cart.total}</span>
                    <span>
                      ${parseFloat(cart.cost.totalAmount.amount).toFixed(2)}{" "}
                      {cart.cost.totalAmount.currencyCode}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button
                  className="w-full bg-gray-800 hover:bg-gray-700 text-sm sm:text-base"
                  size="default"
                  asChild
                >
                  <a href={getCheckoutUrl()} target="_blank" rel="noopener noreferrer">
                    {t.cart.proceedToCheckout}
                  </a>
                </Button>

                <Button variant="outline" className="w-full text-sm sm:text-base" onClick={closeCart}>
                  {t.cart.continueShopping}
                </Button>
              </div>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  )
}

