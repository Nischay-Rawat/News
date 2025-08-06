"use client"

import { useEffect, useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Cloud, CloudRain, Droplets, MapPin, Thermometer, Wind, Eye, Loader2 } from 'lucide-react'
import Image from "next/image"
import { useLanguage } from "@/components/language-provider"

interface WeatherData {
  location: {
    name: string
    region: string
    country: string
    lat: number
    lon: number
    localtime: string
  }
  current: {
    temp_c: number
    temp_f: number
    is_day: number
    condition: {
      text: string
      icon: string
      code: number
    }
    wind_kph: number
    wind_dir: string
    pressure_mb: number
    precip_mm: number
    humidity: number
    cloud: number
    feelslike_c: number
    vis_km: number
    uv: number
  }
  forecast: {
    forecastday: Array<{
      date: string
      day: {
        maxtemp_c: number
        mintemp_c: number
        avgtemp_c: number
        totalprecip_mm: number
        avghumidity: number
        daily_chance_of_rain: number
        condition: {
          text: string
          icon: string
          code: number
        }
        uv: number
      }
    }>
  }
}

// Cache for weather data
let cachedWeatherData: WeatherData | null = null
let weatherCacheTimestamp = 0
const WEATHER_CACHE_DURATION = 10 * 60 * 1000 // 10 minutes

export default function WeatherWidget() {
  const { language, t } = useLanguage()
  const [weather, setWeather] = useState<WeatherData | null>(cachedWeatherData)
  const [loading, setLoading] = useState(!cachedWeatherData)
  const [error, setError] = useState<string | null>(null)
  const [locationName, setLocationName] = useState(language === "hi" ? "देहरादून" : "Dehradun")

  // Default coordinates for Dehradun
  const defaultCoords = { lat: 30.3165, lon: 78.0322 }

  useEffect(() => {
    const fetchWeather = async (lat: number, lon: number) => {
      // Check if we have valid cached data
      const now = Date.now()
      if (cachedWeatherData && (now - weatherCacheTimestamp) < WEATHER_CACHE_DURATION) {
        setWeather(cachedWeatherData)
        setLoading(false)
        return
      }

      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000) // 5s timeout

        const response = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=69ddf1bb9fd1463586345209252505&q=${lat},${lon}&days=1`,
          { 
            signal: controller.signal,
            headers: {
              'Cache-Control': 'max-age=600' // 10 minutes cache
            }
          }
        )
        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error("Weather data fetch failed")
        }

        const data = await response.json()
        
        // Cache the data
        cachedWeatherData = data
        weatherCacheTimestamp = now
        setWeather(data)

        // Update location name based on actual location
        if (
          data.location.name.toLowerCase().includes("dehradun") ||
          data.location.region.toLowerCase().includes("uttarakhand")
        ) {
          setLocationName(data.location.name)
        } else {
          setLocationName(`${data.location.name} ${language === "hi" ? "(आपका स्थान)" : "(Your Location)"}`)
        }

        setLoading(false)
        setError(null)
      } catch (err) {
        console.error("Error fetching weather:", err)
        setError(language === "hi" ? "मौसम डेटा लोड नहीं हो सका" : "Could not load weather data")
        setLoading(false)
      }
    }

    // Skip if we already have cached data
    if (cachedWeatherData && (Date.now() - weatherCacheTimestamp) < WEATHER_CACHE_DURATION) {
      return
    }

    // Try to get user's location with multiple fallbacks
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude)
        },
        async (error) => {
          console.error("Geolocation error:", error)
          // Fallback to default location
          fetchWeather(defaultCoords.lat, defaultCoords.lon)
        },
        { timeout: 3000, enableHighAccuracy: false } // Faster timeout, less accuracy
      )
    } else {
      // Browser doesn't support geolocation, use default
      fetchWeather(defaultCoords.lat, defaultCoords.lon)
    }
  }, [language])

  // Get weather condition text in the current language
  const getConditionText = useMemo(() => {
    return (condition: string) => {
      return t.weather.conditions[condition] || condition
    }
  }, [t.weather.conditions])

  if (loading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !weather) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="text-center text-muted-foreground">
            <Cloud className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm">
              {error || (language === "hi" ? "मौसम डेटा उपलब्ध नहीं है" : "Weather data not available")}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const { current, forecast, location } = weather
  const todayForecast = forecast.forecastday[0]

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">{t.weather.title}</h3>
            <div className="flex items-center text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 mr-1" />
              <span>{locationName}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="relative h-12 w-12 mr-3">
                <Image
                  src={`https:${current.condition.icon}`}
                  alt={current.condition.text}
                  fill
                  className="object-contain"
                  sizes="48px"
                  loading="lazy"
                />
              </div>
              <div>
                <div className="text-3xl font-bold">{Math.round(current.temp_c)}°C</div>
                <div className="text-sm text-muted-foreground">{getConditionText(current.condition.text)}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center">
              <Thermometer className="h-4 w-4 mr-2 text-red-500" />
              <div>
                <span className="text-muted-foreground">{t.weather.max} </span>
                <span className="font-medium">{Math.round(todayForecast.day.maxtemp_c)}°C</span>
              </div>
            </div>
            <div className="flex items-center">
              <Thermometer className="h-4 w-4 mr-2 text-blue-500" />
              <div>
                <span className="text-muted-foreground">{t.weather.min} </span>
                <span className="font-medium">{Math.round(todayForecast.day.mintemp_c)}°C</span>
              </div>
            </div>
            <div className="flex items-center">
              <Droplets className="h-4 w-4 mr-2 text-blue-500" />
              <div>
                <span className="text-muted-foreground">{t.weather.humidity} </span>
                <span className="font-medium">{current.humidity}%</span>
              </div>
            </div>
            <div className="flex items-center">
              <CloudRain className="h-4 w-4 mr-2 text-blue-500" />
              <div>
                <span className="text-muted-foreground">{t.weather.rain} </span>
                <span className="font-medium">{todayForecast.day.daily_chance_of_rain}%</span>
              </div>
            </div>
            <div className="flex items-center">
              <Wind className="h-4 w-4 mr-2 text-gray-500" />
              <div>
                <span className="text-muted-foreground">{t.weather.wind} </span>
                <span className="font-medium">{Math.round(current.wind_kph)} km/h</span>
              </div>
            </div>
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-2 text-gray-500" />
              <div>
                <span className="text-muted-foreground">{t.weather.visibility} </span>
                <span className="font-medium">{current.vis_km} km</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t text-xs text-muted-foreground text-center">
            {t.weather.lastUpdated}{" "}
            {new Date(location.localtime).toLocaleTimeString(language === "hi" ? "hi-IN" : "en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
