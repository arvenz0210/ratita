"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Store, ListChecks } from "lucide-react"
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Comparando precios...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchComparisonData}>Reintentar</Button>
        </div>
      </div>
    )
  }

  if (!comparisonData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No hay datos de comparación disponibles</p>
        </div>
      </div>
    )
  }

  const bestStore = getBestStore()
  const orderedStores = bestStore
    ? [bestStore, ...comparisonData.stores.filter((s) => s !== bestStore)]
    : comparisonData.stores
  const bestStoreData = bestStore ? comparisonData.storeTotals[bestStore] : null
  const normalPrice = bestStoreData ? bestStoreData.total + 25578 : null // Mocked normal price
  const discount = bestStoreData ? 25578 : null // Mocked discount

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => router.back()}
                className="p-2 text-gray-300 hover:text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Best Option Card */}
        {bestStore && bestStoreData && (
          <div className="mb-8">
            <div 
              className="bg-gradient-to-br from-green-900/50 to-green-800/30 rounded-2xl shadow p-6 flex flex-col items-center border border-green-700 cursor-pointer hover:shadow-lg transition-all duration-200"
              onClick={() => handleStoreSelection(bestStore)}
            >
              <div className="flex items-center mb-2">
                <span className="bg-green-700 rounded-full p-2 mr-2">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 21c4.97 0 9-3.582 9-8 0-2.21-1.79-4-4-4-.34 0-.67.04-.99.12C14.36 6.5 13.27 5 12 5c-1.27 0-2.36 1.5-3.01 4.12-.32-.08-.65-.12-.99-.12-2.21 0-4 1.79-4 4 0 4.418 4.03 8 9 8Z" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                <span className="font-semibold text-green-100 text-base">Comprá este jueves en {bestStore} con tarjeta de crédito VISA</span>
              </div>
              <div className="w-full bg-gray-800 rounded-xl p-4 flex flex-col items-center border border-gray-700 mb-4">
                <div className="flex w-full justify-between items-center mb-1">
                  <span className="text-gray-400">Precio normal:</span>
                  <span className="text-gray-500 line-through">{normalPrice ? formatPrice(normalPrice) : '--'}</span>
                </div>
                <div className="flex w-full justify-between items-center">
                  <span className="text-green-300 font-medium">Con descuentos:</span>
                  <span className="text-green-300 font-bold text-lg">{formatPrice(bestStoreData.total)}</span>
                </div>
              </div>

              <span className="text-green-100 text-lg mb-4">¡Ahorrás {discount ? formatPrice(discount) : '--'}!</span>

              <div className="w-full">
                <div className="bg-gradient-to-r font-bold text-white from-green-600 to-green-500 rounded-xl py-3 px-4 flex items-center justify-center">
                  Realizar pedido
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-3 flex items-center justify-center gap-2 border-green-700 text-green-200 hover:bg-green-900/30"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    router.push('/shopping-list');
                  }}
                >
                  <ListChecks className="w-5 h-5 mr-1" />
                  Ir a comprar físicamente
                </Button>
              </div>
              {/* <div className="mt-4 flex items-center text-green-700 text-sm">
                <Truck className="w-4 h-4 mr-1" />
                <span>Hacer pedido en {bestStore}</span>
              </div> */}
            </div>
          </div>
        )}

        {/* Store Selection Cards (excluding best) */}
        {orderedStores.length > 1 && (
          <div className="mb-8">
            {!showMoreOptions ? (
              <Button
                variant="outline"
                className="w-full"
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
                      className={`bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl shadow p-6 flex flex-col items-center border border-gray-600 cursor-pointer hover:shadow-lg transition-all duration-200 ${
                        !hasItems ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      onClick={() => hasItems && handleStoreSelection(store)}
                    >
                      <div className="flex items-center mb-4">
                        <span className="bg-gray-600 rounded-full p-2 mr-2">
                          <Store className="w-5 h-5 text-gray-300" />
                        </span>
                        <span className="font-semibold text-gray-100 text-base">{store}</span>
                      </div>
                      
                      <div className="w-full bg-gray-800 rounded-xl p-4 flex flex-col items-center border border-gray-700 mb-4">
                        <div className="flex w-full justify-between items-center mb-1">
                          <span className="text-gray-400">Total:</span>
                          <span className="text-gray-100 font-bold text-lg">{formatPrice(storeData.total)}</span>
                        </div>
                        <div className="flex w-full justify-between items-center">
                          <span className="text-gray-400">Productos encontrados:</span>
                          <span className="text-gray-100">{storeData.itemsFound}/{comparisonData.products.length}</span>
                        </div>
                      </div>

                      {!hasItems && (
                        <p className="text-sm text-red-400 mt-2">No hay productos disponibles</p>
                      )}

                      {hasItems && (
                        <div className="w-full">
                          <div className="bg-gradient-to-r from-gray-600 to-gray-500 rounded-xl py-3 px-4 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">Realizar pedido</span>
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

        {/* Product Comparison Table */}
        {/* <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5" />
              <span>Comparación por Producto</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Producto</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Cantidad</th>
                    {comparisonData.stores.map((store) => (
                      <th key={store} className="text-left py-3 px-4 font-medium text-gray-900">
                        {store}
                      </th>
                    ))}
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Mejor Precio</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.products.map((product, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">
                        {product.product}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {product.quantity}
                      </td>
                      {comparisonData.stores.map((store) => {
                        const price = product.prices[store]
                        const isBestPrice = store === product.bestStore
                        
                        return (
                          <td key={store} className="py-3 px-4">
                            <span className={`${
                              isBestPrice ? 'font-semibold text-green-600' : 'text-gray-900'
                            }`}>
                              {formatPrice(price)}
                            </span>
                          </td>
                        )
                      })}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-green-600">
                            {formatPrice(product.bestPrice)}
                          </span>
                          {product.bestStore && (
                            <span className="text-xs text-gray-500">
                              ({product.bestStore})
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  )
} 