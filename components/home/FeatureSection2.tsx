"use client"
import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useFeatureSectionMetaobjectServer, HomePageMetaobject } from '../hooks/useHomePageMetaobject'

const FeatureSection2 = () => {
    const { data: metaobjectData, isLoading: metaobjectLoading } = useFeatureSectionMetaobjectServer()
    console.log(metaobjectData, "feature section data")
    const getFieldValue = (fields: HomePageMetaobject['fields'], key: string): string | null => {
        const field = fields.find(f => f.key === key)
        return field?.value || null
    }

    const getImage = (fields: HomePageMetaobject['fields']) => {
        const imagenField = fields.find(f => f.key === "imagen")
        return imagenField?.reference?.image || null
    }

    const featureSectionNode = metaobjectData?.metaobjects?.edges?.[1]?.node
    const featureSectionFields = featureSectionNode?.fields || []

    const featureImage = getImage(featureSectionFields)

    const featureData = {
        titulo: getFieldValue(featureSectionFields, "titulo") || "The 2026 Colour Edit",
        descripcion: getFieldValue(featureSectionFields, "descripcion") || "Our 2026 Edit is inspired by colour before the rules. It's about designing your home like no one is watching and letting colour lead the way.",
        textoBoton: getFieldValue(featureSectionFields, "texto_boton") || "Learn more",
        linkBoton: getFieldValue(featureSectionFields, "link_boton") || "/collections/2026-colour-edit",
    }

    return (
        <section className="w-full py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div className="flex flex-col justify-center space-y-6 px-4 lg:px-8">
                    {metaobjectLoading ? (
                        <>
                            <div className="h-12 bg-muted/50 rounded mb-4 animate-pulse w-3/4" />
                            <div className="h-6 bg-muted/50 rounded mb-6 animate-pulse w-full" />
                            <div className="h-6 bg-muted/50 rounded mb-8 animate-pulse w-5/6" />
                            <div className="h-12 w-40 bg-muted/50 rounded animate-pulse" />
                        </>
                    ) : (
                        <>
                            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                                {featureData.titulo}
                            </h2>
                            <p className="text-base md:text-lg leading-relaxed max-w-xl">
                                {featureData.descripcion}
                            </p>
                            <div className="pt-2">
                                <Button
                                    asChild
                                    size="lg"
                                    className="px-8 py-6 text-base"
                                >
                                    <Link href={featureData.linkBoton}>{featureData.textoBoton}</Link>
                                </Button>
                            </div>
                        </>
                    )}
                </div>
                <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded">
                    {metaobjectLoading ? (
                        <div className="w-full h-full bg-muted/50 animate-pulse" />
                    ) : featureImage ? (
                        <Image
                            src={featureImage.url}
                            alt={featureImage.altText || featureData.titulo}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 640px"
                            priority
                        />
                    ) : (
                        <Image
                            src="https://www.lick.com/_next/image?url=https%3A%2F%2Feu-central-1.graphassets.com%2FALdVU93uSfuiaR3RsZgFXz%2Fcompress%3Dmetadata%3Atrue%2Fauto_image%2Fresize%3Dwidth%3A1291%2Cfit%3Aclip%2Fcmhf3ptrz5ojb07ugul9c12ug&w=1280&q=100"
                            alt="The 2026 Colour Edit - Colorful paint brushes"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 640px"
                            priority
                        />
                    )}
                </div>
            </div>
        </section>
    )
}

export default FeatureSection2