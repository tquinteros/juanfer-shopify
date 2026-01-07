import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { ProductsQuery, ProductsQuerySchema } from '@/lib/types/shopify';
import { shopifyFetch } from '@/lib/shopify';
import { GET_PRODUCTS_QUERY } from '@/lib/queries';
import { useLanguage } from '@/lib/contexts/language-context';

interface UseProductSearchOptions {
    query: string;
    first?: number;
    enabled?: boolean;
    language?: string; // Optional override - if not provided, uses store language
}

export function useProductSearch(
    { query, first = 5, enabled = true, language: languageOverride }: UseProductSearchOptions,
    queryOptions?: Omit<UseQueryOptions<ProductsQuery>, 'queryKey' | 'queryFn'>
) {
    const { language: contextLanguage } = useLanguage();
    const language = languageOverride ?? contextLanguage;

    return useQuery({
        queryKey: ['productSearch', query, first, language],
        queryFn: async () => {
            const data = await shopifyFetch<ProductsQuery>({
                query: GET_PRODUCTS_QUERY,
                variables: { 
                    first,
                    query: `title:*${query}* OR description:*${query}*`,
                },
                language,
            });

            const validated = ProductsQuerySchema.parse(data);
            return validated;
        },
        enabled: enabled && query.length >= 2,
        staleTime: 1000 * 30, // 30 seconds for search results
        ...queryOptions,
    });
}

