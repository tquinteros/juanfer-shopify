"use client"

import { useInfiniteArticles, useArticlesTags } from "@/components/hooks/useBlogs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"
import Link from "next/link"
import { Calendar, User, Loader2 } from "lucide-react"
import { useLanguage } from "@/lib/contexts/language-context"
import { translations } from "@/lib/i18n/translations"
import { BlogFilters, FilterValues } from "@/components/blogs/blog-filters"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { Suspense, useCallback, useMemo, useEffect, useRef } from "react"
import { useInView } from "react-intersection-observer"
import type { ArticlesQuery } from "@/lib/types/blogs"

function BlogsContent() {
  const { language } = useLanguage()
  const t = translations[language]
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const filters = useMemo<FilterValues>(() => {
    const name = searchParams.get('name') || ""
    const tag = searchParams.get('tag') || ""

    return {
      name,
      tag,
    }
  }, [searchParams])

  const handleFiltersChange = useCallback((newFilters: FilterValues) => {
    const params = new URLSearchParams()

    if (newFilters.name) {
      params.set('name', newFilters.name)
    }

    if (newFilters.tag) {
      params.set('tag', newFilters.tag)
    }

    const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ''}`
    const currentUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`

    if (newUrl !== currentUrl) {
      router.replace(newUrl, { scroll: false })
    }
  }, [searchParams, router, pathname])
  // Fetch only tags from articles (much more efficient than fetching full articles)
  const { data: tagsData } = useArticlesTags({
    first: 250, // Adjust based on your expected max articles
  })

  // Extract all available tags
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>()
    if (tagsData?.articles.edges) {
      tagsData.articles.edges.forEach(({ node: article }) => {
        if (article.tags) {
          article.tags.forEach(tag => tagSet.add(tag))
        }
      })
    }
    return Array.from(tagSet)
  }, [tagsData])

  const shopifyQuery = useMemo(() => {
    const queryParts: string[] = []

    if (filters.name) {
      queryParts.push(`title:*${filters.name}*`)
    }

    if (filters.tag) {
      queryParts.push(`tag:${filters.tag}`)
    }

    return queryParts.length > 0 ? queryParts.join(' AND ') : null
  }, [filters.name, filters.tag])

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteArticles({
    first: 12,
    query: shopifyQuery,
  })

  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
    rootMargin: '200px',
  })

  const isFetchingRef = useRef(false)

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && !isFetchingRef.current) {
      isFetchingRef.current = true
      fetchNextPage()
    }

    if (!isFetchingNextPage && isFetchingRef.current) {
      isFetchingRef.current = false
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  const allArticles = useMemo(() => {
    if (!data || !('pages' in data)) return []
    return (data.pages as ArticlesQuery[]).flatMap(page => page.articles.edges)
  }, [data])

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

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{t.blogs.title}</h1>
        <p className="text-muted-foreground">
          {t.blogs.description}
        </p>
      </div>

      <BlogFilters
        key={`${filters.name}-${filters.tag}`}
        onFiltersChange={handleFiltersChange}
        initialFilters={filters}
        availableTags={availableTags}
      />

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
      ) : allArticles.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allArticles.map(({ node: article }) => {
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

          {hasNextPage && (
            <div ref={loadMoreRef} className="mt-8 flex justify-center items-center py-4">
              {isFetchingNextPage && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span>Loading more articles...</span>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            {t.blogs.noArticlesFound}
          </p>
        </div>
      )}
    </div>
  )
}

function BlogsLoadingFallback() {
  const { language } = useLanguage()
  const t = translations[language]
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{t.blogs.title}</h1>
        <p className="text-muted-foreground">
          {t.blogs.description}
        </p>
      </div>
      <Skeleton className="h-40 w-full mb-6" />
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
    </div>
  )
}

export default function BlogsPage() {
  return (
    <Suspense fallback={<BlogsLoadingFallback />}>
      <BlogsContent />
    </Suspense>
  )
}

