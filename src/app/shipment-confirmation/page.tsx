"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ShoppingCart, Store, Check, Truck, Package } from "lucide-react"
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

  const formatDate = (timestamp: string): string => {
    return new Date(timestamp).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleConfirmOrder = async () => {
    setIsProcessing(true)
    
    // Simulate API call with a delay
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Redirect to shipment congratulations page
    router.push('/shipment-congrats')
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => router.push('/comparison')}>Volver a comparación</Button>
        </div>
      </div>
    )
  }

  if (!shipmentData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No hay datos de envío disponibles</p>
          <Button onClick={() => router.push('/comparison')} className="mt-4">
            Volver a comparación
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Loading Modal */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-6"></div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Estamos procesando tu pedido
            </h3>
            <p className="text-gray-600">
              Por favor espera mientras confirmamos tu solicitud...
            </p>
            <div className="mt-4 flex items-center justify-center space-x-2 text-green-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
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
              {/* <h1 className="text-xl font-semibold text-gray-900">Confirmación de Pedido</h1> */}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
                 {/* Order Summary - Receipt Style */}
         <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
           <div className="flex items-center space-x-2 mb-4">
             <Package className="w-5 h-5" />
             <h2 className="text-lg font-semibold text-gray-900">Resumen del Pedido</h2>
           </div>
           
           <div className="space-y-3">
             <div className="flex justify-between items-center py-1 border-b border-gray-100">
               <span className="text-gray-600">Tienda</span>
               <span className="font-medium text-gray-900">{shipmentData.store}</span>
             </div>
           </div>
         </div>

                 {/* Products List - Receipt Style */}
         <div className="bg-white border border-gray-200 rounded-lg p-6">
           <div className="flex items-center space-x-2 mb-4">
             <ShoppingCart className="w-5 h-5" />
             <h2 className="text-lg font-semibold text-gray-900">Productos ({shipmentData.items.length})</h2>
           </div>
           
           <div className="space-y-2">
             {shipmentData.items.map((item, index) => (
               <div key={index} className="flex justify-between items-start py-1 border-b border-gray-100">
                 <div className="flex-1">
                   <p className="font-medium text-gray-900">{item.product}</p>
                   <p className="text-sm text-gray-600">
                     {item.quantity} x {formatPrice(item.price)}
                   </p>
                 </div>
                 <div className="text-right ml-4">
                   <p className="font-semibold text-gray-900">
                     {formatPrice(item.total)}
                   </p>
                 </div>
               </div>
             ))}
           </div>

           {/* Total Summary */}
           <div className="mt-4 pt-3 border-t-2 border-gray-300">
             <div className="flex justify-between items-center">
               <span className="text-lg font-semibold text-gray-900">TOTAL</span>
               <span className="text-xl font-bold text-gray-900">
                 {formatPrice(shipmentData.total)}
               </span>
             </div>
           </div>
         </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Button
            className="flex-1 bg-green-600 hover:bg-green-700"
            onClick={handleConfirmOrder}
            disabled={isProcessing}
          >
            <Check className="w-4 h-4 mr-2" />
            {isProcessing ? 'Procesando...' : 'Confirmar Pedido'}
          </Button>
        </div>
      </div>
    </div>
  )
} 