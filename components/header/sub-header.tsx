'use client';

import React from 'react';
import { useMenuByHandle } from '@/components/hooks/useMenu';
import Link from 'next/link';
import type { MenuItem } from '@/lib/types/shopify';
import { Skeleton } from '../ui/skeleton';

const formatUrl = (url: string): string => {
    if (url.startsWith('/')) {
        return url;
    }

    try {
        const urlObj = new URL(url);
        return `${urlObj.pathname}${urlObj.search}`;
    } catch {
        return url.startsWith('/') ? url : `/${url}`;
    }
};

const SubHeader = () => {
    const { data, isLoading, error } = useMenuByHandle({
        handle: 'sub-menu',
    });

    if (isLoading) {
        return (
            <>
                {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton
                        key={i}
                        className="h-4 w-20 bg-background"
                    />
                ))}
            </>
        );
    }

    if (error || !data?.menu) {
        return null;
    }

    const { items } = data.menu;

    const renderMenuItems = (menuItems: MenuItem[]) => {
        return menuItems.map((item) => {
            const href = formatUrl(item.url);
            console.log(href, "href")
            if (item.items && item.items.length > 0) {
                return (
                    <div key={item.id} className="relative group">
                        <Link
                            href={href}
                            className="hover:opacity-80 transition-opacity"
                        >
                            {item.title}
                        </Link>
                        <div className="absolute top-full left-0 mt-1 bg-background border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 min-w-[200px]">
                            <div className="py-2">
                                {item.items.map((subItem) => (
                                    <Link
                                        key={subItem.id}
                                        href={formatUrl(subItem.url)}
                                        className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
                                    >
                                        {subItem.title}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            }

            return (
                <Link
                    key={item.id}
                    href={href}
                    className="hover:opacity-80 transition-opacity"
                >
                    {item.title}
                </Link>
            );
        });
    };

    return (
        <>
            {renderMenuItems(items)}
        </>
    );
}

export default SubHeader