"use client"

import { useState, useRef, useEffect } from "react"
import { User, Heart, ShoppingCart, ChevronDown, Phone, Mail, Search, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { useCart } from "@/components/providers/cart-provider"
import { CartDrawer } from "@/components/cart/cart-drawer"
import { useProductSearch } from "@/components/hooks/useProductSearch"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLanguage, languages } from "@/lib/contexts/language-context"
import { translations } from "@/lib/i18n/translations"
import { ThemeToggler } from "./theme-toggler"

export function Header() {
    const { language, setLanguage, getLanguageLabel } = useLanguage()
    const selectedLanguageLabel = getLanguageLabel()
    const t = translations[language]
    const [searchQuery, setSearchQuery] = useState("")
    const [debouncedQuery, setDebouncedQuery] = useState("")
    const [showSearchResults, setShowSearchResults] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
    const [mobileSearchQuery, setMobileSearchQuery] = useState("")
    const [mobileDebouncedQuery, setMobileDebouncedQuery] = useState("")
    const searchRef = useRef<HTMLDivElement>(null)
    const router = useRouter()
    const { cart, openCart } = useCart()
    const cartQuantity = cart?.totalQuantity || 0

    // Debounce search query (desktop)
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery)
        }, 300)

        return () => clearTimeout(timer)
    }, [searchQuery])

    // Debounce mobile search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setMobileDebouncedQuery(mobileSearchQuery)
        }, 300)

        return () => clearTimeout(timer)
    }, [mobileSearchQuery])

    // Close search results when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSearchResults(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    // Search products (desktop)
    const { data: searchData, isLoading: isSearching } = useProductSearch({
        query: debouncedQuery,
        first: 5,
        enabled: debouncedQuery.length >= 2,
        language,
    })

    // Search products (mobile)
    const { data: mobileSearchData, isLoading: isMobileSearching } = useProductSearch({
        query: mobileDebouncedQuery,
        first: 10,
        enabled: mobileDebouncedQuery.length >= 2 && mobileSearchOpen,
        language,
    })

    const searchResults = searchData?.products.edges.slice(0, 5) || []
    const mobileSearchResults = mobileSearchData?.products.edges || []

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSearchQuery(value)
        setShowSearchResults(value.length >= 2)
    }

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            router.push(`/products?name=${encodeURIComponent(searchQuery.trim())}`)
            setShowSearchResults(false)
            setSearchQuery("")
        }
    }

    const handleProductClick = () => {
        setShowSearchResults(false)
        setSearchQuery("")
    }

    const handleMobileSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMobileSearchQuery(e.target.value)
    }

    const handleMobileSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (mobileSearchQuery.trim()) {
            router.push(`/products?name=${encodeURIComponent(mobileSearchQuery.trim())}`)
            setMobileSearchOpen(false)
            setMobileSearchQuery("")
        }
    }

    const handleMobileProductClick = () => {
        setMobileSearchOpen(false)
        setMobileSearchQuery("")
    }

    const handleNavLinkClick = () => {
        setMobileMenuOpen(false)
    }

    return (
        <>
            <header className="w-full sticky bg-white dark:bg-black top-0 z-50">
                {mobileSearchOpen && (
                    <div className="fixed inset-0 z-60 md:hidden">
                        <div className="p-4">
                            <form onSubmit={handleMobileSearchSubmit} className="flex items-center gap-2 mb-4">
                                <Input
                                    type="search"
                                    placeholder={t.header.searchPlaceholder}
                                    className="flex-1"
                                    value={mobileSearchQuery}
                                    onChange={handleMobileSearchChange}
                                    autoFocus
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setMobileSearchOpen(false)}
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </form>

                            {/* Mobile Search Results */}
                            <div className="overflow-y-auto max-h-[calc(100vh-80px)]">
                                {isMobileSearching ? (
                                    <div className="space-y-3">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <div key={i} className="flex gap-3">
                                                <Skeleton className="h-20 w-20 rounded" />
                                                <div className="flex-1 space-y-2">
                                                    <Skeleton className="h-4 w-3/4" />
                                                    <Skeleton className="h-4 w-1/2" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : mobileSearchResults.length > 0 ? (
                                    <div className="space-y-2">
                                        {mobileSearchResults.map(({ node: product }) => {
                                            const firstImage = product.images.edges[0]?.node
                                            const price = product.priceRange.minVariantPrice
                                            const productId = product.id.split('/').pop()

                                            return (
                                                <Link
                                                    key={product.id}
                                                    href={`/product/${productId}`}
                                                    onClick={handleMobileProductClick}
                                                    className="flex items-center gap-3 p-3 hover:bg-accent transition-colors rounded-lg"
                                                >
                                                    {firstImage ? (
                                                        <Image
                                                            src={firstImage.url}
                                                            alt={firstImage.altText || product.title}
                                                            width={80}
                                                            height={80}
                                                            className="h-20 w-20 object-cover rounded"
                                                        />
                                                    ) : (
                                                        <div className="h-20 w-20 rounded flex items-center justify-center">
                                                            <span className="text-muted-foreground text-xs">{t.common.noImage}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-medium text-sm">{product.title}</h4>
                                                        <p className="text-sm text-muted-foreground">
                                                            ${parseFloat(price.amount).toFixed(2)} {price.currencyCode}
                                                        </p>
                                                    </div>
                                                </Link>
                                            )
                                        })}
                                    </div>
                                ) : mobileDebouncedQuery.length >= 2 ? (
                                    <div className="text-center text-muted-foreground py-8">
                                        {t.header.noProductsFound} &quot;{mobileDebouncedQuery}&quot;
                                    </div>
                                ) : (
                                    <div className="text-center text-muted-foreground py-8">
                                        {t.header.searchPlaceholder}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <div className="border-b border-border">
                    <div className="container mx-auto px-4 py-4">
                        <div className="hidden md:flex items-center justify-between gap-4">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="flex items-center justify-center w-10 h-10 bg-primary text-primary-foreground rounded font-bold text-lg">
                                    FP
                                </div>
                                <span className="text-xl font-bold uppercase tracking-tight">FESTFLOOR</span>
                            </Link>

                            <div className="flex-1 max-w-2xl relative" ref={searchRef}>
                                <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                                    <div className="relative flex-1">
                                        <Input
                                            type="search"
                                            placeholder={t.header.searchPlaceholder}
                                            className="flex-1 rounded-full pr-10"
                                            value={searchQuery}
                                            onChange={handleSearchChange}
                                            onFocus={() => searchQuery.length >= 2 && setShowSearchResults(true)}
                                        />
                                        {isSearching && (
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-foreground"></div>
                                            </div>
                                        )}
                                    </div>
                                    <Button
                                        type="submit"
                                        className="rounded-full"
                                    >
                                        <Search className="h-4 w-4" />
                                    </Button>
                                </form>

                                {showSearchResults && debouncedQuery.length >= 2 && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                                        {isSearching ? (
                                            <div className="p-4 space-y-3">
                                                {Array.from({ length: 3 }).map((_, i) => (
                                                    <div key={i} className="flex gap-3">
                                                        <Skeleton className="h-16 w-16 rounded" />
                                                        <div className="flex-1 space-y-2">
                                                            <Skeleton className="h-4 w-3/4" />
                                                            <Skeleton className="h-4 w-1/2" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : searchResults.length > 0 ? (
                                            <div className="py-2">
                                                {searchResults.map(({ node: product }) => {
                                                    const firstImage = product.images.edges[0]?.node
                                                    const price = product.priceRange.minVariantPrice
                                                    const productId = product.id.split('/').pop()

                                                    return (
                                                        <Link
                                                            key={product.id}
                                                            href={`/product/${productId}`}
                                                            onClick={handleProductClick}
                                                            className="flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors"
                                                        >
                                                            {firstImage ? (
                                                                <Image
                                                                    src={firstImage.url}
                                                                    alt={firstImage.altText || product.title}
                                                                    width={64}
                                                                    height={64}
                                                                    className="h-16 w-16 object-cover rounded"
                                                                />
                                                            ) : (
                                                                <div className="h-16 w-16 rounded flex items-center justify-center">
                                                                    <span className="text-muted-foreground text-xs">{t.common.noImage}</span>
                                                                </div>
                                                            )}
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="font-medium text-sm truncate">{product.title}</h4>
                                                                <p className="text-sm text-muted-foreground">
                                                                    ${parseFloat(price.amount).toFixed(2)} {price.currencyCode}
                                                                </p>
                                                            </div>
                                                        </Link>
                                                    )
                                                })}
                                            </div>
                                        ) : (
                                            <div className="p-4 text-center text-muted-foreground text-sm">
                                                {t.header.noProductsFound} &quot;{debouncedQuery}&quot;
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-4">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="gap-1">
                                            {selectedLanguageLabel}
                                            <ChevronDown className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        {languages.map((lang) => (
                                            <DropdownMenuItem
                                                key={lang.code}
                                                onClick={() => setLanguage(lang.code)}
                                            >
                                                {lang.label}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <ThemeToggler />
                                <Link href="/account">
                                    <Button variant="ghost" size="icon" className="relative">
                                        <User className="h-5 w-5" />
                                    </Button>
                                </Link>

                                <Button variant="ghost" size="icon" className="relative">
                                    <Heart className="h-5 w-5" />
                                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                                        0
                                    </span>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="relative"
                                    onClick={openCart}
                                >
                                    <ShoppingCart className="h-5 w-5" />
                                    {cartQuantity > 0 && (
                                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                                            {cartQuantity}
                                        </span>
                                    )}
                                </Button>
                            </div>
                        </div>

                        <div className="flex md:hidden items-center justify-between gap-4">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="flex items-center justify-center w-10 h-10 bg-primary text-primary-foreground rounded font-bold text-lg">
                                    FP
                                </div>
                                <span className="text-xl font-bold uppercase tracking-tight">FESTFLOOR</span>
                            </Link>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setMobileSearchOpen(true)}
                                >
                                    <Search className="h-5 w-5" />
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="relative"
                                    onClick={openCart}
                                >
                                    <ShoppingCart className="h-5 w-5" />
                                    {cartQuantity > 0 && (
                                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                                            {cartQuantity}
                                        </span>
                                    )}
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setMobileMenuOpen(true)}
                                >
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:block bg-[#EEF0F2] dark:bg-[#1C1B1A]">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-between">
                            <nav className="flex items-center gap-6 py-3">
                                <Link href="/products" className="hover:opacity-80 transition-opacity">
                                    {t.header.nav.shop}
                                </Link>
                                <Link href="/blogs" className="hover:opacity-80 transition-opacity">
                                    {t.header.nav.blogs}
                                </Link>
                                <Link href="/microcement-kits" className="hover:opacity-80 transition-opacity">
                                    {t.header.nav.microcementKits}
                                </Link>
                                <Link href="/samples" className="hover:opacity-80 transition-opacity">
                                    {t.header.nav.samples}
                                </Link>
                                <Link href="/colors" className="hover:opacity-80 transition-opacity">
                                    {t.header.nav.colors}
                                </Link>
                                <Link href="/inspirations" className="hover:opacity-80 transition-opacity">
                                    {t.header.nav.inspirations}
                                </Link>
                                <Link href="/knowledge" className="hover:opacity-80 transition-opacity">
                                    {t.header.nav.knowledge}
                                </Link>
                                <Link href="/collaboration" className="hover:opacity-80 transition-opacity">
                                    {t.header.nav.collaboration}
                                </Link>
                                <Link href="/contact" className="hover:opacity-80 transition-opacity">
                                    {t.header.nav.contact}
                                </Link>
                            </nav>

                            <div className="flex items-center gap-6">
                                <a
                                    href="tel:+48537991307"
                                    className="flex items-center gap-2 hover:opacity-80 transition-opacity underline"
                                >
                                    <Phone className="h-4 w-4" />
                                    <span>+48 537 991 307</span>
                                </a>
                                <a
                                    href="mailto:hello@festfloor.com"
                                    className="flex items-center gap-2 hover:opacity-80 transition-opacity underline"
                                >
                                    <Mail className="h-4 w-4" />
                                    <span>hello@festfloor.com</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <Drawer open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} direction="right">
                <DrawerContent className="h-full max-h-full rounded-none">
                    <DrawerHeader hidden>
                        <DrawerTitle>{t.header.nav.shop}</DrawerTitle>
                    </DrawerHeader>
                    <div className="px-4 py-8 overflow-y-auto">
                        <div className="mb-6">
                            {/* <p className="text-sm font-medium text-gray-500 mb-2">{t.header.nav.language}</p> */}
                            <div className="flex flex-wrap gap-2">
                                {languages.map((lang) => (
                                    <Button
                                        key={lang.code}
                                        variant={language === lang.code ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setLanguage(lang.code)}
                                    >
                                        {lang.label}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <Separator className="my-4" />

                        <div className="space-y-2 mb-6">
                            <Link href="/account" onClick={handleNavLinkClick}>
                                <Button variant="ghost" className="w-full justify-start gap-2">
                                    <User className="h-5 w-5" />
                                    {t.header.nav.account}
                                </Button>
                            </Link>
                            <Button variant="ghost" className="w-full justify-start gap-2">
                                <Heart className="h-5 w-5" />
                                {t.header.nav.wishlist} (0)
                            </Button>
                        </div>

                        <Separator className="my-4" />

                        <nav className="space-y-2">
                            <Link href="/products" onClick={handleNavLinkClick}>
                                <Button variant="ghost" className="w-full justify-start">
                                    {t.header.nav.shop}
                                </Button>
                            </Link>
                            <Link href="/blogs" onClick={handleNavLinkClick}>
                                <Button variant="ghost" className="w-full justify-start">
                                    {t.header.nav.blogs}
                                </Button>
                            </Link>
                            <Link href="/microcement-kits" onClick={handleNavLinkClick}>
                                <Button variant="ghost" className="w-full justify-start">
                                    {t.header.nav.microcementKits}
                                </Button>
                            </Link>
                            <Link href="/samples" onClick={handleNavLinkClick}>
                                <Button variant="ghost" className="w-full justify-start">
                                    {t.header.nav.samples}
                                </Button>
                            </Link>
                            <Link href="/colors" onClick={handleNavLinkClick}>
                                <Button variant="ghost" className="w-full justify-start">
                                    {t.header.nav.colors}
                                </Button>
                            </Link>
                            <Link href="/inspirations" onClick={handleNavLinkClick}>
                                <Button variant="ghost" className="w-full justify-start">
                                    {t.header.nav.inspirations}
                                </Button>
                            </Link>
                            <Link href="/knowledge" onClick={handleNavLinkClick}>
                                <Button variant="ghost" className="w-full justify-start">
                                    {t.header.nav.knowledge}
                                </Button>
                            </Link>
                            <Link href="/collaboration" onClick={handleNavLinkClick}>
                                <Button variant="ghost" className="w-full justify-start">
                                    {t.header.nav.collaboration}
                                </Button>
                            </Link>
                            <Link href="/contact" onClick={handleNavLinkClick}>
                                <Button variant="ghost" className="w-full justify-start">
                                    {t.header.nav.contact}
                                </Button>
                            </Link>
                        </nav>

                        <Separator className="my-4" />

                        <div className="space-y-2">
                            <a
                                href="tel:+48537991307"
                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                            >
                                <Phone className="h-4 w-4" />
                                <span>+48 537 991 307</span>
                            </a>
                            <a
                                href="mailto:hello@festfloor.com"
                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                            >
                                <Mail className="h-4 w-4" />
                                <span>hello@festfloor.com</span>
                            </a>
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>

            <CartDrawer />
        </>
    )
}

