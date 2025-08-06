export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header Skeleton */}
      <div className="h-16 bg-background/95 border-b animate-pulse">
        <div className="container flex items-center justify-between h-full">
          <div className="h-6 w-48 bg-muted rounded"></div>
          <div className="h-8 w-24 bg-muted rounded"></div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <main className="flex-1">
        <section className="container grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
          <div className="col-span-1 md:col-span-2 space-y-6">
            {/* Featured News Skeleton */}
            <div className="aspect-[16/9] w-full bg-muted rounded-lg animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-[16/9] w-full bg-muted rounded-lg animate-pulse"></div>
                  <div className="h-4 bg-muted rounded animate-pulse"></div>
                  <div className="h-3 bg-muted rounded w-3/4 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Sidebar Skeleton */}
          <div className="space-y-6">
            <div className="h-32 bg-muted rounded-lg animate-pulse"></div>
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded animate-pulse"></div>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-3 bg-muted rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </section>

        {/* Latest News Skeleton */}
        <section className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-[4/3] w-full bg-muted rounded-lg animate-pulse"></div>
                <div className="h-4 bg-muted rounded animate-pulse"></div>
                <div className="h-3 bg-muted rounded w-3/4 animate-pulse"></div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
