import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { shopifyFetch } from '@/lib/shopify';
import { GET_PAGE_BY_HANDLE_QUERY } from '@/lib/queries';
import { PageByHandleQuery, PageByHandleQuerySchema } from '@/lib/types/shopify';
import { useLanguage } from '@/lib/contexts/language-context';

interface UsePageByHandleOptions {
  handle: string;
  enabled?: boolean;
  language?: string;
}

export function usePageByHandle(
  { handle, enabled = true, language: languageOverride }: UsePageByHandleOptions,
  queryOptions?: Omit<UseQueryOptions<PageByHandleQuery>, 'queryKey' | 'queryFn'>
) {
  const { language: contextLanguage } = useLanguage();
  const language = languageOverride ?? contextLanguage;

  return useQuery({
    queryKey: ['page', handle, language],
    queryFn: async () => {
      const data = await shopifyFetch<PageByHandleQuery>({
        query: GET_PAGE_BY_HANDLE_QUERY,
        variables: { handle },
        language,
      });

      const validated = PageByHandleQuerySchema.parse(data);
      return validated;
    },
    enabled: enabled && !!handle,
    staleTime: 1000 * 60 * 5, 
    ...queryOptions,
  });
}

