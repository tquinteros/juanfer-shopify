"use client"

import { useOrders } from "@/components/hooks/useOrders"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"
import { Package, Calendar, CreditCard } from "lucide-react"
import { useLanguage } from "@/lib/contexts/language-context"
import { translations } from "@/lib/i18n/translations"

export function OrdersTab() {
  const { data, isLoading, error } = useOrders({ first: 20 })
  const { language } = useLanguage()
  const t = translations[language]

  // Helper function to get translated status
  const getFinancialStatus = (status: string | null) => {
    if (!status) return ""
    const statusKey = status.toLowerCase() as keyof typeof t.account.orders.status
    return t.account.orders.status[statusKey] || status
  }

  // Helper function to get translated fulfillment status
  const getFulfillmentStatus = (status: string | null) => {
    if (!status) return ""
    const statusKey = status.toLowerCase() as keyof typeof t.account.orders.fulfillment
    return t.account.orders.fulfillment[statusKey] || status
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {t.account.orders.errorLoading}: {error.message}
        </AlertDescription>
      </Alert>
    )
  }

  const orders = data?.customer?.orders.edges || []

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="pt-12 pb-12 text-center">
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">{t.account.orders.noOrdersYet}</h3>
          <p className="text-muted-foreground">
            {t.account.orders.noOrdersDescription}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map(({ node: order }) => {
        const orderDate = new Date(order.processedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })

        const totalPrice = parseFloat(order.totalPrice.amount)

        return (
          <Card key={order.id} className="overflow-hidden">
            <CardHeader className="bg-muted/50">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-lg">{t.account.orders.order} {order.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4" />
                    {orderDate}
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  {order.financialStatus && (
                    <Badge
                      variant={
                        order.financialStatus === "PAID" ? "default" : "secondary"
                      }
                    >
                      <CreditCard className="h-3 w-3 mr-1" />
                      {getFinancialStatus(order.financialStatus)}
                    </Badge>
                  )}
                  {order.fulfillmentStatus && (
                    <Badge variant="outline">
                      <Package className="h-3 w-3 mr-1" />
                      {getFulfillmentStatus(order.fulfillmentStatus)}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {order.lineItems.edges.map(({ node: item }, index) => (
                  <div key={index} className="flex gap-4">
                    {item.variant?.image ? (
                      <Image
                        src={item.variant.image.url}
                        alt={item.variant.image.altText || item.title}
                        width={80}
                        height={80}
                        className="rounded-md object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-muted rounded-md flex items-center justify-center">
                        <Package className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium">{item.title}</h4>
                      {item.variant?.title && item.variant.title !== "Default Title" && (
                        <p className="text-sm text-muted-foreground">
                          {item.variant.title}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground mt-1">
                        {t.account.orders.quantity}: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      {item.variant?.price && (
                        <p className="font-medium">
                          ${parseFloat(item.variant.price.amount).toFixed(2)}{" "}
                          {item.variant.price.currencyCode}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4 space-y-2">
                {order.subtotalPrice && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t.account.orders.subtotal}</span>
                    <span>
                      ${parseFloat(order.subtotalPrice.amount).toFixed(2)}{" "}
                      {order.subtotalPrice.currencyCode}
                    </span>
                  </div>
                )}
                {order.totalShippingPrice && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t.account.orders.shipping}</span>
                    <span>
                      ${parseFloat(order.totalShippingPrice.amount).toFixed(2)}{" "}
                      {order.totalShippingPrice.currencyCode}
                    </span>
                  </div>
                )}
                {order.totalTax && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t.account.orders.tax}</span>
                    <span>
                      ${parseFloat(order.totalTax.amount).toFixed(2)}{" "}
                      {order.totalTax.currencyCode}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>{t.account.orders.total}</span>
                  <span>
                    ${totalPrice.toFixed(2)} {order.totalPrice.currencyCode}
                  </span>
                </div>
              </div>

              {/* Shipping Address */}
              {order.shippingAddress && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-medium mb-2">{t.account.orders.shippingAddress}</h4>
                  <div className="text-sm text-muted-foreground">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                    <br />
                    {order.shippingAddress.address1}
                    {order.shippingAddress.address2 && (
                      <>
                        <br />
                        {order.shippingAddress.address2}
                      </>
                    )}
                    <br />
                    {order.shippingAddress.city}, {order.shippingAddress.province}{" "}
                    {order.shippingAddress.zip}
                    <br />
                    {order.shippingAddress.country}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

