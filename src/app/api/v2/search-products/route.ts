import axios from 'axios';

interface Product {
  name: string;
  price: number;
  store: string;
  image?: string;
  url?: string;
}

class RatoneandoAPIScraper {
  private apiUrl = 'https://go.ratoneando.ar';
  private requestDelay = 1000; // 1 second delay between requests
  private lastRequestTime = 0;

  async searchProducts(query: string): Promise<Product[]> {
    try {
      console.log(`🔍 Searching for: ${query}`);
      
      // Rate limiting - wait between requests
      await this.enforceRateLimit();
      
      const url = `${this.apiUrl}?q=${encodeURIComponent(query.toLowerCase())}`;
      console.log(`🌐 API URL: ${url}`);
      
      const response = await axios.get<unknown>(url, {
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
      });

      console.log(`✅ Status: ${response.status}`);
      
      if (response.status !== 200) {
        throw new Error(`API returned status ${response.status}`);
      }
      
      const data: { products: { name: string, price: number, source: string, link: string, image: string }[], failedScrapers: string[] } = response.data as { products: { name: string, price: number, source: string, link: string, image: string }[], failedScrapers: string[] };
      
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format');
      }
      
      const products = this.parseProducts(data.products as { name: string, price: number, source: string, link: string, image: string }[] || []);
      
      console.log(`🎯 Found ${products.length} products`);
      
      // Log failed scrapers for debugging
      if (data.failedScrapers && data.failedScrapers.length > 0) {
        console.log(`⚠️  Failed scrapers: ${data.failedScrapers.join(', ')}`);
      }
      
      return products;
      
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 429) {
          throw new Error('Rate limit exceeded. Please wait and try again.');
        }
        throw new Error(`API error: ${error.response?.status} - ${error.response?.statusText}`);
      }
      throw new Error(`Failed to scrape products: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async enforceRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.requestDelay) {
      const waitTime = this.requestDelay - timeSinceLastRequest;
      console.log(`⏳ Rate limiting: waiting ${waitTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastRequestTime = Date.now();
  }

  private parseProducts(apiProducts: { name: string, price: number, source: string, link: string, image: string }[]): Product[] {
    const products: Product[] = [];
    
    for (const apiProduct of apiProducts) {
      try {
        const product: Product = {
          name: apiProduct.name || 'Unknown Product',
          price: this.parsePrice(apiProduct.price),
          store: apiProduct.source || 'Unknown Store',
          url: apiProduct.link || '',
          image: apiProduct.image || undefined,
        };
        
        // Only add products with valid prices
        if (product.price > 0) {
          products.push(product);
        }
        
      } catch (error) {
        console.error('Error parsing product:', error);
        continue;
      }
    }
    
    return products;
  }

  private parsePrice(price: number | string): number {
    if (typeof price === 'number') {
      return price;
    }
    
    if (typeof price === 'string') {
      // Clean up price string and convert to number
      const cleanPrice = price.replace(/[^\d.,]/g, '').replace(',', '.');
      const numPrice = parseFloat(cleanPrice);
      return isNaN(numPrice) ? 0 : numPrice;
    }
    
    return 0;
  }
}

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    
    if (!query || typeof query !== 'string') {
      return Response.json(
        { error: 'Query parameter is required and must be a string' },
        { status: 400 }
      );
    }

    console.log(`🔍 Search request for: ${query}`);
    
    const scraper = new RatoneandoAPIScraper();
    const products = await scraper.searchProducts(query);
    
    console.log(`✅ Returning ${products.length} products`);
    
    return Response.json(products);
    
  } catch (error) {
    console.error('❌ Error in search-products API:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return Response.json(
      {
        error: 'Failed to search products',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
