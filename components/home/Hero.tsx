"use client"
import React from 'react'
import { useLanguage } from '@/lib/contexts/language-context'
import { translations } from '@/lib/i18n/translations'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useHomePageMetaobject, HomePageMetaobject } from '../hooks/useHomePageMetaobject'

const Hero = () => {
    const { language } = useLanguage()
    const t = translations[language]
    const { data: metaobjectData, isLoading: metaobjectLoading } = useHomePageMetaobject()

    const getFieldValue = (fields: HomePageMetaobject['fields'], key: string): string | null => {
        const field = fields.find(f => f.key === key)
        return field?.value || null
    }

    const getImage = (fields: HomePageMetaobject['fields']) => {
        const imagenField = fields.find(f => f.key === "imagen_hero")
        return imagenField?.reference?.image || null
    }

    const heroNode = metaobjectData?.metaobjects?.edges?.[0]?.node
    const heroFields = heroNode?.fields || []

    const heroImage = getImage(heroFields)

    const heroData = {
        titulo: getFieldValue(heroFields, "titulo_principal") || t.home.heroTitle,
        descripcion: getFieldValue(heroFields, "descripcion_principal") || t.home.heroDescription,
        textoBotonPrimario: getFieldValue(heroFields, "texto_boton_primario") || t.home.shopNow,
        linkBotonPrimario: getFieldValue(heroFields, "link_boton_primario") || "/products",
        textoBotonSecundario: getFieldValue(heroFields, "texto_boton_secundario") || t.home.viewSamples,
        linkBotonSecundario: getFieldValue(heroFields, "link_boton_secundario") || "/samples",
    }

    return (
        <section
            className="relative flex items-center overflow-hidden"
            style={{
                minHeight: '60vh',
                height: '60vh',
                maxHeight: '700px',
                ...(heroImage && {
                    backgroundImage: `url(${heroImage.url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                })
            }}
        >
            {heroImage && (
                <div className="absolute inset-0 bg-black/40" />
            )}

            <div className="px-20 w-full relative z-10">
                <div className="max-w-2xl">
                    {metaobjectLoading ? (
                        <>
                            <div className="h-12 bg-muted/50 rounded mb-4 animate-pulse w-3/4" />
                            <div className="h-6 bg-muted/50 rounded mb-6 animate-pulse w-full" />
                            <div className="h-6 bg-muted/50 rounded mb-8 animate-pulse w-5/6" />
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="h-12 w-32 bg-muted/50 rounded animate-pulse" />
                                <div className="h-12 w-32 bg-muted/50 rounded animate-pulse" />
                            </div>
                        </>
                    ) : (
                        <>
                            <h1 className="text-2xl md:text-4xl lg:text-5xl text-white font-bold mb-4  drop-shadow-lg">
                                {heroData.titulo}
                            </h1>
                            <p className="text-sm md:text-base lg:text-lg text-white mb-6 drop-shadow-md leading-relaxed">
                                {heroData.descripcion}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button asChild size="lg" className="">
                                    <Link href={heroData.linkBotonPrimario}>{heroData.textoBotonPrimario}</Link>
                                </Button>
                                <Button asChild size="lg" variant="outline" className="">
                                    <Link href={heroData.linkBotonSecundario}>{heroData.textoBotonSecundario}</Link>
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    )
}

export default Hero