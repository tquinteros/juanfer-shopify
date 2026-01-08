"use client"

import React, { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { useLanguage } from '@/lib/contexts/language-context'
import { translations } from '@/lib/i18n/translations'

type ContactFormValues = {
    firstName: string
    lastName: string
    email: string
    reason: string
}

const ContactForm = () => {
    const { language } = useLanguage()
    const t = translations[language]

    const contactFormSchema = useMemo(() => z.object({
        firstName: z.string().min(2, t.contact.validation.firstNameMin),
        lastName: z.string().min(2, t.contact.validation.lastNameMin),
        email: z.email(t.contact.validation.emailInvalid),
        reason: z.string().min(10, t.contact.validation.reasonMin),
    }), [t])

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ContactFormValues>({
        resolver: zodResolver(contactFormSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            reason: '',
        },
    })

    const onSubmit = (data: ContactFormValues) => {
        console.log('Form submitted with values:', data)
        toast.success(t.contact.submitSuccess)
        reset()
    }

    const onReset = () => {
        reset()
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>{t.contact.title}</CardTitle>
                <CardDescription>
                    {t.contact.description}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">{t.contact.firstName}</Label>
                            <Input
                                id="firstName"
                                placeholder={t.contact.firstNamePlaceholder}
                                {...register('firstName')}
                                className={errors.firstName ? 'border-destructive' : ''}
                            />
                            {errors.firstName && (
                                <p className="text-sm text-destructive">{errors.firstName.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="lastName">{t.contact.lastName}</Label>
                            <Input
                                id="lastName"
                                placeholder={t.contact.lastNamePlaceholder}
                                {...register('lastName')}
                                className={errors.lastName ? 'border-destructive' : ''}
                            />
                            {errors.lastName && (
                                <p className="text-sm text-destructive">{errors.lastName.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">{t.contact.email}</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder={t.contact.emailPlaceholder}
                            {...register('email')}
                            className={errors.email ? 'border-destructive' : ''}
                        />
                        {errors.email && (
                            <p className="text-sm text-destructive">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="reason">{t.contact.reason}</Label>
                        <Textarea
                            id="reason"
                            placeholder={t.contact.reasonPlaceholder}
                            rows={6}
                            {...register('reason')}
                            className={errors.reason ? 'border-destructive' : ''}
                        />
                        {errors.reason && (
                            <p className="text-sm text-destructive">{errors.reason.message}</p>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onReset}
                            className="flex-1"
                        >
                            {t.contact.reset}
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? t.contact.submitting : t.contact.submit}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

export default ContactForm