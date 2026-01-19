'use server'

import { shopifyFetch } from '@/lib/shopify'
import { GET_PRODUCTS_BY_COLLECTION_QUERY, GET_PRODUCTS_QUERY, GET_PRODUCT_BY_HANDLE_QUERY } from '@/lib/queries'
import { ProductsQuery, ProductsQuerySchema, ProductByHandleQuery, ProductByHandleQuerySchema } from '@/lib/types/shopify'

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

interface GetProductsParams {
    first?: number
    after?: string | null
    query?: string | null
    collectionHandle?: string | null
    language?: string
}

export async function getProductsAction(
    params: GetProductsParams = {}
): Promise<ProductsQuery> {
    const { first = 20, after = null, query = null, collectionHandle = null, language = 'ES' } = params

    try {
        if (collectionHandle) {
            const data = await shopifyFetch<{
                collectionByHandle?: {
                    products: ProductsQuery['products']
                }
            }>({
                query: GET_PRODUCTS_BY_COLLECTION_QUERY,
                variables: {
                    collectionHandle,
                    first,
                    after
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
                        endCursor: null
                    }
                }
            }

            return ProductsQuerySchema.parse(transformed)
        }

        const data = await shopifyFetch<ProductsQuery>({
            query: GET_PRODUCTS_QUERY,
            variables: {
                first,
                after,
                query
            },
            language,
        })

        return ProductsQuerySchema.parse(data)
    } catch (error) {
        console.error('Error fetching products:', error)
        throw new Error('Failed to fetch products')
    }
}

interface GetProductByHandleParams {
    handle: string
    language?: string
}

export async function getProductByHandleAction(
    params: GetProductByHandleParams
): Promise<ProductByHandleQuery> {
    const { handle, language = 'ES' } = params

    try {
        const data = await shopifyFetch<ProductByHandleQuery>({
            query: GET_PRODUCT_BY_HANDLE_QUERY,
            variables: { handle },
            language,
        })
        console.log(data, "product by handle data server")
        return ProductByHandleQuerySchema.parse(data)
    } catch (error) {
        console.error('Error fetching product by handle:', error)
        throw new Error('Failed to fetch product by handle')
    }
}
