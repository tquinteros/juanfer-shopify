// Customer Orders Queries

export const GET_CUSTOMER_ORDERS = `
  query getCustomerOrders($customerAccessToken: String!, $first: Int!, $after: String) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      orders(first: $first, after: $after, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          cursor
          node {
            id
            name
            orderNumber
            processedAt
            financialStatus
            fulfillmentStatus
            totalPrice {
              amount
              currencyCode
            }
            subtotalPrice {
              amount
              currencyCode
            }
            totalShippingPrice {
              amount
              currencyCode
            }
            totalTax {
              amount
              currencyCode
            }
            lineItems(first: 10) {
              edges {
                node {
                  title
                  quantity
                  variant {
                    title
                    price {
                      amount
                      currencyCode
                    }
                    image {
                      url
                      altText
                    }
                  }
                }
              }
            }
            shippingAddress {
              firstName
              lastName
              address1
              address2
              city
              province
              country
              zip
            }
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  }
`;

export const GET_ORDER_BY_ID = `
  query getOrderById($customerAccessToken: String!, $orderId: ID!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      order(id: $orderId) {
        id
        name
        orderNumber
        processedAt
        financialStatus
        fulfillmentStatus
        totalPrice {
          amount
          currencyCode
        }
        subtotalPrice {
          amount
          currencyCode
        }
        totalShippingPrice {
          amount
          currencyCode
        }
        totalTax {
          amount
          currencyCode
        }
        lineItems(first: 50) {
          edges {
            node {
              title
              quantity
              variant {
                title
                price {
                  amount
                  currencyCode
                }
                image {
                  url
                  altText
                }
              }
            }
          }
        }
        shippingAddress {
          firstName
          lastName
          address1
          address2
          city
          province
          country
          zip
        }
      }
    }
  }
`;

