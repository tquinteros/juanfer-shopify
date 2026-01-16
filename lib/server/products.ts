'use server'

import { shopifyFetch } from '@/lib/shopify'
import { GET_PRODUCTS_BY_COLLECTION_QUERY } from '@/lib/queries'
import { ProductsQuery, ProductsQuerySchema } from '@/lib/types/shopify'

interface GetFeaturedProductsParams {
    first?: number
    language?: string
}

export async function getFeaturedProductsAction(
    params: GetFeaturedProductsParams = {}
): Promise<ProductsQuery> {
    const { first = 8, language = 'ES' } = params

    try {
        const data = await shopifyFetch<{
            collectionByHandle?: {
                products: ProductsQuery['products']
            }
        }>({
            query: GET_PRODUCTS_BY_COLLECTION_QUERY,
            variables: {
                collectionHandle: 'home-productos-destacados',
                first,
                after: null,
            },
            language,
        })
        const transformed: ProductsQuery = {
            products: data.collectionByHandle?.products || {
                edges: [],
                pageInfo: {
                    hasNextPage: false,
                    hasPreviousPage: false,
                    startCursor: null,
                    endCursor: null,
                },
            },
        }

        return ProductsQuerySchema.parse(transformed)
    } catch (error) {
        console.error('Error fetching featured products:', error)
        throw new Error('Failed to fetch featured products')
    }
}
