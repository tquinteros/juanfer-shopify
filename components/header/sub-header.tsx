'use client';

import React from 'react';
import { useMenuByHandle } from '@/components/hooks/useMenu';
import Link from 'next/link';

const SubHeader = () => {
    const { data, isLoading, error } = useMenuByHandle({
        handle: 'sub-menu',
    });
    console.log(data, "header")
    if (isLoading) {
        return (
            <div className="border-b border-border bg-muted/40">
                <div className="container mx-auto px-4 py-2">
                    <div className="flex items-center gap-4">
                        <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                        <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                        <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !data?.menu) {
        return null;
    }

    const { items } = data.menu;

    return (
        <div className="border-b border-border bg-muted/40">
            <div className="container mx-auto px-4 py-2">
                <nav className="flex items-center gap-6">
                    {items.map((item) => (
                        <Link
                            key={item.id}
                            href={item.url}
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {item.title}
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    );
}

export default SubHeader