"use client"

import { useArticleById } from "@/components/hooks/useBlogs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, User, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { use } from "react"
import { useLanguage } from "@/lib/contexts/language-context"
import { translations } from "@/lib/i18n/translations"

interface BlogPageProps {
  params: Promise<{
    id: string
  }>
}

export default function BlogPage({ params }: BlogPageProps) {
  const { language } = useLanguage()
  const t = translations[language]
  const { id } = use(params)

  // Convert numeric ID to Shopify GID format if needed
  const articleId = id.startsWith('gid://')
    ? id
    : `gid://shopify/Article/${id}`

  const { data, isLoading, error } = useArticleById({ id: articleId })

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertDescription>
            {t.blogs.errorLoadingArticle}: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-12 w-48 mb-6" />
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-1/2 mb-8" />
          <Skeleton className="w-full h-96 rounded-lg mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    )
  }

  const article = data?.article

  if (!article) {
    return (
      <div className="container mx-auto py-8">
        <Alert>
          <AlertDescription>{t.blogs.articleNotFound}</AlertDescription>
        </Alert>
      </div>
    )
  }

  const publishedDate = new Date(article.publishedAt)
  const formattedDate = publishedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link href="/blogs">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t.blogs.backToBlogs}
          </Button>
        </Link>

        {/* Article Header */}
        <div className="mb-8">
          {article.blog && (
            <Link
              href={`/blogs/${article.blog.handle}`}
              className="text-sm text-primary hover:underline mb-2 inline-block"
            >
              {article.blog.title}
            </Link>
          )}
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{article.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
            {article.author && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{article.author.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Featured Image */}
        {article.image && (
          <div className="relative w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden mb-8">
            <Image
              src={article.image.url}
              alt={article.image.altText || article.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Article Content */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            {article.excerpt && (
              <div className="prose prose-lg max-w-none mb-6">
                <p className="text-xl text-muted-foreground italic">{article.excerpt}</p>
              </div>
            )}

            {article.contentHtml ? (
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: article.contentHtml }}
              />
            ) : article.content ? (
              <div className="prose prose-lg max-w-none whitespace-pre-wrap">
                {article.content}
              </div>
            ) : (
              <p className="text-muted-foreground">{t.blogs.noContentAvailable}</p>
            )}
          </CardContent>
        </Card>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">{t.blogs.tags}</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Back to Blogs Button */}
        <div className="text-center">
          <Link href="/blogs">
            <Button variant="outline" size="lg">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t.blogs.backToAllBlogs}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

