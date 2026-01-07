import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { ProductsQuery, ProductsQuerySchema, ProductByIdQuery } from '@/lib/types/shopify';
import { shopifyFetch } from '@/lib/shopify';
import { GET_PRODUCTS_QUERY, GET_PRODUCT_BY_HANDLE_QUERY, GET_PRODUCT_BY_ID_QUERY } from '@/lib/queries';
import { useLanguage } from '@/lib/contexts/language-context';

interface UseProductsOptions {
    first?: number;
    after?: string | null;
    query?: string | null;
    language?: string;
}

export function useProducts(
    options: UseProductsOptions = {},
    queryOptions?: Omit<UseQueryOptions<ProductsQuery>, 'queryKey' | 'queryFn'>
) {
    const { first = 10, after = null, query = null, language: languageOverride } = options;
    const { language: contextLanguage } = useLanguage();
    const language = languageOverride ?? contextLanguage;

    return useQuery({
        queryKey: ['products', first, after, query, language],
        queryFn: async () => {
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

interface UseProductByHandleOptions {
    handle: string;
    enabled?: boolean;
    language?: string;
}

export function useProductByHandle(
    { handle, enabled = true, language: languageOverride }: UseProductByHandleOptions,
    queryOptions?: Omit<UseQueryOptions<ProductsQuery>, 'queryKey' | 'queryFn'>
) {
    const { language: contextLanguage } = useLanguage();
    const language = languageOverride ?? contextLanguage;

    return useQuery({
        queryKey: ['product', handle, language],
        queryFn: async () => {
            const data = await shopifyFetch<ProductsQuery>({
                query: GET_PRODUCT_BY_HANDLE_QUERY,
                variables: { handle },
                language,
            });
            return data;
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