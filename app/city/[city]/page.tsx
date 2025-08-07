import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, MapPin, Calendar, Eye, Heart, Share2 } from 'lucide-react'
import Footer from '@/components/footer'

interface NewsArticle {
  id: number
  slug: string
  title: {
    hi: string
    en: string
  }
  description: string
  image_url: string
  author: {
    username: string
  }
  category: {
    name_en: string
    name_hi: string
  }
  city: {
    name: {
      en: string
      hi: string
    }
    state: string
  }
  views: number
  likes: number
  shares: number
  is_breaking: boolean
  published_at: string
  hours_ago: number
}

interface ApiResponse {
  success: boolean
  data: {
    data: NewsArticle[]
    limit: number
    page: number
    total: number
    totalPages: number
  }
}

interface CityPageProps {
  params: {
    city: string
  }
  searchParams: {
    page?: string
  }
}

// Function to get city display name
function getCityDisplayName(cityParam: string, language: 'hi' | 'en' = 'en') {
  const cityMappings: Record<string, { en: string; hi: string }> = {
    'dehradun': { en: 'Dehradun', hi: 'देहरादून' },
    'nainital': { en: 'Nainital', hi: 'नैनीताल' },
    'haridwar': { en: 'Haridwar', hi: 'हरिद्वार' },
    'mussoorie': { en: 'Mussoorie', hi: 'मसूरी' },
    'rishikesh': { en: 'Rishikesh', hi: 'ऋषिकेश' },
    'almora': { en: 'Almora', hi: 'अल्मोड़ा' },
    'pauri': { en: 'Pauri', hi: 'पौड़ी' },
    'bageshwar': { en: 'Bageshwar', hi: 'बागेश्वर' },
    'chamoli': { en: 'Chamoli', hi: 'चमोली' },
    'uttarkashi': { en: 'Uttarkashi', hi: 'उत्तरकाशी' },
    'pithoragarh': { en: 'Pithoragarh', hi: 'पिथौरागढ़' },
    'rudraprayag': { en: 'Rudraprayag', hi: 'रुद्रप्रयाग' },
    'tehri': { en: 'Tehri', hi: 'टिहरी' }
  }

  const cityKey = cityParam.toLowerCase()
  const cityInfo = cityMappings[cityKey]
  
  if (cityInfo) {
    return cityInfo[language]
  }
  
  // Fallback: capitalize first letter
  return cityParam.charAt(0).toUpperCase() + cityParam.slice(1)
}

async function fetchCityNews(city: string, page: number = 1): Promise<ApiResponse> {
  const cityName = getCityDisplayName(city, 'en')
  
  try {
    const response = await fetch(
      `https://api.garhwalisonglyrics.com/api/v1/news/city/${cityName}?page=${page}&limit=10`,
      {
        next: { revalidate: 300 }, // Cache for 5 minutes
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching city news:', error)
    throw error
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('hi-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3">
          <div className="relative h-48 md:h-full">
            <img
              src={article.image_url || '/placeholder.jpg'}
              alt={article.title.hi}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = '/placeholder.jpg'
              }}
            />
            {article.is_breaking && (
              <Badge className="absolute top-2 left-2 bg-red-600 text-white">
                ब्रेकिंग न्यूज़
              </Badge>
            )}
          </div>
        </div>
        
        <div className="md:w-2/3 p-4">
          <CardHeader className="p-0 mb-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Badge variant="secondary">
                {article.category.name_hi}
              </Badge>
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {article.city.name.hi}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {article.hours_ago} घंटे पहले
              </span>
            </div>
            
            <CardTitle className="text-lg md:text-xl leading-tight">
              <Link 
                href={`/article/${article.slug}`}
                className="hover:text-primary transition-colors"
              >
                {article.title.hi}
              </Link>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-0">
            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
              {article.description}
            </p>
            
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>लेखक: {article.author.username}</span>
              
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {article.views}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  {article.likes}
                </span>
                <span className="flex items-center gap-1">
                  <Share2 className="h-3 w-3" />
                  {article.shares}
                </span>
              </div>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  )
}

function PaginationControls({ 
  currentPage, 
  totalPages, 
  city 
}: { 
  currentPage: number
  totalPages: number
  city: string
}) {
  if (totalPages <= 1) return null

  const pages = []
  const maxVisiblePages = 5
  
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {currentPage > 1 && (
        <Button variant="outline" size="sm" asChild>
          <Link href={`/city/${city}?page=${currentPage - 1}`}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            पिछला
          </Link>
        </Button>
      )}

      {startPage > 1 && (
        <>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/city/${city}?page=1`}>1</Link>
          </Button>
          {startPage > 2 && <span className="px-2">...</span>}
        </>
      )}

      {pages.map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? "default" : "outline"}
          size="sm"
          asChild
        >
          <Link href={`/city/${city}?page=${page}`}>
            {page}
          </Link>
        </Button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2">...</span>}
          <Button variant="outline" size="sm" asChild>
            <Link href={`/city/${city}?page=${totalPages}`}>
              {totalPages}
            </Link>
          </Button>
        </>
      )}

      {currentPage < totalPages && (
        <Button variant="outline" size="sm" asChild>
          <Link href={`/city/${city}?page=${currentPage + 1}`}>
            अगला
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      )}
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(5)].map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3">
              <div className="h-48 md:h-full bg-muted animate-pulse" />
            </div>
            <div className="md:w-2/3 p-4">
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="h-5 w-16 bg-muted animate-pulse rounded" />
                  <div className="h-5 w-20 bg-muted animate-pulse rounded" />
                </div>
                <div className="h-6 bg-muted animate-pulse rounded" />
                <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

export async function generateMetadata({ params }: CityPageProps) {
  const cityName = getCityDisplayName(params.city, 'hi')
  const cityNameEn = getCityDisplayName(params.city, 'en')
  
  return {
    title: `${cityName} की ताज़ा खबरें | Inside Uttarakhand News`,
    description: `${cityName} (${cityNameEn}) से जुड़ी सभी ताज़ा खबरें, अपडेट और समाचार पढ़ें। उत्तराखंड की विश्वसनीय न्यूज़ वेबसाइट पर।`,
    keywords: `${cityName}, ${cityNameEn}, उत्तराखंड न्यूज़, ताज़ा खबरें, समाचार`,
    openGraph: {
      title: `${cityName} की ताज़ा खबरें`,
      description: `${cityName} से जुड़ी सभी ताज़ा खबरें और अपडेट`,
      type: 'website',
    }
  }
}

export default async function CityPage({ params, searchParams }: CityPageProps) {
  const currentPage = parseInt(searchParams.page || '1', 10)
  const cityName = getCityDisplayName(params.city, 'hi')
  const cityNameEn = getCityDisplayName(params.city, 'en')

  let newsData: ApiResponse
  
  try {
    newsData = await fetchCityNews(params.city, currentPage)
  } catch (error) {
    notFound()
  }

  if (!newsData.success || !newsData.data.data.length) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <div className="mb-6">
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
              <Link href="/" className="hover:text-primary">होम</Link>
              <span>/</span>
              <span>{cityName}</span>
            </nav>
            
            <h1 className="text-3xl font-bold mb-2">
              {cityName} की खबरें
            </h1>
            <p className="text-muted-foreground">
              {cityName} से जुड़ी ताज़ा खबरें और अपडेट
            </p>
          </div>

          <div className="text-center py-12">
            <MapPin className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">कोई खबर नहीं मिली</h2>
            <p className="text-muted-foreground mb-4">
              {cityName} से संबंधित कोई समाचार उपलब्ध नहीं है।
            </p>
            <Button asChild>
              <Link href="/">सभी खबरें देखें</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const { data: articles, total, totalPages } = newsData.data

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary">होम</Link>
          <span>/</span>
          <span>{cityName}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">
                {cityName} की खबरें
              </h1>
              <p className="text-muted-foreground">
                {cityName} से जुड़ी {total} ताज़ा खबरें
              </p>
            </div>
          </div>
        </div>

        {/* News Articles */}
        <Suspense fallback={<LoadingSkeleton />}>
          <div className="space-y-6">
            {articles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        </Suspense>

        {/* Pagination */}
        <PaginationControls 
          currentPage={currentPage}
          totalPages={totalPages}
          city={params.city}
        />

        {/* Page Info */}
        <div className="text-center text-sm text-muted-foreground mt-4">
          पृष्ठ {currentPage} of {totalPages} • कुल {total} खबरें
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
