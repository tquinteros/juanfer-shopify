"use client"

import { RegisterForm } from "@/components/auth/register-form"
import Link from "next/link"
import { useLanguage } from "@/lib/contexts/language-context"
import { translations } from "@/lib/i18n/translations"

export default function RegisterPage() {
  const { language } = useLanguage()
  const t = translations[language]
  return (
    <div className="container mx-auto px-4 py-16">
      <RegisterForm />
      <p className="text-center mt-4 text-sm text-muted-foreground">
        {t.auth.register.alreadyHaveAccount}{" "}
        <Link href="/login" className="text-primary hover:underline font-medium">
          {t.auth.register.signInHere}
        </Link>
      </p>
    </div>
  )
}

