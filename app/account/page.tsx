"use client"

import { useAuth } from "@/components/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { AccountDetailsTab } from "@/components/account/account-details-tab"
import { OrdersTab } from "@/components/account/orders-tab"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { User, Package, LogOut } from "lucide-react"
import { useLanguage } from "@/lib/contexts/language-context"
import { translations } from "@/lib/i18n/translations"

export default function AccountPage() {
  const router = useRouter()
  const { customer, isLoading, isAuthenticated, logout } = useAuth()
  const { language } = useLanguage()
  const t = translations[language]

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  // Show loading state while checking authentication or if not authenticated yet
  if (isLoading || !isAuthenticated) {
    return (
      <div className="container mx-auto min-h-screen px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header skeleton matching the actual header structure */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div className="mb-4 md:mb-0">
              <Skeleton className="h-9 w-48 mb-2" />
              <Skeleton className="h-5 w-64" />
            </div>
            <Skeleton className="h-10 w-24 md:w-32" />
          </div>

          {/* Tabs skeleton */}
          <div className="mb-8">
            <div className="grid w-full grid-cols-2 gap-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          {/* Content skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64 mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!customer) {
    return null
  }

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  return (
    <div className="container mx-auto min-h-screen px-4 py-8 md:py-16">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t.account.title}</h1>
            <p className="text-muted-foreground">
              {t.account.welcomeBack.replace("{name}", customer.firstName || customer.displayName || "")}
            </p>
          </div>
          <Button variant="destructive" onClick={handleLogout} className="mt-4 md:mt-0">
            <LogOut className="h-4 w-4 mr-2" />
            {t.account.logout}
          </Button>
        </div>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="details" className="flex items-center cursor-pointer gap-2">
              <User className="h-4 w-4" />
              {t.account.tabs.details}
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center cursor-pointer gap-2">
              <Package className="h-4 w-4" />
              {t.account.tabs.orders}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <AccountDetailsTab />
          </TabsContent>

          <TabsContent value="orders">
            <OrdersTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
