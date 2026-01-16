'use client';

import React from 'react';
import { useMenuByHandle } from '@/components/hooks/useMenu';
import Link from 'next/link';
import type { MenuItem } from '@/lib/types/shopify';
import { Skeleton } from '../ui/skeleton';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { useCollectionsByMetadata, SimplifiedCollectionsResponse } from "@/components/hooks/useCollections"
import { useLanguage } from "@/lib/contexts/language-context"
import { translations } from "@/lib/i18n/translations"
import Image from "next/image"

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

interface ProductsMegaMenuProps {
    productCollections?: SimplifiedCollectionsResponse
    spaceCollections?: SimplifiedCollectionsResponse
    isLoading: boolean
}

const ProductsMegaMenu = ({ productCollections, spaceCollections, isLoading }: ProductsMegaMenuProps) => {
    const { language } = useLanguage()
    const t = translations[language]

    if (isLoading) {
        return (
            <div className="w-[800px] p-6">
                <div className="grid grid-cols-2 gap-8">
                    {/* Product Collections Skeleton */}
                    <div>
                        <Skeleton className="h-6 w-32 mb-4" />
                        <div className="space-y-3">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="flex gap-3">
                                    <Skeleton className="h-16 w-16 rounded" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Space Collections Skeleton */}
                    <div>
                        <Skeleton className="h-6 w-32 mb-4" />
                        <div className="space-y-3">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="flex gap-3">
                                    <Skeleton className="h-16 w-16 rounded" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="w-[800px] p-6">
            <div className="grid grid-cols-2 gap-8">
                {/* Product Collections */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">{t.home.shopByProduct}</h3>
                    <div className="space-y-2">
                        {productCollections?.collections.map((collection) => (
                            <Link
                                key={collection.id}
                                href={`/collections/${collection.handle}`}
                                className="flex items-center gap-3 p-2 rounded-md hover:bg-accent transition-colors group"
                            >
                                {collection.image ? (
                                    <Image
                                        src={collection.image.url}
                                        alt={collection.image.altText || collection.title}
                                        width={64}
                                        height={64}
                                        className="h-16 w-16 object-cover rounded"
                                    />
                                ) : (
                                    <div className="h-16 w-16 rounded bg-muted flex items-center justify-center">
                                        <span className="text-muted-foreground text-xs">{t.common.noImage}</span>
                                    </div>
                                )}
                                <span className="text-sm font-medium group-hover:text-primary transition-colors">
                                    {collection.title}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Space Collections */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">{t.home.shopBySpace}</h3>
                    <div className="space-y-2">
                        {spaceCollections?.collections.map((collection) => (
                            <Link
                                key={collection.id}
                                href={`/collections/${collection.handle}`}
                                className="flex items-center gap-3 p-2 rounded-md hover:bg-accent transition-colors group"
                            >
                                {collection.image ? (
                                    <Image
                                        src={collection.image.url}
                                        alt={collection.image.altText || collection.title}
                                        width={64}
                                        height={64}
                                        className="h-16 w-16 object-cover rounded"
                                    />
                                ) : (
                                    <div className="h-16 w-16 rounded bg-muted flex items-center justify-center">
                                        <span className="text-muted-foreground text-xs">{t.common.noImage}</span>
                                    </div>
                                )}
                                <span className="text-sm font-medium group-hover:text-primary transition-colors">
                                    {collection.title}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

const SubHeader = () => {
    const { data, isLoading, error } = useMenuByHandle({
        handle: 'sub-menu',
    });
    
    // Prefetch collections data for megamenu
    const { data: productCollections, isLoading: productsLoading } = useCollectionsByMetadata({
        metadataValue: "product",
        first: 50
    })
    
    const { data: spaceCollections, isLoading: spacesLoading } = useCollectionsByMetadata({
        metadataValue: "space",
        first: 50
    })

    const collectionsLoading = productsLoading || spacesLoading

    console.log(data, "header-links");
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
        const navigationMenuItems: React.ReactElement[] = []
        const regularItems: React.ReactElement[] = []

        menuItems.forEach((item) => {
            // Check if this is the "Productos" menu item to render with megamenu
            if (item.title === "Productos" || item.title === "Products") {
                navigationMenuItems.push(
                    <NavigationMenu key={item.id}>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="hover:opacity-80 transition-opacity bg-transparent hover:bg-accent">
                                    {item.title}
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ProductsMegaMenu 
                                        productCollections={productCollections}
                                        spaceCollections={spaceCollections}
                                        isLoading={collectionsLoading}
                                    />
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                )
            } else if (item.items && item.items.length > 0) {
                regularItems.push(
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
                )
            } else {
                regularItems.push(
                    <React.Fragment key={item.id}>
                        {renderMenuItem(item)}
                    </React.Fragment>
                )
            }
        })

        return [...navigationMenuItems, ...regularItems]
    };

    return (
        <>
            {renderMenuItems(items)}
        </>
    );
}

export default SubHeader