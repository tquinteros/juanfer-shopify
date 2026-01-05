"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import Link from "next/link"
import Image from "next/image"

const categories = [
  { id: 1, name: "Microcement Kits", image: "/placeholder-category.jpg" },
  { id: 2, name: "Samples", image: "/placeholder-category.jpg" },
  { id: 3, name: "Colors", image: "/placeholder-category.jpg" },
  { id: 4, name: "Tools", image: "/placeholder-category.jpg" },
  { id: 5, name: "Accessories", image: "/placeholder-category.jpg" },
  { id: 6, name: "Finishes", image: "/placeholder-category.jpg" },
]

export default function Home() {
  const { data: productsData, isLoading: productsLoading } = useProducts({ first: 8 })

  return (
    <div className="min-h-screen">
      <section className="relative bg-linear-to-br from-gray-50 to-gray-100 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
              Transform Your Spaces with Premium Microcement
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover our collection of high-quality microcement products designed to bring
              elegance and durability to any surface. Perfect for modern interiors and
              contemporary designs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-gray-800 hover:bg-gray-700 text-white">
                <Link href="/products">Shop Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/samples">View Samples</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Shop by Category</h2>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {categories.map((category) => (
                <CarouselItem
                  key={category.id}
                  className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="p-0">
                      <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <span className="text-gray-500 text-sm">Category Image</span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0" />
            <CarouselNext className="right-0" />
          </Carousel>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Bestsellers</h2>
            <Button asChild variant="outline">
              <Link href="/products">View All</Link>
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
              {productsData?.products.edges.slice(0, 4).map(({ node: product }) => {
                const firstImage = product.images.edges[0]?.node
                const price = product.priceRange.minVariantPrice

                return (
                  <Card
                    key={product.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <CardHeader className="p-0">
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
                          <span className="text-gray-500 text-sm">No Image</span>
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="p-4">
                      <CardTitle className="text-lg mb-2 line-clamp-2">
                        {product.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 mb-4">
                        {product.description}
                      </CardDescription>
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold">
                          ${parseFloat(price.amount).toFixed(2)} {price.currencyCode}
                        </span>
                        {product.availableForSale ? (
                          <span className="text-sm text-green-600 font-medium">
                            In Stock
                          </span>
                        ) : (
                          <span className="text-sm text-red-600 font-medium">Out of Stock</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
