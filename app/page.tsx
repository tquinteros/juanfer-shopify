"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { useProducts } from "@/components/hooks/useProducts"
import { useCollections } from "@/components/hooks/useCollections"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/lib/contexts/language-context"
import { translations } from "@/lib/i18n/translations"
import { useEffect, useState, useRef } from "react"
import { ProductCard } from "@/components/product/product-card"

export default function Home() {
  const { language } = useLanguage()
  const t = translations[language]
  const { data: productsData, isLoading: productsLoading } = useProducts({ first: 8 })
  const { data: collectionsData, isLoading: collectionsLoading } = useCollections({ first: 10 })
  const [headerHeight, setHeaderHeight] = useState(0)
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const updateHeaderHeight = () => {
      const header = document.querySelector('header')
      if (header) {
        setHeaderHeight(header.offsetHeight)
      }
    }

    updateHeaderHeight()
    window.addEventListener('resize', updateHeaderHeight)
    
    return () => window.removeEventListener('resize', updateHeaderHeight)
  }, [])

  return (
    <div className="min-h-screen">
      <section 
        ref={heroRef}
        className="relative flex items-center justify-center"
        style={{ 
          height: headerHeight > 0 ? `calc(100vh - ${headerHeight}px)` : '100vh',
          minHeight: headerHeight > 0 ? `calc(100vh - ${headerHeight}px)` : '100vh'
        }}
      >
        <div className="container mx-auto px-4 w-full">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
              {t.home.heroTitle}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t.home.heroDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/products">{t.home.shopNow}</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/samples">{t.home.viewSamples}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">{t.home.shopByCategory}</h2>
          {collectionsLoading ? (
            <div className="flex gap-4 overflow-hidden">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="min-w-[250px]">
                  <Card>
                    <CardHeader className="p-0">
                      <Skeleton className="h-48 w-full" />
                    </CardHeader>
                    <CardContent className="p-4">
                      <Skeleton className="h-4 w-3/4" />
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          ) : collectionsData?.collections.length ? (
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {collectionsData.collections.map((collection) => (
                  <CarouselItem
                    key={collection.id}
                    className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                  >
                    <Link href={`/collections/${collection.handle}`}>
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                        <CardHeader className="p-0">
                          {collection.image ? (
                            <Image
                              src={collection.image.url}
                              alt={collection.image.altText || collection.title}
                              width={400}
                              height={300}
                              className="w-full h-48 object-cover"
                            />
                          ) : (
                            <div className="w-full h-48 flex items-center justify-center">
                              <span className="text-muted-foreground text-sm">{t.common.noImage}</span>
                            </div>
                          )}
                        </CardHeader>
                        <CardContent className="p-4">
                          <CardTitle className="text-lg">{collection.title}</CardTitle>
                        </CardContent>
                      </Card>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-0" />
              <CarouselNext className="right-0" />
            </Carousel>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              {t.home.noCollectionsAvailable}
            </div>
          )}
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">{t.home.bestsellers}</h2>
            <Button asChild variant="outline">
              <Link href="/products">{t.home.viewAll}</Link>
            </Button>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-48 w-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {productsData?.products.edges.slice(0, 4).map(({ node: product }) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  showTags={false}
                  priceSize="xl"
                  stockStatusKey="home"
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
