"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Truck, Home, Package } from "lucide-react"
import { useRouter } from "next/navigation"

interface ShipmentData {
  store: string
  total: number
  items: any[]
  timestamp: string
}

export default function ShipmentCongratsPage() {
  const [shipmentData, setShipmentData] = useState<ShipmentData | null>(null)
  const router = useRouter()

  useEffect(() => {
    loadShipmentData()
  }, [])

  const loadShipmentData = () => {
    try {
      const storedData = sessionStorage.getItem('shipmentData')
      if (storedData) {
        const data: ShipmentData = JSON.parse(storedData)
        setShipmentData(data)
      }
    } catch (err) {
      console.error('Error loading shipment data:', err)
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Success Card */}
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-green-800 mb-4">
                ¡Pedido Confirmado!
              </h1>
              <p className="text-green-700 text-lg mb-8">
                Tu pedido ha sido procesado exitosamente y está siendo preparado
              </p>
            </div>

            {/* Order Details */}
            {shipmentData && (
              <div className="bg-white rounded-lg p-6 mb-6 border border-green-200">
                <div className="flex items-center space-x-2 mb-4">
                  <Package className="w-5 h-5 text-green-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Detalles del Pedido</h2>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-1 border-b border-gray-100">
                    <span className="text-gray-600">Tienda</span>
                    <span className="font-medium text-gray-900">{shipmentData.store}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-gray-100">
                    <span className="text-gray-600">Total</span>
                    <span className="font-semibold text-green-600 text-lg">
                      {formatPrice(shipmentData.total)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-600">Fecha</span>
                    <span className="font-medium text-gray-900">{formatDate(shipmentData.timestamp)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="bg-white rounded-lg p-6 mb-8 border border-green-200">
              <div className="flex items-center space-x-2 mb-4">
                <Truck className="w-5 h-5 text-green-600" />
                <h2 className="text-lg font-semibold text-gray-900">Próximos Pasos</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Confirmación por email</p>
                    <p className="text-sm text-gray-600">Recibirás una confirmación con los detalles de tu pedido</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Preparación del envío</p>
                    <p className="text-sm text-gray-600">La tienda preparará tu pedido en las próximas 24-48 horas</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Seguimiento del envío</p>
                    <p className="text-sm text-gray-600">Recibirás actualizaciones sobre el estado de tu envío</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="outline"
                onClick={() => router.push('/')}
                className="flex-1"
              >
                <Home className="w-4 h-4 mr-2" />
                Volver al Inicio
              </Button>
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={() => router.push('/comparison')}
              >
                <Package className="w-4 h-4 mr-2" />
                Nuevo Pedido
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 