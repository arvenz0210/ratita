import { NextResponse } from 'next/server'
import axios from 'axios'
import fs from 'fs'
import path from 'path'

interface Product {
  name: string
  quantity: number
}

interface ScrapedProduct {
  title: string
  price: string
  store: string
  link: string
  image?: string
}

interface ComparisonRow {
  product: string
  quantity: number
  prices: { [store: string]: number | null }
  bestPrice: number | null
  bestStore: string | null
}

interface ComparisonResult {
  products: ComparisonRow[]
  storeTotals: { [store: string]: { total: number, itemsFound: number } }
  stores: string[]
}

interface CacheEntry {
  timestamp: string
  data: {
    products: ScrapedProduct[]
    totalFound: number
  }
}

interface Cache {
  [searchTerm: string]: CacheEntry
}

// Función para extraer precio numérico
function extractPrice(priceStr: string): number | null {
  const match = priceStr.match(/[\d,]+/)
  if (!match) return null
  
  const cleanPrice = match[0].replace(/,/g, '')
  return parseInt(cleanPrice)
}

// Función para buscar productos usando el scraper
async function scrapeProduct(searchTerm: string): Promise<ScrapedProduct[]> {
  try {
    console.log(`🔍 Searching for: ${searchTerm}`)
    
    const url = `https://go.ratoneando.ar?q=${encodeURIComponent(searchTerm.toLowerCase())}`
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Referer': 'https://ratoneando.ar/',
        'Origin': 'https://ratoneando.ar',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
      },
      timeout: 10000,
    })
    
    console.log(`✅ Status: ${response.status}`)
    
    if (response.status !== 200) {
      throw new Error(`API returned status ${response.status}`)
    }
    
    const data = response.data
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format')
    }
    
    const products = data.products || []
    console.log(`🎯 Found ${products.length} products`)
    
    // Parse products to our format
    const scrapedProducts: ScrapedProduct[] = products.map((product: { name?: string; price?: number | string; source?: string; link?: string; image?: string }) => ({
      title: product.name || 'Unknown Product',
      price: formatPrice(product.price),
      store: product.source || 'Unknown Store',
      link: product.link || '',
      image: product.image || undefined,
    }))
    
    return scrapedProducts
    
  } catch (error) {
    console.error(`Error scraping ${searchTerm}:`, error)
    return []
  }
}

// Función para formatear precio
function formatPrice(price: number | string | undefined): string {
  if (typeof price === 'number') {
    return `$${price.toFixed(2)}`
  }
  
  if (typeof price === 'string') {
    // Clean up price string
    return price.replace(/[^\d.,]/g, '').replace(',', '.')
  }
  
  return 'Price not available'
}

// Función para obtener término de búsqueda del nombre del producto
function getSearchTerm(productName: string): string {
  const searchMap: { [key: string]: string } = {
    'Coca Cola 2.25L': 'coca cola',
    'Leche entera 1L': 'leche',
    'Bife de chorizo': 'bife chorizo',
    'Chorizo': 'chorizo',
    'Pan francés': 'pan',
    'Ensalada mixta': 'ensalada',
    'Cerveza lata 473ml': 'cerveza'
  }
  
  return searchMap[productName] || productName.toLowerCase().split(' ')[0]
}

// Función para cargar cache
function loadCache(): Cache {
  const cacheFile = path.join(process.cwd(), 'cache.json')
  
  try {
    if (fs.existsSync(cacheFile)) {
      const cacheData = fs.readFileSync(cacheFile, 'utf8')
      return JSON.parse(cacheData)
    }
  } catch (error) {
    console.error('Error loading cache:', error)
  }
  
  return {}
}

// Función para guardar cache
function saveCache(cache: Cache): void {
  const cacheFile = path.join(process.cwd(), 'cache.json')
  
  try {
    const dir = path.dirname(cacheFile)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    
    fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2))
    console.log('💾 Cache saved successfully')
  } catch (error) {
    console.error('Error saving cache:', error)
  }
}

// Función para verificar si el cache es válido (menos de 1 hora)
function isCacheValid(cacheEntry: CacheEntry): boolean {
  const now = new Date()
  const cacheTime = new Date(cacheEntry.timestamp)
  const hourDiff = (now.getTime() - cacheTime.getTime()) / (1000 * 60 * 60)
  
  return hourDiff < 1 // Cache válido por 1 hora
}

export async function POST(req: Request) {
  try {
    const { products } = await req.json()
    
    if (!products || !Array.isArray(products)) {
      return NextResponse.json(
        { error: 'Invalid products data' },
        { status: 400 }
      )
    }

    const productList: Product[] = products

    // Cargar cache
    const cache = loadCache()
    let cacheUpdated = false
    
    const comparisonRows: ComparisonRow[] = []
    const storeSet = new Set<string>()

    // Procesar cada producto
    for (const product of productList) {
      const productName = product.name
      const searchTerm = getSearchTerm(productName)
      console.log(`Processing: ${productName} (search: ${searchTerm})`)
      
      // Verificar si está en cache y es válido
      const cacheEntry = cache[searchTerm]
      let scrapedProducts: ScrapedProduct[] = []
      
      if (cacheEntry && isCacheValid(cacheEntry)) {
        console.log(`📖 Using cached data for: ${searchTerm}`)
        scrapedProducts = cacheEntry.data.products
      } else {
        console.log(`🔍 Scraping fresh data for: ${searchTerm}`)
        
        scrapedProducts = await scrapeProduct(searchTerm)
        
        // Solo guardar en cache si se encontraron productos
        if (scrapedProducts.length > 0) {
          cache[searchTerm] = {
            timestamp: new Date().toISOString(),
            data: {
              products: scrapedProducts,
              totalFound: scrapedProducts.length
            }
          }
          cacheUpdated = true
          console.log(`💾 Cached ${scrapedProducts.length} products for: ${searchTerm}`)
        } else {
          console.log(`⚠️  No products found for: ${searchTerm} - not caching`)
        }
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
      
      // Organizar precios por supermercado
      const prices: { [store: string]: number | null } = {}
      let bestPrice: number | null = null
      let bestStore: string | null = null
      
      scrapedProducts.forEach(item => {
        const price = extractPrice(item.price)
        if (price) {
          storeSet.add(item.store)
          
          // Tomar el mejor precio por supermercado
          if (!prices[item.store] || price < prices[item.store]!) {
            prices[item.store] = price
          }
          
          // Encontrar el mejor precio general
          if (!bestPrice || price < bestPrice) {
            bestPrice = price
            bestStore = item.store
          }
        }
      })
      
      comparisonRows.push({
        product: productName,
        quantity: product.quantity,
        prices,
        bestPrice,
        bestStore
      })
    }
    
    // Guardar cache si fue actualizado
    if (cacheUpdated) {
      saveCache(cache)
    }

    // Calcular totales por supermercado
    const stores = Array.from(storeSet)
    const storeTotals: { [store: string]: { total: number, itemsFound: number } } = {}
    
    stores.forEach(store => {
      storeTotals[store] = { total: 0, itemsFound: 0 }
    })
    
    comparisonRows.forEach(row => {
      stores.forEach(store => {
        if (row.prices[store]) {
          storeTotals[store].total += row.prices[store]! * row.quantity
          storeTotals[store].itemsFound += 1
        }
      })
    })

    const result: ComparisonResult = {
      products: comparisonRows,
      storeTotals,
      stores: stores.sort()
    }

    return NextResponse.json(result)
    
  } catch (error) {
    console.error('Error in compare-prices endpoint:', error)
    return NextResponse.json(
      { error: 'Error comparing prices' },
      { status: 500 }
    )
  }
} 