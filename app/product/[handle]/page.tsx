"use client"

import { useProductByHandle } from "@/components/hooks/useProducts"
import { useCart } from "@/components/providers/cart-provider"
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
import { ShoppingCart, Check } from "lucide-react"
import Image from "next/image"
import { useState, use, useEffect, useMemo } from "react"
import { useLanguage } from "@/lib/contexts/language-context"
import { translations } from "@/lib/i18n/translations"

interface ProductPageProps {
    params: Promise<{
        handle: string
    }>
}

export default function ProductPage({ params }: ProductPageProps) {
    const { handle } = use(params)

    const { data, isLoading, error } = useProductByHandle({ handle })
    const { addToCart } = useCart()
    const { language } = useLanguage()
    const t = translations[language]
    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)
    const [selectedVariant, setSelectedVariant] = useState<string | null>(null)
    const [selectedColor, setSelectedColor] = useState<string | null>(null)
    const [selectedSize, setSelectedSize] = useState<string | null>(null)
    const [quantity, setQuantity] = useState(1)
    const [isAddingToCart, setIsAddingToCart] = useState(false)
    const [addedToCart, setAddedToCart] = useState(false)

    const images = data?.productByHandle?.images.edges.map((edge) => edge.node) || []
    const product = data?.productByHandle

    // Parse variants into colors and sizes
    const variantOptions = useMemo(() => {
        if (!product?.variants?.edges) return { colors: [], sizes: [], variantsByOption: {} }

        const colors = new Set<string>()
        const sizes = new Set<string>()
        const variantsByOption: Record<string, Record<string, typeof product.variants.edges[0]['node']>> = {}

        product.variants.edges.forEach(({ node: variant }) => {
            // Parse variant title like "Gris / XL" or "Color / Size"
            const parts = variant.title.split(' / ').map(p => p.trim())

            if (parts.length >= 2) {
                const color = parts[0]
                const size = parts[1]

                colors.add(color)
                sizes.add(size)

                if (!variantsByOption[color]) {
                    variantsByOption[color] = {}
                }
                variantsByOption[color][size] = variant
            } else {
                // Fallback: if format doesn't match, treat as single option
                const option = parts[0]
                colors.add(option)
                if (!variantsByOption[option]) {
                    variantsByOption[option] = {}
                }
                variantsByOption[option]['Default'] = variant
            }
        })

        return {
            colors: Array.from(colors).sort(),
            sizes: Array.from(sizes).sort(),
            variantsByOption,
        }
    }, [product])

    // Get available sizes for selected color
    const availableSizes = useMemo(() => {
        if (!selectedColor || !variantOptions.variantsByOption[selectedColor]) {
            return []
        }
        return Object.keys(variantOptions.variantsByOption[selectedColor]).sort()
    }, [selectedColor, variantOptions])

    // Get first available variant or selected variant
    const firstAvailableVariant = product?.variants?.edges.find(
        (edge) => edge.node.availableForSale
    )?.node

    // Update selected variant when color and size change
    useEffect(() => {
        if (selectedColor && selectedSize && variantOptions.variantsByOption[selectedColor]?.[selectedSize]) {
            const variant = variantOptions.variantsByOption[selectedColor][selectedSize]
            setSelectedVariant(variant.id)
        }
    }, [selectedColor, selectedSize, variantOptions])

    // Set initial color and size
    useEffect(() => {
        if (firstAvailableVariant && !selectedColor && !selectedSize) {
            const parts = firstAvailableVariant.title.split(' / ').map(p => p.trim())
            if (parts.length >= 2) {
                setSelectedColor(parts[0])
                setSelectedSize(parts[1])
            } else if (variantOptions.colors.length > 0) {
                setSelectedColor(variantOptions.colors[0])
                if (variantOptions.sizes.length > 0) {
                    setSelectedSize(variantOptions.sizes[0])
                }
            }
        }
    }, [firstAvailableVariant, selectedColor, selectedSize, variantOptions])

    const currentVariant = selectedVariant
        ? product?.variants?.edges.find((edge) => edge.node.id === selectedVariant)?.node
        : firstAvailableVariant

    // Carousel effect
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

    // Set initial variant
    useEffect(() => {
        if (!selectedVariant && firstAvailableVariant) {
            setSelectedVariant(firstAvailableVariant.id)
        }
    }, [firstAvailableVariant, selectedVariant])

    const scrollTo = (index: number) => {
        api?.scrollTo(index)
    }

    const handleAddToCart = async () => {
        if (!currentVariant) return

        setIsAddingToCart(true)
        setAddedToCart(false)

        try {
            await addToCart(currentVariant.id, quantity)
            setAddedToCart(true)
            setTimeout(() => setAddedToCart(false), 2000)
        } catch (error) {
            console.error("Failed to add to cart:", error)
        } finally {
            setIsAddingToCart(false)
        }
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Alert variant="destructive">
                    <AlertDescription>
                        {t.product.errorLoading}: {error.message}
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

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Alert>
                    <AlertDescription>{t.product.notFound}</AlertDescription>
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
                                            className={`shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${current === index
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
                                <span className="text-gray-500">{t.product.noImage}</span>
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
                                {t.product.inStock}
                            </span>
                        ) : (
                            <span className="inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                                {t.product.outOfStock}
                            </span>
                        )}
                    </div>

                    {product.description && (
                        <Card>
                            <CardContent className="pt-6">
                                <h2 className="text-xl font-semibold mb-3">{t.product.description}</h2>
                                <div
                                    className="prose max-w-none"
                                    dangerouslySetInnerHTML={{ __html: product.description }}
                                />
                            </CardContent>
                        </Card>
                    )}

                    {product.variants && product.variants.edges.length > 1 && (
                        <div className="space-y-4">
                            {/* Color Selector */}
                            {variantOptions.colors.length > 0 && (
                                <div>
                                    <label className="text-sm font-medium mb-2 block">
                                        {t.product.color} {selectedColor && `(${selectedColor})`}
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {variantOptions.colors.map((color) => {
                                            const hasAvailableVariant = Object.values(variantOptions.variantsByOption[color] || {}).some(
                                                (v) => v.availableForSale
                                            )
                                            return (
                                                <Button
                                                    key={color}
                                                    onClick={() => {
                                                        setSelectedColor(color)
                                                        const firstAvailableSize = Object.keys(variantOptions.variantsByOption[color] || {})
                                                            .find(size => variantOptions.variantsByOption[color][size].availableForSale)
                                                        setSelectedSize(firstAvailableSize || null)
                                                    }}
                                                    size="lg"
                                                    disabled={!hasAvailableVariant}
                                                    className={`px-4 py-2 border-2 rounded-lg transition-colors font-medium ${!hasAvailableVariant
                                                        ? "opacity-50 cursor-not-allowed"
                                                        : "cursor-pointer"
                                                        }`}
                                                    variant={selectedColor === color ? "default" : "outline"}
                                                >
                                                    {color}
                                                </Button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Size Selector */}
                            {selectedColor && availableSizes.length > 0 && (
                                <div>
                                    <label className="text-sm font-medium mb-2 block">
                                        {t.product.size} {selectedSize && `(${selectedSize})`}
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {availableSizes.map((size) => {
                                            const variant = variantOptions.variantsByOption[selectedColor]?.[size]
                                            const isAvailable = variant?.availableForSale ?? false
                                            return (
                                                <Button
                                                    variant={selectedSize === size ? "default" : "outline"}
                                                    key={size}
                                                    size="lg"
                                                    onClick={() => setSelectedSize(size)}
                                                    disabled={!isAvailable}
                                                    className={`px-4 py-2 border-2 rounded-lg transition-colors font-medium min-w-[60px]  ${!isAvailable
                                                        ? "opacity-50 cursor-not-allowed line-through"
                                                        : "cursor-pointer"
                                                        }`}
                                                >
                                                    {size}
                                                </Button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Fallback: If variant format doesn't match expected pattern, show old selector */}
                            {variantOptions.colors.length === 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-3">{t.product.selectVariant}</h3>
                                    <div className="grid grid-cols-1 gap-2">
                                        {product.variants.edges.map(({ node: variant }) => (
                                            <button
                                                key={variant.id}
                                                onClick={() => setSelectedVariant(variant.id)}
                                                disabled={!variant.availableForSale}
                                                className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${selectedVariant === variant.id
                                                    ? "border-gray-900 bg-gray-50"
                                                    : "border-gray-200 hover:border-gray-300"
                                                    } ${!variant.availableForSale
                                                        ? "opacity-50 cursor-not-allowed"
                                                        : "cursor-pointer"
                                                    }`}
                                            >
                                                <span className="font-medium">{variant.title}</span>
                                                <div className="flex items-center gap-3">
                                                    <span className="font-bold">
                                                        ${parseFloat(variant.price.amount).toFixed(2)}{" "}
                                                        {variant.price.currencyCode}
                                                    </span>
                                                    {!variant.availableForSale && (
                                                        <span className="text-sm text-red-600">{t.product.unavailable}</span>
                                                    )}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {product.tags && product.tags.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-3">{t.product.tags}</h3>
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

                    {/* Quantity Selector */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">{t.product.quantity}</label>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                disabled={quantity <= 1}
                            >
                                -
                            </Button>
                            <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setQuantity(quantity + 1)}
                            >
                                +
                            </Button>
                        </div>
                    </div>

                    {/* Add to Cart Button */}
                    <div className="pt-4 space-y-2">
                        <Button
                            size="lg"
                            className="w-full"
                            disabled={!currentVariant?.availableForSale || isAddingToCart}
                            onClick={handleAddToCart}
                        >
                            {isAddingToCart ? (
                                t.product.adding
                            ) : addedToCart ? (
                                <>
                                    <Check className="h-5 w-5 mr-2" />
                                    {t.product.addedToCart}
                                </>
                            ) : (
                                <>
                                    <ShoppingCart className="h-5 w-5 mr-2" />
                                    {currentVariant?.availableForSale ? t.product.addToCart : t.product.outOfStock}
                                </>
                            )}
                        </Button>
                        {currentVariant && (
                            <p className="text-sm text-center text-muted-foreground">
                                ${(parseFloat(currentVariant.price.amount) * quantity).toFixed(2)}{" "}
                                {currentVariant.price.currencyCode} {t.product.total}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

