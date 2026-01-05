"use client"

import { useState } from "react"
import { User, Heart, ShoppingCart, ChevronDown, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useCart } from "@/components/providers/cart-provider"
import { CartDrawer } from "@/components/cart/cart-drawer"
import Link from "next/link"

const languages = [
    { code: "en", label: "GB English" },
    { code: "es", label: "ES Español" },
    { code: "fr", label: "FR Français" },
]

export function Header() {
    const [selectedLanguage, setSelectedLanguage] = useState(languages[0].label)
    const { cart, openCart } = useCart()
    const cartQuantity = cart?.totalQuantity || 0

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

                        <div className="flex-1 max-w-2xl flex items-center gap-2">
                            <Input
                                type="search"
                                placeholder="Search for products"
                                className="flex-1 rounded-full"
                            />
                            <Button className="rounded-full bg-gray-800 hover:bg-gray-700 text-white">
                                search
                            </Button>
                        </div>

                        <div className="flex items-center gap-4">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="gap-1">
                                        {selectedLanguage}
                                        <ChevronDown className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {languages.map((lang) => (
                                        <DropdownMenuItem
                                            key={lang.code}
                                            onClick={() => setSelectedLanguage(lang.label)}
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
                            <Link aria-disabled={true} href="/microcement-kits" className="hover:text-gray-300 transition-colors">
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

