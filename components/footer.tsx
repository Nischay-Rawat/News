"use client"

import Link from "next/link"
import { useLanguage } from "@/components/language-provider"

export default function Footer() {
  const { language } = useLanguage()

  // Popular categories (hardcoded for footer)
  const popularCategories = [
    { key: "politics", name_hi: "राजनीति", name_en: "Politics" },
    { key: "education", name_hi: "शिक्षा", name_en: "Education" },
    { key: "tourism", name_hi: "पर्यटन", name_en: "Tourism" },
    { key: "business", name_hi: "व्यापार", name_en: "Business" },
    { key: "health", name_hi: "स्वास्थ्य", name_en: "Health" },
  ]

  // Popular cities (hardcoded for footer)
  const popularCities = [
    { key: "dehradun", name_hi: "देहरादून", name_en: "Dehradun" },
    { key: "haridwar", name_hi: "हरिद्वार", name_en: "Haridwar" },
    { key: "nainital", name_hi: "नैनीताल", name_en: "Nainital" },
    { key: "rishikesh", name_hi: "ऋषिकेश", name_en: "Rishikesh" },
    { key: "mussoorie", name_hi: "मसूरी", name_en: "Mussoorie" },
    { key: "almora", name_hi: "अल्मोड़ा", name_en: "Almora" },
  ]

  return (
    <footer className="border-t bg-background">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="text-xl font-bold text-primary">
                {language === "hi" ? "इनसाइड उत्तराखंड न्यूज़" : "Inside Uttarakhand News"}
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              {language === "hi" 
                ? "उत्तराखंड की सबसे विश्वसनीय और ताज़ा खबरें।"
                : "The most trusted and latest news from Uttarakhand."
              }
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4">
              {language === "hi" ? "लोकप्रिय श्रेणियाँ" : "Popular Categories"}
            </h3>
            <ul className="space-y-2 text-sm">
              {popularCategories.map((category) => (
                <li key={category.key}>
                  <Link href={`/category/${category.key}`} className="text-muted-foreground hover:text-primary transition-colors">
                    {language === "hi" ? category.name_hi : category.name_en}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/categories" className="text-primary hover:underline font-medium">
                  {language === "hi" ? "सभी श्रेणियाँ देखें" : "View All Categories"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Cities */}
          <div>
            <h3 className="font-semibold mb-4">
              {language === "hi" ? "लोकप्रिय शहर" : "Popular Cities"}
            </h3>
            <ul className="space-y-2 text-sm">
              {popularCities.map((city) => (
                <li key={city.key}>
                  <Link href={`/city/${city.key}`} className="text-muted-foreground hover:text-primary transition-colors">
                    {language === "hi" ? city.name_hi : city.name_en}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/cities" className="text-primary hover:underline font-medium">
                  {language === "hi" ? "सभी शहर देखें" : "View All Cities"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Legal */}
          <div>
            <h3 className="font-semibold mb-4">
              {language === "hi" ? "संपर्क और जानकारी" : "Contact & Info"}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  {language === "hi" ? "हमारे बारे में" : "About Us"}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  {language === "hi" ? "संपर्क करें" : "Contact Us"}
                </Link>
              </li>
              <li>
                <Link href="/advertise" className="text-muted-foreground hover:text-primary transition-colors">
                  {language === "hi" ? "विज्ञापन" : "Advertise"}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  {language === "hi" ? "नियम और शर्तें" : "Terms & Conditions"}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  {language === "hi" ? "गोपनीयता नीति" : "Privacy Policy"}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-muted-foreground mb-4 md:mb-0">
              &copy; {new Date().getFullYear()}{" "}
              {language === "hi"
                ? "इनसाइड उत्तराखंड न्यूज़. सर्वाधिकार सुरक्षित."
                : "Inside Uttarakhand News. All rights reserved."
              }
            </p>
            
            <div className="flex space-x-4 text-xs">
              <Link href="/cookies" className="text-muted-foreground hover:text-primary transition-colors">
                {language === "hi" ? "कुकी नीति" : "Cookie Policy"}
              </Link>
              <Link href="/sitemap" className="text-muted-foreground hover:text-primary transition-colors">
                {language === "hi" ? "साइटमैप" : "Sitemap"}
              </Link>
              <Link href="/rss" className="text-muted-foreground hover:text-primary transition-colors">
                {language === "hi" ? "RSS फीड" : "RSS Feed"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
