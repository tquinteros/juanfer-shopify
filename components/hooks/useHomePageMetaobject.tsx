// src/hooks/useHomePageMetaobject.ts
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { shopifyFetch } from '@/lib/shopify';
import { GET_METAOBJECTS_QUERY } from '@/lib/queries';
import { useLanguage } from '@/lib/contexts/language-context';

export interface HomePageMetaobject {
  id: string;
  handle: string;
  type: string;
  fields: Array<{
    key: string;
    value: string | null;
    type: string;
    reference?: {
      image?: {
        url: string;
        altText: string | null;
        width: number;
        height: number;
      };
    };
  }>;
}

export interface HomePageMetaobjectQuery {
  metaobject: HomePageMetaobject | null;
}

export interface HomePageMetaobjectsQuery {
  metaobjects: {
    edges: Array<{
      node: HomePageMetaobject;
    }>;
  };
}

interface UseHomePageMetaobjectOptions {
  language?: string;
}

export function useHomePageMetaobject(
  options: UseHomePageMetaobjectOptions = {},
  queryOptions?: Omit<UseQueryOptions<HomePageMetaobjectsQuery>, 'queryKey' | 'queryFn'>
) {
  const { language: languageOverride } = options;
  const { language: contextLanguage } = useLanguage();
  const language = languageOverride ?? contextLanguage;

  return useQuery({
    queryKey: ['home-page-metaobject', language],
    queryFn: async () => {
      try {
        const metaobjectsData = await shopifyFetch<HomePageMetaobjectsQuery>({
          query: GET_METAOBJECTS_QUERY,
          variables: {
            type: 'home_page',
            first: 10,
          },
          language,
        });

        return metaobjectsData;
      } catch (error) {
        console.error('Error fetching metaobjects:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5,
    ...queryOptions,
  });
}
export function getMetaobjectField(
  metaobject: HomePageMetaobject | null | undefined,
  fieldKey: string
): string | null {
  if (!metaobject) return null;
  const field = metaobject.fields.find((f) => f.key === fieldKey);
  return field?.value ?? null;
}

export function useHomeBannersCat(
  options: UseHomePageMetaobjectOptions = {},
  queryOptions?: Omit<UseQueryOptions<HomePageMetaobjectsQuery>, 'queryKey' | 'queryFn'>
) {
  const { language: languageOverride } = options;
  const { language: contextLanguage } = useLanguage();
  const language = languageOverride ?? contextLanguage;

  return useQuery<HomePageMetaobjectsQuery>({
    queryKey: ['home-banners-categories', language],
    queryFn: async () => {
      try {
        const metaobjectData = await shopifyFetch<HomePageMetaobjectsQuery>({
          query: GET_METAOBJECTS_QUERY,
          variables: {
            type: 'banners_categorias',
            first: 50,
          },
          language,
        });

        return metaobjectData;
      } catch (error) {
        console.error('Error fetching metaobjects:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5,
    ...queryOptions,
  });
}

export function useFeatureSectionMetaobject(
  options: UseHomePageMetaobjectOptions = {},
  queryOptions?: Omit<UseQueryOptions<HomePageMetaobjectsQuery>, 'queryKey' | 'queryFn'>
) {
  const { language: languageOverride } = options;
  const { language: contextLanguage } = useLanguage();
  const language = languageOverride ?? contextLanguage;

  return useQuery<HomePageMetaobjectsQuery>({
    queryKey: ['feature-section', language],
    queryFn: async () => {
      try {
        const metaobjectData = await shopifyFetch<HomePageMetaobjectsQuery>({
          query: GET_METAOBJECTS_QUERY,
          variables: {
            type: 'feature_section',
            first: 10,
          },
          language,
        });
        return metaobjectData;
      } catch (error) {
        console.error('Error fetching feature section metaobject:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5,
    ...queryOptions,
  });
}