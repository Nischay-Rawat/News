"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "hi" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: any
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  hi: {
    nav: {
      home: "होम",
      dehradun: "देहरादून",
      nainital: "नैनीताल",
      haridwar: "हरिद्वार",
      mussoorie: "मसूरी",
      rishikesh: "ऋषिकेश",
    },
    search: {
      placeholder: "खोजें...",
    },
    trending: {
      title: "ट्रेंडिंग",
      items: [
        "उत्तराखंड में नई पर्यटन नीति की घोषणा, स्थानीय व्यवसायों को मिलेगा बढ़ावा",
        "चारधाम यात्रा: इस साल रिकॉर्ड तीर्थयात्रियों की संख्या, व्यापारियों में खुशी",
        "देहरादून में नया आईटी पार्क, हजारों युवाओं को मिलेगा रोजगार",
        "उत्तराखंड के स्कूलों में नई शिक्षा नीति लागू, छात्रों में उत्साह",
        "मसूरी में पर्यटकों की भीड़, होटल व्यवसायियों ने की रिकॉर्ड कमाई",
      ],
    },
    tabs: {
      latest: "नवीनतम समाचार",
      politics: "राजनीति",
      tourism: "पर्यटन",
      education: "शिक्षा",
      viewAll: "सभी समाचार देखें",
    },
    newsletter: {
      title: "उत्तराखंड न्यूज़ न्यूज़लेटर",
      description: "उत्तराखंड की सबसे ताज़ा खबरें सीधे अपने इनबॉक्स में प्राप्त करें। हमारे न्यूज़लेटर के लिए साइन अप करें।",
      placeholder: "आपका ईमेल पता",
      subscribe: "सब्सक्राइब",
    },
    footer: {
      description: "उत्तराखंड की सबसे विश्वसनीय और ताज़ा खबरें। हमारे साथ जुड़े रहें और अपने राज्य के बारे में सब कुछ जानें।",
      categories: {
        title: "श्रेणियाँ",
        items: ["राजनीति", "पर्यटन", "शिक्षा", "व्यापार", "खेल", "मनोरंजन"],
      },
      regions: {
        title: "क्षेत्र",
        items: ["देहरादून", "नैनीताल", "हरिद्वार", "मसूरी", "ऋषिकेश", "अल्मोड़ा"],
      },
      contact: {
        title: "संपर्क",
        items: ["हमारे बारे में", "संपर्क करें", "विज्ञापन", "नियम और शर्तें", "गोपनीयता नीति"],
      },
      legal: ["नियम और शर्तें", "गोपनीयता नीति", "कुकी नीति"],
    },
    weather: {
      title: "आज का मौसम",
      max: "अधिकतम:",
      min: "न्यूनतम:",
      humidity: "आर्द्रता:",
      rain: "वर्षा:",
      wind: "हवा:",
      visibility: "दृश्यता:",
      lastUpdated: "अंतिम अपडेट:",
      conditions: {
        Clear: "साफ़ आसमान",
        Sunny: "धूप",
        "Partly cloudy": "आंशिक बादल",
        Cloudy: "बादल",
        Overcast: "घने बादल",
        Mist: "धुंध",
        "Patchy rain possible": "हल्की बारिश संभव",
        "Patchy rain nearby": "आस-पास हल्की बारिश",
        "Thundery outbreaks possible": "गरज के साथ बारिश संभव",
        Fog: "कोहरा",
        "Light rain": "हल्की बारिश",
        "Moderate rain": "मध्यम बारिश",
        "Heavy rain": "भारी बारिश",
        "Light snow": "हल्की बर्फ़बारी",
        "Moderate snow": "मध्यम बर्फ़बारी",
        "Heavy snow": "भारी बर्फ़बारी",
      },
    },
  },
  en: {
    nav: {
      home: "Home",
      dehradun: "Dehradun",
      nainital: "Nainital",
      haridwar: "Haridwar",
      mussoorie: "Mussoorie",
      rishikesh: "Rishikesh",
    },
    search: {
      placeholder: "Search...",
    },
    trending: {
      title: "Trending",
      items: [
        "New tourism policy announced in Uttarakhand, local businesses to get boost",
        "Char Dham Yatra: Record number of pilgrims this year, traders rejoice",
        "New IT park in Dehradun, thousands of youth to get employment",
        "New education policy implemented in Uttarakhand schools, enthusiasm among students",
        "Tourist rush in Mussoorie, hotel businessmen make record earnings",
      ],
    },
    tabs: {
      latest: "Latest News",
      politics: "Politics",
      tourism: "Tourism",
      education: "Education",
      viewAll: "View All News",
    },
    newsletter: {
      title: "Uttarakhand News Newsletter",
      description: "Get the latest news from Uttarakhand directly in your inbox. Sign up for our newsletter.",
      placeholder: "Your email address",
      subscribe: "Subscribe",
    },
    footer: {
      description:
        "The most trusted and latest news from Uttarakhand. Stay connected with us and know everything about your state.",
      categories: {
        title: "Categories",
        items: ["Politics", "Tourism", "Education", "Business", "Sports", "Entertainment"],
      },
      regions: {
        title: "Regions",
        items: ["Dehradun", "Nainital", "Haridwar", "Mussoorie", "Rishikesh", "Almora"],
      },
      contact: {
        title: "Contact",
        items: ["About Us", "Contact Us", "Advertise", "Terms & Conditions", "Privacy Policy"],
      },
      legal: ["Terms & Conditions", "Privacy Policy", "Cookie Policy"],
    },
    weather: {
      title: "Today's Weather",
      max: "Max:",
      min: "Min:",
      humidity: "Humidity:",
      rain: "Rain:",
      wind: "Wind:",
      visibility: "Visibility:",
      lastUpdated: "Last Updated:",
      conditions: {
        Clear: "Clear Sky",
        Sunny: "Sunny",
        "Partly cloudy": "Partly Cloudy",
        Cloudy: "Cloudy",
        Overcast: "Overcast",
        Mist: "Mist",
        "Patchy rain possible": "Light Rain Possible",
        "Patchy rain nearby": "Light Rain Nearby",
        "Thundery outbreaks possible": "Thunderstorms Possible",
        Fog: "Fog",
        "Light rain": "Light Rain",
        "Moderate rain": "Moderate Rain",
        "Heavy rain": "Heavy Rain",
        "Light snow": "Light Snow",
        "Moderate snow": "Moderate Snow",
        "Heavy snow": "Heavy Snow",
      },
    },
  },
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("hi")

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem("preferred-language") as Language
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("preferred-language", lang)
  }

  const value = {
    language,
    setLanguage: handleSetLanguage,
    t: translations[language],
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
