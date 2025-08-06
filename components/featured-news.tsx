"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CalendarDays, Clock } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/components/language-provider"

interface NewsItem {
  slug: string
  title: {
    hi: string
    en: string
  }
  description: string
  image_url: string
  published_at: string
  hours_ago: number
}

interface DashboardData {
  success: boolean
  data: {
    breaking_news: NewsItem[]
    latest_news_by_category: NewsItem[]
  }
}

export default function FeaturedNews() {
  const { language } = useLanguage()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://api.garhwalisonglyrics.com/api/v1/news/dashboard")
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setDashboardData(data)
          }
        }
      } catch (error) {
        console.warn("API not available, using fallback")
        // Fallback data
        setDashboardData({
          success: true,
          data: {
            breaking_news: [
              {
                slug: "uttarakhand-tourism-boost",
                title: {
                  hi: "उत्तराखंड के पहाड़ों में नया पर्यटन केंद्र, पर्यटकों की संख्या बढ़ने की उम्मीद",
                  en: "New tourism center in Uttarakhand mountains, expected increase in tourist numbers",
                },
                description: "राज्य सरकार ने उत्तराखंड के पहाड़ी क्षेत्रों में नए पर्यटन केंद्र विकसित करने की योजना की घोषणा की है।",
                image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600",
                published_at: "2025-01-24T10:45:33.443768Z",
                hours_ago: 2,
              },
              {
                slug: "char-dham-yatra-record",
                title: {
                  hi: "चारधाम यात्रा: इस साल रिकॉर्ड तीर्थयात्रियों की संख्या",
                  en: "Char Dham Yatra: Record number of pilgrims this year",
                },
                description: "इस साल चारधाम यात्रा में रिकॉर्ड संख्या में तीर्थयात्री पहुंचे हैं।",
                image_url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600",
                published_at: "2025-01-24T08:30:33.443768Z",
                hours_ago: 4,
              },
            ],
            latest_news_by_category: [],
          },
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatTimeAgo = (hoursAgo: number) => {
    if (hoursAgo < 1) {
      return language === "hi" ? "अभी" : "Now"
    } else if (hoursAgo < 24) {
      return language === "hi" ? `${Math.floor(hoursAgo)} घंटे पहले` : `${Math.floor(hoursAgo)} hours ago`
    } else {
      const daysAgo = Math.floor(hoursAgo / 24)
      return language === "hi" ? `${daysAgo} दिन पहले` : `${daysAgo} days ago`
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    if (language === "hi") {
      return date.toLocaleDateString("hi-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    } else {
      return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="aspect-[16/9] w-full bg-muted rounded-lg animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-[16/9] w-full bg-muted rounded-lg animate-pulse"></div>
              <div className="h-4 bg-muted rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!dashboardData?.success) {
    return (
      <div className="text-center text-muted-foreground p-8">
        <p>{language === "hi" ? "समाचार लोड नहीं हो सके" : "Failed to load news"}</p>
      </div>
    )
  }

  const { breaking_news, latest_news_by_category } = dashboardData.data
  const featuredNews = breaking_news.length > 0 ? breaking_news[0] : latest_news_by_category[0]
  const sideNews = breaking_news.length > 1 ? breaking_news.slice(1, 3) : latest_news_by_category.slice(1, 3)

  if (!featuredNews) {
    return (
      <div className="text-center text-muted-foreground p-8">
        <p>{language === "hi" ? "कोई समाचार उपलब्ध नहीं है" : "No news available"}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-lg">
        <Link href={`/article/${featuredNews.slug}`}>
          <div className="relative aspect-[16/9] w-full">
            <img
              src={featuredNews.image_url || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600"}
              alt={featuredNews.title[language]}
              className="w-full h-full object-cover"
              loading="eager"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600"
              }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-0 p-4 md:p-6 text-white">
            {breaking_news.some((news) => news.slug === featuredNews.slug) && (
              <Badge className="mb-2 bg-red-600 hover:bg-red-700">
                {language === "hi" ? "ब्रेकिंग न्यूज़" : "Breaking News"}
              </Badge>
            )}
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2">{featuredNews.title[language]}</h2>
            <p className="text-sm md:text-base opacity-90 mb-2 line-clamp-2">{featuredNews.description}</p>
            <div className="flex items-center text-xs md:text-sm space-x-4">
              <div className="flex items-center">
                <CalendarDays className="h-3 w-3 mr-1" />
                <span>{formatDate(featuredNews.published_at)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                <span>{formatTimeAgo(featuredNews.hours_ago)}</span>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {sideNews.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sideNews.map((news) => (
            <div key={news.slug} className="group">
              <Link href={`/article/${news.slug}`}>
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg mb-3">
                  <img
                    src={news.image_url || "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&h=400"}
                    alt={news.title[language]}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&h=400"
                    }}
                  />
                </div>
                <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                  {news.title[language]}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{news.description}</p>
                <div className="flex items-center text-xs text-muted-foreground mt-2 space-x-4">
                  <div className="flex items-center">
                    <CalendarDays className="h-3 w-3 mr-1" />
                    <span>{formatDate(news.published_at)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{formatTimeAgo(news.hours_ago)}</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
