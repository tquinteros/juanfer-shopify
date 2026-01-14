"use client"
import React from 'react'
import { useLanguage } from '@/lib/contexts/language-context'
import { translations } from '@/lib/i18n/translations'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useHomePageMetaobject, HomePageMetaobject } from '../hooks/useHomePageMetaobject'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel'
import { Skeleton } from '@/components/ui/skeleton'

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
    const { data: metaobjectData, isLoading: metaobjectLoading } = useHomePageMetaobject()
    const [api, setApi] = React.useState<CarouselApi>()
    console.log(metaobjectData, "hero data")

    React.useEffect(() => {
        if (!api) return

        const intervalId = setInterval(() => {
            api.scrollNext()
        }, 5000)

        return () => clearInterval(intervalId)
    }, [api])

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

    if (metaobjectLoading) {
        return (
            <section
                className="relative flex items-center overflow-hidden"
                style={{
                    minHeight: '60vh',
                    height: '60vh',
                    maxHeight: '700px',
                }}
            >
                <div className="px-20 w-full relative z-10">
                    <div className="max-w-2xl">
                        <Skeleton className="h-12 md:h-16 lg:h-20 mb-4 w-3/4" />
                        <Skeleton className="h-4 mb-3 w-full" />
                        <Skeleton className="h-4 mb-3 w-11/12" />
                        <Skeleton className="h-4 mb-6 w-10/12" />
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Skeleton className="h-12 w-36" />
                            <Skeleton className="h-12 w-36" />
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    if (herosData.length === 0) {
        return (
            <section
                className="relative flex items-center overflow-hidden"
                style={{
                    minHeight: '60vh',
                    height: '60vh',
                    maxHeight: '700px',
                }}
            >
                <div className="px-20 w-full relative z-10">
                    <div className="max-w-2xl">
                        <h1 className="text-2xl md:text-4xl lg:text-5xl text-white font-bold mb-4 drop-shadow-lg">
                            {t.home.heroTitle}
                        </h1>
                        <p className="text-sm md:text-base lg:text-lg text-white mb-6 drop-shadow-md leading-relaxed">
                            {t.home.heroDescription}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
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
        )
    }

    return (
        <Carousel
            opts={{
                loop: true,
                align: "start",
            }}
            setApi={setApi}
            className="w-full"
        >
            <CarouselContent className="ml-0">
                {herosData.map((heroData, index) => (
                    <CarouselItem key={index} className="pl-0">
                        <section
                            className="relative flex items-center overflow-hidden"
                            style={{
                                minHeight: '60vh',
                                height: '60vh',
                                maxHeight: '700px',
                                ...(heroData.heroImage && {
                                    backgroundImage: `url(${heroData.heroImage.url})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat',
                                })
                            }}
                        >
                            {heroData.heroImage && (
                                <div className="absolute inset-0 bg-black/40" />
                            )}

                            <div className="px-20 w-full relative z-10">
                                <div className="max-w-2xl">
                                    <h1 className="text-2xl md:text-4xl lg:text-5xl text-white font-bold mb-4 drop-shadow-lg">
                                        {heroData.titulo}
                                    </h1>
                                    <p className="text-sm md:text-base lg:text-lg text-white mb-6 drop-shadow-md leading-relaxed">
                                        {heroData.descripcion}
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <Button asChild size="lg">
                                            <Link href={heroData.linkBotonPrimario}>{heroData.textoBotonPrimario}</Link>
                                        </Button>
                                        <Button asChild size="lg" variant="outline">
                                            <Link href={heroData.linkBotonSecundario}>{heroData.textoBotonSecundario}</Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 text-white border-white hover:bg-white/20 hover:text-white" />
            <CarouselNext className="right-4 text-white border-white hover:bg-white/20 hover:text-white" />
        </Carousel>
    )
}

export default Hero