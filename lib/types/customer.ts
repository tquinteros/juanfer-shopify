import { z } from 'zod';

// Customer Schemas
export const CustomerSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  displayName: z.string(),
  phone: z.string().nullable().optional(),
});

export const CustomerAccessTokenSchema = z.object({
  accessToken: z.string(),
  expiresAt: z.string(),
});

export const CustomerAccessTokenCreateSchema = z.object({
  customerAccessTokenCreate: z.object({
    customerAccessToken: CustomerAccessTokenSchema.nullable(),
    customerUserErrors: z.array(
      z.object({
        code: z.string().optional(),
        field: z.array(z.string()).optional(),
        message: z.string(),
      })
    ),
  }),
});

export const CustomerCreateSchema = z.object({
  customerCreate: z.object({
    customer: CustomerSchema.nullable(),
    customerUserErrors: z.array(
      z.object({
        code: z.string().optional(),
        field: z.array(z.string()).optional(),
        message: z.string(),
      })
    ),
  }),
});

export const CustomerQuerySchema = z.object({
  customer: CustomerSchema.nullable(),
});

// Types
export type Customer = z.infer<typeof CustomerSchema>;
export type CustomerAccessToken = z.infer<typeof CustomerAccessTokenSchema>;
export type CustomerAccessTokenCreate = z.infer<typeof CustomerAccessTokenCreateSchema>;
export type CustomerCreate = z.infer<typeof CustomerCreateSchema>;
export type CustomerQuery = z.infer<typeof CustomerQuerySchema>;

