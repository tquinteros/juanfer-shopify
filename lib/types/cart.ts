import { z } from 'zod';

// Money type
export const MoneySchema = z.object({
  amount: z.string(),
  currencyCode: z.string(),
});

export type Money = z.infer<typeof MoneySchema>;

// Cart Cost
export const CartCostSchema = z.object({
  totalAmount: MoneySchema,
  subtotalAmount: MoneySchema,
  totalTaxAmount: MoneySchema.nullable().optional(),
});

export type CartCost = z.infer<typeof CartCostSchema>;

// Product Image
export const ProductImageSchema = z.object({
  url: z.string().url(),
  altText: z.string().nullable(),
});

export type ProductImage = z.infer<typeof ProductImageSchema>;

// Product in cart
export const CartProductSchema = z.object({
  id: z.string(),
  title: z.string(),
  handle: z.string(),
  featuredImage: ProductImageSchema.nullable(),
});

export type CartProduct = z.infer<typeof CartProductSchema>;

// Product Variant (Merchandise)
export const ProductVariantSchema = z.object({
  id: z.string(),
  title: z.string(),
  priceV2: MoneySchema,
  product: CartProductSchema,
});

export type ProductVariant = z.infer<typeof ProductVariantSchema>;

// Cart Line Item
export const CartLineSchema = z.object({
  id: z.string(),
  quantity: z.number(),
  cost: z.object({
    totalAmount: MoneySchema,
  }),
  merchandise: ProductVariantSchema,
});

export type CartLine = z.infer<typeof CartLineSchema>;

// Cart Line Edge
export const CartLineEdgeSchema = z.object({
  node: CartLineSchema,
});

export type CartLineEdge = z.infer<typeof CartLineEdgeSchema>;

// Cart
export const CartSchema = z.object({
  id: z.string(),
  checkoutUrl: z.string().url(),
  totalQuantity: z.number(),
  cost: CartCostSchema,
  lines: z.object({
    edges: z.array(CartLineEdgeSchema),
  }),
});

export type Cart = z.infer<typeof CartSchema>;

// User Error
export const UserErrorSchema = z.object({
  field: z.array(z.string()).nullable().optional(),
  message: z.string(),
});

export type UserError = z.infer<typeof UserErrorSchema>;

// Mutation Responses
export const CartCreateResponseSchema = z.object({
  cartCreate: z.object({
    cart: CartSchema.nullable(),
    userErrors: z.array(UserErrorSchema),
  }),
});

export type CartCreateResponse = z.infer<typeof CartCreateResponseSchema>;

export const CartLinesAddResponseSchema = z.object({
  cartLinesAdd: z.object({
    cart: CartSchema.nullable(),
    userErrors: z.array(UserErrorSchema),
  }),
});

export type CartLinesAddResponse = z.infer<typeof CartLinesAddResponseSchema>;

export const CartLinesUpdateResponseSchema = z.object({
  cartLinesUpdate: z.object({
    cart: CartSchema.nullable(),
    userErrors: z.array(UserErrorSchema),
  }),
});

export type CartLinesUpdateResponse = z.infer<typeof CartLinesUpdateResponseSchema>;

export const CartLinesRemoveResponseSchema = z.object({
  cartLinesRemove: z.object({
    cart: CartSchema.nullable(),
    userErrors: z.array(UserErrorSchema),
  }),
});

export type CartLinesRemoveResponse = z.infer<typeof CartLinesRemoveResponseSchema>;

// Query Response
export const GetCartResponseSchema = z.object({
  cart: CartSchema.nullable(),
});

export type GetCartResponse = z.infer<typeof GetCartResponseSchema>;

// Input types for mutations
export interface CartLineInput {
  merchandiseId: string;
  quantity: number;
}

export interface CartLineUpdateInput {
  id: string;
  quantity: number;
}

