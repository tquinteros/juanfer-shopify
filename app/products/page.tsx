// src/app/products/page.tsx
'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useInfiniteProducts } from '@/components/hooks/useProducts';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Suspense, useCallback, useMemo, useEffect, useRef } from 'react';
import { useLanguage } from '@/lib/contexts/language-context';
import { translations } from '@/lib/i18n/translations';
import { ProductCard } from '@/components/product/product-card';
import { Filters, FilterValues } from '@/components/products/filters';
import { useInView } from 'react-intersection-observer';
import { Loader2 } from 'lucide-react';
import type { ProductsQuery } from '@/lib/types/shopify';

const MIN_PRICE = 0
const MAX_PRICE = 10000

function ProductsContent() {
  const { language } = useLanguage();
  const t = translations[language];
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const filters = useMemo<FilterValues>(() => {
    const name = searchParams.get('name') || "";
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const collection = searchParams.get('collection') || "";

    const priceRange: [number, number] = [
      minPrice ? parseInt(minPrice, 10) : MIN_PRICE,
      maxPrice ? parseInt(maxPrice, 10) : MAX_PRICE,
    ];

    return {
      name,
      priceRange,
      collection,
    };
  }, [searchParams]);

  const handleFiltersChange = useCallback((newFilters: FilterValues) => {
    const params = new URLSearchParams();

    if (newFilters.name) {
      params.set('name', newFilters.name);
    }

    if (newFilters.collection) {
      params.set('collection', newFilters.collection);
    }

    const [minPrice, maxPrice] = newFilters.priceRange;
    if (minPrice > MIN_PRICE) {
      params.set('minPrice', minPrice.toString());
    }

    if (maxPrice < MAX_PRICE) {
      params.set('maxPrice', maxPrice.toString());
    }

    const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    const currentUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

    if (newUrl !== currentUrl) {
      router.replace(newUrl, { scroll: false });
    }
  }, [searchParams, router, pathname]);

  let shopifyQuery = null;
  if (!filters.collection) {
    const queryParts: string[] = [];

    if (filters.name) {
      queryParts.push(`title:*${filters.name}* OR description:*${filters.name}*`);
    }

    const [minPrice, maxPrice] = filters.priceRange;
    if (minPrice > 0 || maxPrice < 10000) {
      queryParts.push(`variants.price:>=${minPrice} AND variants.price:<=${maxPrice}`);
    }

    if (queryParts.length > 0) {
      shopifyQuery = queryParts.join(' AND ');
    }
  }

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteProducts({
    first: 12,
    query: shopifyQuery,
    collectionHandle: filters.collection || null,
  });

  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
    rootMargin: '200px',
  });

  const isFetchingRef = useRef(false);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && !isFetchingRef.current) {
      isFetchingRef.current = true;
      fetchNextPage();
    }

    if (!isFetchingNextPage && isFetchingRef.current) {
      isFetchingRef.current = false;
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allProducts = useMemo(() => {
    if (!data || !('pages' in data)) return [];
    return (data.pages as ProductsQuery[]).flatMap(page => page.products.edges);
  }, [data]);

  const filteredProducts = useMemo(() => {
    if (!filters.collection) {
      return allProducts;
    }

    return allProducts.filter(({ node: product }: ProductsQuery['products']['edges'][0]) => {
      if (filters.name) {
        const searchTerm = filters.name.toLowerCase();
        const matchesName =
          product.title.toLowerCase().includes(searchTerm) ||
          (product.description && product.description.toLowerCase().includes(searchTerm));
        if (!matchesName) return false;
      }

      const [minPrice, maxPrice] = filters.priceRange;
      if (minPrice > 0 || maxPrice < 10000) {
        const productMinPrice = parseFloat(product.priceRange.minVariantPrice.amount);
        const productMaxPrice = parseFloat(product.priceRange.maxVariantPrice.amount);

        const matchesPrice =
          (productMinPrice >= minPrice && productMinPrice <= maxPrice) ||
          (productMaxPrice >= minPrice && productMaxPrice <= maxPrice) ||
          (productMinPrice <= minPrice && productMaxPrice >= maxPrice);

        if (!matchesPrice) return false;
      }

      return true;
    });
  }, [allProducts, filters.name, filters.priceRange, filters.collection]);


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
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">
        {t.products.title}
      </h1>

      <Filters
        onFiltersChange={handleFiltersChange}
        initialFilters={filters}
      />

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
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map(({ node: product }: ProductsQuery['products']['edges'][0]) => (
            <ProductCard
              key={product.id}
              product={product}
              showTags={true}
              priceSize="2xl"
              stockStatusKey="products"
            />
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground">{t.products.noProductsFound}</p>
          </div>
        )}
      </div>

      {hasNextPage && (
        <div ref={loadMoreRef} className="mt-8 flex justify-center items-center py-4">
          {isFetchingNextPage && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading more products...</span>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

function ProductsLoadingFallback() {
  const { language } = useLanguage();
  const t = translations[language];
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">{t.products.title}</h1>
      <Skeleton className="h-40 w-full mb-6" />
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

