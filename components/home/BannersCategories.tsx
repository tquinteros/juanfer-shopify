"use client"

import React from 'react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import Image from "next/image"
import { useHomeBannersCat, HomePageMetaobject } from "@/components/hooks/useHomePageMetaobject"

const BannersCategories = () => {
    const { data: bannersCategoriesData, isLoading: bannersCategoriesLoading, error: bannersCategoriesError } = useHomeBannersCat()

    const getFieldValue = (fields: HomePageMetaobject['fields'], key: string): string | null => {
        const field = fields.find(f => f.key === key)
        return field?.value || null
    }

    const getImage = (fields: HomePageMetaobject['fields']) => {
        const imagenField = fields.find(f => f.key === "imagen")
        return imagenField?.reference?.image || null
    }

    const banners = bannersCategoriesData?.metaobjects?.edges?.map(edge => ({
        id: edge.node.id,
        handle: edge.node.handle,
        nombre: getFieldValue(edge.node.fields, "nombre"),
        link: getFieldValue(edge.node.fields, "link"),
        image: getImage(edge.node.fields)
    })) || []

    return (
        <div className="w-full">
            <h2 className="text-xl font-bold mb-4">Banners Categories</h2>
            {bannersCategoriesLoading ? (
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
                                        <Skeleton className="h-48 w-full" />
                                    </CardHeader>
                                    <CardContent className="p-4">
                                        <Skeleton className="h-4 w-3/4" />
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-0" />
                    <CarouselNext className="right-0" />
                </Carousel>
            ) : bannersCategoriesError ? (
                <div className="text-center text-muted-foreground py-8">
                    Error loading banners
                </div>
            ) : banners.length > 0 ? (
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-2 md:-ml-4">
                        {banners.map((banner) => (
                            <CarouselItem
                                key={banner.id}
                                className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/6"
                            >
                                <Link href={banner.link || "#"}>
                                    <Card className="overflow-hidden bg-transparent pt-0 gap-0 border-none hover:shadow-none shadow-none rounded cursor-pointer h-full">
                                        <CardHeader className="p-0">
                                            {banner.image ? (
                                                <Image
                                                    src={banner.image.url}
                                                    alt={banner.image.altText || banner.nombre || "Banner"}
                                                    width={400}
                                                    height={300}
                                                    className="w-full h-48 object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-48 flex items-center justify-center bg-muted">
                                                    <span className="text-muted-foreground text-sm">No image</span>
                                                </div>
                                            )}
                                        </CardHeader>
                                        {banner.nombre && (
                                            <CardContent className="px-0">
                                                <h3 className="text-lg font-semibold">{banner.nombre}</h3>
                                            </CardContent>
                                        )}
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
                    No banners available
                </div>
            )}
        </div>
    )
}

export default BannersCategories