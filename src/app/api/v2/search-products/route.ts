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
    
    const products = [
      {
        id: '30112',
        image: 'https://ardiaprod.vtexassets.com/arquivos/ids/343873/Leche-Parcialmente-Descremada-DIA-Sachet-1-Lt-_1.jpg?v=638736548318930000',
        link: 'https://diaonline.supermercadosdia.com.ar/leche-parcialmente-descremada-dia-sachet-1-lt-30112/p',
        name: 'Leche Parcialmente Descremada DIA Sachet 1 Lt.',
        price: 1190,
        source: 'diaonline',
        unit: 'LT',
        unitPrice: 1190
      },
      {
        id: '269231',
        image: 'https://ardiaprod.vtexassets.com/arquivos/ids/344153/Leche-Ultrapasteurizada-2--Dia-1-Lt-_1.jpg?v=638736551498170000',
        link: 'https://diaonline.supermercadosdia.com.ar/leche-ultrapasteurizada-2--dia-1-lt-269231/p',
        name: 'Leche Ultrapasteurizada 2% Dia 1 Lt.',
        price: 1190,
        source: 'diaonline',
        unit: 'LT',
        unitPrice: 1190
      },
      {
        id: '30111',
        image: 'https://ardiaprod.vtexassets.com/arquivos/ids/343871/Leche-Entera-DIA-Sachet-1-Lt-_1.jpg?v=638736548287370000',
        link: 'https://diaonline.supermercadosdia.com.ar/leche-entera-dia-sachet-1-lt-30111/p',
        name: 'Leche Entera DIA Sachet 1 Lt.',
        price: 1190,
        source: 'diaonline',
        unit: 'LT',
        unitPrice: 1190
      },
      {
        id: '720022',
        image: 'https://carrefourar.vtexassets.com/arquivos/ids/386693/7791720029404_01.jpg?v=638318705567600000',
        link: 'https://www.carrefour.com.ar/leche-uat-entera-carrefour-classic-brik-1-lt-720022/p',
        name: 'Leche UAT entera Carrefour classic brik 1 lt.',
        price: 1278.8,
        source: 'carrefour',
        unit: 'LT',
        unitPrice: 1278.8
      },
      {
        id: '214031',
        image: 'https://farmacityar.vtexassets.com/arquivos/ids/232585/214031_leche-infantil-liquida-nan-3-x-24-un_imagen-1.jpg?v=638055240592170000',
        link: 'https://www.farmacity.com/leche-infantil-liquida-nan-3-x-24-un/p',
        name: 'Leche Infantil Líquida Nan 3 x 24 un',
        price: 30871,
        source: 'disco',
        unit: 'UN',
        unitPrice: 1286.2916666666667
      },
      {
        id: '173154',
        image: 'https://masonlineprod.vtexassets.com/arquivos/ids/355416/Leche-Entera-Check-Larga-Vida-1-L-0779912000102-1.jpg?v=638841438251530000',
        link: 'https://www.masonline.com.ar/leche-uht-entera-check-1-lt-2/p',
        name: 'Leche Entera Check Larga Vida 1 L',
        price: 1389,
        source: 'masonline',
        unit: 'LT',
        unitPrice: 1389
      },
      {
        id: '173157',
        image: 'https://masonlineprod.vtexassets.com/arquivos/ids/315951/Leche-Uat-Check-Parcialmente-Descremada-Larga-Vida-1-L-1-32618.jpg?v=638436405919200000',
        link: 'https://www.masonline.com.ar/leche-uht-parcialmente-descremada-check-1-lt-2/p',
        name: 'Leche Descremada Check Larga Vida 1 L',
        price: 1389,
        source: 'masonline',
        unit: 'LT',
        unitPrice: 1389
      },
      {
        id: '504',
        image: 'https://ardiaprod.vtexassets.com/arquivos/ids/346318/Leche-Semi-Descremada-DIA-Larga-Vida-1-Lt-_1.jpg?v=638768905078330000',
        link: 'https://diaonline.supermercadosdia.com.ar/leche-semi-descremada-dia-larga-vida-1-lt-504/p',
        name: 'Leche Semi Descremada DIA Larga Vida 1 Lt.',
        price: 1390,
        source: 'diaonline',
        unit: 'LT',
        unitPrice: 1390
      },
      {
        id: '347718',
        image: 'https://jumboargentina.vtexassets.com/arquivos/ids/853917/Leche-Desc-Ls-Reduc-Lactosa-Sachet-1l-Leche-Desc-Ls-Zero-Lactosa-Sachet-1l-1-886202.jpg?v=638733299923930000',
        link: 'https://www.jumbo.com.ar/leche-desc-ls-reduc-lactosa-sachet-1l/p',
        name: 'Leche Desc Ls Reduc. Lactosa Sachet 1l',
        price: 1950,
        source: 'vea',
        unit: 'LT',
        unitPrice: 1950
      },
      {
        id: '347718',
        image: 'https://jumboargentina.vteximg.com.br/arquivos/ids/853917/Leche-Desc-Ls-Reduc-Lactosa-Sachet-1l-Leche-Desc-Ls-Zero-Lactosa-Sachet-1l-1-886202.jpg?v=638733299923930000',
        link: 'https://www.jumbo.com.ar/leche-desc-ls-reduc-lactosa-sachet-1l/p',
        name: 'Leche Desc Ls Reduc. Lactosa Sachet 1l',
        price: 1950,
        source: 'jumbo',
        unit: 'LT',
        unitPrice: 1950
      },
      {
        id: '311942',
        image: 'https://jumboargentina.vtexassets.com/arquivos/ids/853882/Leche-Descremada-La-Seren-sima-1sachet-1lt-1-849813.jpg?v=638733299806900000',
        link: 'https://www.disco.com.ar/leche-descremada-la-serenisima-1sachet-1lt/p',
        name: 'Leche Descremada La Serenísima 1sachet 1lt',
        price: 2000,
        source: 'disco',
        unit: 'LT',
        unitPrice: 2000
      },
      {
        id: '293938',
        image: 'https://jumboargentina.vtexassets.com/arquivos/ids/818747/Leche-Uat-Descremada-Las-Tres-Ni-as-1-L-1-668224.jpg?v=638488787475130000',
        link: 'https://www.disco.com.ar/leche-uat-descremada-las-tres-ninas-1l/p',
        name: 'Leche Uat Descremada Las Tres Niñas 1l',
        price: 2230,
        source: 'disco',
        unit: 'LT',
        unitPrice: 2230
      },
      {
        id: '720719',
        image: 'https://carrefourar.vtexassets.com/arquivos/ids/636141/7790742363008_01.jpg.jpg?v=638780812788100000',
        link: 'https://www.carrefour.com.ar/leche-la-serenisima-clasica-3-1l-720719/p',
        name: 'Leche La serenisima clásica 3% 1L.',
        price: 2299,
        source: 'carrefour',
        unit: 'LT',
        unitPrice: 2299
      },
      {
        id: '720720',
        image: 'https://carrefourar.vtexassets.com/arquivos/ids/636143/7790742363107_01.jpg.jpg?v=638780813024830000',
        link: 'https://www.carrefour.com.ar/leche-la-serenisima-liviana-1-1l-720720/p',
        name: 'Leche La serenisima liviana 1% 1L',
        price: 2299,
        source: 'carrefour',
        unit: 'LT',
        unitPrice: 2299
      },
      {
        id: '192651',
        image: 'https://masonlineprod.vtexassets.com/arquivos/ids/283922/Leche-La-Serenisima-Larga-Vida-Livana-1-L-1-43470.jpg?v=638736071630270000',
        link: 'https://www.masonline.com.ar/leche-la-serenisima-larga-vida-livana-1-l-2/p',
        name: 'Leche Descremada La Serenísima Larga Vida Livana 1 L',
        price: 2299,
        source: 'masonline',
        unit: 'LT',
        unitPrice: 2299
      },
      {
        id: '215352',
        image: 'https://masonlineprod.vtexassets.com/arquivos/ids/306415/Leche-Larga-Vida-La-Seren-sima-Zero-Lactosa-1-L-1-50524.jpg?v=638736088016900000',
        link: 'https://www.masonline.com.ar/leche-larga-vida-la-serenisima-zero-lactosa-1-l-2/p',
        name: 'Leche Descremada La Serenísima Larga Vida Zero Lactosa 1 L',
        price: 2469,
        source: 'masonline',
        unit: 'LT',
        unitPrice: 2469
      },
      {
        id: '654827',
        image: 'https://carrefourar.vtexassets.com/arquivos/ids/636105/7790742333605_01.jpg.jpg?v=638780808656800000',
        link: 'https://www.carrefour.com.ar/leche-descremada-larga-vida-la-serenisima-cero-lactosa-1-l/p',
        name: 'Leche descremada larga vida La Serenísima cero lactosa 1 l.',
        price: 2469,
        source: 'carrefour',
        unit: 'LT',
        unitPrice: 2469
      },
      {
        id: '394453',
        image: 'https://jumboargentina.vtexassets.com/arquivos/ids/853940/Leche-Uat-La-Serenisima-1-1-Lt-1-958306.jpg?v=638733299996700000',
        link: 'https://www.jumbo.com.ar/leche-uat-la-serenisima-1-1-lt/p',
        name: 'Leche Uat La Serenisima 1 - 1 Lt',
        price: 2650,
        source: 'vea',
        unit: 'LT',
        unitPrice: 2650
      },
      {
        id: '394453',
        image: 'https://jumboargentina.vtexassets.com/arquivos/ids/853940/Leche-Uat-La-Serenisima-1-1-Lt-1-958306.jpg?v=638733299996700000',
        link: 'https://www.disco.com.ar/leche-uat-la-serenisima-1-1-lt/p',
        name: 'Leche Uat La Serenisima 1 - 1 Lt',
        price: 2650,
        source: 'disco',
        unit: 'LT',
        unitPrice: 2650
      },
      {
        id: '300228',
        image: 'https://jumboargentina.vtexassets.com/arquivos/ids/853868/Leche-La-Serenisima-Liviana-Bot-1l-1-807015.jpg?v=638733298554830000',
        link: 'https://www.jumbo.com.ar/leche-la-serenisima-liviana-bot-1l/p',
        name: 'Leche La Serenisima Liviana Bot 1l',
        price: 2750,
        source: 'vea',
        unit: 'LT',
        unitPrice: 2750
      },
      {
        id: '301429',
        image: 'https://jumboargentina.vtexassets.com/arquivos/ids/853869/Leche-La-Serenisima-Zerolact-Bot-1l-Leche-Zero-Lactosa-La-Serenisima-Botella-Larga-Vida-1l-1-833488.jpg?v=638733298558370000',
        link: 'https://www.jumbo.com.ar/leche-la-serenisima-zerolact-bot-1l/p',
        name: 'Leche La Serenisima Zerolact Bot 1l',
        price: 2800,
        source: 'vea',
        unit: 'LT',
        unitPrice: 2800
      },
      {
        id: '301429',
        image: 'https://jumboargentina.vteximg.com.br/arquivos/ids/853869/Leche-La-Serenisima-Zerolact-Bot-1l-Leche-Zero-Lactosa-La-Serenisima-Botella-Larga-Vida-1l-1-833488.jpg?v=638733298558370000',
        link: 'https://www.jumbo.com.ar/leche-la-serenisima-zerolact-bot-1l/p',
        name: 'Leche La Serenisima Zerolact Bot 1l',
        price: 2800,
        source: 'jumbo',
        unit: 'LT',
        unitPrice: 2800
      },
      {
        id: '301429',
        image: 'https://jumboargentina.vtexassets.com/arquivos/ids/853869/Leche-La-Serenisima-Zerolact-Bot-1l-Leche-Zero-Lactosa-La-Serenisima-Botella-Larga-Vida-1l-1-833488.jpg?v=638733298558370000',
        link: 'https://www.disco.com.ar/leche-la-serenisima-zerolact-bot-1l/p',
        name: 'Leche La Serenisima Zerolact Bot 1l',
        price: 2800,
        source: 'disco',
        unit: 'LT',
        unitPrice: 2800
      },
      {
        id: '3415',
        image: 'https://jumboargentina.vteximg.com.br/arquivos/ids/586776/Galletitas-Okebon-Leche-Con-Dulce-De-Leche-290-Gr-1-2145.jpg?v=637269240267330000',
        link: 'https://www.jumbo.com.ar/galletitas-leche-con-dulce-de-leche-okebon-273-gr/p',
        name: 'Galletitas Leche Con Dulce De Leche Okebon 273 Gr',
        price: 1450,
        source: 'jumbo',
        unit: 'KG',
        unitPrice: 5311.355311355311
      },
      {
        id: '317471',
        image: 'https://jumboargentina.vteximg.com.br/arquivos/ids/618234/Dulce-De-Leche-Ser-300g-1-855295.jpg?v=637447656298500000',
        link: 'https://www.jumbo.com.ar/dulce-de-leche-ser-300g/p',
        name: 'Dulce De Leche Ser 300g',
        price: 2950,
        source: 'jumbo',
        unit: 'KG',
        unitPrice: 9833.333333333334
      },
      {
        id: '217819',
        image: 'https://farmacityar.vtexassets.com/arquivos/ids/246009/217819_leche-infantil-en-polvo-nutrilon-4-pouch-x-12-kg__imagen-1.jpg?v=638283964243730000',
        link: 'https://www.farmacity.com/leche-infantil-en-polvo-nutrilon-4-pouch-x-1-2-kg/p',
        name: 'Leche Infantil en Polvo Nutrilon 4 Pouch x 1,2 kg',
        price: 27173,
        source: 'disco',
        unit: 'KG',
        unitPrice: 22644.166666666668
      },
      {
        id: '217821',
        image: 'https://farmacityar.vtexassets.com/arquivos/ids/246006/217821_leche-infantil-en-polvo-nutrilon-3-pouch-x-12-kg__imagen-1.jpg?v=638283955042430000',
        link: 'https://www.farmacity.com/leche-infantil-en-polvo-nutrilon-3-pouch-x-1-2-kg/p',
        name: 'Leche Infantil en Polvo Nutrilon 3 Pouch x 1,2 kg',
        price: 28892,
        source: 'disco',
        unit: 'KG',
        unitPrice: 24076.666666666668
      },
      {
        id: '241361',
        image: 'https://jumboargentina.vteximg.com.br/arquivos/ids/875490/Oblea-Leche-4-Fingers-Kitkat-41-5-Gr-1-238654.jpg?v=638872403612770000',
        link: 'https://www.jumbo.com.ar/oblea-leche-4-fingers-41-5-grs-kitkat/p',
        name: 'Oblea Leche 4 Fingers 41.5 Grs Kitkat®',
        price: 2100,
        source: 'jumbo',
        unit: 'KG',
        unitPrice: 50602.409638554214
      },
      {
        id: '28571',
        image: 'https://jumboargentina.vteximg.com.br/arquivos/ids/803254/Chocolate-Con-Leche-Milka-150g-1-26505.jpg?v=638379382566430000',
        link: 'https://www.jumbo.com.ar/chocolate-con-leche-milka-150-gr/p',
        name: 'Chocolate Con Leche Milka 150 Gr',
        price: 9200,
        source: 'jumbo',
        unit: 'KG',
        unitPrice: 61333.333333333336
      },
      {
        id: '233786',
        image: 'https://farmacityar.vtexassets.com/arquivos/ids/243037/233786_leche-de-limpieza-filomena-clean-beauty-x-60-ml_imagen-1.jpg?v=638210697694500000',
        link: 'https://www.farmacity.com/leche-de-limpieza-filomena-clean-beauty-x-60-ml/p',
        name: 'Leche de Limpieza Facial Filomena Clean Beauty x 60 ml',
        price: 11500,
        source: 'disco',
        unit: 'LT',
        unitPrice: 191666.6666666667
      }
    ];

    console.log({products});
    
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
