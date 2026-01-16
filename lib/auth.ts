// Customer authentication utilities (client-side)
import { 
  loginAction, 
  registerAction, 
  getCustomerAction, 
  logoutAction,
  type LoginCredentials,
  type RegisterData,
} from './server/auth';

export type { LoginCredentials, RegisterData };

const TOKEN_KEY = 'shopify_customer_token';
const TOKEN_EXPIRY_KEY = 'shopify_customer_token_expiry';

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

// Login (calls server action)
export const login = async (credentials: LoginCredentials) => {
  try {
    const customerAccessToken = await loginAction(credentials);
    setCustomerToken(customerAccessToken.accessToken, customerAccessToken.expiresAt);
    return customerAccessToken;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Register (calls server action)
export const register = async (data: RegisterData) => {
  try {
    const customerAccessToken = await registerAction(data);
    setCustomerToken(customerAccessToken.accessToken, customerAccessToken.expiresAt);
    return customerAccessToken;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Get customer data (calls server action)
export const getCustomer = async (token: string) => {
  try {
    return await getCustomerAction(token);
  } catch (error) {
    console.error('Get customer error:', error);
    throw error;
  }
};

// Logout (calls server action)
export const logout = async () => {
  const token = getCustomerToken();

  if (token) {
    try {
      await logoutAction(token);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearCustomerToken();
    }
  }
};

