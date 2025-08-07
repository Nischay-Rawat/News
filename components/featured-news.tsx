"use client"

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

interface FeaturedNewsProps {
  dashboardData: DashboardData | null
}

export default function FeaturedNews({ dashboardData }: FeaturedNewsProps) {
  const { language } = useLanguage()

  const formatTimeAgo = (hoursAgo: number) => {
    if (hoursAgo < 1) {
      return language === "hi" ? "अभी" : "Now"
    } else if (hoursAgo < 24) {
      return language === "hi" 
        ? `${Math.floor(hoursAgo)} घंटे पहले`
        : `${Math.floor(hoursAgo)} hours ago`
    } else {
      const daysAgo = Math.floor(hoursAgo / 24)
      return language === "hi" 
        ? `${daysAgo} दिन पहले`
        : `${daysAgo} days ago`
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

  // Fallback data if API is not available
  const fallbackNews = [
    {
      slug: "uttarakhand-tourism-boost",
      title: {
        hi: "उत्तराखंड के पहाड़ों में नया पर्यटन केंद्र, पर्यटकों की संख्या बढ़ने की उम्मीद",
        en: "New tourism center in Uttarakhand mountains, expected increase in tourist numbers",
      },
      description: language === "hi" 
        ? "राज्य सरकार ने उत्तराखंड के पहाड़ी क्षेत्रों में नए पर्यटन केंद्र विकसित करने की योजना की घोषणा की है।"
        : "The state government has announced plans to develop new tourism centers in the mountainous regions of Uttarakhand.",
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
      description: language === "hi"
        ? "इस साल की चारधाम यात्रा में रिकॉर्ड संख्या में तीर्थयात्रियों ने पवित्र स्थानों का दर्शन किया है।"
        : "This year's Char Dham Yatra has seen a record number of pilgrims visiting the holy sites.",
      image_url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600",
      published_at: "2025-01-24T08:30:33.443768Z",
      hours_ago: 4,
    },
  ]

  const { breaking_news, latest_news_by_category } = dashboardData?.data || { breaking_news: [], latest_news_by_category: [] }
  const newsToShow = breaking_news.length > 0 ? breaking_news : latest_news_by_category.length > 0 ? latest_news_by_category : fallbackNews
  
  const featuredNews = newsToShow[0]
  const sideNews = newsToShow.slice(1, 3)

  if (!featuredNews) {
    return (
      <div className="text-center text-muted-foreground p-8">
        <p>{language === "hi" ? "कोई समाचार उपलब्ध नहीं" : "No news available"}</p>
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
              alt={language === "hi" ? featuredNews.title.hi : featuredNews.title.en}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-0 p-4 md:p-6 text-white">
            {breaking_news.some((news) => news.slug === featuredNews.slug) && (
              <Badge className="mb-2 bg-red-600 hover:bg-red-700">
                {language === "hi" ? "ब्रेकिंग न्यूज़" : "Breaking News"}
              </Badge>
            )}
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2">
              {language === "hi" ? featuredNews.title.hi : featuredNews.title.en}
            </h2>
            <p className="text-sm md:text-base opacity-90 mb-2 line-clamp-2">
              {featuredNews.description}
            </p>
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
                    alt={language === "hi" ? news.title.hi : news.title.en}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                  {language === "hi" ? news.title.hi : news.title.en}
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
