"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "@/lib/contexts/language-context"
import { translations } from "@/lib/i18n/translations"

interface ProductCardProps {
  product: {
    id: string
    title: string
    description?: string | null
    images: {
      edges: Array<{
        node: {
          url: string
          altText?: string | null
        }
      }>
    }
    priceRange: {
      minVariantPrice: {
        amount: string
        currencyCode: string
      }
    }
    availableForSale: boolean
    tags?: string[]
  }
  showTags?: boolean
  priceSize?: "lg" | "xl" | "2xl"
  stockStatusKey?: "products" | "home"
  className?: string
}

export function ProductCard({
  product,
  showTags = false,
  priceSize = "xl",
  stockStatusKey = "products",
  className = "",
}: ProductCardProps) {
  const { language } = useLanguage()
  const t = translations[language]
  
  const firstImage = product.images.edges[0]?.node
  const price = product.priceRange.minVariantPrice
  const productId = product.id.split("/").pop() || product.id

  const priceSizeClasses = {
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
  }

  const stockStatus = product.availableForSale
    ? stockStatusKey === "home"
      ? t.home.inStock
      : t.products.available
    : stockStatusKey === "home"
    ? t.home.outOfStock
    : t.products.outOfStock

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow ${className}`}>
      <CardHeader className="p-0">
        <Link href={`/product/${productId}`} className="block cursor-pointer">
          {firstImage ? (
            <Image
              width={500}
              height={500}
              src={firstImage.url}
              alt={firstImage.altText || product.title}
              className="w-full h-64 object-cover"
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-sm">{t.common.noImage}</span>
            </div>
          )}
        </Link>
      </CardHeader>
      <CardContent className="p-4">
        <Link href={`/product/${productId}`}>
          <CardTitle className="text-lg mb-2 line-clamp-2 hover:underline">
            {product.title}
          </CardTitle>
        </Link>
        {product.description && (
          <CardDescription className="line-clamp-2 mb-4">
            {product.description}
          </CardDescription>
        )}
        <div className="flex justify-between items-center">
          <span className={`${priceSizeClasses[priceSize]} font-bold`}>
            ${parseFloat(price.amount).toFixed(2)} {price.currencyCode}
          </span>
          <span
            className={`text-sm font-medium ${
              product.availableForSale
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {stockStatus}
          </span>
        </div>
        {showTags && product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {product.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-gray-100 px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

