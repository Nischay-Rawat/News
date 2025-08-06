"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Clock, MapPin, Loader2 } from 'lucide-react'
import { useLanguage } from "@/components/language-provider"
import LanguageSwitch from "@/components/language-switch"
import MobileNavigation from "@/components/mobile-navigation"

interface NewsItem {
  id: number
  slug: string
  title: {
    hi: string
    en: string
  }
  description: string
  image_url: string
  author_id: number
  category_id: number
  city_id: number
  views: number
  likes: number
  shares: number
  is_breaking: boolean
  meta_description: string
  meta_image: string
  published_at: string
  created_at: string
  updated_at: string
  author: {
    id: string
    username: string
    email: string
    role: string
    created_at: string
  }
  category: {
    id: number
    name_en: string
    name_hi: string
    created_at: string
  }
  city: {
    id: number
    name: {
      en: string
      hi: string
    }
    state: string
  }
  hours_ago: number
}

interface CategoryNewsResponse {
  success: boolean
  data: {
    data: NewsItem[]
    limit: number
    page: number
    total: number
    totalPages: number
  }
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const { language } = useLanguage()
  const [newsData, setNewsData] = useState<CategoryNewsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const defaultCategories = [
    { key: "politics", name_en: "Politics", name_hi: "राजनीति", count: 0 },
    { key: "tourism", name_en: "Tourism", name_hi: "पर्यटन", count: 0 },
    { key: "education", name_en: "Education", name_hi: "शिक्षा", count: 0 },
  ]

  const defaultCities = [
    { key: "dehradun", name: language === "hi" ? "देहरादून" : "Dehradun", count: 0 },
    { key: "nainital", name: language === "hi" ? "नैनीताल" : "Nainital", count: 0 },
    { key: "haridwar", name: language === "hi" ? "हरिद्वार" : "Haridwar", count: 0 },
    { key: "mussoorie", name: language === "hi" ? "मसूरी" : "Mussoorie", count: 0 },
    { key: "rishikesh", name: language === "hi" ? "ऋषिकेश" : "Rishikesh", count: 0 },
  ]

  useEffect(() => {
    const fetchCategoryNews = async () => {
      try {
        setLoading(true)
        // Try different category name formats
        const categoryVariants = [
          params.category,
          params.category.toLowerCase(),
          params.category.charAt(0).toUpperCase() + params.category.slice(1).toLowerCase()
        ]
        
        let response
        let data
        
        for (const categoryName of categoryVariants) {
          try {
            response = await fetch(`https://api.garhwalisonglyrics.com/api/v1/news/category/${categoryName}`)
            if (response.ok) {
              const contentType = response.headers.get("content-type")
              if (contentType && contentType.includes("application/json")) {
                data = await response.json()
                if (data.success) {
                  setNewsData(data)
                  setError(null)
                  return
                }
              }
            }
          } catch (err) {
            console.warn(`Failed to fetch with category name: ${categoryName}`)
            continue
          }
        }
        
        // If all variants fail
        setError(language === "hi" ? "समाचार लोड नहीं हो सके" : "Failed to load news")
      } catch (err) {
        console.error("Error fetching category news:", err)
        setError(language === "hi" ? "नेटवर्क त्रुटि" : "Network error")
      } finally {
        setLoading(false)
      }
    }

    fetchCategoryNews()
  }, [params.category, language])

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

  const getCategoryDisplayName = () => {
    if (newsData?.success && newsData.data?.data && newsData.data.data.length > 0) {
      const firstItem = newsData.data.data[0]
      return language === "hi" ? firstItem.category.name_hi : firstItem.category.name_en
    }
  
    // Fallback to format the category parameter nicely
    const categoryName = params.category
    if (categoryName === "accidents") {
      return language === "hi" ? "दुर्घटनाएं" : "Accidents"
    }
  
    // Default fallback - capitalize first letter
    return categoryName.charAt(0).toUpperCase() + categoryName.slice(1)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <MobileNavigation categories={defaultCategories} cities={defaultCities} />
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl md:text-2xl font-bold text-primary">
                {language === "hi" ? "इनसाइड उत्तराखंड न्यूज़" : "Inside Uttarakhand News"}
              </span>
            </Link>
          </div>
          <LanguageSwitch />
        </div>
      </header>

      <main className="flex-1">
        <div className="container py-6 md:py-10">
          <div className="mb-6">
            <Button variant="ghost" size="sm" className="mb-4" asChild>
              <Link href="/">
                <ChevronLeft className="mr-2 h-4 w-4" />
                {language === "hi" ? "वापस जाएं" : "Go Back"}
              </Link>
            </Button>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{getCategoryDisplayName()}</h1>
                <p className="text-muted-foreground">
                  {newsData?.data?.total || 0} {language === "hi" ? "समाचार मिले" : "news articles found"}
                </p>
              </div>
            </div>
          </div>

          {newsData?.success && newsData.data?.data && newsData.data.data.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {newsData.data.data.map((news) => (
                  <div key={news.slug} className="group">
                    <Link href={`/article/${news.slug}`}>
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg mb-3">
                        <Image
                          src={news.image_url || "/placeholder.svg?height=300&width=400&query=uttarakhand news"}
                          alt={news.title[language]}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                        {news.is_breaking && (
                          <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
                            {language === "hi" ? "ब्रेकिंग" : "Breaking"}
                          </div>
                        )}
                      </div>
                      <h3 className="text-base font-semibold group-hover:text-primary transition-colors line-clamp-2 mb-2">
                        {news.title[language]}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{news.description}</p>
                      <div className="flex items-center text-xs text-muted-foreground space-x-3">
                        {news.city && (
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{news.city.name[language]}</span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{formatTimeAgo(news.hours_ago)}</span>
                        </div>
                      </div>
                      {news.views > 0 && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {news.views} {language === "hi" ? "बार देखा गया" : "views"}
                        </div>
                      )}
                    </Link>
                  </div>
                ))}
              </div>

              {newsData.data.totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {language === "hi" ? "पृष्ठ" : "Page"} {newsData.data.page} {language === "hi" ? "का" : "of"}{" "}
                      {newsData.data.totalPages}
                    </span>
                  </div>
                </div>
              )}
            </>
          ) : !loading && (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2">
                {language === "hi" ? "कोई समाचार नहीं मिला" : "No news found"}
              </h2>
              <p className="text-muted-foreground mb-4">
                {language === "hi" 
                  ? "इस श्रेणी में अभी कोई समाचार उपलब्ध नहीं है।" 
                  : "No news articles are currently available in this category."}
              </p>
              <Button asChild>
                <Link href="/">{language === "hi" ? "होम पर वापस जाएं" : "Go Back Home"}</Link>
              </Button>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t bg-background">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Link href="/" className="inline-block mb-4 md:mb-0">
              <span className="text-xl font-bold text-primary">
                {language === "hi" ? "इनसाइड उत्तराखंड न्यूज़" : "Inside Uttarakhand News"}
              </span>
            </Link>
            <div className="flex space-x-4">
              <Link href="#" className="text-xs text-muted-foreground hover:text-primary">
                {language === "hi" ? "हमारे बारे में" : "About Us"}
              </Link>
              <Link href="#" className="text-xs text-muted-foreground hover:text-primary">
                {language === "hi" ? "संपर्क करें" : "Contact Us"}
              </Link>
              <Link href="#" className="text-xs text-muted-foreground hover:text-primary">
                {language === "hi" ? "नियम और शर्तें" : "Terms & Conditions"}
              </Link>
              <Link href="#" className="text-xs text-muted-foreground hover:text-primary">
                {language === "hi" ? "गोपनीयता नीति" : "Privacy Policy"}
              </Link>
            </div>
          </div>
          <div className="border-t mt-4 pt-4 text-center">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()}{" "}
              {language === "hi"
                ? "इनसाइड उत्तराखंड न्यूज़. सर्वाधिकार सुरक्षित."
                : "Inside Uttarakhand News. All rights reserved."}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
