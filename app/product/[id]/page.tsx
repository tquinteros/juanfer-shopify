"use client"

import { useProductById } from "@/components/hooks/useProducts"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import Image from "next/image"
import { useState, use, useEffect } from "react"

interface ProductPageProps {
    params: Promise<{
        id: string
    }>
}

export default function ProductPage({ params }: ProductPageProps) {
    const { id } = use(params)

    // Convert numeric ID to Shopify GID format if needed
    const productId = id.startsWith('gid://')
        ? id
        : `gid://shopify/Product/${id}`

    const { data, isLoading, error } = useProductById({ id: productId })
    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)

    const images = data?.product?.images.edges.map((edge) => edge.node) || []

    useEffect(() => {
        if (!api) {
            return
        }

        const updateCurrent = () => {
            setCurrent(api.selectedScrollSnap())
        }

        updateCurrent()
        api.on("select", updateCurrent)

        return () => {
            api.off("select", updateCurrent)
        }
    }, [api])

    const scrollTo = (index: number) => {
        api?.scrollTo(index)
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Alert variant="destructive">
                    <AlertDescription>
                        Error loading product: {error.message}
                    </AlertDescription>
                </Alert>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <Skeleton className="w-full h-[600px] rounded-lg" />
                        <div className="flex gap-4 mt-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <Skeleton key={i} className="w-20 h-20 rounded" />
                            ))}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-6 w-1/2" />
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                </div>
            </div>
        )
    }

    const product = data?.product

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Alert>
                    <AlertDescription>Product not found</AlertDescription>
                </Alert>
            </div>
        )
    }

    const minPrice = parseFloat(product.priceRange.minVariantPrice.amount)
    const maxPrice = parseFloat(product.priceRange.maxVariantPrice.amount)
    const hasPriceRange = minPrice !== maxPrice
    const currencyCode = product.priceRange.minVariantPrice.currencyCode

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                <div>
                    {images.length > 0 ? (
                        <>
                            <Card className="overflow-hidden mb-4">
                                <Carousel setApi={setApi} className="w-full">
                                    <CarouselContent>
                                        {images.map((image, index) => (
                                            <CarouselItem key={index}>
                                                <div className="relative w-full aspect-square">
                                                    <Image
                                                        src={image.url}
                                                        alt={image.altText || `${product.title} ${index + 1}`}
                                                        fill
                                                        className="object-cover"
                                                        priority={index === 0}
                                                    />
                                                </div>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    {images.length > 1 && (
                                        <>
                                            <CarouselPrevious className="left-4" />
                                            <CarouselNext className="right-4" />
                                        </>
                                    )}
                                </Carousel>
                            </Card>

                            {images.length > 1 && (
                                <div className="flex gap-4 overflow-x-auto">
                                    {images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => scrollTo(index)}
                                            className={`shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${
                                                current === index
                                                    ? "border-gray-900"
                                                    : "border-transparent hover:border-gray-300"
                                            }`}
                                        >
                                            <Image
                                                src={image.url}
                                                alt={image.altText || `${product.title} ${index + 1}`}
                                                width={80}
                                                height={80}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <Card className="overflow-hidden mb-4">
                            <div className="relative w-full aspect-square bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500">No Image</span>
                            </div>
                        </Card>
                    )}
                </div>

                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.title}</h1>
                        <div className="flex items-center gap-4 mb-4">
                            <span className="text-3xl font-bold">
                                ${minPrice.toFixed(2)} {currencyCode}
                                {hasPriceRange && (
                                    <span className="text-xl text-gray-500 ml-2">
                                        - ${maxPrice.toFixed(2)}
                                    </span>
                                )}
                            </span>
                        </div>
                    </div>

                    <div>
                        {product.availableForSale ? (
                            <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                In Stock
                            </span>
                        ) : (
                            <span className="inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                                Out of Stock
                            </span>
                        )}
                    </div>

                    {product.description && (
                        <Card>
                            <CardContent className="pt-6">
                                <h2 className="text-xl font-semibold mb-3">Description</h2>
                                <div
                                    className="prose max-w-none"
                                    dangerouslySetInnerHTML={{ __html: product.description }}
                                />
                            </CardContent>
                        </Card>
                    )}

                    {product.variants && product.variants.edges.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-3">Variants</h3>
                            <div className="space-y-2">
                                {product.variants.edges.map(({ node: variant }) => (
                                    <div
                                        key={variant.id}
                                        className="flex items-center justify-between p-3 border rounded-lg"
                                    >
                                        <span>{variant.title}</span>
                                        <div className="flex items-center gap-4">
                                            <span className="font-medium">
                                                ${parseFloat(variant.price.amount).toFixed(2)}{" "}
                                                {variant.price.currencyCode}
                                            </span>
                                            {variant.availableForSale ? (
                                                <span className="text-sm text-green-600">Available</span>
                                            ) : (
                                                <span className="text-sm text-red-600">Unavailable</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {product.tags && product.tags.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-3">Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {product.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="pt-4">
                        <Button
                            size="lg"
                            className="w-full bg-gray-800 hover:bg-gray-700 text-white"
                            disabled={!product.availableForSale}
                        >
                            {product.availableForSale ? "Add to Cart" : "Out of Stock"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

