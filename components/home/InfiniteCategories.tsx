"use client"

const categories = [
  "RESIDENTIAL INTERIORS",
  "COMMERCIAL SPACES",
  "BATHROOMS & SPAS",
  "KITCHENS",
  "FLOORS",
  "WALLS",
  "COUNTERTOPS",
  "OUTDOOR APPLICATIONS",
]

export function InfiniteCategories() {
  return (
    <section className="py-12 mt-20 border-y border-border overflow-hidden">
      <div className="flex animate-infinite-scroll">
        {[...categories, ...categories].map((category, index) => (
          <div key={index} className="shrink-0 px-8 py-4">
            <span className="text-2xl md:text-3xl font-light tracking-wide whitespace-nowrap">{category}</span>
            <span className="mx-8 text-2xl md:text-3xl text-primary">•</span>
          </div>
        ))}
      </div>
    </section>
  )
}
