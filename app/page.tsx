"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Loader2 } from 'lucide-react'
import LanguageSwitch from "@/components/language-switch"
import FeaturedNews from "@/components/featured-news"
import LatestNews from "@/components/latest-news"
import WeatherWidget from "@/components/weather-widget"
import Footer from "@/components/footer"
import MobileNavigation from "@/components/mobile-navigation"
import NewsletterSignup from "@/components/newsletter-signup"
import { useLanguage } from "@/components/language-provider"
import { fetchCities, fetchCategories, getCitySlug, getCategorySlug, type City, type Category } from "@/lib/api"
import CitiesNavigation from "@/components/cities-navigation"

interface TrendingNewsItem {
  slug: string
  title: { hi: string; en: string }
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

async function getDashboardData(): Promise<DashboardData | null> {
  try {
    const response = await fetch("https://api.garhwalisonglyrics.com/api/v1/news/dashboard", {
      headers: { 'Accept': 'application/json' },
      cache: 'no-store' // Don't cache for real-time data
    })
    
    if (response.ok) {
      const data = await response.json()
      if (data.success) {
        return data
      }
    }
  } catch (error) {
    console.warn("Dashboard API not available")
  }
  
  return null
}

export default function Home() {
  const { language, t } = useLanguage()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [cities, setCities] = useState<City[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [categoryLoading, setCategoryLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const [dashboardResult, citiesResult, categoriesResult] = await Promise.all([
          getDashboardData(),
          fetchCities(),
          fetchCategories()
        ])
        
        setDashboardData(dashboardResult)
        setCities(citiesResult)
        setCategories(categoriesResult)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Convert cities to the format expected by components
  const citiesForNav = cities.map(city => ({
    key: getCitySlug(city.name.en),
    name: city.name.en,
    name_hi: city.name.hi,
    count: 0
  }))

  // Convert categories to the format expected by components
  const categoriesForNav = categories.slice(0, 10).map(category => ({
    key: getCategorySlug(category.name_en),
    name_en: category.name_en,
    name_hi: category.name_hi,
    count: 0
  }))

  // Get top categories for header navigation (limit to 6)
  const topCategories = categories.slice(0, 6)

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">
            {language === "hi" ? "लोड हो रहा है..." : "Loading..."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <MobileNavigation categories={categoriesForNav} cities={citiesForNav} />
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl md:text-2xl font-bold text-primary">
                {language === "hi" ? "इनसाइड उत्तराखंड न्यूज़" : "Inside Uttarakhand News"}
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex gap-6 text-sm">
            <Link href="/" className="font-medium transition-colors hover:text-primary">
              {language === "hi" ? "होम" : "Home"}
            </Link>
            {topCategories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${getCategorySlug(category.name_en)}`}
                className="font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {language === "hi" ? category.name_hi : category.name_en}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={language === "hi" ? "खोजें..." : "Search..."}
                className="w-[200px] pl-8"
              />
            </div>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="h-5 w-5" />
            </Button>
            <LanguageSwitch />
          </div>
        </div>

        {/* Cities Navigation Bar */}
        <CitiesNavigation cities={cities} />
      </header>

      <main className="flex-1">
        <section className="container grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
          <div className="col-span-1 md:col-span-2">
            <FeaturedNews dashboardData={dashboardData} />
          </div>
          <div className="space-y-6">
            <WeatherWidget />

            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">
                    {language === "hi" ? "ट्रेंडिंग" : "Trending"}
                  </h3>
                  <ul className="space-y-3">
                    {dashboardData?.data?.trending_news?.slice(0, 5).map((item, index) => (
                      <li key={index}>
                        <Link href={`/article/${item.slug}`} className="text-sm hover:underline flex items-start">
                          <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center mr-2 shrink-0 text-xs">
                            {index + 1}
                          </span>
                          <span className="line-clamp-2">
                            {language === "hi" ? item.title.hi : item.title.en}
                          </span>
                        </Link>
                      </li>
                    )) || [
                      {
                        hi: "उत्तराखंड में नई पर्यटन नीति की घोषणा",
                        en: "New tourism policy announced in Uttarakhand"
                      },
                      {
                        hi: "चारधाम यात्रा: रिकॉर्ड तीर्थयात्री",
                        en: "Char Dham Yatra: Record number of pilgrims"
                      },
                      {
                        hi: "देहरादून में नया आईटी पार्क",
                        en: "New IT park in Dehradun announced"
                      },
                      {
                        hi: "स्कूलों में शिक्षा नीति लागू",
                        en: "Education policy implemented in schools"
                      },
                      {
                        hi: "मसूरी में पर्यटकों की भीड़",
                        en: "Tourist rush in Mussoorie this season"
                      }
                    ].map((title, index) => (
                      <li key={index}>
                        <Link href={`/article/trending-${index}`} className="text-sm hover:underline flex items-start">
                          <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center mr-2 shrink-0 text-xs">
                            {index + 1}
                          </span>
                          <span className="line-clamp-2">
                            {language === "hi" ? title.hi : title.en}
                          </span>
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
              <TabsList className="w-full sm:w-auto overflow-x-auto">
                <TabsTrigger value="latest">
                  {language === "hi" ? "नवीनतम समाचार" : "Latest News"}
                </TabsTrigger>
                {categories.slice(0, 4).map((category) => (
                  <TabsTrigger key={category.id} value={getCategorySlug(category.name_en)}>
                    {language === "hi" ? category.name_hi : category.name_en}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/categories">
                    {language === "hi" ? "सभी श्रेणियाँ" : "All Categories"}
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/cities">
                    {language === "hi" ? "सभी शहर" : "All Cities"}
                  </Link>
                </Button>
              </div>
            </div>
            
            <TabsContent value="latest">
              <LatestNews dashboardData={dashboardData} />
            </TabsContent>
            
            {categories.slice(0, 4).map((category) => (
              <TabsContent key={category.id} value={getCategorySlug(category.name_en)}>
                <LatestNews category={category.name_en} dashboardData={dashboardData} />
              </TabsContent>
            ))}
          </Tabs>
        </section>

        {/* Categories Grid Section */}
        <section className="bg-muted/30 py-12">
          <div className="container">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                {language === "hi" ? "श्रेणी के अनुसार ब्राउज़ करें" : "Browse by Category"}
              </h2>
              <p className="text-muted-foreground">
                {language === "hi" ? "विभिन्न श्रेणियों से समाचार देखें" : "Explore news from different categories"}
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${getCategorySlug(category.name_en)}`}
                  className="group"
                >
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <CardContent className="p-4 text-center">
                      <h3 className="font-medium group-hover:text-primary transition-colors">
                        {language === "hi" ? category.name_hi : category.name_en}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {language === "hi" ? category.name_en : category.name_hi}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            
            {categories.length > 20 && (
              <div className="text-center mt-8">
                <Button asChild>
                  <Link href="/categories">
                    {language === "hi" ? "सभी श्रेणियाँ देखें" : "View All Categories"}
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Cities Grid Section */}
        <section className="py-12">
          <div className="container">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                {language === "hi" ? "शहर के अनुसार समाचार" : "News by City"}
              </h2>
              <p className="text-muted-foreground">
                {language === "hi" ? "अपने शहर की स्थानीय खबरें पाएं" : "Get local news from your city"}
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {cities.map((city) => (
                <Link
                  key={city.id}
                  href={`/city/${getCitySlug(city.name.en)}`}
                  className="group"
                >
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <CardContent className="p-4 text-center">
                      <h3 className="font-medium group-hover:text-primary transition-colors">
                        {language === "hi" ? city.name.hi : city.name.en}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {language === "hi" ? city.name.en : city.name.hi}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            
            {cities.length > 18 && (
              <div className="text-center mt-8">
                <Button asChild>
                  <Link href="/cities">
                    {language === "hi" ? "सभी शहर देखें" : "View All Cities"}
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </section>

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
