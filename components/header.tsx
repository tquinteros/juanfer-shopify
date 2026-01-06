"use client"

import { useState, useRef, useEffect } from "react"
import { User, Heart, ShoppingCart, ChevronDown, Phone, Mail, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useCart } from "@/components/providers/cart-provider"
import { CartDrawer } from "@/components/cart/cart-drawer"
import { useProductSearch } from "@/components/hooks/useProductSearch"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLanguage, languages } from "@/lib/contexts/language-context"

export function Header() {
    const { language, setLanguage, getLanguageLabel } = useLanguage()
    const selectedLanguageLabel = getLanguageLabel()
    const [searchQuery, setSearchQuery] = useState("")
    const [debouncedQuery, setDebouncedQuery] = useState("")
    const [showSearchResults, setShowSearchResults] = useState(false)
    const searchRef = useRef<HTMLDivElement>(null)
    const router = useRouter()
    const { cart, openCart } = useCart()
    const cartQuantity = cart?.totalQuantity || 0

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery)
        }, 300)

        return () => clearTimeout(timer)
    }, [searchQuery])

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

    // Search products
    const { data: searchData, isLoading: isSearching } = useProductSearch({
        query: debouncedQuery,
        first: 5,
        enabled: debouncedQuery.length >= 2,
        language,
    })

    const searchResults = searchData?.products.edges.slice(0, 5) || []

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

    return (
        <>
        <header className="w-full">
            <div className="bg-white border-b border-border">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between gap-4">
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
                                        placeholder="Search for products"
                                        className="flex-1 rounded-full pr-10"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        onFocus={() => searchQuery.length >= 2 && setShowSearchResults(true)}
                                    />
                                    {isSearching && (
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
                                        </div>
                                    )}
                                </div>
                                <Button 
                                    type="submit"
                                    className="rounded-full bg-gray-800 hover:bg-gray-700 text-white"
                                >
                                    <Search className="h-4 w-4" />
                                </Button>
                            </form>

                            {/* Search Results Dropdown */}
                            {showSearchResults && debouncedQuery.length >= 2 && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
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
                                                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
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
                                                            <div className="h-16 w-16 bg-gray-200 rounded flex items-center justify-center">
                                                                <span className="text-gray-400 text-xs">No image</span>
                                                            </div>
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-medium text-sm truncate">{product.title}</h4>
                                                            <p className="text-sm text-gray-600">
                                                                ${parseFloat(price.amount).toFixed(2)} {price.currencyCode}
                                                            </p>
                                                        </div>
                                                    </Link>
                                                )
                                            })}
                                        </div>
                                    ) : (
                                        <div className="p-4 text-center text-gray-500 text-sm">
                                            No products found for &quot;{debouncedQuery}&quot;
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

                            <Link href="/account">
                                <Button variant="ghost" size="icon" className="relative">
                                    <User className="h-5 w-5" />
                                </Button>
                            </Link>

                            <Button variant="ghost" size="icon" className="relative">
                                <Heart className="h-5 w-5" />
                                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs text-white">
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
                      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs text-white">
                        {cartQuantity}
                      </span>
                    )}
                  </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-800 text-white">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between">
                        <nav className="flex items-center gap-6 py-3">
                            <Link href="/products" className="hover:text-gray-300 transition-colors">
                                Shop
                            </Link>
                            <Link href="/blogs" className="hover:text-gray-300 transition-colors">
                                Blogs
                            </Link>
                            <Link href="/microcement-kits" className="hover:text-gray-300 transition-colors">
                                Microcement Kits
                            </Link>
                            <Link href="/samples" className="hover:text-gray-300 transition-colors">
                                Samples
                            </Link>
                            <Link href="/colors" className="hover:text-gray-300 transition-colors">
                                Colors
                            </Link>
                            <Link href="/inspirations" className="hover:text-gray-300 transition-colors">
                                Inspirations
                            </Link>
                            <Link href="/knowledge" className="hover:text-gray-300 transition-colors">
                                Knowledge
                            </Link>
                            <Link href="/collaboration" className="hover:text-gray-300 transition-colors">
                                Collaboration
                            </Link>
                            <Link href="/contact" className="hover:text-gray-300 transition-colors">
                                Contact
                            </Link>
                        </nav>

                        <div className="flex items-center gap-6">
                            <a
                                href="tel:+48537991307"
                                className="flex items-center gap-2 hover:text-gray-300 transition-colors underline"
                            >
                                <Phone className="h-4 w-4" />
                                <span>+48 537 991 307</span>
                            </a>
                            <a
                                href="mailto:hello@festfloor.com"
                                className="flex items-center gap-2 hover:text-gray-300 transition-colors underline"
                            >
                                <Mail className="h-4 w-4" />
                                <span>hello@festfloor.com</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </header>
        <CartDrawer />
        </>
    )
}

