"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
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
import { useCollections } from "@/components/hooks/useCollections"

interface FiltersProps {
  onFiltersChange: (filters: FilterValues) => void
  initialFilters?: FilterValues
}

export interface FilterValues {
  name: string
  priceRange: [number, number]
  collection: string
}

const MIN_PRICE = 0
const MAX_PRICE = 10000

export function Filters({ onFiltersChange, initialFilters }: FiltersProps) {
  const { language } = useLanguage()
  const t = translations[language]

  // Fetch collections for dropdown
  const { data: collectionsData } = useCollections({ first: 50 })

  // Initialize state from initialFilters
  const [name, setName] = useState(initialFilters?.name || "")
  const [priceRange, setPriceRange] = useState<[number, number]>(
    initialFilters?.priceRange || [MIN_PRICE, MAX_PRICE]
  )
  const [collection, setCollection] = useState(initialFilters?.collection || "")
  const [debouncedName, setDebouncedName] = useState(initialFilters?.name || "")
  const [debouncedPriceRange, setDebouncedPriceRange] = useState<[number, number]>(
    initialFilters?.priceRange || [MIN_PRICE, MAX_PRICE]
  )

  const prevInitialFiltersRef = useRef<FilterValues | undefined>(initialFilters)

  useEffect(() => {
    const prevFilters = prevInitialFiltersRef.current
    if (initialFilters && prevFilters) {
      if (initialFilters.name !== prevFilters.name) {
        // eslint-disable-next-line
        setName(initialFilters.name)
        setDebouncedName(initialFilters.name)
      }
      if (initialFilters.collection !== prevFilters.collection) {
        setCollection(initialFilters.collection)
      }
      if (
        initialFilters.priceRange[0] !== prevFilters.priceRange[0] ||
        initialFilters.priceRange[1] !== prevFilters.priceRange[1]
      ) {
        setPriceRange(initialFilters.priceRange)
        setDebouncedPriceRange(initialFilters.priceRange)
      }
    }
    prevInitialFiltersRef.current = initialFilters
  }, [initialFilters])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedName(name)
    }, 500)

    return () => clearTimeout(timer)
  }, [name])
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPriceRange(priceRange)
    }, 500)

    return () => clearTimeout(timer)
  }, [priceRange])

  useEffect(() => {
    onFiltersChange({
      name: debouncedName,
      priceRange: debouncedPriceRange,
      collection,
    })
  }, [debouncedName, debouncedPriceRange, collection, onFiltersChange])

  const handleReset = () => {
    setName("")
    setPriceRange([MIN_PRICE, MAX_PRICE])
    setCollection("")
  }

  const selectedCollection = collectionsData?.collections.find(c => c.handle === collection)
  const isPriceRangeActive = priceRange[0] !== MIN_PRICE || priceRange[1] !== MAX_PRICE
  const hasActiveFilters = name !== "" || isPriceRangeActive || collection !== ""

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-xl font-semibold">{t.products.filters.title}</h2>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="h-8"
              >
                <X className="h-4 w-4 mr-1" />
                {t.products.filters.clearAll}
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Name Filter */}
            <div className="space-y-2">
              <Label htmlFor="name-filter">{t.products.filters.searchByName}</Label>
              <Input
                id="name-filter"
                type="text"
                placeholder={t.products.filters.searchPlaceholder}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Collection Filter */}
            <div className="space-y-2">
              <Label htmlFor="collection-filter">{t.products.filters.collection}</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    id="collection-filter"
                  >
                    {selectedCollection ? selectedCollection.title : t.products.filters.allCollections}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) max-h-[300px] overflow-y-auto">
                  <DropdownMenuItem
                    onClick={() => setCollection("")}
                    className={collection === "" ? "bg-accent" : ""}
                  >
                    {t.products.filters.allCollections}
                  </DropdownMenuItem>
                  {collectionsData?.collections.map((coll) => (
                    <DropdownMenuItem
                      key={coll.id}
                      onClick={() => setCollection(coll.handle)}
                      className={collection === coll.handle ? "bg-accent" : ""}
                    >
                      {coll.title}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-2">
              <Label htmlFor="price-range-filter">
                {t.products.filters.priceRange}: ${priceRange[0]} - ${priceRange[1]}
              </Label>
              <div className="pt-2">
                <Slider
                  id="price-range-filter"
                  min={MIN_PRICE}
                  max={MAX_PRICE}
                  step={10}
                  value={priceRange}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>${MIN_PRICE}</span>
                  <span>${MAX_PRICE}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              <span className="text-sm text-muted-foreground">{t.products.filters.activeFilters}:</span>
              {name && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setName("")}
                  className="h-7 text-xs"
                >
                  {t.products.filters.name}: &quot;{name}&quot;
                  <X className="h-3 w-3 ml-1" />
                </Button>
              )}
              {isPriceRangeActive && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPriceRange([MIN_PRICE, MAX_PRICE])}
                  className="h-7 text-xs"
                >
                  ${priceRange[0]} - ${priceRange[1]}
                  <X className="h-3 w-3 ml-1" />
                </Button>
              )}
              {collection && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setCollection("")}
                  className="h-7 text-xs"
                >
                  {t.products.filters.collection}: {selectedCollection?.title || collection}
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

