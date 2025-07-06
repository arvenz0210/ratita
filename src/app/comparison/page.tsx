"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Layout } from "@/components/ui/layout"
import { MouseLogo } from "@/components/ui/ratita-components"
import { ArrowLeft, Store, ListChecks, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

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

export default function ComparisonPage() {
  const [comparisonData, setComparisonData] = useState<ComparisonResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showMoreOptions, setShowMoreOptions] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchComparisonData()
  }, [])

  const fetchComparisonData = async () => {
    try {
      setIsLoading(true)
      
      // Get data from sessionStorage
      const storedData = sessionStorage.getItem('comparisonData')

      console.log('=== FETCHING COMPARISON DATA DEBUG ===')
      console.log('Session storage:', sessionStorage)
      console.log('storedData:', storedData)
      console.log('=== END FETCHING COMPARISON DATA DEBUG ===')
      
      if (!storedData) {
        throw new Error('No comparison data found')
      }
      
      const data: ComparisonResult = JSON.parse(storedData)
      setComparisonData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (price: number | null): string => {
    if (price === null) return 'N/A'
    return `$${price.toLocaleString('es-AR')}`
  }

  const getBestStore = (): string | null => {
    if (!comparisonData) return null
    
    let bestStore: string | null = null
    let lowestTotal = Infinity
    
    Object.entries(comparisonData.storeTotals).forEach(([store, data]) => {
      if (data.total < lowestTotal && data.itemsFound > 0) {
        lowestTotal = data.total
        bestStore = store
      }
    })
    
    return bestStore
  }

  const handleStoreSelection = (store: string) => {
    const storeData = comparisonData?.storeTotals[store]
    if (!storeData || storeData.itemsFound === 0) return

    // Store the selected store in sessionStorage for the confirmation page
    sessionStorage.setItem('selectedStore', store)
    
    // Transform products data to include prices and totals
    const items = comparisonData?.products.map(product => {
      const price = product.prices[store] || 0
      return {
        product: product.product,
        quantity: product.quantity,
        price: price,
        total: price * product.quantity
      }
    }) || []
    
    sessionStorage.setItem('shipmentData', JSON.stringify({
      store: store,
      total: storeData.total,
      items: items,
      timestamp: new Date().toISOString()
    }))
    
    // Redirect to shipment confirmation page
    router.push('/shipment-confirmation')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <MouseLogo size="lg" className="mx-auto mb-6" animated />
          <p className="text-white/70 text-lg">Comparando precios...</p>
          <p className="text-white/50 text-sm mt-2">Ratita está buscando las mejores ofertas</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
          <p className="text-red-400 mb-4 text-lg">❌ {error}</p>
          <Button 
            onClick={fetchComparisonData}
            className="bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white"
          >
            Reintentar
          </Button>
        </div>
      </div>
    )
  }

  if (!comparisonData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
          <MouseLogo size="lg" className="mx-auto mb-6" />
          <p className="text-white/70 text-lg">No hay datos de comparación disponibles</p>
        </div>
      </div>
    )
  }

  const bestStore = getBestStore()
  const orderedStores = bestStore
    ? [bestStore, ...comparisonData.stores.filter((s) => s !== bestStore)]
    : comparisonData.stores
  const bestStoreData = bestStore ? comparisonData.storeTotals[bestStore] : null
  const normalPrice = bestStoreData ? bestStoreData.total  : null // Mocked normal price
  const discount = bestStoreData ? bestStoreData.total * 0.8 : null // Mocked discount

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Layout
        topbarContent={
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.back()}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <MouseLogo size="sm" />
            <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Comparación de Precios
            </span>
          </div>
        }
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Best Option Card */}
          {bestStore && bestStoreData && (
            <div className="mb-8">
              <div 
                className="bg-gradient-to-br from-green-900/30 to-emerald-800/20 rounded-2xl shadow-xl p-6 flex flex-col items-center border border-green-500/30 cursor-pointer hover:shadow-2xl transition-all duration-300 backdrop-blur-sm"
                onClick={() => handleStoreSelection(bestStore)}
              >
                <div className="flex items-center mb-4">
                  <span className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-full p-3 mr-3">
                    <Sparkles className="w-6 h-6 text-white" />
                  </span>
                  <div className="text-center">
                    <h3 className="font-bold text-green-100 text-xl">{bestStore} </h3>
                    <p className="text-green-200/80 text-sm">Mejor opción</p>
                  </div>
                </div>
                
                <div className="w-full bg-black/20 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center border border-white/10 mb-4">
                  <div className="flex w-full justify-between items-center mb-2">
                    <span className="text-white/60">Precio normal:</span>
                    <span className="text-white/50 line-through">{normalPrice ? formatPrice(normalPrice) : '--'}</span>
                  </div>
                  <div className="flex w-full justify-between items-center">
                    <span className="text-green-300 font-medium">Con descuentos:</span>
                    <span className="text-green-300 font-bold text-2xl">{discount ? formatPrice(discount) : '--'}</span>
                  </div>
                </div>

                <span className="text-green-100 text-xl mb-6 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2" />
                  ¡Ahorrás {formatPrice(bestStoreData.total - (discount || 0))}!
                </span>

                <div className="w-full space-y-3">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl py-4 px-6 flex items-center justify-center transition-all duration-200 shadow-lg">
                    <span className="text-white font-bold text-lg">Realizar pedido</span>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 border-green-400/50 text-green-200 hover:bg-green-900/30 backdrop-blur-sm"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      router.push('/shopping-list');
                    }}
                  >
                    <ListChecks className="w-5 h-5" />
                    Ir a comprar físicamente
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Store Selection Cards (excluding best) */}
          {orderedStores.length > 1 && (
            <div className="mb-8">
              {!showMoreOptions ? (
                <Button
                  variant="outline"
                  className="w-full border-white/20 text-white/70 hover:bg-white/10 backdrop-blur-sm"
                  onClick={() => setShowMoreOptions(true)}
                >
                  Ver más opciones
                </Button>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {orderedStores.map((store, idx) => {
                    if (idx === 0 && bestStore) return null // skip best, already rendered
                    const storeData = comparisonData.storeTotals[store]
                    const hasItems = storeData.itemsFound > 0

                    return (
                      <div
                        key={store}
                        className={`bg-white/5 backdrop-blur-sm rounded-2xl shadow-xl p-6 flex flex-col items-center border border-white/10 cursor-pointer hover:shadow-2xl hover:bg-white/10 transition-all duration-300 ${
                          !hasItems ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        onClick={() => hasItems && handleStoreSelection(store)}
                      >
                        <div className="flex items-center mb-4">
                          <span className="bg-gradient-to-r from-violet-600 to-purple-700 rounded-full p-3 mr-3">
                            <Store className="w-6 h-6 text-white" />
                          </span>
                          <span className="font-bold text-white text-lg">{store}</span>
                        </div>
                        
                        <div className="w-full bg-black/20 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center border border-white/10 mb-4">
                          <div className="flex w-full justify-between items-center mb-2">
                            <span className="text-white/60">Total:</span>
                            <span className="text-white font-bold text-xl">{formatPrice(storeData.total)}</span>
                          </div>
                          <div className="flex w-full justify-between items-center">
                            <span className="text-white/60">Productos encontrados:</span>
                            <span className="text-white">{storeData.itemsFound}/{comparisonData.products.length}</span>
                          </div>
                        </div>

                        {!hasItems && (
                          <p className="text-sm text-red-400 mt-2">No hay productos disponibles</p>
                        )}

                        {hasItems && (
                          <div className="w-full">
                            <div className="bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 rounded-xl py-3 px-4 flex items-center justify-center transition-all duration-200">
                              <span className="text-white font-bold">Realizar pedido</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </Layout>
    </div>
  )
} 