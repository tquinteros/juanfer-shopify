// Customer authentication utilities
import { shopifyFetch } from './shopify';
import {
  CUSTOMER_ACCESS_TOKEN_CREATE,
  CUSTOMER_CREATE,
  GET_CUSTOMER,
  CUSTOMER_ACCESS_TOKEN_DELETE,
} from './queries/customer';
import type {
  CustomerAccessTokenCreate,
  CustomerCreate,
  CustomerQuery,
} from './types/customer';

const TOKEN_KEY = 'shopify_customer_token';
const TOKEN_EXPIRY_KEY = 'shopify_customer_token_expiry';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  acceptsMarketing?: boolean;
}

// Token management
export const setCustomerToken = (token: string, expiresAt: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiresAt);
  }
};

export const getCustomerToken = (): string | null => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem(TOKEN_KEY);
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);

    if (token && expiry) {
      // Check if token is expired
      if (new Date(expiry) > new Date()) {
        return token;
      } else {
        clearCustomerToken();
      }
    }
  }
  return null;
};

export const clearCustomerToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
  }
};

// Login
export const login = async (credentials: LoginCredentials) => {
  try {
    const data = await shopifyFetch<CustomerAccessTokenCreate>({
      query: CUSTOMER_ACCESS_TOKEN_CREATE,
      variables: {
        input: {
          email: credentials.email,
          password: credentials.password,
        },
      },
    });

    const { customerAccessToken, customerUserErrors } =
      data.customerAccessTokenCreate;

    if (customerUserErrors.length > 0) {
      throw new Error(customerUserErrors[0].message);
    }

    if (!customerAccessToken) {
      throw new Error('Failed to create access token');
    }

    setCustomerToken(customerAccessToken.accessToken, customerAccessToken.expiresAt);
    return customerAccessToken;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Register
export const register = async (data: RegisterData) => {
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
    });

    const { customer, customerUserErrors } = response.customerCreate;

    if (customerUserErrors.length > 0) {
      throw new Error(customerUserErrors[0].message);
    }

    if (!customer) {
      throw new Error('Failed to create customer');
    }

    // Auto login after registration
    if (data.password) {
      await login({ email: data.email, password: data.password });
    }

    return customer;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Get customer data
export const getCustomer = async (token: string) => {
  try {
    const data = await shopifyFetch<CustomerQuery>({
      query: GET_CUSTOMER,
      variables: {
        customerAccessToken: token,
      },
    });

    return data.customer;
  } catch (error) {
    console.error('Get customer error:', error);
    throw error;
  }
};

// Logout
export const logout = async () => {
  const token = getCustomerToken();

  if (token) {
    try {
      await shopifyFetch({
        query: CUSTOMER_ACCESS_TOKEN_DELETE,
        variables: {
          customerAccessToken: token,
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearCustomerToken();
    }
  }
};

