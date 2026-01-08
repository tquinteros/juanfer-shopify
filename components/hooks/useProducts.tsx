import { useQuery, useInfiniteQuery, UseQueryOptions, UseInfiniteQueryOptions } from '@tanstack/react-query';

import { ProductsQuery, ProductsQuerySchema, ProductByIdQuery, ProductByHandleQuery, ProductByHandleQuerySchema } from '@/lib/types/shopify';
import { shopifyFetch } from '@/lib/shopify';
import { GET_PRODUCTS_QUERY, GET_PRODUCTS_BY_COLLECTION_QUERY, GET_PRODUCT_BY_HANDLE_QUERY, GET_PRODUCT_BY_ID_QUERY } from '@/lib/queries';
import { useLanguage } from '@/lib/contexts/language-context';

interface UseProductsOptions {
    first?: number;
    after?: string | null;
    query?: string | null;
    collectionHandle?: string | null;
    language?: string;
}

export function useProducts(
    options: UseProductsOptions = {},
    queryOptions?: Omit<UseQueryOptions<ProductsQuery>, 'queryKey' | 'queryFn'>
) {
    const { first = 10, after = null, query = null, collectionHandle = null, language: languageOverride } = options;
    const { language: contextLanguage } = useLanguage();
    const language = languageOverride ?? contextLanguage;

    return useQuery({
        queryKey: ['products', first, after, query, collectionHandle, language],
        queryFn: async () => {
            if (collectionHandle) {
                const data = await shopifyFetch<{
                    collectionByHandle?: {
                        products: ProductsQuery['products'];
                    };
                }>({
                    query: GET_PRODUCTS_BY_COLLECTION_QUERY,
                    variables: { collectionHandle, first, after },
                    language,
                });

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
                };

                return transformed;
            }

            const data = await shopifyFetch<ProductsQuery>({
                query: GET_PRODUCTS_QUERY,
                variables: { first, after, query },
                language,
            });

            const validated = ProductsQuerySchema.parse(data);
            return validated;
        },
        staleTime: 1000 * 60 * 5,
        ...queryOptions,
    });
}

interface UseInfiniteProductsOptions {
    first?: number;
    query?: string | null;
    collectionHandle?: string | null;
    language?: string;
}

export function useInfiniteProducts(
    options: UseInfiniteProductsOptions = {},
    queryOptions?: Omit<UseInfiniteQueryOptions<ProductsQuery, Error>, 'queryKey' | 'queryFn' | 'getNextPageParam' | 'initialPageParam'>
) {
    const { first = 20, query = null, collectionHandle = null, language: languageOverride } = options;
    const { language: contextLanguage } = useLanguage();
    const language = languageOverride ?? contextLanguage;

    return useInfiniteQuery({
        queryKey: ['products-infinite', first, query, collectionHandle, language],
        queryFn: async ({ pageParam }) => {
            if (collectionHandle) {
                const data = await shopifyFetch<{
                    collectionByHandle?: {
                        products: ProductsQuery['products'];
                    };
                }>({
                    query: GET_PRODUCTS_BY_COLLECTION_QUERY,
                    variables: { 
                        collectionHandle, 
                        first, 
                        after: pageParam || null 
                    },
                    language,
                });

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
                };

                return transformed;
            }

            const data = await shopifyFetch<ProductsQuery>({
                query: GET_PRODUCTS_QUERY,
                variables: { 
                    first, 
                    after: pageParam || null, 
                    query 
                },
                language,
            });

            const validated = ProductsQuerySchema.parse(data);
            return validated;
        },
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => {
            const pageInfo = lastPage.products.pageInfo;
            return pageInfo.hasNextPage ? pageInfo.endCursor : null;
        },
        staleTime: 1000 * 60 * 5,
        ...queryOptions,
    });
}

interface UseProductByHandleOptions {
    handle: string;
    enabled?: boolean;
    language?: string;
}

export function useProductByHandle(
    { handle, enabled = true, language: languageOverride }: UseProductByHandleOptions,
    queryOptions?: Omit<UseQueryOptions<ProductByHandleQuery>, 'queryKey' | 'queryFn'>
) {
    const { language: contextLanguage } = useLanguage();
    const language = languageOverride ?? contextLanguage;

    return useQuery({
        queryKey: ['product', handle, language],
        queryFn: async () => {
            const data = await shopifyFetch<ProductByHandleQuery>({
                query: GET_PRODUCT_BY_HANDLE_QUERY,
                variables: { handle },
                language,
            });
            const validated = ProductByHandleQuerySchema.parse(data);
            return validated;
        },
        enabled: enabled && !!handle,
        staleTime: 1000 * 60 * 5,
        ...queryOptions,
    });
}

interface UseProductByIdOptions {
    id: string;
    enabled?: boolean;
    language?: string; // Optional override - if not provided, uses store language
}

export function useProductById(
    { id, enabled = true, language: languageOverride }: UseProductByIdOptions,
    queryOptions?: Omit<UseQueryOptions<ProductByIdQuery>, 'queryKey' | 'queryFn'>
) {
    const { language: contextLanguage } = useLanguage();
    const language = languageOverride ?? contextLanguage;

    return useQuery({
        queryKey: ['product', id, language],
        queryFn: async () => {
            const data = await shopifyFetch<ProductByIdQuery>({
                query: GET_PRODUCT_BY_ID_QUERY,
                variables: { id },
                language,
            });
            return data;
        },
        enabled: enabled && !!id,
        staleTime: 1000 * 60 * 5,
        ...queryOptions,
    });
}