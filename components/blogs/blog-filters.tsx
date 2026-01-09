"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { X, ChevronDown } from "lucide-react"
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
  
  // Initialize state from initialFilters
  const [name, setName] = useState(initialFilters?.name || "")
  const [tag, setTag] = useState(initialFilters?.tag || "")
  const [debouncedName, setDebouncedName] = useState(initialFilters?.name || "")

  // Debounce name search changes (500ms after user stops typing)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedName(name)
    }, 500)

    return () => clearTimeout(timer)
  }, [name])

  // Notify parent of filter changes
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

  // Get unique sorted tags
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Filter */}
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

            {/* Tag Filter */}
            <div className="space-y-2">
              <Label htmlFor="tag-filter">{t.blogs.filters.tag}</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    id="tag-filter"
                  >
                    {tag || t.blogs.filters.allTags}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) max-h-[300px] overflow-y-auto">
                  <DropdownMenuItem
                    onClick={() => setTag("")}
                    className={tag === "" ? "bg-accent" : ""}
                  >
                    {t.blogs.filters.allTags}
                  </DropdownMenuItem>
                  {uniqueTags.map((tagOption) => (
                    <DropdownMenuItem
                      key={tagOption}
                      onClick={() => setTag(tagOption)}
                      className={tag === tagOption ? "bg-accent" : ""}
                    >
                      {tagOption}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Active Filters Summary */}
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

