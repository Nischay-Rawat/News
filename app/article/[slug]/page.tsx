"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { CalendarDays, ChevronLeft, Clock, MapPin, Share2, Loader2 } from "lucide-react"
import NewsletterSignup from "@/components/newsletter-signup"
import { useLanguage } from "@/components/language-provider"
import MobileNavigation from "@/components/mobile-navigation"
import LanguageSwitch from "@/components/language-switch"

interface ArticleData {
  id?: number
  slug: string
  title: {
    hi: string
    en: string
  }
  content?: {
    hi: {
      json: any
      html: string
      text: string
    }
    en: {
      json: any
      html: string
      text: string
    }
  }
  description: string
  image_url: string
  author_id?: number
  category?: {
    id: number
    name_en: string
    name_hi: string
    created_at: string
  }
  city?:
    | {
        hi: string
        en: string
      }
    | string
  views?: number
  likes?: number
  shares?: number
  is_breaking?: boolean
  meta_description?: string
  meta_image?: string
  published_at: string
  created_at?: string
  updated_at?: string
  hours_ago: number
  author?: {
    id: number
    username: string
  }
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const { language } = useLanguage()
  const [article, setArticle] = useState<ArticleData | null>(null)
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
    const fetchArticle = async () => {
      try {
        const apiEndpoints = [
          `https://api.garhwalisonglyrics.com/api/v1/news/slug/${params.slug}`,
          `http://api.garhwalisonglyrics.com/api/v1/news/slug/${params.slug}`,
        ]

        let articleData = null

        for (const endpoint of apiEndpoints) {
          try {
            console.log(`Trying to fetch from: ${endpoint}`)
            const articleResponse = await fetch(endpoint, {
              method: "GET",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              signal: AbortSignal.timeout(10000),
            })

            if (articleResponse.ok) {
              const contentType = articleResponse.headers.get("content-type")
              if (contentType && contentType.includes("application/json")) {
                const data = await articleResponse.json()
                console.log("Article API response:", data)
                if (data.success && data.data) {
                  articleData = data.data
                  break
                }
              }
            } else {
              console.warn(`API endpoint ${endpoint} returned status: ${articleResponse.status}`)
            }
          } catch (endpointError) {
            console.warn(`Failed to fetch from ${endpoint}:`, endpointError)
            continue
          }
        }

        if (articleData) {
          setArticle(articleData)
          setLoading(false)
          return
        }

        console.log("Falling back to dashboard data...")
        const dashboardResponse = await fetch("https://api.garhwalisonglyrics.com/api/v1/news/dashboard", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          signal: AbortSignal.timeout(10000),
        })

        if (dashboardResponse.ok) {
          const contentType = dashboardResponse.headers.get("content-type")
          if (contentType && contentType.includes("application/json")) {
            const dashboardData = await dashboardResponse.json()
            console.log("Dashboard API response:", dashboardData)
            if (dashboardData.success) {
              let foundArticle = dashboardData.data.breaking_news.find((item: any) => item.slug === params.slug)

              if (!foundArticle) {
                foundArticle = dashboardData.data.latest_news_by_category.find((item: any) => item.slug === params.slug)
              }

              if (foundArticle) {
                console.log("Found article in dashboard data:", foundArticle)
                setArticle(foundArticle)
                setLoading(false)
                return
              }
            }
          }
        }

        throw new Error("Article not found in any data source")
      } catch (err) {
        console.error("Error fetching article:", err)
        setError(language === "hi" ? "लेख लोड नहीं हो सका" : "Failed to load article")
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [params.slug, language])

  const formatTimeAgo = (hoursAgo: number) => {
    if (!hoursAgo || hoursAgo < 1) {
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
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{language === "hi" ? "लेख लोड हो रहा है..." : "Loading article..."}</p>
          </div>
        </main>
      </div>
    )
  }

  if (error || !article) {
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
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">{language === "hi" ? "लेख नहीं मिला" : "Article Not Found"}</h1>
            <p className="text-muted-foreground mb-4">
              {error ||
                (language === "hi"
                  ? "यह लेख उपलब्ध नहीं है या लोड नहीं हो सका"
                  : "This article is not available or failed to load")}
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              {language === "hi" ? `खोजा गया स्लग: ${params.slug}` : `Searched slug: ${params.slug}`}
            </p>
            <Button asChild>
              <Link href="/">{language === "hi" ? "होम पर वापस जाएं" : "Go Back Home"}</Link>
            </Button>
          </div>
        </main>
      </div>
    )
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
        <article className="container py-6 md:py-10">
          <div className="mx-auto max-w-3xl">
            <Button variant="ghost" size="sm" className="mb-6" asChild>
              <Link href="/">
                <ChevronLeft className="mr-2 h-4 w-4" />
                {language === "hi" ? "वापस जाएं" : "Go Back"}
              </Link>
            </Button>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">{article.title[language]}</h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-6">
              <div className="flex items-center">
                <CalendarDays className="h-4 w-4 mr-1" />
                <span>{formatDate(article.published_at)}</span>
              </div>
              {article.hours_ago !== undefined && (
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{formatTimeAgo(article.hours_ago)}</span>
                </div>
              )}
              {article.city && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>
                    {typeof article.city === "string" ? article.city : article.city[language] || article.city.hi}
                  </span>
                </div>
              )}
              {article.views !== undefined && article.views > 0 && (
                <div>
                  <span>
                    {article.views} {language === "hi" ? "बार देखा गया" : "views"}
                  </span>
                </div>
              )}
              {article.is_breaking && (
                <div className="bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
                  {language === "hi" ? "ब्रेकिंग न्यूज़" : "Breaking News"}
                </div>
              )}
            </div>

            <div className="relative aspect-[16/9] w-full mb-6">
              <Image
                src={article.image_url || "/placeholder.svg?height=600&width=1200&query=uttarakhand news"}
                alt={article.title[language]}
                fill
                className="object-cover rounded-lg"
                priority
              />
            </div>

            <div className="prose max-w-none mb-8">
              {article.content && article.content[language] && article.content[language].html ? (
                <div
                  className="prose prose-lg max-w-none [&>p]:mb-4 [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mb-4 [&>h2]:text-xl [&>h2]:font-semibold [&>h2]:mb-3 [&>h3]:text-lg [&>h3]:font-medium [&>h3]:mb-2 [&>strong]:font-semibold [&>em]:italic [&>ul]:list-disc [&>ul]:pl-6 [&>ol]:list-decimal [&>ol]:pl-6 [&>blockquote]:border-l-4 [&>blockquote]:border-primary [&>blockquote]:pl-4 [&>blockquote]:italic"
                  dangerouslySetInnerHTML={{ __html: article.content[language].html }}
                />
              ) : article.content && article.content[language] && article.content[language].text ? (
                <div className="whitespace-pre-wrap text-lg leading-relaxed">{article.content[language].text}</div>
              ) : (
                <div>
                  <p className="text-lg leading-relaxed mb-4">{article.description}</p>
                  <p className="text-muted-foreground">
                    {language === "hi"
                      ? "इस लेख की पूरी सामग्री अभी उपलब्ध नहीं है।"
                      : "Full content for this article is not available yet."}
                  </p>
                </div>
              )}
            </div>

            {article.author && (
              <div className="bg-muted rounded-lg p-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                    {article.author.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">
                      {language === "hi" ? "लेखक:" : "Author:"} {article.author.username}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {language === "hi" ? "प्रकाशित:" : "Published:"} {formatDate(article.published_at)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center border-t border-b py-4 my-8">
              <div className="text-sm">
                <span className="font-medium">{language === "hi" ? "श्रेणी:" : "Category:"}</span>{" "}
                {article.category
                  ? language === "hi"
                    ? article.category.name_hi
                    : article.category.name_en
                  : language === "hi"
                    ? "सामान्य"
                    : "General"}
              </div>
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                {language === "hi" ? "शेयर करें" : "Share"}
              </Button>
            </div>
          </div>
        </article>

        <section className="bg-muted py-12">
          <div className="container">
            <NewsletterSignup />
          </div>
        </section>
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
