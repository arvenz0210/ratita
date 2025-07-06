"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Layout } from "@/components/ui/layout"
import { MouseLogo } from "@/components/ui/ratita-components"
import { ArrowLeft, ShoppingCart, Check, Package, Sparkles, CreditCard } from "lucide-react"
import { useRouter } from "next/navigation"

interface ShipmentItem {
  product: string
  quantity: number
  price: number
  total: number
}

interface ShipmentData {
  store: string
  total: number
  items: ShipmentItem[]
  timestamp: string
}

export default function ShipmentConfirmationPage() {
  const [shipmentData, setShipmentData] = useState<ShipmentData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()

  useEffect(() => {
    loadShipmentData()
  }, [])

  const loadShipmentData = () => {
    try {
      const storedData = sessionStorage.getItem('shipmentData')
      const selectedStore = sessionStorage.getItem('selectedStore')
      
      if (!storedData || !selectedStore) {
        throw new Error('No shipment data found')
      }
      
      const data: ShipmentData = JSON.parse(storedData)
      setShipmentData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const formatPrice = (price: number): string => {
    return `$${price.toLocaleString('es-AR')}`
  }

  const handleConfirmOrder = async () => {
    if (!shipmentData) return
    
    setIsProcessing(true)
    
    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Save confirmed order to order history
      const confirmedOrder = {
        ...shipmentData,
        orderId: `ORDER-${Date.now()}`,
        status: 'confirmed',
        confirmedAt: new Date().toISOString()
      }
      
      // Get existing confirmed orders or initialize empty array
      const existingOrdersJson = sessionStorage.getItem('confirmedOrders')
      const existingOrders = existingOrdersJson ? JSON.parse(existingOrdersJson) : []
      
      // Add new order to the beginning of the array
      const updatedOrders = [confirmedOrder, ...existingOrders]
      
      // Save updated orders to sessionStorage
      sessionStorage.setItem('confirmedOrders', JSON.stringify(updatedOrders))
      
      // Clear current cart/shopping data
      sessionStorage.removeItem('shipmentData')
      sessionStorage.removeItem('comparisonData')
      sessionStorage.removeItem('selectedStore')
      
      // Clear any other temporary data that might exist
      sessionStorage.removeItem('products')
      sessionStorage.removeItem('messages')
      sessionStorage.removeItem('currentProducts')
      sessionStorage.removeItem('currentMessages')
      
      // Mark that temp data should be cleared when returning to main page
      sessionStorage.setItem('clearTempData', 'true')
      
      // Redirect to shipment congratulations page
      router.push('/shipment-congrats')
      
    } catch (error) {
      console.error('Error confirming order:', error)
      setIsProcessing(false)
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
          <p className="text-red-400 mb-4 text-lg">❌ {error}</p>
          <Button 
            onClick={() => router.push('/comparison')}
            className="bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white"
          >
            Volver a comparación
          </Button>
        </div>
      </div>
    )
  }

  if (!shipmentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
          <MouseLogo size="lg" className="mx-auto mb-6" />
          <p className="text-white/70 text-lg mb-4">No hay datos de envío disponibles</p>
          <Button 
            onClick={() => router.push('/comparison')} 
            className="bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white"
          >
            Volver a comparación
          </Button>
        </div>
      </div>
    )
  }

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
              Confirmación de Pedido
            </span>
          </div>
        }
      >
        {/* Loading Modal */}
        {isProcessing && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 max-w-md mx-4 text-center border border-white/20">
              <MouseLogo size="lg" className="mx-auto mb-6" animated />
              <h3 className="text-2xl font-bold text-white mb-3 flex items-center justify-center">
                <Sparkles className="w-6 h-6 mr-2 text-cyan-400" />
                Procesando tu pedido
              </h3>
              <p className="text-white/70 mb-6">
                Ratita está confirmando tu solicitud...
              </p>
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-cyan-400 border-t-transparent"></div>
                <span className="text-cyan-400 font-medium">Procesando...</span>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Order Summary - Receipt Style */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-6 hover:bg-white/10 transition-all duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full p-3">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white flex items-center">
                Resumen del Pedido
                <Sparkles className="w-5 h-5 ml-2 text-cyan-400" />
              </h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-white/20">
                <span className="text-white/60 text-lg">Tienda seleccionada</span>
                <span className="font-bold text-white text-xl bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  {shipmentData.store}
                </span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-white/60 text-lg flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-violet-400" />
                  Método de pago
                </span>
                <span className="font-medium text-white">Tarjeta de crédito VISA</span>
              </div>
            </div>
          </div>

          {/* Products List - Receipt Style */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-full p-3">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">
                Productos ({shipmentData.items.length})
              </h2>
            </div>
            
            <div className="space-y-4">
              {shipmentData.items.map((item, index) => (
                <div key={index} className="flex justify-between items-start py-4 border-b border-white/10">
                  <div className="flex-1">
                    <p className="font-bold text-white text-lg">{item.product}</p>
                    <p className="text-white/60 mt-1">
                      {item.quantity} x {formatPrice(item.price)}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-bold text-white text-xl">
                      {formatPrice(item.total)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Summary */}
            <div className="mt-6 pt-6 border-t-2 border-gradient-to-r from-cyan-400 to-purple-400">
              <div className="flex justify-between items-center bg-gradient-to-r from-green-900/30 to-emerald-800/20 rounded-xl p-4 border border-green-500/30">
                <span className="text-2xl font-bold text-white flex items-center">
                  <Sparkles className="w-6 h-6 mr-2 text-green-400" />
                  TOTAL
                </span>
                <span className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  {formatPrice(shipmentData.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-lg py-4 shadow-lg"
              onClick={handleConfirmOrder}
              disabled={isProcessing}
            >
              <Check className="w-5 h-5 mr-2" />
              {isProcessing ? 'Procesando...' : 'Confirmar Pedido'}
            </Button>
          </div>
        </div>
      </Layout>
    </div>
  )
} 