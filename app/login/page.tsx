"use client"

import { LoginForm } from "@/components/auth/login-form"
import Link from "next/link"
import { useLanguage } from "@/lib/contexts/language-context"
import { translations } from "@/lib/i18n/translations"
  
export default function LoginPage() {
  const { language } = useLanguage()
  const t = translations[language]
  return (
    <div className="container min-h-screen mx-auto px-4 py-16">
      <LoginForm />
      <p className="text-center mt-4 text-sm text-gray-600">
        {t.auth.login.dontHaveAccount} {" "}
        <Link href="/register" className="text-primary hover:underline font-medium">
          {t.auth.login.createAccountHere}
        </Link>
      </p>
    </div>
  )
}

