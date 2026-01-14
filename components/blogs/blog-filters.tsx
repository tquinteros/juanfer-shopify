"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { useLanguage } from "@/lib/contexts/language-context"
import { translations } from "@/lib/i18n/translations"

interface BlogFiltersProps {
  onFiltersChange: (filters: FilterValues) => void
  initialFilters?: FilterValues
  availableTags?: string[]
}

export interface FilterValues {
  name: string
  tag: string
}

export function BlogFilters({ onFiltersChange, initialFilters, availableTags = [] }: BlogFiltersProps) {
  const { language } = useLanguage()
  const t = translations[language]
  
  const [name, setName] = useState(initialFilters?.name || "")
  const [tag, setTag] = useState(initialFilters?.tag || "")
  const [debouncedName, setDebouncedName] = useState(initialFilters?.name || "")

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedName(name)
    }, 500)

    return () => clearTimeout(timer)
  }, [name])

  useEffect(() => {
    onFiltersChange({
      name: debouncedName,
      tag,
    })
  }, [debouncedName, tag, onFiltersChange])

  const handleReset = () => {
    setName("")
    setTag("")
  }

  const hasActiveFilters = name !== "" || tag !== ""

  const uniqueTags = Array.from(new Set(availableTags)).sort()

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-xl font-semibold">{t.blogs.filters.title}</h2>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="h-8"
              >
                <X className="h-4 w-4 mr-1" />
                {t.blogs.filters.clearAll}
              </Button>
            )}
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name-filter">{t.blogs.filters.searchByName}</Label>
              <Input
                id="name-filter"
                type="text"
                placeholder={t.blogs.filters.searchPlaceholder}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>{t.blogs.filters.tag}</Label>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={tag === "" ? "default" : "outline"}
                  className="cursor-pointer hover:bg-accent transition-colors select-none"
                  role="button"
                  tabIndex={0}
                  onClick={() => setTag("")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      setTag("")
                    }
                  }}
                >
                  {t.blogs.filters.allTags}
                </Badge>
                {uniqueTags.map((tagOption) => (
                  <Badge
                    key={tagOption}
                    variant={tag === tagOption ? "default" : "outline"}
                    className="cursor-pointer hover:bg-accent transition-colors select-none"
                    role="button"
                    tabIndex={0}
                    onClick={() => setTag(tag === tagOption ? "" : tagOption)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        setTag(tag === tagOption ? "" : tagOption)
                      }
                    }}
                  >
                    {tagOption}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              <span className="text-sm text-muted-foreground">{t.blogs.filters.activeFilters}:</span>
              {name && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setName("")}
                  className="h-7 text-xs"
                >
                  {t.blogs.filters.name}: &quot;{name}&quot;
                  <X className="h-3 w-3 ml-1" />
                </Button>
              )}
              {tag && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setTag("")}
                  className="h-7 text-xs"
                >
                  {t.blogs.filters.tag}: {tag}
                  <X className="h-3 w-3 ml-1" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

