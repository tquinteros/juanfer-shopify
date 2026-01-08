'use client';

import React from 'react';
import { usePageByHandle } from '@/components/hooks/usePage';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

const FaqPage = () => {
    const { data, isLoading, error } = usePageByHandle({
        handle: 'preguntas-frecuentes',
    });

    if (isLoading) {
        return (
            <div className="container mx-auto py-8">
                <Skeleton className="h-10 w-64 mb-6" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-4 w-3/4 mb-4" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto py-8">
                <Alert variant="destructive">
                    <AlertDescription>
                        Error al cargar la página: {error.message}
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    if (!data?.page) {
        return (
            <div className="container mx-auto py-8">
                <Alert>
                    <AlertDescription>
                        La página no fue encontrada.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }
    console.log(data, "data");
    const { title, body } = data.page;

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-4xl font-bold mb-8">{title}</h1>
            <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: body }}
            />
        </div>
    );
}

export default FaqPage