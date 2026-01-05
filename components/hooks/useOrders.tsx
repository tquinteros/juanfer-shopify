import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { shopifyFetch } from '@/lib/shopify';
import { GET_CUSTOMER_ORDERS } from '@/lib/queries/orders';
import { CustomerOrdersQuerySchema, type CustomerOrdersQuery } from '@/lib/types/orders';
import { getCustomerToken } from '@/lib/auth';

interface UseOrdersOptions {
  first?: number;
  after?: string | null;
  enabled?: boolean;
}

export function useOrders(
  options: UseOrdersOptions = {},
  queryOptions?: Omit<UseQueryOptions<CustomerOrdersQuery>, 'queryKey' | 'queryFn'>
) {
  const { first = 10, after = null, enabled = true } = options;

  return useQuery({
    queryKey: ['customer-orders', first, after],
    queryFn: async () => {
      const token = getCustomerToken();

      if (!token) {
        throw new Error('Not authenticated');
      }

      const data = await shopifyFetch<CustomerOrdersQuery>({
        query: GET_CUSTOMER_ORDERS,
        variables: {
          customerAccessToken: token,
          first,
          after,
        },
      });

      const validated = CustomerOrdersQuerySchema.parse(data);
      return validated;
    },
    enabled: enabled && !!getCustomerToken(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...queryOptions,
  });
}

