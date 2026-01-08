import { z } from 'zod';

export const MoneyV2Schema = z.object({
  amount: z.string(),
  currencyCode: z.string(),
});

export const ImageSchema = z.object({
  url: z.string().url(),
  altText: z.string().nullable(),
  width: z.number().optional(),
  height: z.number().optional(),
});

export const ImageEdgeSchema = z.object({
  node: ImageSchema,
});

export const PriceRangeSchema = z.object({
  minVariantPrice: MoneyV2Schema,
  maxVariantPrice: MoneyV2Schema,
});

export const ProductVariantSchema = z.object({
  id: z.string(),
  title: z.string(),
  price: MoneyV2Schema,
  availableForSale: z.boolean(),
  quantityAvailable: z.number().optional(),
});

export const ProductVariantEdgeSchema = z.object({
  node: ProductVariantSchema,
});

export const ProductSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  handle: z.string(),
  availableForSale: z.boolean(),
  priceRange: PriceRangeSchema,
  images: z.object({
    edges: z.array(ImageEdgeSchema),
  }),
  variants: z.object({
    edges: z.array(ProductVariantEdgeSchema),
  }).optional(),
  tags: z.array(z.string()).optional(),
});

export const ProductEdgeSchema = z.object({
  node: ProductSchema,
  cursor: z.string(),
});

export const PageInfoSchema = z.object({
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
  startCursor: z.string().nullable(),
  endCursor: z.string().nullable(),
});

export const ProductConnectionSchema = z.object({
  edges: z.array(ProductEdgeSchema),
  pageInfo: PageInfoSchema,
});

export const ProductsQuerySchema = z.object({
  products: ProductConnectionSchema,
});

export const ProductByIdQuerySchema = z.object({
  product: ProductSchema.nullable(),
});

export const ProductByHandleQuerySchema = z.object({
  productByHandle: ProductSchema.nullable(),
});

export const CollectionImageSchema = z.object({
  url: z.url(),
  altText: z.string().nullable(),
  width: z.number().optional(),
  height: z.number().optional(),
});

export const CollectionProductPreviewSchema = z.object({
  id: z.string(),
  title: z.string(),
  handle: z.string(),
  priceRange: z.object({
    minVariantPrice: MoneyV2Schema,
  }),
  images: z.object({
    edges: z.array(ImageEdgeSchema),
  }),
});

export const CollectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
  handle: z.string(),
  image: CollectionImageSchema.nullable().optional(),
  products: z.object({
    edges: z.array(
      z.object({
        node: CollectionProductPreviewSchema,
      })
    ),
  }).optional(),
});

export const CollectionEdgeSchema = z.object({
  node: CollectionSchema,
  cursor: z.string(),
});

export const CollectionConnectionSchema = z.object({
  edges: z.array(CollectionEdgeSchema),
  pageInfo: PageInfoSchema,
});

export const CollectionsQuerySchema = z.object({
  collections: CollectionConnectionSchema,
});

// Single Collection Query (by handle or ID)
export const SingleCollectionProductSchema = ProductSchema;
export const SingleCollectionProductEdgeSchema = z.object({
  node: SingleCollectionProductSchema,
  cursor: z.string(),
});

export const SingleCollectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
  handle: z.string(),
  image: CollectionImageSchema.nullable().optional(),
  products: z.object({
    edges: z.array(SingleCollectionProductEdgeSchema),
    pageInfo: PageInfoSchema,
  }),
});

export const CollectionByHandleQuerySchema = z.object({
  collectionByHandle: SingleCollectionSchema.nullable(),
});

export const CollectionByIdQuerySchema = z.object({
  collection: SingleCollectionSchema.nullable(),
});

// Page types
export const PageSchema = z.object({
  id: z.string(),
  title: z.string(),
  body: z.string(),
  bodySummary: z.string().nullable().optional(),
});

export const PageByHandleQuerySchema = z.object({
  page: PageSchema.nullable(),
});

// Types inferidos de los schemas
export type MoneyV2 = z.infer<typeof MoneyV2Schema>;
export type Image = z.infer<typeof ImageSchema>;
export type PriceRange = z.infer<typeof PriceRangeSchema>;
export type Product = z.infer<typeof ProductSchema>;
export type ProductEdge = z.infer<typeof ProductEdgeSchema>;
export type PageInfo = z.infer<typeof PageInfoSchema>;
export type ProductConnection = z.infer<typeof ProductConnectionSchema>;
export type ProductsQuery = z.infer<typeof ProductsQuerySchema>;
export type ProductByIdQuery = z.infer<typeof ProductByIdQuerySchema>;
export type ProductByHandleQuery = z.infer<typeof ProductByHandleQuerySchema>;

export type Collection = z.infer<typeof CollectionSchema>;
export type CollectionEdge = z.infer<typeof CollectionEdgeSchema>;
export type CollectionConnection = z.infer<typeof CollectionConnectionSchema>;
export type CollectionsQuery = z.infer<typeof CollectionsQuerySchema>;
export type SingleCollection = z.infer<typeof SingleCollectionSchema>;
export type CollectionByHandleQuery = z.infer<typeof CollectionByHandleQuerySchema>;
export type CollectionByIdQuery = z.infer<typeof CollectionByIdQuerySchema>;

export type Page = z.infer<typeof PageSchema>;
export type PageByHandleQuery = z.infer<typeof PageByHandleQuerySchema>;