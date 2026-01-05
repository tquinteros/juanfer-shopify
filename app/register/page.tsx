"use client"

import { RegisterForm } from "@/components/auth/register-form"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <RegisterForm />
      <p className="text-center mt-4 text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline font-medium">
          Sign in here
        </Link>
      </p>
    </div>
  )
}

