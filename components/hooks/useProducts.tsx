import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { ProductsQuery, ProductsQuerySchema, ProductByIdQuery } from '@/lib/types/shopify';
import { shopifyFetch } from '@/lib/shopify';
import { GET_PRODUCTS_QUERY, GET_PRODUCT_BY_HANDLE_QUERY, GET_PRODUCT_BY_ID_QUERY } from '@/lib/queries';

interface UseProductsOptions {
    first?: number;
    after?: string | null;
    query?: string | null;
}

export function useProducts(
    options: UseProductsOptions = {},
    queryOptions?: Omit<UseQueryOptions<ProductsQuery>, 'queryKey' | 'queryFn'>
) {
    const { first = 10, after = null, query = null } = options;

    return useQuery({
        queryKey: ['products', first, after, query],
        queryFn: async () => {
            const data = await shopifyFetch<ProductsQuery>({
                query: GET_PRODUCTS_QUERY,
                variables: { first, after, query },
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

interface UseProductByIdOptions {
    id: string;
    enabled?: boolean;
}

export function useProductById(
    { id, enabled = true }: UseProductByIdOptions,
    queryOptions?: Omit<UseQueryOptions<ProductByIdQuery>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: ['product', id],
        queryFn: async () => {
            const data = await shopifyFetch<ProductByIdQuery>({
                query: GET_PRODUCT_BY_ID_QUERY,
                variables: { id },
            });
            return data;
        },
        enabled: enabled && !!id,
        staleTime: 1000 * 60 * 5,
        ...queryOptions,
    });
}