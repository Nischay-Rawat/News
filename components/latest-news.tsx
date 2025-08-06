"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Clock, MapPin } from 'lucide-react'
import { useLanguage } from "@/components/language-provider"

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

interface LatestNewsProps {
  category?: string
}

const mockNewsData: NewsItem[] = [
  {
    slug: "uttarakhand-education-policy",
    title: {
      hi: "उत्तराखंड के स्कूलों में नई शिक्षा नीति लागू, छात्रों में उत्साह",
      en: "New education policy implemented in Uttarakhand schools, enthusiasm among students",
    },
    description: "राज्य के सभी सरकारी स्कूलों में नई शिक्षा नीति लागू की गई है।",
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
    description: "गर्मियों की छुट्टियों में मसूरी में पर्यटकों की भारी भीड़ देखी जा रही है।",
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
    description: "आगामी चुनावों को लेकर हरिद्वार में तैयारियां तेज हो गई हैं।",
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
    description: "नैनीताल में स्वास्थ्य सेवाओं के विस्तार के लिए नई योजना शुरू की गई है।",
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

export default function LatestNews({ category = "latest" }: LatestNewsProps) {
  const { language } = useLanguage()
  const [newsData, setNewsData] = useState<NewsItem[]>(mockNewsData)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://api.garhwalisonglyrics.com/api/v1/news/dashboard")
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data.latest_news_by_category) {
            setNewsData(data.data.latest_news_by_category)
          }
        }
      } catch (error) {
        console.warn("Using fallback data")
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

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-[4/3] w-full bg-muted rounded-lg animate-pulse"></div>
            <div className="h-4 bg-muted rounded animate-pulse"></div>
            <div className="h-3 bg-muted rounded w-3/4 animate-pulse"></div>
          </div>
        ))}
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
                alt={news.title[language]}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300"
                }}
              />
            </div>
            <h3 className="text-base font-semibold group-hover:text-primary transition-colors line-clamp-2">
              {news.title[language]}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{news.description}</p>
            <div className="flex items-center text-xs text-muted-foreground mt-2 space-x-3">
              {news.city && (
                <div className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>{typeof news.city === "string" ? news.city : news.city[language] || news.city.hi}</span>
                </div>
              )}
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                <span>{formatTimeAgo(news.hours_ago)}</span>
              </div>
            </div>
            {news.category && (
              <div className="text-xs text-primary mt-1 font-medium">
                {language === "hi" ? news.category.name_hi : news.category.name_en}
              </div>
            )}
            {news.views && news.views > 0 && (
              <div className="text-xs text-muted-foreground mt-1">
                {news.views} {language === "hi" ? "बार देखा गया" : "views"}
              </div>
            )}
          </Link>
        </div>
      ))}
    </div>
  )
}
