"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Truck, CheckCircle, Package, Store } from "lucide-react"
import { useRouter } from "next/navigation"

interface ShipmentData {
  store: string
  total: number
  items: Array<{
    product: string
    quantity: number
    prices: { [store: string]: number | null }
  }>
  timestamp: string
}

export default function ShipmentConfirmationPage() {
  const [shipmentData, setShipmentData] = useState<ShipmentData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
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
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (price: number): string => {
    return `$${price.toLocaleString('es-AR')}`
  }

  const formatDate = (timestamp: string): string => {
    return new Date(timestamp).toLocaleString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleBackToHome = () => {
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando confirmación...</p>
        </div>
      </div>
    )
  }

  if (!shipmentData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">No se encontraron datos del envío</p>
          <Button onClick={handleBackToHome}>Volver al inicio</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBackToHome}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Confirmación de Envío</h1>
              <p className="text-sm text-gray-500">Tu pedido ha sido procesado exitosamente</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Success Message */}
        <Card className="mb-8 border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-green-800 mb-2">
                ¡Tu pedido está en camino!
              </h2>
              <p className="text-green-700">
                Hemos confirmado tu pedido y lo estamos preparando para el envío
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Shipment Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Store Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Store className="w-5 h-5" />
                <span>Información de la Tienda</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Tienda seleccionada</p>
                <p className="font-semibold text-lg text-gray-900">{shipmentData.store}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total del pedido</p>
                <p className="font-semibold text-2xl text-green-600">
                  {formatPrice(shipmentData.total)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fecha y hora del pedido</p>
                <p className="font-medium text-gray-900">
                  {formatDate(shipmentData.timestamp)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="w-5 h-5" />
                <span>Resumen del Pedido</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-sm text-gray-600">Productos</span>
                  <span className="text-sm text-gray-600">Cantidad</span>
                </div>
                {shipmentData.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">{item.product}</span>
                    <span className="text-gray-600">{item.quantity}</span>
                  </div>
                ))}
                <div className="pt-3 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-bold text-lg text-green-600">
                      {formatPrice(shipmentData.total)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next Steps */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Próximos Pasos</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Confirmación del pedido</p>
                  <p className="text-sm text-gray-600">Recibirás una confirmación por email con los detalles de tu pedido</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Preparación del envío</p>
                  <p className="text-sm text-gray-600">La tienda preparará tu pedido y lo enviará en las próximas 24-48 horas</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Seguimiento del envío</p>
                  <p className="text-sm text-gray-600">Recibirás actualizaciones sobre el estado de tu envío</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={handleBackToHome}
            variant="outline"
            className="flex-1 sm:flex-none"
          >
            Volver al Inicio
          </Button>
          <Button 
            className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700"
          >
            Ver Mis Pedidos
          </Button>
        </div>
      </div>
    </div>
  )
} 