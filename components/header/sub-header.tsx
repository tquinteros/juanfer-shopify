'use client';

import React from 'react';
import { useMenuByHandle } from '@/components/hooks/useMenu';
import Link from 'next/link';
import type { MenuItem } from '@/lib/types/shopify';
import { Skeleton } from '../ui/skeleton';

const DEPLOY_URL = 'https://juanfer-shopify.vercel.app';

const isInternalUrl = (url: string): boolean => {
    if (url.startsWith('/')) {
        return true;
    }

    try {
        const urlObj = new URL(url);
        const deployHost = new URL(DEPLOY_URL).hostname;
        return urlObj.hostname === deployHost ||
            urlObj.hostname === `www.${deployHost}` ||
            `www.${urlObj.hostname}` === deployHost;
    } catch {
        return url.startsWith('/');
    }
};

const formatUrl = (url: string): { href: string; isExternal: boolean } => {
    const isExternal = !isInternalUrl(url);

    if (isExternal) {
        return { href: url, isExternal: true };
    }

    if (url.startsWith('/')) {
        return { href: url, isExternal: false };
    }

    try {
        const urlObj = new URL(url);
        return { href: `${urlObj.pathname}${urlObj.search}`, isExternal: false };
    } catch {
        return { href: url.startsWith('/') ? url : `/${url}`, isExternal: false };
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

    const renderMenuItem = (item: MenuItem, className: string = "hover:opacity-80 transition-opacity") => {
        const { href, isExternal } = formatUrl(item.url);

        if (isExternal) {
            return (
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={className}
                >
                    {item.title}
                </a>
            );
        }

        return (
            <Link
                href={href}
                className={className}
            >
                {item.title}
            </Link>
        );
    };

    const renderMenuItems = (menuItems: MenuItem[]) => {
        return menuItems.map((item) => {
            if (item.items && item.items.length > 0) {
                return (
                    <div key={item.id} className="relative group">
                        {renderMenuItem(item)}
                        <div className="absolute top-full left-0 mt-1 bg-background border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 min-w-[200px]">
                            <div className="py-2">
                                {item.items.map((subItem) => {
                                    const { href, isExternal } = formatUrl(subItem.url);
                                    if (isExternal) {
                                        return (
                                            <a
                                                key={subItem.id}
                                                href={href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
                                            >
                                                {subItem.title}
                                            </a>
                                        );
                                    }
                                    return (
                                        <Link
                                            key={subItem.id}
                                            href={href}
                                            className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
                                        >
                                            {subItem.title}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                );
            }

            return (
                <React.Fragment key={item.id}>
                    {renderMenuItem(item)}
                </React.Fragment>
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