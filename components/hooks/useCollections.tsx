// src/hooks/useCollections.ts
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import {
  CollectionsQuery,
  CollectionsQuerySchema,
  CollectionByHandleQuery,
  CollectionByIdQuery,
  Collection,
} from '@/lib/types/shopify';
import { shopifyFetch } from '@/lib/shopify';
import {
  GET_COLLECTIONS_QUERY,
  GET_COLLECTION_BY_HANDLE_QUERY,
  GET_COLLECTION_BY_ID_QUERY,
} from '@/lib/queries';
import { useLanguage } from '@/lib/contexts/language-context';

// Simplified collection type
export interface SimplifiedCollection {
  id: string;
  title: string;
  handle: string;
  image: {
    url: string;
    altText: string | null;
  } | null;
  hasProducts: boolean;
  metadata: {
    value: string;
  } | null;
}

function transformCollection(collection: Collection): SimplifiedCollection {
  const navigationMetafield = collection.metafields
    ?.filter((metafield): metafield is NonNullable<typeof metafield> => metafield !== null)
    .find(
      (metafield) => metafield.namespace === 'custom' && metafield.key === 'navigation'
    );

  return {
    id: collection.id,
    title: collection.title,
    handle: collection.handle,
    image: collection.image
      ? {
        url: collection.image.url,
        altText: collection.image.altText,
      }
      : null,
    hasProducts: !!(collection.products && collection.products.edges.length > 0),
    metadata: navigationMetafield
      ? {
        value: navigationMetafield.value,
      }
      : null,
  }
}

interface UseCollectionsOptions {
  first?: number;
  after?: string | null;
  language?: string;
}

export interface SimplifiedCollectionsResponse {
  collections: SimplifiedCollection[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string | null;
    endCursor: string | null;
  };
}

export function useCollections(
  options: UseCollectionsOptions = {},
  queryOptions?: Omit<UseQueryOptions<SimplifiedCollectionsResponse>, 'queryKey' | 'queryFn'>
) {
  const { first = 10, after = null, language: languageOverride } = options;
  const { language: contextLanguage } = useLanguage();
  const language = languageOverride ?? contextLanguage;

  return useQuery({
    queryKey: ['collections', first, after, language],
    queryFn: async () => {
      const data = await shopifyFetch<CollectionsQuery>({
        query: GET_COLLECTIONS_QUERY,
        variables: { first, after },
        language,
      });
      console.log(data, "responsedata")

      try {
        const validated = CollectionsQuerySchema.parse(data);
        console.log('Validation successful:', validated);

        return {
          collections: validated.collections.edges.map(({ node }) => transformCollection(node)),
          pageInfo: validated.collections.pageInfo,
        };
      } catch (error) {
        console.error('Validation error:', error);
        console.error('Data that failed validation:', JSON.stringify(data, null, 2));
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5,
    ...queryOptions,
  });
}

interface UseCollectionByHandleOptions {
  handle: string;
  first?: number;
  after?: string | null;
  enabled?: boolean;
  language?: string;
}

export function useCollectionByHandle(
  { handle, first = 10, after = null, enabled = true, language: languageOverride }: UseCollectionByHandleOptions,
  queryOptions?: Omit<UseQueryOptions<CollectionByHandleQuery>, 'queryKey' | 'queryFn'>
) {
  const { language: contextLanguage } = useLanguage();
  const language = languageOverride ?? contextLanguage;

  return useQuery({
    queryKey: ['collection', handle, first, after, language],
    queryFn: async () => {
      const data = await shopifyFetch<CollectionByHandleQuery>({
        query: GET_COLLECTION_BY_HANDLE_QUERY,
        variables: { handle, first, after },
        language,
      });
      return data;
    },
    enabled: enabled && !!handle,
    staleTime: 1000 * 60 * 5,
    ...queryOptions,
  });
}

interface UseCollectionByIdOptions {
  id: string;
  first?: number;
  after?: string | null;
  enabled?: boolean;
  language?: string;
}

export function useCollectionById(
  { id, first = 10, after = null, enabled = true, language: languageOverride }: UseCollectionByIdOptions,
  queryOptions?: Omit<UseQueryOptions<CollectionByIdQuery>, 'queryKey' | 'queryFn'>
) {
  const { language: contextLanguage } = useLanguage();
  const language = languageOverride ?? contextLanguage;

  return useQuery({
    queryKey: ['collection', id, first, after, language],
    queryFn: async () => {
      const data = await shopifyFetch<CollectionByIdQuery>({
        query: GET_COLLECTION_BY_ID_QUERY,
        variables: { id, first, after },
        language,
      });
      return data;
    },
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 5,
    ...queryOptions,
  });
}

interface UseCollectionsByMetadataOptions {
  metadataValue: string;
  first?: number;
  after?: string | null;
  language?: string;
}

export function useCollectionsByMetadata(
  { metadataValue, first = 50, after = null, language: languageOverride }: UseCollectionsByMetadataOptions,
  queryOptions?: Omit<UseQueryOptions<SimplifiedCollectionsResponse>, 'queryKey' | 'queryFn'>
) {
  const { language: contextLanguage } = useLanguage();
  const language = languageOverride ?? contextLanguage;

  return useQuery({
    queryKey: ['collections-by-metadata', metadataValue, first, after, language],
    queryFn: async () => {
      const data = await shopifyFetch<CollectionsQuery>({
        query: GET_COLLECTIONS_QUERY,
        variables: { first, after },
        language,
      });

      const validated = CollectionsQuerySchema.parse(data);

      // Filter collections by metadata value
      const filteredCollections = validated.collections.edges
        .map(({ node }) => transformCollection(node))
        .filter((collection) => collection.metadata?.value === metadataValue);

      return {
        collections: filteredCollections,
        pageInfo: validated.collections.pageInfo,
      };
    },
    staleTime: 1000 * 60 * 5,
    ...queryOptions,
  });
}

