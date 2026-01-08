"use client"

import { useCollectionByHandle } from "@/components/hooks/useCollections"
import { ProductCard } from "@/components/product/product-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { use } from "react"
import { useLanguage } from "@/lib/contexts/language-context"
import { translations } from "@/lib/i18n/translations"

interface CollectionPageProps {
  params: Promise<{
    handle: string
  }>
}

export default function CollectionPage({ params }: CollectionPageProps) {
  const { language } = useLanguage()
  const t = translations[language]
  const { handle } = use(params)

  const { data, isLoading, error } = useCollectionByHandle({ 
    handle, 
    first: 50 
  })

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>
            {t.common.errorLoading}: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-12 w-48 mb-6" />
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-1/2 mb-8" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const collection = data?.collectionByHandle

  if (!collection) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertDescription>{t.common.notFound}</AlertDescription>
        </Alert>
      </div>
    )
  }

  const products = collection.products.edges

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link href="/">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t.common.backToHome || "Back to Home"}
        </Button>
      </Link>

      {/* Collection Header */}
      <div className="mb-8">
        {collection.image && (
          <div className="relative w-full h-[300px] rounded-lg overflow-hidden mb-6">
            <Image
              src={collection.image.url}
              alt={collection.image.altText || collection.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{collection.title}</h1>
        {collection.description && (
          <p className="text-lg text-muted-foreground max-w-3xl">
            {collection.description}
          </p>
        )}
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">
              {products.length} {products.length === 1 ? t.common.product : t.common.products}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(({ node: product }) => (
              <ProductCard
                key={product.id}
                product={product}
                showTags={true}
                priceSize="xl"
                stockStatusKey="products"
              />
            ))}
          </div>
        </div>
      ) : (
        <Alert>
          <AlertDescription>
            {t.common.noProductsInCollection || "No products found in this collection."}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

