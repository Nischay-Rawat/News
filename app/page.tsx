"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, ChevronDown, Menu } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/components/language-provider"
import LanguageSwitch from "@/components/language-switch"

// Lightweight components - no lazy loading to reduce complexity
import FeaturedNews from "@/components/featured-news"
import LatestNews from "@/components/latest-news"

interface TrendingNewsItem {
  slug: string
  title: { hi: string; en: string }
}

interface Category {
  name_en: string
  name_hi: string
  count: number
}

interface DashboardData {
  success: boolean
  data: {
    breaking_news: Array<{
      slug: string
      title: { hi: string; en: string }
      description: string
      hours_ago: number
    }>
    trending_news: TrendingNewsItem[]
    categories: Category[]
    cities: Array<{ name: { hi: string; en: string }; count: number }>
  }
}

export default function Home() {
  const { language, setLanguage, t } = useLanguage()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Simplified data fetching
    const fetchData = async () => {
      try {
        const response = await fetch("https://api.garhwalisonglyrics.com/api/v1/news/dashboard", {
          headers: { 'Accept': 'application/json' }
        })
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setDashboardData(data)
          }
        }
      } catch (error) {
        console.warn("API not available")
      }
    }

    fetchData()
  }, [])

  // Get trending items
  const getTrendingItems = () => {
    if (dashboardData?.success && dashboardData.data.trending_news.length > 0) {
      return dashboardData.data.trending_news.slice(0, 5).map((item) => ({
        title: item.title[language],
        slug: item.slug,
      }))
    }
    return t.trending.items.map((item: string, index: number) => ({
      title: item,
      slug: `trending-${index}`,
    }))
  }

  // Get available categories
  const getAvailableCategories = () => {
    if (dashboardData?.success && dashboardData.data.categories.length > 0) {
      return dashboardData.data.categories.map((cat) => ({
        key: cat.name_en.toLowerCase().replace(/\s+/g, "-"),
        name_en: cat.name_en,
        name_hi: cat.name_hi,
        count: cat.count,
      }))
    }
    return [
      { key: "politics", name_en: "Politics", name_hi: "राजनीति", count: 0 },
      { key: "tourism", name_en: "Tourism", name_hi: "पर्यटन", count: 0 },
      { key: "education", name_en: "Education", name_hi: "शिक्षा", count: 0 },
    ]
  }

  const getMainCities = () => {
    const mainCityKeys = ["dehradun", "nainital", "haridwar", "mussoorie", "rishikesh"]
    return mainCityKeys.map((key) => ({
      key,
      name: t.nav[key as keyof typeof t.nav],
      count: 0,
    }))
  }

  const mainCities = getMainCities()
  const availableCategories = getAvailableCategories()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl md:text-2xl font-bold text-primary">
                {language === "hi" ? "इनसाइड उत्तराखंड न्यूज़" : "Inside Uttarakhand News"}
              </span>
            </Link>
          </div>
          
          <nav className="hidden lg:flex gap-6 text-sm">
            <Link href="#" className="font-medium transition-colors hover:text-primary">
              {t.nav.home}
            </Link>
            {mainCities.slice(0, 4).map((city) => (
              <Link
                key={city.key}
                href="#"
                className="font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {city.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t.search.placeholder}
                className="w-[200px] pl-8"
              />
            </div>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="h-5 w-5" />
            </Button>
            <LanguageSwitch />
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t bg-background">
            <div className="container py-4 space-y-2">
              <Link href="#" className="block py-2 px-3 rounded hover:bg-muted">
                {t.nav.home}
              </Link>
              {mainCities.map((city) => (
                <Link
                  key={city.key}
                  href="#"
                  className="block py-2 px-3 rounded hover:bg-muted"
                >
                  {city.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <section className="container grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
          <div className="col-span-1 md:col-span-2">
            <FeaturedNews />
          </div>
          <div className="space-y-6">
            {/* Simplified Weather Widget */}
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-3">{t.weather.title}</h3>
                <div className="text-center text-muted-foreground">
                  <p className="text-sm">Weather data loading...</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{t.trending.title}</h3>
                  <ul className="space-y-3">
                    {getTrendingItems().map((item, index) => (
                      <li key={index}>
                        <Link href={`/article/${item.slug}`} className="text-sm hover:underline flex items-start">
                          <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center mr-2 shrink-0 text-xs">
                            {index + 1}
                          </span>
                          <span className="line-clamp-2">{item.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="container py-8">
          <Tabs defaultValue="latest" className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="latest">{t.tabs.latest}</TabsTrigger>
                {availableCategories.slice(0, 2).map((category) => (
                  <TabsTrigger key={category.key} value={category.key}>
                    {language === "hi" ? category.name_hi : category.name_en}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            <TabsContent value="latest">
              <LatestNews />
            </TabsContent>
          </Tabs>
        </section>

        <section className="bg-muted py-12">
          <div className="container">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
              <div className="text-center md:text-left">
                <h3 className="text-xl md:text-2xl font-bold mb-2">{t.newsletter.title}</h3>
                <p className="text-muted-foreground">{t.newsletter.description}</p>
              </div>
              <div className="w-full md:w-auto">
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <Input type="email" placeholder={t.newsletter.placeholder} className="flex-1" />
                  <Button type="submit">{t.newsletter.subscribe}</Button>
                </div>
              </div>
            </div>
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
            <div className="flex space-x-4 text-sm">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                {language === "hi" ? "हमारे बारे में" : "About"}
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                {language === "hi" ? "संपर्क" : "Contact"}
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                {language === "hi" ? "नीति" : "Privacy"}
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
