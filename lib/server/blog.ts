'use server'

import { shopifyFetch } from '@/lib/shopify'
import {
  GET_ARTICLES_QUERY,
  GET_ARTICLE_BY_ID_QUERY,
  GET_ARTICLES_TAGS_QUERY,
} from '@/lib/queries/blogs'
import {
  ArticlesQuery,
  ArticlesQuerySchema,
  ArticleByIdQuery,
  ArticleByIdQuerySchema,
  ArticlesTagsQuery,
  ArticlesTagsQuerySchema,
} from '@/lib/types/blogs'

interface GetArticlesParams {
  first?: number
  after?: string | null
  query?: string | null
  language?: string
}

export async function getArticlesAction(
  params: GetArticlesParams = {}
): Promise<ArticlesQuery> {
  const { first = 20, after = null, query = null, language = 'ES' } = params

  try {
    const data = await shopifyFetch<ArticlesQuery>({
      query: GET_ARTICLES_QUERY,
      variables: {
        first,
        after,
        query
      },
      language,
    })

    return ArticlesQuerySchema.parse(data)
  } catch (error) {
    console.error('Error fetching articles:', error)
    throw new Error('Failed to fetch articles')
  }
}

interface GetArticleByIdParams {
  id: string
  language?: string
}

export async function getArticleByIdAction(
  params: GetArticleByIdParams
): Promise<ArticleByIdQuery> {
  const { id, language = 'ES' } = params

  const articleId = id.startsWith('gid://')
    ? id
    : `gid://shopify/Article/${id}`

  try {
    const data = await shopifyFetch<ArticleByIdQuery>({
      query: GET_ARTICLE_BY_ID_QUERY,
      variables: { id: articleId },
      language,
    })

    return ArticleByIdQuerySchema.parse(data)
  } catch (error) {
    console.error('Error fetching article by id:', error)
    throw new Error('Failed to fetch article by id')
  }
}

interface GetArticlesTagsParams {
  first?: number
  after?: string | null
  language?: string
}

export async function getArticlesTagsAction(
  params: GetArticlesTagsParams = {}
): Promise<ArticlesTagsQuery> {
  const { first = 250, after = null, language = 'ES' } = params

  try {
    const data = await shopifyFetch<ArticlesTagsQuery>({
      query: GET_ARTICLES_TAGS_QUERY,
      variables: { first, after },
      language,
    })

    return ArticlesTagsQuerySchema.parse(data)
  } catch (error) {
    console.error('Error fetching articles tags:', error)
    throw new Error('Failed to fetch articles tags')
  }
}

