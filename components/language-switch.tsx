"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { Languages } from "lucide-react"

export default function LanguageSwitch() {
  const { language, setLanguage } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === "hi" ? "en" : "hi")
  }

  return (
    <Button variant="outline" size="sm" onClick={toggleLanguage} className="flex items-center gap-2 bg-transparent">
      <Languages className="h-4 w-4" />
      <span className="hidden sm:inline">{language === "hi" ? "हिंदी" : "English"}</span>
      <span className="sm:hidden">{language === "hi" ? "हि" : "EN"}</span>
    </Button>
  )
}
