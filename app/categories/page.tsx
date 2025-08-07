"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Tag, Loader2 } from 'lucide-react'
import Footer from '@/components/footer'
import { useLanguage } from '@/components/language-provider'
import { fetchCategories, getCategorySlug, type Category } from '@/lib/api'

export default function CategoriesPage() {
  const { language } = useLanguage()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCategories() {
      setLoading(true)
      try {
        const result = await fetchCategories()
        setCategories(result)
      } catch (error) {
        console.error('Error loading categories:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">
                {language === "hi" ? "श्रेणियाँ लोड हो रही हैं..." : "Loading categories..."}
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
            <Tag className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">
                {language === "hi" ? "सभी श्रेणियाँ" : "All Categories"}
              </h1>
              <p className="text-muted-foreground">
                {language === "hi" 
                  ? `श्रेणी के अनुसार समाचार ब्राउज़ करें • ${categories.length} श्रेणियाँ उपलब्ध`
                  : `Browse news by category • ${categories.length} categories available`
                }
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/category/${getCategorySlug(category.name_en)}`}>
              <Card className="h-full hover:shadow-lg transition-shadow group">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {language === "hi" ? category.name_hi : category.name_en}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-3">
                    {language === "hi" ? category.name_en : category.name_hi}
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    {language === "hi" ? "श्रेणी" : "Category"}
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-12">
            <Tag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              {language === "hi" ? "कोई श्रेणी नहीं मिली" : "No categories found"}
            </h2>
            <p className="text-muted-foreground mb-4">
              {language === "hi" 
                ? "श्रेणियाँ वर्तमान में उपलब्ध नहीं हैं।"
                : "Categories are currently not available."
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
