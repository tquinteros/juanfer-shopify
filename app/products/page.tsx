// src/app/products/page.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useProducts } from '@/components/hooks/useProducts';
import Image from 'next/image';

export default function ProductsPage() {
  const { data, isLoading, error } = useProducts({ first: 12 });

  if (error) {
    return (
      <div className=" p-6">
        <Alert variant="destructive">
          <AlertDescription>
            Error al cargar productos: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className=" p-6">
      <h1 className="text-4xl font-bold mb-8">Nuestros Productos</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          // Skeletons mientras carga
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
          // Productos
          data?.products.edges.map(({ node: product }) => {
            const firstImage = product.images.edges[0]?.node;
            const price = product.priceRange.minVariantPrice;

            return (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  {firstImage ? (
                    <Image
                      width={500}
                      height={500}
                      src={firstImage.url}
                      alt={firstImage.altText || product.title}
                      className="w-full h-64 object-cover"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                      Sin imagen
                    </div>
                  )}
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg mb-2 line-clamp-2">
                    {product.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 mb-4">
                    {product.description}
                  </CardDescription>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">
                      ${parseFloat(price.amount).toFixed(2)} {price.currencyCode}
                    </span>
                    {product.availableForSale ? (
                      <span className="text-sm text-green-600 font-medium">
                        Disponible
                      </span>
                    ) : (
                      <span className="text-sm text-red-600 font-medium">
                        Agotado
                      </span>
                    )}
                  </div>
                  {product.tags && product.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {product.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-gray-100 px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Info de paginación */}
      {data?.products.pageInfo.hasNextPage && (
        <div className="mt-8 text-center">
          <p className="text-gray-600">Hay más productos disponibles</p>
        </div>
      )}
    </div>
  );
}