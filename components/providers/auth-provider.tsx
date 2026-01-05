"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getCustomer, getCustomerToken, logout as logoutAuth } from '@/lib/auth'
import type { Customer } from '@/lib/types/customer'

interface AuthContextType {
  customer: Customer | null
  isLoading: boolean
  isAuthenticated: boolean
  refetch: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchCustomer = async () => {
    const token = getCustomerToken()

    if (!token) {
      setCustomer(null)
      setIsLoading(false)
      return
    }

    try {
      const customerData = await getCustomer(token)
      setCustomer(customerData)
    } catch (error) {
      console.error('Error fetching customer:', error)
      setCustomer(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomer()
  }, [])

  const logout = async () => {
    await logoutAuth()
    setCustomer(null)
  }

  return (
    <AuthContext.Provider
      value={{
        customer,
        isLoading,
        isAuthenticated: !!customer,
        refetch: fetchCustomer,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

