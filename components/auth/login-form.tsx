"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { login } from "@/lib/auth"
import { useAuth } from "@/components/providers/auth-provider"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/contexts/language-context"
import { translations } from "@/lib/i18n/translations"

type LoginFormData = {
  email: string
  password: string
}

export function LoginForm() {
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
  } = useForm<LoginFormData>()

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError(null)

    // Validate with zod
    const loginSchema = z.object({
      email: z.string().email(t.auth.login.invalidEmail),
      password: z.string().min(5, t.auth.login.passwordMinLength),
    })

    const validation = loginSchema.safeParse(data)
    if (!validation.success) {
      const firstError = Object.values(validation.error.flatten().fieldErrors)[0]?.[0]
      setError(firstError || t.auth.login.loginFailed)
      setIsLoading(false)
      return
    }

    try {
      await login(validation.data)
      await refetch()
      router.push("/account")
    } catch (err) {
      setError(err instanceof Error ? err.message : t.auth.login.loginFailed)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{t.auth.login.title}</CardTitle>
        <CardDescription>{t.auth.login.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              {t.auth.login.email}
            </label>
            <Input
              id="email"
              type="email"
              placeholder={t.auth.login.emailPlaceholder}
              {...register("email", { 
                required: t.auth.login.invalidEmail,
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: t.auth.login.invalidEmail,
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
              {t.auth.login.password}
            </label>
            <Input
              id="password"
              type="password"
              placeholder={t.auth.login.passwordPlaceholder}
              {...register("password", { 
                required: t.auth.login.passwordMinLength,
                minLength: {
                  value: 5,
                  message: t.auth.login.passwordMinLength,
                },
              })}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t.auth.login.signingIn : t.auth.login.signIn}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

