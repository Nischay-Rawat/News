import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { CalendarDays, ChevronLeft, Clock, MapPin, Share2 } from 'lucide-react'
import NewsletterSignup from "@/components/newsletter-signup"
import MobileNavigation from "@/components/mobile-navigation"
import LanguageSwitch from "@/components/language-switch"
import Footer from "@/components/footer"
import { notFound } from 'next/navigation'

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

async function getArticle(slug: string): Promise<ArticleData | null> {
  try {
    // Try to fetch from the specific article endpoint
    const apiEndpoints = [
      `https://api.garhwalisonglyrics.com/api/v1/news/slug/${slug}`,
    ]

    for (const endpoint of apiEndpoints) {
      try {
        const articleResponse = await fetch(endpoint, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          next: { revalidate: 300 } // Revalidate every 5 minutes
        })

        if (articleResponse.ok) {
          const contentType = articleResponse.headers.get("content-type")
          if (contentType && contentType.includes("application/json")) {
            const data = await articleResponse.json()
            if (data.success && data.data) {
              return data.data
            }
          }
        }
      } catch (endpointError) {
        console.warn(`Failed to fetch from ${endpoint}:`, endpointError)
        continue
      }
    }

    // Fallback to dashboard data
    const dashboardResponse = await fetch("https://api.garhwalisonglyrics.com/api/v1/news/dashboard", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 }
    })

    if (dashboardResponse.ok) {
      const contentType = dashboardResponse.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        const dashboardData = await dashboardResponse.json()
        if (dashboardData.success) {
          let foundArticle = dashboardData.data.breaking_news.find((item: any) => item.slug === slug)

          if (!foundArticle) {
            foundArticle = dashboardData.data.latest_news_by_category.find((item: any) => item.slug === slug)
          }

          if (foundArticle) {
            return foundArticle
          }
        }
      }
    }

    return null
  } catch (err) {
    console.error("Error fetching article:", err)
    return null
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug)
  
  if (!article) {
    return {
      title: 'Article Not Found - Inside Uttarakhand News',
      description: 'The requested article could not be found.'
    }
  }

  return {
    title: `${article.title.en} - Inside Uttarakhand News`,
    description: article.description || article.meta_description,
    openGraph: {
      title: article.title.en,
      description: article.description,
      images: [article.image_url || article.meta_image],
      type: 'article',
      publishedTime: article.published_at,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title.en,
      description: article.description,
      images: [article.image_url || article.meta_image],
    }
  }
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug)

  if (!article) {
    notFound()
  }

  const defaultCategories = [
    { key: "politics", name_en: "Politics", name_hi: "राजनीति", count: 0 },
    { key: "tourism", name_en: "Tourism", name_hi: "पर्यटन", count: 0 },
    { key: "education", name_en: "Education", name_hi: "शिक्षा", count: 0 },
  ]

  const defaultCities = [
    { key: "dehradun", name: "Dehradun", count: 0 },
    { key: "nainital", name: "Nainital", count: 0 },
    { key: "haridwar", name: "Haridwar", count: 0 },
    { key: "mussoorie", name: "Mussoorie", count: 0 },
    { key: "rishikesh", name: "Rishikesh", count: 0 },
  ]

  const formatTimeAgo = (hoursAgo: number) => {
    if (!hoursAgo || hoursAgo < 1) {
      return "Now"
    } else if (hoursAgo < 24) {
      return `${Math.floor(hoursAgo)} hours ago`
    } else {
      const daysAgo = Math.floor(hoursAgo / 24)
      return `${daysAgo} days ago`
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <MobileNavigation categories={defaultCategories} cities={defaultCities} />
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl md:text-2xl font-bold text-primary">
                Inside Uttarakhand News
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
                Go Back
              </Link>
            </Button>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">{article.title.en}</h1>

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
                    {typeof article.city === "string" ? article.city : article.city.en || article.city.hi}
                  </span>
                </div>
              )}
              {article.views !== undefined && article.views > 0 && (
                <div>
                  <span>{article.views} views</span>
                </div>
              )}
              {article.is_breaking && (
                <div className="bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
                  Breaking News
                </div>
              )}
            </div>

            <div className="relative aspect-[16/9] w-full mb-6">
              <Image
                src={article.image_url || "/placeholder.svg?height=600&width=1200&query=uttarakhand news"}
                alt={article.title.en}
                fill
                className="object-cover rounded-lg"
                priority
              />
            </div>

            <div className="prose max-w-none mb-8">
              {article.content && article.content.en && article.content.en.html ? (
                <div
                  className="prose prose-lg max-w-none [&>p]:mb-4 [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mb-4 [&>h2]:text-xl [&>h2]:font-semibold [&>h2]:mb-3 [&>h3]:text-lg [&>h3]:font-medium [&>h3]:mb-2 [&>strong]:font-semibold [&>em]:italic [&>ul]:list-disc [&>ul]:pl-6 [&>ol]:list-decimal [&>ol]:pl-6 [&>blockquote]:border-l-4 [&>blockquote]:border-primary [&>blockquote]:pl-4 [&>blockquote]:italic"
                  dangerouslySetInnerHTML={{ __html: article.content.en.html }}
                />
              ) : article.content && article.content.en && article.content.en.text ? (
                <div className="whitespace-pre-wrap text-lg leading-relaxed">{article.content.en.text}</div>
              ) : (
                <div>
                  <p className="text-lg leading-relaxed mb-4">{article.description}</p>
                  <p className="text-muted-foreground">
                    Full content for this article is not available yet.
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
                    <p className="font-medium">Author: {article.author.username}</p>
                    <p className="text-sm text-muted-foreground">
                      Published: {formatDate(article.published_at)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center border-t border-b py-4 my-8">
              <div className="text-sm">
                <span className="font-medium">Category:</span>{" "}
                {article.category ? article.category.name_en : "General"}
              </div>
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
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
      <Footer />
    </div>
  )
}
