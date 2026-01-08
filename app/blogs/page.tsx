"use client"

import { useArticles } from "@/components/hooks/useBlogs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"
import Link from "next/link"
import { Calendar, User } from "lucide-react"
import { useLanguage } from "@/lib/contexts/language-context"
import { translations } from "@/lib/i18n/translations"

export default function BlogsPage() {
  const { language } = useLanguage()
  const t = translations[language]
  const { data, isLoading, error } = useArticles({ first: 12 })

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertDescription>
            {t.blogs.errorLoading}: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const articles = data?.articles.edges.map((edge) => edge.node) || []
  console.log(articles, "articles")
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{t.blogs.title}</h1>
        <p className="text-muted-foreground">
          {t.blogs.description}
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="p-0">
                <Skeleton className="h-48 w-full" />
              </CardHeader>
              <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => {
            const publishedDate = new Date(article.publishedAt)
            const formattedDate = publishedDate.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })

            return (
              <Card
                key={article.id}
                className="overflow-hidden hover:shadow-lg transition-shadow group"
              >
                <Link 
                  href={`/blog/${article.id.split('/').pop()}`} 
                  className="block"
                >
                  <CardHeader className="p-0">
                    {article.image ? (
                      <div className="relative w-full h-48 overflow-hidden">
                        <Image
                          src={article.image.url}
                          alt={article.image.altText || article.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-linear-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <span className="text-gray-500 text-sm">{t.common.noImage}</span>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formattedDate}</span>
                      </div>
                      {article.author && (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{article.author.name}</span>
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </CardTitle>
                    {article.excerpt && (
                      <CardDescription className="line-clamp-3">
                        {article.excerpt}
                      </CardDescription>
                    )}
                    {article.tags && article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {article.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-gray-100 px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Link>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            {t.blogs.noArticlesFound}
          </p>
        </div>
      )}

      {data?.articles.pageInfo.hasNextPage && (
        <div className="mt-8 text-center">
          <p className="text-muted-foreground">
            {t.blogs.moreArticlesAvailable}
          </p>
        </div>
      )}
    </div>
  )
}

