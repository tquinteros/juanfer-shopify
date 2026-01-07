// src/app/products/page.tsx
'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useProducts } from '@/components/hooks/useProducts';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useLanguage } from '@/lib/contexts/language-context';
import { translations } from '@/lib/i18n/translations';
import { ProductCard } from '@/components/product/product-card';

function ProductsContent() {
  const { language } = useLanguage();
  const t = translations[language];
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('name');
  
  // Build Shopify search query
  const shopifyQuery = searchQuery 
    ? `title:*${searchQuery}* OR description:*${searchQuery}*`
    : null;

  const { data, isLoading, error } = useProducts({ 
    first: 12,
    query: shopifyQuery,
  });
  
  console.log(data, "products")

  if (error) {
    return (
      <div className=" p-6">
        <Alert variant="destructive">
          <AlertDescription>
            {t.products.errorLoading}: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className=" p-6">
      <h1 className="text-4xl font-bold mb-8">
        {searchQuery ? `${t.products.searchResults} "${searchQuery}"` : t.products.title}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-48 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))
        ) : (
          data?.products.edges.map(({ node: product }) => (
            <ProductCard
              key={product.id}
              product={product}
              showTags={true}
              priceSize="2xl"
              stockStatusKey="products"
            />
          ))
        )}
      </div>

      {data?.products.pageInfo.hasNextPage && (
        <div className="mt-8 text-center">
          <p className="text-gray-600">{t.products.moreProductsAvailable}</p>
        </div>
      )}
    </div>
  );
}function ProductsLoadingFallback() {
  const { language } = useLanguage();
  const t = translations[language];
  return (
    <div className=" p-6">
      <h1 className="text-4xl font-bold mb-8">{t.products.title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-48 w-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsLoadingFallback />}>
      <ProductsContent />
    </Suspense>
  );
}

