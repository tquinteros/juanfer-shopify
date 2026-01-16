'use server'

import { shopifyFetch } from '@/lib/shopify'
import {
  CUSTOMER_ACCESS_TOKEN_CREATE,
  CUSTOMER_CREATE,
  GET_CUSTOMER,
  CUSTOMER_ACCESS_TOKEN_DELETE,
} from '@/lib/queries/customer'
import { GET_CUSTOMER_ORDERS } from '@/lib/queries/orders'
import type {
  CustomerAccessTokenCreate,
  CustomerCreate,
  CustomerQuery,
} from '@/lib/types/customer'
import { CustomerOrdersQuery, CustomerOrdersQuerySchema } from '@/lib/types/orders'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  firstName?: string
  lastName?: string
  acceptsMarketing?: boolean
}

export interface CustomerAccessToken {
  accessToken: string
  expiresAt: string
}

// Login action
export async function loginAction(credentials: LoginCredentials): Promise<CustomerAccessToken> {
  try {
    const data = await shopifyFetch<CustomerAccessTokenCreate>({
      query: CUSTOMER_ACCESS_TOKEN_CREATE,
      variables: {
        input: {
          email: credentials.email,
          password: credentials.password,
        },
      },
    })

    const { customerAccessToken, customerUserErrors } =
      data.customerAccessTokenCreate

    if (customerUserErrors.length > 0) {
      throw new Error(customerUserErrors[0].message)
    }

    if (!customerAccessToken) {
      throw new Error('Failed to create access token')
    }

    return {
      accessToken: customerAccessToken.accessToken,
      expiresAt: customerAccessToken.expiresAt,
    }
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

// Register action
export async function registerAction(data: RegisterData): Promise<CustomerAccessToken> {
  try {
    const response = await shopifyFetch<CustomerCreate>({
      query: CUSTOMER_CREATE,
      variables: {
        input: {
          email: data.email,
          password: data.password,
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          acceptsMarketing: data.acceptsMarketing || false,
        },
      },
    })

    const { customer, customerUserErrors } = response.customerCreate

    if (customerUserErrors.length > 0) {
      throw new Error(customerUserErrors[0].message)
    }

    if (!customer) {
      throw new Error('Failed to create customer')
    }

    // Auto login after registration
    if (data.password) {
      return await loginAction({ email: data.email, password: data.password })
    }

    throw new Error('Password is required')
  } catch (error) {
    console.error('Registration error:', error)
    throw error
  }
}

// Get customer data action
export async function getCustomerAction(token: string) {
  try {
    const data = await shopifyFetch<CustomerQuery>({
      query: GET_CUSTOMER,
      variables: {
        customerAccessToken: token,
      },
    })

    return data.customer
  } catch (error) {
    console.error('Get customer error:', error)
    throw error
  }
}

// Logout action
export async function logoutAction(token: string) {
  try {
    await shopifyFetch({
      query: CUSTOMER_ACCESS_TOKEN_DELETE,
      variables: {
        customerAccessToken: token,
      },
    })
  } catch (error) {
    console.error('Logout error:', error)
    throw error
  }
}

// Get orders action
interface GetOrdersParams {
  token: string
  first?: number
  after?: string | null
}

export async function getOrdersAction(params: GetOrdersParams): Promise<CustomerOrdersQuery> {
  const { token, first = 10, after = null } = params

  try {
    const data = await shopifyFetch<CustomerOrdersQuery>({
      query: GET_CUSTOMER_ORDERS,
      variables: {
        customerAccessToken: token,
        first,
        after,
      },
    })

    return CustomerOrdersQuerySchema.parse(data)
  } catch (error) {
    console.error('Get orders error:', error)
    throw error
  }
}

