"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { register as registerCustomer } from "@/lib/auth"
import { useAuth } from "@/components/providers/auth-provider"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/contexts/language-context"
import { translations } from "@/lib/i18n/translations"

type RegisterFormData = {
  email: string
  password: string
  firstName: string
  lastName: string
}

export function RegisterForm() {
  const router = useRouter()
  const { refetch } = useAuth()
  const { language } = useLanguage()
  const t = translations[language]
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>()

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    setError(null)

    // Validate with zod
    const registerSchema = z.object({
      email: z.string().email(t.auth.register.invalidEmail),
      password: z.string().min(5, t.auth.register.passwordMinLength),
      firstName: z.string().min(1, t.auth.register.firstNameRequired),
      lastName: z.string().min(1, t.auth.register.lastNameRequired),
    })

    const validation = registerSchema.safeParse(data)
    if (!validation.success) {
      const firstError = Object.values(validation.error.flatten().fieldErrors)[0]?.[0]
      setError(firstError || t.auth.register.registrationFailed)
      setIsLoading(false)
      return
    }

    try {
      await registerCustomer(validation.data)
      await refetch()
      router.push("/account")
    } catch (err) {
      setError(err instanceof Error ? err.message : t.auth.register.registrationFailed)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{t.auth.register.title}</CardTitle>
        <CardDescription>{t.auth.register.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-sm font-medium">
                {t.auth.register.firstName}
              </label>
              <Input
                id="firstName"
                placeholder={t.auth.register.firstNamePlaceholder}
                {...register("firstName", { 
                  required: t.auth.register.firstNameRequired,
                })}
                disabled={isLoading}
              />
              {errors.firstName && (
                <p className="text-sm text-red-600">{errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="lastName" className="text-sm font-medium">
                {t.auth.register.lastName}
              </label>
              <Input
                id="lastName"
                placeholder={t.auth.register.lastNamePlaceholder}
                {...register("lastName", { 
                  required: t.auth.register.lastNameRequired,
                })}
                disabled={isLoading}
              />
              {errors.lastName && (
                <p className="text-sm text-red-600">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              {t.auth.register.email}
            </label>
            <Input
              id="email"
              type="email"
              placeholder={t.auth.register.emailPlaceholder}
              {...register("email", { 
                required: t.auth.register.invalidEmail,
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: t.auth.register.invalidEmail,
                },
              })}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              {t.auth.register.password}
            </label>
            <Input
              id="password"
              type="password"
              placeholder={t.auth.register.passwordPlaceholder}
              {...register("password", { 
                required: t.auth.register.passwordMinLength,
                minLength: {
                  value: 5,
                  message: t.auth.register.passwordMinLength,
                },
              })}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t.auth.register.creatingAccount : t.auth.register.createAccount}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

