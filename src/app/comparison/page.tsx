"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ShoppingCart, TrendingUp, Store, Check, Truck, Loader2 } from "lucide-react"
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
  const [selectedStore, setSelectedStore] = useState<string | null>(null)
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
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
    setSelectedStore(store)
  }

  const handleCreateShipment = async () => {
    if (selectedStore) {
      setIsCreatingOrder(true)
      
      // Store the selected store in sessionStorage for the confirmation page
      sessionStorage.setItem('selectedStore', selectedStore)
      sessionStorage.setItem('shipmentData', JSON.stringify({
        store: selectedStore,
        total: comparisonData?.storeTotals[selectedStore]?.total || 0,
        items: comparisonData?.products || [],
        timestamp: new Date().toISOString()
      }))
      
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Redirect to shipment confirmation page
      router.push('/shipment-confirmation')
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Loading Modal */}
      {isCreatingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Estamos creando tu pedido
            </h3>
            <p className="text-gray-600">
              Por favor espera mientras procesamos tu solicitud...
            </p>
            <div className="mt-4 flex items-center justify-center space-x-2 text-blue-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Procesando...</span>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => router.back()}
                className="p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Comparación de Precios</h1>
                <p className="text-sm text-gray-500">Selecciona la mejor opción para tu pedido</p>
              </div>
            </div>
            {bestStore && (
              <div className="text-right">
                <p className="text-sm text-gray-500">Mejor opción</p>
                <p className="font-semibold text-green-600">{bestStore}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Store Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {comparisonData.stores.map((store) => {
            const storeData = comparisonData.storeTotals[store]
            const isBestStore = store === bestStore
            const isSelected = selectedStore === store
            const hasItems = storeData.itemsFound > 0
            
            return (
              <Card 
                key={store} 
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  isSelected 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : isBestStore 
                      ? 'ring-2 ring-green-500' 
                      : ''
                } ${!hasItems ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => hasItems && handleStoreSelection(store)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-lg">
                    <div className="flex items-center space-x-2">
                      <Store className="w-5 h-5" />
                      <span>{store}</span>
                      {isBestStore && (
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total:</span>
                      <span className={`font-semibold ${
                        isSelected 
                          ? 'text-blue-600' 
                          : isBestStore 
                            ? 'text-green-600' 
                            : 'text-gray-900'
                      }`}>
                        {formatPrice(storeData.total)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Productos encontrados:</span>
                      <span className="text-gray-900">{storeData.itemsFound}/{comparisonData.products.length}</span>
                    </div>
                    {!hasItems && (
                      <p className="text-sm text-red-500 mt-2">No hay productos disponibles</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Product Comparison Table */}
        <Card className="mb-8">
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
                        const isSelectedStore = store === selectedStore
                        
                        return (
                          <td key={store} className="py-3 px-4">
                            <span className={`${
                              isSelectedStore 
                                ? 'font-semibold text-blue-600' 
                                : isBestPrice 
                                  ? 'font-semibold text-green-600' 
                                  : 'text-gray-900'
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
        </Card>

        {/* Shipment Creation Button */}
        {selectedStore && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tienda seleccionada:</p>
                  <p className="font-semibold text-gray-900">{selectedStore}</p>
                  <p className="text-sm text-gray-600">
                    Total: {formatPrice(comparisonData.storeTotals[selectedStore]?.total || 0)}
                  </p>
                </div>
                <Button 
                  onClick={handleCreateShipment}
                  disabled={isCreatingOrder}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 flex items-center space-x-2 disabled:opacity-50"
                >
                  <Truck className="w-5 h-5" />
                  <span>{isCreatingOrder ? 'Creando...' : 'Crear Envío'}</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 