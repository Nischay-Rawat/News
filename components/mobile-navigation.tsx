"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Menu, ChevronRight } from 'lucide-react'
import { useLanguage } from "@/components/language-provider"

interface Category {
  key: string
  name_en: string
  name_hi: string
  count: number
}

interface City {
  key: string
  name: string
  name_hi?: string
  count: number
}

interface MobileNavigationProps {
  categories: Category[]
  cities: City[]
}

export default function MobileNavigation({ categories, cities }: MobileNavigationProps) {
  const { language, t } = useLanguage()
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">{language === "hi" ? "मेनू खोलें" : "Open menu"}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[80%] sm:w-[350px] overflow-y-auto">
        <SheetHeader className="border-b pb-4 mb-4">
          <SheetTitle className="text-left">
            {language === "hi" ? "इनसाइड उत्तराखंड न्यूज़" : "Inside Uttarakhand News"}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-4">
          <Link
            href="/"
            className="block py-2 px-3 rounded-md hover:bg-muted transition-colors"
            onClick={() => setOpen(false)}
          >
            {t?.nav?.home || (language === "hi" ? "होम" : "Home")}
          </Link>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="categories">
              <AccordionTrigger className="py-2 px-3 hover:bg-muted rounded-md">
                {language === "hi" ? "श्रेणियाँ" : "Categories"}
              </AccordionTrigger>
              <AccordionContent>
                <div className="pl-4 space-y-1 mt-1 max-h-60 overflow-y-auto">
                  {categories.map((category) => (
                    <Link
                      key={category.key}
                      href={`/category/${category.key}`}
                      className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      <span>{language === "hi" ? category.name_hi : category.name_en}</span>
                      {category.count > 0 && <span className="text-xs text-muted-foreground">({category.count})</span>}
                    </Link>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="cities">
              <AccordionTrigger className="py-2 px-3 hover:bg-muted rounded-md">
                {language === "hi" ? "शहर" : "Cities"}
              </AccordionTrigger>
              <AccordionContent>
                <div className="pl-4 space-y-1 mt-1 max-h-60 overflow-y-auto">
                  {cities.map((city) => (
                    <Link
                      key={city.key}
                      href={`/city/${city.key}`}
                      className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      <span>{language === "hi" && city.name_hi ? city.name_hi : city.name}</span>
                      {city.count > 0 && <span className="text-xs text-muted-foreground">({city.count})</span>}
                    </Link>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="border-t pt-4 mt-4">
            <Link
              href="/categories"
              className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted transition-colors"
              onClick={() => setOpen(false)}
            >
              <span>{language === "hi" ? "सभी श्रेणियाँ" : "All Categories"}</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              href="/cities"
              className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted transition-colors"
              onClick={() => setOpen(false)}
            >
              <span>{language === "hi" ? "सभी शहर" : "All Cities"}</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              href="/about"
              className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted transition-colors"
              onClick={() => setOpen(false)}
            >
              <span>{language === "hi" ? "हमारे बारे में" : "About Us"}</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted transition-colors"
              onClick={() => setOpen(false)}
            >
              <span>{language === "hi" ? "संपर्क करें" : "Contact Us"}</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
