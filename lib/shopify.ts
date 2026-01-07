// src/lib/shopify.ts

const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const STOREFRONT_ACCESS_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

if (!SHOPIFY_STORE_DOMAIN || !STOREFRONT_ACCESS_TOKEN) {
  throw new Error('Missing Shopify environment variables');
}

const SHOPIFY_GRAPHQL_URL = `https://${SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`;

export interface ShopifyResponse<T> {
  data: T;
  errors?: Array<{ message: string }>;
}

export async function shopifyFetch<T>({
  query,
  variables = {},
  language,
}: {
  query: string;
  variables?: Record<string, unknown>;
  language?: string;
}): Promise<T> {
  if (!STOREFRONT_ACCESS_TOKEN) {
    throw new Error('Missing Storefront Access Token');
  }

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN,
    };

    // Add Accept-Language header if language is specified
    // Shopify Storefront API uses this header to return localized content
    if (language) {
      headers['Accept-Language'] = language;
    }

    const response = await fetch(SHOPIFY_GRAPHQL_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query,
        variables,
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.status}`);
    }

    const json: ShopifyResponse<T> = await response.json();

    if (json.errors) {
      throw new Error(json.errors[0]?.message || 'Shopify GraphQL error');
    }

    return json.data;
  } catch (error) {
    console.error('Shopify fetch error:', error);
    throw error;
  }
}