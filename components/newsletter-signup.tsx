"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

export default function NewsletterSignup() {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
      <div className="text-center md:text-left">
        <h3 className="text-xl md:text-2xl font-bold mb-2">{t.newsletter.title}</h3>
        <p className="text-muted-foreground">{t.newsletter.description}</p>
      </div>
      <div className="w-full md:w-auto">
        <form className="flex w-full max-w-sm items-center space-x-2">
          <Input type="email" placeholder={t.newsletter.placeholder} className="flex-1" />
          <Button type="submit">
            <Send className="h-4 w-4 mr-2" />
            {t.newsletter.subscribe}
          </Button>
        </form>
      </div>
    </div>
  )
}
