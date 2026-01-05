"use client"

import { useAuth } from "@/components/providers/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function AccountDetailsTab() {
  const { customer, isLoading } = useAuth()
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
          <p className="text-muted-foreground">No customer data available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Your account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">First Name</label>
              <p className="text-lg">{customer.firstName || "—"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Last Name</label>
              <p className="text-lg">{customer.lastName || "—"}</p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Email</label>
            <p className="text-lg">{customer.email}</p>
          </div>

          {customer.phone && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Phone</label>
              <p className="text-lg">{customer.phone}</p>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-muted-foreground">Customer ID</label>
            <p className="text-sm text-muted-foreground font-mono">{customer.id}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

