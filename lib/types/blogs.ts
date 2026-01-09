import { z } from 'zod';

// Author Schema
export const AuthorSchema = z.object({
  name: z.string(),
});

export type Author = z.infer<typeof AuthorSchema>;

// Image Schema
export const BlogImageSchema = z.object({
  url: z.string().url(),
  altText: z.string().nullable(),
  width: z.number().optional(),
  height: z.number().optional(),
});

export type BlogImage = z.infer<typeof BlogImageSchema>;

// Blog Schema
export const BlogSchema = z.object({
  id: z.string(),
  title: z.string(),
  handle: z.string(),
});

export type Blog = z.infer<typeof BlogSchema>;

// Blog Edge Schema
export const BlogEdgeSchema = z.object({
  node: BlogSchema,
  cursor: z.string(),
});

export type BlogEdge = z.infer<typeof BlogEdgeSchema>;

// Page Info Schema
export const PageInfoSchema = z.object({
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
  startCursor: z.string().nullable(),
  endCursor: z.string().nullable(),
});

export type PageInfo = z.infer<typeof PageInfoSchema>;

// Article Schema
export const ArticleSchema = z.object({
  id: z.string(),
  title: z.string(),
  handle: z.string(),
  excerpt: z.string().nullable(),
  excerptHtml: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  contentHtml: z.string().nullable().optional(),
  publishedAt: z.string(),
  author: AuthorSchema,
  image: BlogImageSchema.nullable(),
  tags: z.array(z.string()),
  blog: z.object({
    id: z.string(),
    title: z.string(),
    handle: z.string(),
  }).optional(),
});

export type Article = z.infer<typeof ArticleSchema>;

// Article Edge Schema
export const ArticleEdgeSchema = z.object({
  node: ArticleSchema,
  cursor: z.string(),
});

export type ArticleEdge = z.infer<typeof ArticleEdgeSchema>;

// Blogs Query Response
export const BlogsQuerySchema = z.object({
  blogs: z.object({
    edges: z.array(BlogEdgeSchema),
    pageInfo: PageInfoSchema,
  }),
});

export type BlogsQuery = z.infer<typeof BlogsQuerySchema>;

// Blog By Handle Query Response
export const BlogByHandleQuerySchema = z.object({
  blogByHandle: z.object({
    id: z.string(),
    title: z.string(),
    handle: z.string(),
    articles: z.object({
      edges: z.array(ArticleEdgeSchema),
      pageInfo: PageInfoSchema,
    }),
  }).nullable(),
});

export type BlogByHandleQuery = z.infer<typeof BlogByHandleQuerySchema>;

// Articles Query Response
export const ArticlesQuerySchema = z.object({
  articles: z.object({
    edges: z.array(ArticleEdgeSchema),
    pageInfo: PageInfoSchema,
  }),
});

export type ArticlesQuery = z.infer<typeof ArticlesQuerySchema>;

// Article By Handle Query Response
export const ArticleByHandleQuerySchema = z.object({
  articleByHandle: ArticleSchema.nullable(),
});

export type ArticleByHandleQuery = z.infer<typeof ArticleByHandleQuerySchema>;

// Article By ID Query Response
export const ArticleByIdQuerySchema = z.object({
  article: ArticleSchema.nullable(),
});

export type ArticleByIdQuery = z.infer<typeof ArticleByIdQuerySchema>;

// Article Tags Only Schema (minimal schema for tags query)
export const ArticleTagsOnlySchema = z.object({
  id: z.string(),
  tags: z.array(z.string()),
});

export type ArticleTagsOnly = z.infer<typeof ArticleTagsOnlySchema>;

// Article Tags Edge Schema
export const ArticleTagsEdgeSchema = z.object({
  node: ArticleTagsOnlySchema,
  cursor: z.string(),
});

export type ArticleTagsEdge = z.infer<typeof ArticleTagsEdgeSchema>;

// Articles Tags Query Response
export const ArticlesTagsQuerySchema = z.object({
  articles: z.object({
    edges: z.array(ArticleTagsEdgeSchema),
    pageInfo: PageInfoSchema,
  }),
});

export type ArticlesTagsQuery = z.infer<typeof ArticlesTagsQuerySchema>;

