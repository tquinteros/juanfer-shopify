// Blog GraphQL Queries

export const GET_BLOGS_QUERY = `
  query GetBlogs($first: Int!, $after: String) {
    blogs(first: $first, after: $after) {
      edges {
        cursor
        node {
          id
          title
          handle
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
`;

export const GET_BLOG_BY_HANDLE_QUERY = `
  query GetBlogByHandle($handle: String!, $first: Int!, $after: String) {
    blogByHandle(handle: $handle) {
      id
      title
      handle
      articles(first: $first, after: $after) {
        edges {
          cursor
          node {
            id
            title
            handle
            excerpt
            excerptHtml
            content
            contentHtml
            publishedAt
            author {
              name
            }
            image {
              url
              altText
              width
              height
            }
            tags
            blog {
              id
              title
              handle
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

export const GET_ARTICLES_QUERY = `
  query GetArticles($first: Int!, $after: String, $query: String) {
    articles(first: $first, after: $after, query: $query) {
      edges {
        cursor
        node {
          id
          title
          handle
          excerpt
          excerptHtml
          content
          contentHtml
          publishedAt
          author {
            name
          }
          image {
            url
            altText
            width
            height
          }
          tags
          blog {
            id
            title
            handle
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
`;

export const GET_ARTICLE_BY_HANDLE_QUERY = `
  query GetArticleByHandle($blogHandle: String!, $articleHandle: String!) {
    articleByHandle(blog: $blogHandle, handle: $articleHandle) {
      id
      title
      handle
      excerpt
      excerptHtml
      content
      contentHtml
      publishedAt
      author {
        name
      }
      image {
        url
        altText
        width
        height
      }
      tags
      blog {
        id
        title
        handle
      }
    }
  }
`;

export const GET_ARTICLE_BY_ID_QUERY = `
  query GetArticleById($id: ID!) {
    article(id: $id) {
      id
      title
      handle
      excerpt
      excerptHtml
      content
      contentHtml
      publishedAt
      author {
        name
      }
      image {
        url
        altText
        width
        height
      }
      tags
      blog {
        id
        title
        handle
      }
    }
  }
`;

export const GET_ARTICLES_TAGS_QUERY = `
  query GetArticlesTags($first: Int!, $after: String) {
    articles(first: $first, after: $after) {
      edges {
        cursor
        node {
          id
          tags
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
`;

