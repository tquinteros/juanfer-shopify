"use client"

import { LoginForm } from "@/components/auth/login-form"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <LoginForm />
      <p className="text-center mt-4 text-sm text-gray-600">
        Don't have an account?{" "}
        <Link href="/register" className="text-primary hover:underline font-medium">
          Create one here
        </Link>
      </p>
    </div>
  )
}

