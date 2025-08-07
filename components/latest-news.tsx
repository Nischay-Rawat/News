"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Clock, MapPin, Loader2 } from 'lucide-react'

interface NewsItem {
  slug: string
  title: {
    hi: string
    en: string
  }
  description: string
  image_url: string
  category: {
    name_en: string
    name_hi: string
  }
  city: {
    hi: string
    en: string
  } | string
  published_at: string
  hours_ago: number
  views?: number
}

interface DashboardData {
  success: boolean
  data: {
    latest_news_by_category: NewsItem[]
  }
}

interface CategoryApiResponse {
  success: boolean
  data: {
    data: NewsItem[]
  }
}

interface LatestNewsProps {
  category?: string
  dashboardData?: DashboardData | null
}

const mockNewsData: NewsItem[] = [
  {
    slug: "uttarakhand-education-policy",
    title: {
      hi: "उत्तराखंड के स्कूलों में नई शिक्षा नीति लागू, छात्रों में उत्साह",
      en: "New education policy implemented in Uttarakhand schools, enthusiasm among students",
    },
    description: "New education policy has been implemented in all government schools of the state.",
    image_url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300",
    category: {
      name_en: "Education",
      name_hi: "शिक्षा",
    },
    city: {
      hi: "देहरादून",
      en: "Dehradun",
    },
    published_at: "2025-01-24T05:00:00Z",
    hours_ago: 8,
    views: 150,
  },
  {
    slug: "mussoorie-tourist-rush",
    title: {
      hi: "मसूरी में पर्यटकों की भीड़, होटल व्यवसायियों ने की रिकॉर्ड कमाई",
      en: "Tourist rush in Mussoorie, hotel businessmen make record earnings",
    },
    description: "Heavy rush of tourists is being seen in Mussoorie during the summer holidays.",
    image_url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300",
    category: {
      name_en: "Tourism",
      name_hi: "पर्यटन",
    },
    city: {
      hi: "मसूरी",
      en: "Mussoorie",
    },
    published_at: "2025-01-24T03:00:00Z",
    hours_ago: 10,
    views: 230,
  },
  {
    slug: "haridwar-election-update",
    title: {
      hi: "हरिद्वार में चुनावी तैयारियां तेज, प्रशासन ने जारी की गाइडलाइन",
      en: "Election preparations intensify in Haridwar, administration issues guidelines",
    },
    description: "Preparations for the upcoming elections have intensified in Haridwar.",
    image_url: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=400&h=300",
    category: {
      name_en: "Politics",
      name_hi: "राजनीति",
    },
    city: {
      hi: "हरिद्वार",
      en: "Haridwar",
    },
    published_at: "2025-01-23T20:00:00Z",
    hours_ago: 17,
    views: 180,
  },
  {
    slug: "nainital-health-initiative",
    title: {
      hi: "नैनीताल में स्वास्थ्य सेवाओं का विस्तार, नई योजना की शुरुआत",
      en: "Expansion of health services in Nainital, new scheme launched",
    },
    description: "A new scheme has been launched for the expansion of health services in Nainital.",
    image_url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300",
    category: {
      name_en: "Health",
      name_hi: "स्वास्थ्य",
    },
    city: {
      hi: "नैनीताल",
      en: "Nainital",
    },
    published_at: "2025-01-23T18:00:00Z",
    hours_ago: 19,
    views: 95,
  },
]

export default function LatestNews({ category, dashboardData }: LatestNewsProps) {
  const [categoryNews, setCategoryNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const formatTimeAgo = (hoursAgo: number) => {
    if (hoursAgo < 1) {
      return "Now"
    } else if (hoursAgo < 24) {
      return `${Math.floor(hoursAgo)} hours ago`
    } else {
      const daysAgo = Math.floor(hoursAgo / 24)
      return `${daysAgo} days ago`
    }
  }

  // Fetch category-specific news when category changes
  useEffect(() => {
    async function fetchCategoryNews() {
      if (!category || category === "latest") {
        setCategoryNews([])
        return
      }

      setLoading(true)
      setError(null)

      try {
        const response = await fetch(
          `https://api.garhwalisonglyrics.com/api/v1/news/category/${category}?page=1&limit=8`,
          {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            }
          }
        )

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: CategoryApiResponse = await response.json()
        
        if (data.success && data.data.data) {
          setCategoryNews(data.data.data)
        } else {
          setCategoryNews([])
        }
      } catch (err) {
        console.error('Error fetching category news:', err)
        setError('Failed to load category news')
        setCategoryNews([])
      } finally {
        setLoading(false)
      }
    }

    fetchCategoryNews()
  }, [category])

  // Determine which data to show
  let newsData: NewsItem[] = []
  
  if (!category || category === "latest") {
    // Show dashboard data for latest news
    newsData = dashboardData?.data?.latest_news_by_category || mockNewsData
  } else {
    // Show category-specific data
    newsData = categoryNews
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading {category} news...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <p className="text-muted-foreground">Please try again later.</p>
      </div>
    )
  }

  if (newsData.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">
          {category && category !== "latest" 
            ? `No news available in ${category} category at the moment.`
            : "No news available"
          }
        </p>
        <p className="text-xs text-muted-foreground">
          Try checking other categories or come back later for updates.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {newsData.map((news) => (
        <div key={news.slug} className="group">
          <Link href={`/article/${news.slug}`}>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg mb-3">
              <img
                src={news.image_url || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300"}
                alt={news.title.en}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300"
                }}
              />
            </div>
            <h3 className="text-base font-semibold group-hover:text-primary transition-colors line-clamp-2">
              {news.title.en}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{news.description}</p>
            <div className="flex items-center text-xs text-muted-foreground mt-2 space-x-3">
              {news.city && (
                <div className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>{typeof news.city === "string" ? news.city : news.city.en || news.city.hi}</span>
                </div>
              )}
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                <span>{formatTimeAgo(news.hours_ago)}</span>
              </div>
            </div>
            {news.category && (
              <div className="text-xs text-primary mt-1 font-medium">
                {news.category.name_en}
              </div>
            )}
            {news.views && news.views > 0 && (
              <div className="text-xs text-muted-foreground mt-1">
                {news.views} views
              </div>
            )}
          </Link>
        </div>
      ))}
    </div>
  )
}
