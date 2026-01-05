// src/types/shopify.ts
import { z } from 'zod';

// Schemas de Zod para validación
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

// Types inferidos de los schemas
export type MoneyV2 = z.infer<typeof MoneyV2Schema>;
export type Image = z.infer<typeof ImageSchema>;
export type PriceRange = z.infer<typeof PriceRangeSchema>;
export type Product = z.infer<typeof ProductSchema>;
export type ProductEdge = z.infer<typeof ProductEdgeSchema>;
export type PageInfo = z.infer<typeof PageInfoSchema>;
export type ProductConnection = z.infer<typeof ProductConnectionSchema>;
export type ProductsQuery = z.infer<typeof ProductsQuerySchema>;