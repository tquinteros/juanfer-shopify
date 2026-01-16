"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { useCollections } from "@/components/hooks/useCollections"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/lib/contexts/language-context"
import { translations } from "@/lib/i18n/translations"
import SpaceCollection from "@/components/collections/SpaceCollection"
import ProductCarousel from "@/components/products/product-carousel"
import ProductsCollection from "@/components/collections/ProductsCollection"
import BannersCategories from "@/components/home/BannersCategories"
import Hero from "@/components/home/Hero"
import FeatureSection from "@/components/home/FeatureSection"
import { InfiniteCategories } from "@/components/home/InfiniteCategories"
import SpaceCollection2 from "@/components/collections/SpaceCollection2"

export default function Home() {
  const { language } = useLanguage()
  const t = translations[language]
  const { data: collectionsData, isLoading: collectionsLoading } = useCollections({ first: 10 })

  return (
    <div className="min-h-screen pb-20">
      <Hero />
      <InfiniteCategories />
      <div className="px-6 flex flex-col gap-20 mt-20">
        <SpaceCollection2 />
        <BannersCategories />
        <FeatureSection />
        <section className="flex flex-col gap-20">
          <div className="">
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
          <ProductsCollection />
          <SpaceCollection />
        </section>

        <section className="">
          <ProductCarousel />
        </section>
      </div>
    </div>
  )
}
