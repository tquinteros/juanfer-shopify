import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { shopifyFetch } from '@/lib/shopify';
import { GET_MENU_BY_HANDLE_QUERY } from '@/lib/queries';
import { MenuByHandleQuery, MenuByHandleQuerySchema } from '@/lib/types/shopify';
import { useLanguage } from '@/lib/contexts/language-context';
import { getMenuByHandleAction } from '@/lib/server/header';

interface UseMenuByHandleOptions {
  handle: string;
  enabled?: boolean;
  language?: string;
}

export function useMenuByHandle(
  { handle, enabled = true, language: languageOverride }: UseMenuByHandleOptions,
  queryOptions?: Omit<UseQueryOptions<MenuByHandleQuery>, 'queryKey' | 'queryFn'>
) {
  const { language: contextLanguage } = useLanguage();
  const language = languageOverride ?? contextLanguage;

  return useQuery({
    queryKey: ['menu', handle, language],
    queryFn: async () => {
      const data = await shopifyFetch<MenuByHandleQuery>({
        query: GET_MENU_BY_HANDLE_QUERY,
        variables: { handle },
        language,
      });

      const validated = MenuByHandleQuerySchema.parse(data);
      return validated;
    },
    enabled: enabled && !!handle,
    staleTime: 1000 * 60 * 5, 
    ...queryOptions,
  });
}

export function useMenuByHandleServer(
  { handle, enabled = true, language: languageOverride }: UseMenuByHandleOptions,
  queryOptions?: Omit<UseQueryOptions<MenuByHandleQuery, Error>, 'queryKey' | 'queryFn'>
) {
  const { language: contextLanguage } = useLanguage();
  const language = languageOverride ?? contextLanguage;

  return useQuery({
    queryKey: ['menu', handle, language],
    queryFn: async () => {
      return await getMenuByHandleAction({ handle, language });
    },
    enabled: enabled && !!handle,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    ...queryOptions,
  });
}

