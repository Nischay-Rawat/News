// Types for API responses
export interface City {
  id: number
  name: {
    en: string
    hi: string
  }
  state: string
}

export interface Category {
  id: number
  name_en: string
  name_hi: string
  created_at: string
}

export interface CitiesResponse {
  success: boolean
  data: {
    cities: City[]
    pagination: {
      limit: number
      page: number
      pages: number
      total: number
    }
  }
}

export interface CategoriesResponse {
  success: boolean
  data: {
    data: Category[]
    meta: {
      total: number
      page: number
      limit: number
      pages: number
    }
  }
}

// Fetch cities from API
export async function fetchCities(): Promise<City[]> {
  try {
    const response = await fetch('https://api.garhwalisonglyrics.com/api/v1/cities', {
      next: { revalidate: 3600 }, // Cache for 1 hour
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: CitiesResponse = await response.json()
    
    if (data.success && data.data.cities) {
      return data.data.cities
    }
    
    return []
  } catch (error) {
    console.error('Error fetching cities:', error)
    // Return fallback cities
    return [
      { id: 1, name: { en: 'Dehradun', hi: 'देहरादून' }, state: 'Uttarakhand' },
      { id: 2, name: { en: 'Haridwar', hi: 'हरिद्वार' }, state: 'Uttarakhand' },
      { id: 3, name: { en: 'Rishikesh', hi: 'ऋषिकेश' }, state: 'Uttarakhand' },
      { id: 4, name: { en: 'Nainital', hi: 'नैनीताल' }, state: 'Uttarakhand' },
      { id: 5, name: { en: 'Mussoorie', hi: 'मसूरी' }, state: 'Uttarakhand' },
    ]
  }
}

// Fetch categories from API
export async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await fetch('https://api.garhwalisonglyrics.com/api/v1/news/categories', {
      next: { revalidate: 3600 }, // Cache for 1 hour
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: CategoriesResponse = await response.json()
    
    if (data.success && data.data.data) {
      return data.data.data
    }
    
    return []
  } catch (error) {
    console.error('Error fetching categories:', error)
    // Return fallback categories
    return [
      { id: 1, name_en: 'Politics', name_hi: 'राजनीति', created_at: '' },
      { id: 2, name_en: 'Education', name_hi: 'शिक्षा', created_at: '' },
      { id: 3, name_en: 'Tourism', name_hi: 'पर्यटन', created_at: '' },
      { id: 4, name_en: 'Business', name_hi: 'व्यापार', created_at: '' },
      { id: 5, name_en: 'Sports', name_hi: 'खेल', created_at: '' },
    ]
  }
}

// Convert city name to URL slug
export function getCitySlug(cityName: string): string {
  const cityMappings: Record<string, string> = {
    'Dehradun': 'dehradun',
    'देहरादून': 'dehradun',
    'Haridwar': 'haridwar', 
    'हरिद्वार': 'haridwar',
    'Rishikesh': 'rishikesh',
    'ऋषिकेश': 'rishikesh',
    'Nainital': 'nainital',
    'नैनीताल': 'nainital',
    'Mussoorie': 'mussoorie',
    'मसूरी': 'mussoorie',
    'Almora': 'almora',
    'अल्मोड़ा': 'almora',
    'Pauri': 'pauri',
    'पौड़ी': 'pauri',
    'Bageshwar': 'bageshwar',
    'बागेश्वर': 'bageshwar',
    'Chamoli': 'chamoli',
    'चमोली': 'chamoli',
    'Uttarkashi': 'uttarkashi',
    'उत्तरकाशी': 'uttarkashi',
    'Pithoragarh': 'pithoragarh',
    'पिथौरागढ़': 'pithoragarh',
    'Rudraprayag': 'rudraprayag',
    'रुद्रप्रयाग': 'rudraprayag',
    'Tehri': 'tehri',
    'टिहरी': 'tehri',
    'Haldwani': 'haldwani',
    'हल्द्वानी': 'haldwani',
    'Kashipur': 'kashipur',
    'काशीपुर': 'kashipur',
    'Kotdwar': 'kotdwar',
    'कोटद्वार': 'kotdwar',
    'Ramnagar': 'ramnagar',
    'रामनगर': 'ramnagar',
    'Roorkee': 'roorkee',
    'रुड़की': 'roorkee',
    'Tanakpur': 'tanakpur',
    'तनकपुर': 'tanakpur',
  }
  
  return cityMappings[cityName] || cityName.toLowerCase().replace(/\s+/g, '-')
}

// Convert category name to URL slug
export function getCategorySlug(categoryName: string): string {
  return categoryName.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')
}
