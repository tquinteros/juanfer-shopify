import { z } from 'zod';

// Order Schemas
export const MoneyV2OrderSchema = z.object({
  amount: z.string(),
  currencyCode: z.string(),
});

export const OrderImageSchema = z.object({
  url: z.string().url(),
  altText: z.string().nullable(),
});

export const OrderVariantSchema = z.object({
  title: z.string(),
  price: MoneyV2OrderSchema,
  image: OrderImageSchema.nullable().optional(),
});

export const OrderLineItemSchema = z.object({
  title: z.string(),
  quantity: z.number(),
  variant: OrderVariantSchema.nullable().optional(),
});

export const OrderLineItemEdgeSchema = z.object({
  node: OrderLineItemSchema,
});

export const OrderAddressSchema = z.object({
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  address1: z.string().nullable(),
  address2: z.string().nullable(),
  city: z.string().nullable(),
  province: z.string().nullable(),
  country: z.string().nullable(),
  zip: z.string().nullable(),
});

export const OrderSchema = z.object({
  id: z.string(),
  name: z.string(),
  orderNumber: z.number(),
  processedAt: z.string(),
  financialStatus: z.string().nullable(),
  fulfillmentStatus: z.string().nullable(),
  totalPrice: MoneyV2OrderSchema,
  subtotalPrice: MoneyV2OrderSchema.nullable().optional(),
  totalShippingPrice: MoneyV2OrderSchema.nullable().optional(),
  totalTax: MoneyV2OrderSchema.nullable().optional(),
  lineItems: z.object({
    edges: z.array(OrderLineItemEdgeSchema),
  }),
  shippingAddress: OrderAddressSchema.nullable().optional(),
});

export const OrderEdgeSchema = z.object({
  node: OrderSchema,
  cursor: z.string(),
});

export const PageInfoSchema = z.object({
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
  startCursor: z.string().nullable(),
  endCursor: z.string().nullable(),
});

export const OrderConnectionSchema = z.object({
  edges: z.array(OrderEdgeSchema),
  pageInfo: PageInfoSchema,
});

export const CustomerOrdersQuerySchema = z.object({
  customer: z.object({
    id: z.string(),
    orders: OrderConnectionSchema,
  }).nullable(),
});

// Types
export type Order = z.infer<typeof OrderSchema>;
export type OrderLineItem = z.infer<typeof OrderLineItemSchema>;
export type OrderAddress = z.infer<typeof OrderAddressSchema>;
export type CustomerOrdersQuery = z.infer<typeof CustomerOrdersQuerySchema>;

