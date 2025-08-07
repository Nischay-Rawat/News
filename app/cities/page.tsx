"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronLeft, MapPin, Loader2 } from 'lucide-react'
import Footer from '@/components/footer'
import { useLanguage } from '@/components/language-provider'
import { fetchCities, getCitySlug, type City } from '@/lib/api'

export default function CitiesPage() {
  const { language } = useLanguage()
  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCities() {
      setLoading(true)
      try {
        const result = await fetchCities()
        setCities(result)
      } catch (error) {
        console.error('Error loading cities:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCities()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">
                {language === "hi" ? "शहर लोड हो रहे हैं..." : "Loading cities..."}
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="mb-8">
          <Button variant="ghost" size="sm" className="mb-4" asChild>
            <Link href="/">
              <ChevronLeft className="mr-2 h-4 w-4" />
              {language === "hi" ? "होम पर वापस" : "Back to Home"}
            </Link>
          </Button>

          <div className="flex items-center gap-3 mb-4">
            <MapPin className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">
                {language === "hi" ? "सभी शहर" : "All Cities"}
              </h1>
              <p className="text-muted-foreground">
                {language === "hi" 
                  ? `शहर के अनुसार समाचार ब्राउज़ करें • ${cities.length} शहर उपलब्ध`
                  : `Browse news by city • ${cities.length} cities available`
                }
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cities.map((city) => (
            <Link key={city.id} href={`/city/${getCitySlug(city.name.en)}`}>
              <Card className="h-full hover:shadow-lg transition-shadow group">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {language === "hi" ? city.name.hi : city.name.en}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-3">
                    {language === "hi" ? city.name.en : city.name.hi}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {city.state}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {language === "hi" ? "स्थानीय समाचार" : "Local News"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {cities.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              {language === "hi" ? "कोई शहर नहीं मिला" : "No cities found"}
            </h2>
            <p className="text-muted-foreground mb-4">
              {language === "hi" 
                ? "शहर वर्तमान में उपलब्ध नहीं हैं।"
                : "Cities are currently not available."
              }
            </p>
            <Button asChild>
              <Link href="/">
                {language === "hi" ? "होम पर वापस जाएं" : "Go Back Home"}
              </Link>
            </Button>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  )
}
