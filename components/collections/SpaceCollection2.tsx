"use client"

import React, { useRef } from 'react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { useCollectionsByMetadataServer } from "@/components/hooks/useCollections"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/lib/contexts/language-context"
import { translations } from "@/lib/i18n/translations"

const SpaceCollection2 = () => {
    const { language } = useLanguage()
    const t = translations[language]
    const plugin = useRef(
        Autoplay({ delay: 3500, stopOnInteraction: true })
    )
    
    const { data: collectionsData, isLoading: collectionsLoading } = useCollectionsByMetadataServer({
        metadataValue: "space",
        first: 50
    })

    return (
        <section className=" bg-background">
            <div className="px-4 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-light mb-6 text-balance">
                        {t.home.shopBySpace}
                    </h2>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-mono">
                        {t.home.shopBySpaceSubTitle}
                    </p>
                </div>

                {collectionsLoading ? (
                    <Carousel
                        opts={{
                            align: "start",
                            loop: true,
                        }}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <CarouselItem
                                    key={i}
                                    className="pl-4 md:basis-1/2 lg:basis-1/3"
                                >
                                    <div className="aspect-4/5 overflow-hidden bg-muted">
                                        <Skeleton className="w-full h-full" />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="hidden md:flex -left-12" />
                        <CarouselNext className="hidden md:flex -right-12" />
                    </Carousel>
                ) : collectionsData?.collections.length ? (
                    <Carousel
                        opts={{
                            align: "start",
                            loop: true,
                        }}
                        plugins={[plugin.current]}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-4">
                            {collectionsData.collections.map((collection) => (
                                <CarouselItem
                                    key={collection.id}
                                    className="pl-4 md:basis-1/2 lg:basis-1/3"
                                >
                                    <Link href={`/collections/${collection.handle}`}>
                                        <div className="group relative aspect-4/5 overflow-hidden bg-muted cursor-pointer">
                                            {collection.image ? (
                                                <Image
                                                    src={collection.image.url}
                                                    alt={collection.image.altText || collection.title}
                                                    width={600}
                                                    height={800}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <span className="text-muted-foreground text-sm">{t.common.noImage}</span>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-500" />
                                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                                <p className="text-sm font-mono text-white/90 mb-1">
                                                    {t.home.shopBySpace}
                                                </p>
                                                <h3 className="text-2xl md:text-3xl font-light text-white">
                                                    {collection.title}
                                                </h3>
                                            </div>
                                        </div>
                                    </Link>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="hidden md:flex -left-12" />
                        <CarouselNext className="hidden md:flex -right-12" />
                    </Carousel>
                ) : (
                    <div className="text-center text-muted-foreground py-8 font-mono">
                        {t.home.noCollectionsAvailable}
                    </div>
                )}
            </div>
        </section>
    )
}

export default SpaceCollection2