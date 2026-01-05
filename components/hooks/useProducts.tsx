// src/hooks/useProducts.ts
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { ProductsQuery, ProductsQuerySchema } from '@/lib/types/shopify';
import { shopifyFetch } from '@/lib/shopify';
import { GET_PRODUCTS_QUERY, GET_PRODUCT_BY_HANDLE_QUERY } from '@/lib/queries';

interface UseProductsOptions {
    first?: number;
    after?: string | null;
}

export function useProducts(
    options: UseProductsOptions = {},
    queryOptions?: Omit<UseQueryOptions<ProductsQuery>, 'queryKey' | 'queryFn'>
) {
    const { first = 10, after = null } = options;

    return useQuery({
        queryKey: ['products', first, after],
        queryFn: async () => {
            const data = await shopifyFetch<ProductsQuery>({
                query: GET_PRODUCTS_QUERY,
                variables: { first, after },
            });

            // Validar con Zod
            const validated = ProductsQuerySchema.parse(data);
            return validated;
        },
        staleTime: 1000 * 60 * 5, // 5 minutos
        ...queryOptions,
    });
}

interface UseProductByHandleOptions {
    handle: string;
    enabled?: boolean;
}

export function useProductByHandle(
    { handle, enabled = true }: UseProductByHandleOptions,
    queryOptions?: Omit<UseQueryOptions<ProductsQuery>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: ['product', handle],
        queryFn: async () => {
            const data = await shopifyFetch<ProductsQuery>({
                query: GET_PRODUCT_BY_HANDLE_QUERY,
                variables: { handle },
            });
            return data;
        },
        enabled: enabled && !!handle,
        staleTime: 1000 * 60 * 5,
        ...queryOptions,
    });
}