'use client';

import React, { useState } from 'react';
import { useMenuByHandle } from '@/components/hooks/useMenu';
import Link from 'next/link';
import type { MenuItem } from '@/lib/types/shopify';
import { Skeleton } from '../ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
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
            <div className="w-[800px] p-6 bg-background border border-border rounded-md shadow-lg">
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
        <div className="w-[800px] p-6 bg-background border border-border rounded-md shadow-lg">
            <div className="grid grid-cols-2 gap-8">
                {/* Product Collections */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">{t.home.shopByProduct}</h3>
                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
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
                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
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
    // All hooks must be called at the top before any conditional returns
    const [megaMenuOpen, setMegaMenuOpen] = useState(false);
    const [megaMenuTimeoutId, setMegaMenuTimeoutId] = useState<NodeJS.Timeout | null>(null);

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

    const handleMegaMenuMouseEnter = () => {
        if (megaMenuTimeoutId) {
            clearTimeout(megaMenuTimeoutId);
            setMegaMenuTimeoutId(null);
        }
        setMegaMenuOpen(true);
    };

    const handleMegaMenuMouseLeave = () => {
        const timeoutId = setTimeout(() => {
            setMegaMenuOpen(false);
        }, 150);
        setMegaMenuTimeoutId(timeoutId);
    };

    const renderMenuItems = (menuItems: MenuItem[]) => {
        return menuItems.map((item) => {
            if (item.title === "Productos" || item.title === "Products") {
                const { href, isExternal } = formatUrl(item.url);
                
                return (
                    <div 
                        key={item.id} 
                        className="relative"
                        onMouseEnter={handleMegaMenuMouseEnter}
                        onMouseLeave={handleMegaMenuMouseLeave}
                    >
                        {isExternal ? (
                            <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                            >
                                {item.title}
                                <ChevronDown 
                                    className={`h-3 w-3 transition-transform duration-200 ${megaMenuOpen ? 'rotate-180' : ''}`}
                                />
                            </a>
                        ) : (
                            <Link
                                href={href}
                                className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                            >
                                {item.title}
                                <ChevronDown 
                                    className={`h-3 w-3 transition-transform duration-200 ${megaMenuOpen ? 'rotate-180' : ''}`}
                                />
                            </Link>
                        )}
                        
                        <AnimatePresence>
                            {megaMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ 
                                        duration: 0.2,
                                        ease: "easeOut"
                                    }}
                                    className="absolute top-full left-0 mt-2 z-50"
                                >
                                    <ProductsMegaMenu 
                                        productCollections={productCollections}
                                        spaceCollections={spaceCollections}
                                        isLoading={collectionsLoading}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            } else if (item.items && item.items.length > 0) {
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