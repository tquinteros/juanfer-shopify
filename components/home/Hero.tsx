"use client"
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useLanguage } from '@/lib/contexts/language-context'
import { translations } from '@/lib/i18n/translations'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useHomePageMetaobjectServer, HomePageMetaobject } from '../hooks/useHomePageMetaobject'
import { Skeleton } from '@/components/ui/skeleton'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'

interface HeroData {
    titulo: string
    descripcion: string
    textoBotonPrimario: string
    linkBotonPrimario: string
    textoBotonSecundario: string
    linkBotonSecundario: string
    heroImage: { url: string; altText: string | null; width: number; height: number } | null
}

const Hero = () => {
    const { language } = useLanguage()
    const t = translations[language]
    const { data: metaobjectData, isLoading: metaobjectLoading } = useHomePageMetaobjectServer()
    const [currentSlide, setCurrentSlide] = useState(0)
    const [headerHeight, setHeaderHeight] = useState(140)
    const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        const header = document.querySelector('header')
        if (!header) return

        const observer = new ResizeObserver(entries => {
            for (const entry of entries) {
                setHeaderHeight(entry.contentRect.height)
            }
        })

        observer.observe(header)

        return () => observer.disconnect()
    }, [])

    const getFieldValue = (fields: HomePageMetaobject['fields'], key: string): string | null => {
        const field = fields.find(f => f.key === key)
        return field?.value || null
    }

    const getImage = (fields: HomePageMetaobject['fields']) => {
        const imagenField = fields.find(f => f.key === "imagen_hero")
        return imagenField?.reference?.image || null
    }

    const heroNodes = metaobjectData?.metaobjects?.edges || []

    const herosData: HeroData[] = heroNodes.map((edge) => {
        const heroFields = edge.node.fields || []
        const heroImage = getImage(heroFields)

        return {
            titulo: getFieldValue(heroFields, "titulo_principal") || t.home.heroTitle,
            descripcion: getFieldValue(heroFields, "descripcion_principal") || t.home.heroDescription,
            textoBotonPrimario: getFieldValue(heroFields, "texto_boton_primario") || t.home.shopNow,
            linkBotonPrimario: getFieldValue(heroFields, "link_boton_primario") || "/products",
            textoBotonSecundario: getFieldValue(heroFields, "texto_boton_secundario") || t.home.viewSamples,
            linkBotonSecundario: getFieldValue(heroFields, "link_boton_secundario") || "/samples",
            heroImage
        }
    })

    const startAutoplay = useCallback(() => {
        if (autoplayTimerRef.current) {
            clearInterval(autoplayTimerRef.current)
        }

        if (herosData.length <= 1) return

        autoplayTimerRef.current = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % herosData.length)
        }, 6000)
    }, [herosData.length])

    useEffect(() => {
        startAutoplay()

        return () => {
            if (autoplayTimerRef.current) {
                clearInterval(autoplayTimerRef.current)
            }
        }
    }, [startAutoplay])

    const goToSlide = (index: number) => {
        setCurrentSlide(index)
        startAutoplay()
    }

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % herosData.length)
        startAutoplay()
    }

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + herosData.length) % herosData.length)
        startAutoplay()
    }

    if (metaobjectLoading) {
        return (
            <section className="relative w-full overflow-hidden" style={{ height: `calc(100vh - ${headerHeight}px)` }}>
                <div className="absolute inset-0 bg-[#E5E5E5]" />
                <div className="relative h-full container mx-auto px-4 lg:px-8 flex items-center">
                    <div className="max-w-3xl w-full">
                        <Skeleton className="h-16 md:h-20 lg:h-24 mb-6 w-3/4" />
                        <div className="space-y-3 mb-8">
                            <Skeleton className="h-6 w-full max-w-2xl" />
                            <Skeleton className="h-6 w-11/12 max-w-2xl" />
                            <Skeleton className="h-6 w-10/12 max-w-2xl" />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Skeleton className="h-12 w-40" />
                            <Skeleton className="h-12 w-40" />
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    if (herosData.length === 0) {
        return (
            <section className="relative w-full overflow-hidden" style={{ height: `calc(100vh - ${headerHeight}px)` }}>
                <div className="absolute inset-0 bg-secondary/40" />
                <div className="relative h-full container mx-auto px-4 lg:px-8 flex items-center">
                    <div className="max-w-3xl text-background">
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-light mb-6 leading-tight text-balance">
                            {t.home.heroTitle}
                        </h1>
                        <p className="text-lg md:text-xl lg:text-2xl mb-8 leading-relaxed max-w-2xl font-mono text-background/90">
                            {t.home.heroDescription}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                asChild
                                size="lg"
                                className="bg-background text-secondary hover:bg-background/90 font-mono uppercase tracking-wider"
                            >
                                <Link href="/products">{t.home.shopNow}</Link>
                            </Button>
                            <Button
                                asChild
                                size="lg"
                                variant="outline"
                                className="border-background text-background hover:bg-background hover:text-secondary font-mono uppercase tracking-wider bg-transparent"
                            >
                                <Link href="/samples">{t.home.viewSamples}</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="relative w-full overflow-hidden" style={{ height: `calc(100vh - ${headerHeight}px)` }}>
            {herosData.map((heroData, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"
                        }`}
                >
                    {heroData.heroImage ? (
                        <Image
                            src={heroData.heroImage.url}
                            alt={heroData.heroImage.altText || heroData.titulo}
                            fill
                            className="object-cover brightness-60"
                            priority={index === 0}
                        />
                    ) : (
                        <div className="absolute inset-0 bg-muted" />
                    )}

                    <div className="relative h-full container mx-auto px-4 lg:px-8 flex items-center">
                        <div className="max-w-3xl text-background">
                            <h1 className="text-5xl md:text-7xl lg:text-8xl text-white font-light mb-6 leading-tight text-balance">
                                {heroData.titulo}
                            </h1>
                            <p className="text-lg md:text-xl lg:text-2xl mb-8 text-white leading-relaxed max-w-3xl font-mono ">
                                {heroData.descripcion}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    asChild
                                    size="lg"
                                    variant="secondary"
                                    className="hover:opacity-80 font-mono uppercase tracking-wider"
                                >
                                    <Link href={heroData.linkBotonPrimario}>{heroData.textoBotonPrimario}</Link>
                                </Button>
                                <Button
                                    asChild
                                    size="lg"
                                    variant="outline"
                                    className="hover:opacity-80 text-white font-mono hover:text-white uppercase tracking-wider hover:bg-transparent bg-transparent"
                                >
                                    <Link href={heroData.linkBotonSecundario}>{heroData.textoBotonSecundario}</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <button
                onClick={prevSlide}
                className="hidden md:block cursor-pointer absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-10 bg-background/20 hover:bg-background/40 backdrop-blur-sm p-3 rounded-full transition-colors"
                aria-label="Previous slide"
            >
                <ChevronLeft className="h-6 w-6 text-white" />
            </button>

            <button
                onClick={nextSlide}
                className="hidden md:block cursor-pointer absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-10 bg-background/20 hover:bg-background/40 backdrop-blur-sm p-3 rounded-full transition-colors"
                aria-label="Next slide"
            >
                <ChevronRight className="h-6 w-6 text-white" />
            </button>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                {herosData.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`h-1 transition-all ${index === currentSlide ? "w-12 bg-white" : "w-8 bg-white/40"}`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    )
}

export default Hero