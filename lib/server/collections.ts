'use server'

import { shopifyFetch } from '@/lib/shopify'
import { GET_COLLECTIONS_QUERY } from '@/lib/queries'
import { CollectionsQuery, CollectionsQuerySchema } from '@/lib/types/shopify'
import type { SimplifiedCollection, SimplifiedCollectionsResponse } from '@/components/hooks/useCollections'

function transformCollection(collection: CollectionsQuery['collections']['edges'][0]['node']): SimplifiedCollection {
  const navigationMetafield = collection.metafields
    ?.filter((metafield): metafield is NonNullable<typeof metafield> => metafield !== null)
    .find(
      (metafield) => metafield.namespace === 'custom' && metafield.key === 'navigation'
    )

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

interface GetCollectionsByMetadataParams {
  metadataValue: string
  first?: number
  after?: string | null
  language?: string
}

export async function getCollectionsByMetadataAction(
  params: GetCollectionsByMetadataParams
): Promise<SimplifiedCollectionsResponse> {
  const { metadataValue, first = 50, after = null, language = 'ES' } = params

  try {
    const data = await shopifyFetch<CollectionsQuery>({
      query: GET_COLLECTIONS_QUERY,
      variables: { first, after },
      language,
    })

    const validated = CollectionsQuerySchema.parse(data)

    const filteredCollections = validated.collections.edges
      .map(({ node }) => transformCollection(node))
      .filter((collection) => collection.metadata?.value === metadataValue)

    return {
      collections: filteredCollections,
      pageInfo: validated.collections.pageInfo,
    }
  } catch (error) {
    console.error('Error fetching collections by metadata:', error)
    throw new Error('Failed to fetch collections by metadata')
  }
}

