"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail, Instagram, Facebook, Youtube, Twitter, Linkedin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/contexts/language-context"
import { translations } from "@/lib/i18n/translations"

export function Footer() {
  const { language } = useLanguage()
  const t = translations[language]
  const [email, setEmail] = useState("")

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement newsletter subscription
    console.log("Newsletter subscription:", email)
    setEmail("")
  }

  return (
    <footer className="bg-[#EEF0F2] dark:bg-[#1C1B1A]">
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Newsletter & Social Media */}
          <div className="lg:col-span-1">
            <h3 className="uppercase font-semibold mb-4 text-sm">
              {t.footer.newsletter.title}
            </h3>
            <form onSubmit={handleNewsletterSubmit} className="mb-6">
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder={t.footer.newsletter.placeholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  required
                />
                <Button
                  type="submit"
                  variant="secondary"
                  className="rounded-full p-2 h-auto w-auto"
                >
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </form>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* SHOP */}
          <div>
            <h3 className=" uppercase font-semibold mb-4 text-sm">
              {t.footer.shop.title}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="hover:opacity-80 transition-opacity">
                  {t.footer.shop.allProducts}
                </Link>
              </li>
              <li>
                <Link href="/microcement-kits" className="hover:opacity-80 transition-opacity">
                  {t.footer.shop.microcementKits}
                </Link>
              </li>
              <li>
                <Link href="/samples" className="hover:opacity-80 transition-opacity">
                  {t.footer.shop.samples}
                </Link>
              </li>
              <li>
                <Link href="/colors" className="hover:opacity-80 transition-opacity">
                  {t.footer.shop.colors}
                </Link>
              </li>
              <li>
                <Link href="/products?category=tools" className="hover:opacity-80 transition-opacity">
                  {t.footer.shop.tools}
                </Link>
              </li>
            </ul>
          </div>

          {/* INSPIRATION AND ADVICE */}
          <div>
            <h3 className="uppercase font-semibold mb-4 text-sm">
              {t.footer.inspiration.title}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/inspirations" className="hover:opacity-80 transition-opacity">
                  {t.footer.inspiration.inspirations}
                </Link>
              </li>
              <li>
                <Link href="/knowledge" className="hover:opacity-80 transition-opacity">
                  {t.footer.inspiration.knowledge}
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="hover:opacity-80 transition-opacity">
                  {t.footer.inspiration.blogs}
                </Link>
              </li>
              <li>
                <Link href="/collaboration" className="hover:opacity-80 transition-opacity">
                  {t.footer.inspiration.collaboration}
                </Link>
              </li>
            </ul>
          </div>

          {/* ABOUT US */}
          <div>
            <h3 className="uppercase font-semibold mb-4 text-sm">
              {t.footer.about.title}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:opacity-80 transition-opacity">
                  {t.footer.about.ourStory}
                </Link>
              </li>
              <li>
                <Link href="/sustainability" className="hover:opacity-80 transition-opacity">
                  {t.footer.about.sustainability}
                </Link>
              </li>
              <li>
                <Link href="/collaboration" className="hover:opacity-80 transition-opacity">
                  {t.footer.about.workWithUs}
                </Link>
              </li>
              <li>
                <Link href="/stockists" className="hover:opacity-80 transition-opacity">
                  {t.footer.about.stockists}
                </Link>
              </li>
            </ul>
          </div>

          {/* HELP & FAQS */}
          <div>
            <h3 className="uppercase font-semibold mb-4 text-sm">
              {t.footer.help.title}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="hover:opacity-80 transition-opacity">
                  {t.footer.help.contact}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:opacity-80 transition-opacity">
                  {t.footer.help.faq}
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:opacity-80 transition-opacity">
                  {t.footer.help.shipping}
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:opacity-80 transition-opacity">
                  {t.footer.help.returns}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:opacity-80 transition-opacity">
                  {t.footer.help.terms}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:opacity-80 transition-opacity">
                  {t.footer.help.privacy}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} {t.footer.copyright}
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                {t.footer.legal.terms}
              </Link>
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                {t.footer.legal.privacy}
              </Link>
              <Link href="/cookies" className="text-muted-foreground hover:text-foreground transition-colors">
                {t.footer.legal.cookies}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

