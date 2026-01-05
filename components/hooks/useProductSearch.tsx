import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { ProductsQuery, ProductsQuerySchema } from '@/lib/types/shopify';
import { shopifyFetch } from '@/lib/shopify';
import { GET_PRODUCTS_QUERY } from '@/lib/queries';

interface UseProductSearchOptions {
    query: string;
    first?: number;
    enabled?: boolean;
}

export function useProductSearch(
    { query, first = 5, enabled = true }: UseProductSearchOptions,
    queryOptions?: Omit<UseQueryOptions<ProductsQuery>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: ['productSearch', query, first],
        queryFn: async () => {
            const data = await shopifyFetch<ProductsQuery>({
                query: GET_PRODUCTS_QUERY,
                variables: { 
                    first,
                    query: `title:*${query}* OR description:*${query}*`,
                },
            });

            const validated = ProductsQuerySchema.parse(data);
            return validated;
        },
        enabled: enabled && query.length >= 2,
        staleTime: 1000 * 30, // 30 seconds for search results
        ...queryOptions,
    });
}

