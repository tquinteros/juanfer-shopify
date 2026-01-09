"use client"

import React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { useProducts } from "@/components/hooks/useProducts"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Link from "next/link"
import { useLanguage } from "@/lib/contexts/language-context"
import { translations } from "@/lib/i18n/translations"
import { ProductCard } from "@/components/product/product-card"

const ProductCarousel = () => {
  const { language } = useLanguage()
  const t = translations[language]
  const { data: productsData, isLoading: productsLoading } = useProducts({ first: 6 })

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">{t.home.bestsellers}</h2>
        <Button asChild variant="outline">
          <Link href="/products">{t.home.viewAll}</Link>
        </Button>
      </div>

      {productsLoading ? (
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <CarouselItem
                key={i}
                className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                <Card className="overflow-hidden h-full">
                  <CardHeader className="p-0">
                    <Skeleton className="h-64 w-full" />
                  </CardHeader>
                  <CardContent className="p-4">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-4" />
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0" />
          <CarouselNext className="right-0" />
        </Carousel>
      ) : productsData?.products.edges.length ? (
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {productsData.products.edges.slice(0, 8).map(({ node: product }) => (
              <CarouselItem
                key={product.id}
                className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                <ProductCard
                  product={product}
                  showTags={false}
                  priceSize="xl"
                  stockStatusKey="home"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0" />
          <CarouselNext className="right-0" />
        </Carousel>
      ) : (
        <div className="text-center text-muted-foreground py-8">
          {t.home.noCollectionsAvailable || "No products available"}
        </div>
      )}
    </div>
  )
}

export default ProductCarousel