"use client"

import Link from "next/link"
import { ChevronDown } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/components/language-provider"
import { getCitySlug, type City } from "@/lib/api"

interface CitiesNavigationProps {
  cities: City[]
}

export default function CitiesNavigation({ cities }: CitiesNavigationProps) {
  const { language } = useLanguage()

  const visibleCities = cities.slice(0, 12)
  const hiddenCities = cities.slice(12)

  return (
    <div className="border-t bg-muted/30">
      <div className="container">
        <div className="flex items-center gap-1 py-2 overflow-x-auto scrollbar-hide">
          <span className="text-xs font-medium text-muted-foreground mr-2 shrink-0">
            {language === "hi" ? "शहर:" : "Cities:"}
          </span>
          
          {/* Visible Cities */}
          {visibleCities.map((city) => (
            <Link
              key={city.id}
              href={`/city/${getCitySlug(city.name.en)}`}
              className="text-xs px-2 py-1 rounded-md hover:bg-background transition-colors shrink-0"
            >
              {language === "hi" ? city.name.hi : city.name.en}
            </Link>
          ))}
          
          {/* More Cities Dropdown */}
          {hiddenCities.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger className="text-xs px-2 py-1 rounded-md hover:bg-background transition-colors shrink-0 text-primary flex items-center gap-1">
                {language === "hi" ? "और..." : "More..."}
                <ChevronDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="start" 
                className="w-80 max-h-96 overflow-y-auto"
                sideOffset={4}
              >
                <div className="p-2">
                  <div className="text-xs font-medium text-muted-foreground mb-2 px-2">
                    {language === "hi" ? "अन्य शहर:" : "Other Cities:"}
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {hiddenCities.map((city) => (
                      <DropdownMenuItem key={city.id} asChild>
                        <Link
                          href={`/city/${getCitySlug(city.name.en)}`}
                          className="text-xs px-2 py-1.5 rounded hover:bg-muted transition-colors cursor-pointer"
                        >
                          {language === "hi" ? city.name.hi : city.name.en}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </div>
                  <div className="border-t mt-2 pt-2">
                    <DropdownMenuItem asChild>
                      <Link
                        href="/cities"
                        className="text-xs px-2 py-1.5 rounded hover:bg-muted transition-colors cursor-pointer text-primary font-medium w-full"
                      >
                        {language === "hi" ? "सभी शहर देखें →" : "View All Cities →"}
                      </Link>
                    </DropdownMenuItem>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  )
}
