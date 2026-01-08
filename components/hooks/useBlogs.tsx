import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { shopifyFetch } from '@/lib/shopify';
import {
  GET_BLOGS_QUERY,
  GET_BLOG_BY_HANDLE_QUERY,
  GET_ARTICLES_QUERY,
  GET_ARTICLE_BY_HANDLE_QUERY,
  GET_ARTICLE_BY_ID_QUERY,
} from '@/lib/queries/blogs';
import {
  BlogsQuery,
  BlogsQuerySchema,
  BlogByHandleQuery,
  ArticlesQuery,
  ArticlesQuerySchema,
  ArticleByHandleQuery,
  ArticleByIdQuery,
  ArticleByIdQuerySchema,
} from '@/lib/types/blogs';
import { useLanguage } from '@/lib/contexts/language-context';

interface UseBlogsOptions {
  first?: number;
  after?: string | null;
  language?: string;
}

export function useBlogs(
  options: UseBlogsOptions = {},
  queryOptions?: Omit<UseQueryOptions<BlogsQuery>, 'queryKey' | 'queryFn'>
) {
  const { first = 10, after = null, language: languageOverride } = options;
  const { language: contextLanguage } = useLanguage();
  const language = languageOverride ?? contextLanguage;

  return useQuery({
    queryKey: ['blogs', first, after, language],
    queryFn: async () => {
      const data = await shopifyFetch<BlogsQuery>({
        query: GET_BLOGS_QUERY,
        variables: { first, after },
        language,
      });

      const validated = BlogsQuerySchema.parse(data);
      return validated;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...queryOptions,
  });
}

interface UseBlogByHandleOptions {
  handle: string;
  first?: number;
  after?: string | null;
  enabled?: boolean;
  language?: string;
}

export function useBlogByHandle(
  { handle, first = 10, after = null, enabled = true, language: languageOverride }: UseBlogByHandleOptions,
  queryOptions?: Omit<UseQueryOptions<BlogByHandleQuery>, 'queryKey' | 'queryFn'>
) {
  const { language: contextLanguage } = useLanguage();
  const language = languageOverride ?? contextLanguage;

  return useQuery({
    queryKey: ['blog', handle, first, after, language],
    queryFn: async () => {
      const data = await shopifyFetch<BlogByHandleQuery>({
        query: GET_BLOG_BY_HANDLE_QUERY,
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

interface UseArticlesOptions {
  first?: number;
  after?: string | null;
  query?: string | null;
  language?: string;
}

export function useArticles(
  options: UseArticlesOptions = {},
  queryOptions?: Omit<UseQueryOptions<ArticlesQuery>, 'queryKey' | 'queryFn'>
) {
  const { first = 10, after = null, query = null, language: languageOverride } = options;
  const { language: contextLanguage } = useLanguage();
  const language = languageOverride ?? contextLanguage;

  return useQuery({
    queryKey: ['articles', first, after, query, language],
    queryFn: async () => {
      const data = await shopifyFetch<ArticlesQuery>({
        query: GET_ARTICLES_QUERY,
        variables: { first, after, query },
        language,
      });

      const validated = ArticlesQuerySchema.parse(data);
      return validated;
    },
    staleTime: 1000 * 60 * 5,
    ...queryOptions,
  });
}

interface UseArticleByHandleOptions {
  blogHandle: string;
  articleHandle: string;
  enabled?: boolean;
  language?: string;
}

export function useArticleByHandle(
  { blogHandle, articleHandle, enabled = true, language: languageOverride }: UseArticleByHandleOptions,
  queryOptions?: Omit<UseQueryOptions<ArticleByHandleQuery>, 'queryKey' | 'queryFn'>
) {
  const { language: contextLanguage } = useLanguage();
  const language = languageOverride ?? contextLanguage;

  return useQuery({
    queryKey: ['article', blogHandle, articleHandle, language],
    queryFn: async () => {
      const data = await shopifyFetch<ArticleByHandleQuery>({
        query: GET_ARTICLE_BY_HANDLE_QUERY,
        variables: { blogHandle, articleHandle },
        language,
      });
      return data;
    },
    enabled: enabled && !!blogHandle && !!articleHandle,
    staleTime: 1000 * 60 * 5,
    ...queryOptions,
  });
}

interface UseArticleByIdOptions {
  id: string;
  enabled?: boolean;
  language?: string;
}

export function useArticleById(
  { id, enabled = true, language: languageOverride }: UseArticleByIdOptions,
  queryOptions?: Omit<UseQueryOptions<ArticleByIdQuery>, 'queryKey' | 'queryFn'>
) {
  // Convert numeric ID to Shopify GID format if needed
  const articleId = id.startsWith('gid://')
    ? id
    : `gid://shopify/Article/${id}`;
  const { language: contextLanguage } = useLanguage();
  const language = languageOverride ?? contextLanguage;
  return useQuery({
    queryKey: ['articleById', articleId, language],
    queryFn: async () => {
      const data = await shopifyFetch<ArticleByIdQuery>({
        query: GET_ARTICLE_BY_ID_QUERY,
        variables: { id: articleId },
        language,
      });

      const validated = ArticleByIdQuerySchema.parse(data);
      return validated;
    },
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 5,
    ...queryOptions,
  });
}

