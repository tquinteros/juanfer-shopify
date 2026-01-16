'use server'

import { shopifyFetch } from '@/lib/shopify'
import { GET_METAOBJECTS_QUERY } from '@/lib/queries'
import type { HomePageMetaobjectsQuery } from '@/components/hooks/useHomePageMetaobject'

interface GetMetaobjectsParams {
    type: string
    first?: number
    language?: string
}

export async function getMetaobjectsAction(
    params: GetMetaobjectsParams
): Promise<HomePageMetaobjectsQuery> {
    const { type, first = 10, language = 'ES' } = params

    try {
        const data = await shopifyFetch<HomePageMetaobjectsQuery>({
            query: GET_METAOBJECTS_QUERY,
            variables: {
                type,
                first,
            },
            language,
        })

        return data
    } catch (error) {
        console.error(`Error fetching metaobjects (${type}):`, error)
        throw new Error(`Failed to fetch metaobjects (${type})`)
    }
}

export async function getHomeBannersCategoriesAction(
    params: { language?: string } = {}
): Promise<HomePageMetaobjectsQuery> {
    const { language = 'ES' } = params

    return getMetaobjectsAction({
        type: 'banners_categorias',
        first: 50,
        language,
    })
}

export async function getFeatureSectionAction(
    params: { language?: string } = {}
): Promise<HomePageMetaobjectsQuery> {
    const { language = 'ES' } = params

    return getMetaobjectsAction({
        type: 'feature_section',
        first: 10,
        language,
    })
}

export async function getHomePageMetaobjectAction(
    params: { language?: string } = {}
): Promise<HomePageMetaobjectsQuery> {
    const { language = 'ES' } = params

    return getMetaobjectsAction({
        type: 'home_page',
        first: 10,
        language,
    })
}

