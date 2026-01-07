"use client"

import { useAuth } from "@/components/providers/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useLanguage } from "@/lib/contexts/language-context"
import { translations } from "@/lib/i18n/translations"

export function AccountDetailsTab() {
  const { customer, isLoading } = useAuth()
  const { language } = useLanguage()
  const t = translations[language]
  console.log(customer,"customer")
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    )
  }

  if (!customer) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">{t.account.details.noCustomerData}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t.account.details.personalInformation}</CardTitle>
          <CardDescription>{t.account.details.accountDetails}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">{t.account.details.firstName}</label>
              <p className="text-lg">{customer.firstName || "—"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">{t.account.details.lastName}</label>
              <p className="text-lg">{customer.lastName || "—"}</p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">{t.account.details.email}</label>
            <p className="text-lg">{customer.email}</p>
          </div>

          {customer.phone && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">{t.account.details.phone}</label>
              <p className="text-lg">{customer.phone}</p>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-muted-foreground">{t.account.details.customerId}</label>
            <p className="text-sm text-muted-foreground font-mono">{customer.id}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

