"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Layout } from "@/components/ui/layout"
import { InputModal, AlertModal } from "@/components/ui/modal"
import { MouseLogo } from "@/components/ui/ratita-components"
import { CheckCircle, Truck, Home, Package, Save, Sparkles, Star, Heart } from "lucide-react"
import { useRouter } from "next/navigation"

interface ShipmentData {
  store: string
  total: number
  items: Array<{
    product: string
    quantity: number
    price: number
    total: number
  }>
  timestamp: string
}

export default function ShipmentCongratsPage() {
  const [shipmentData, setShipmentData] = useState<ShipmentData | null>(null)
  const router = useRouter()

  // Modal states
  const [showSaveInput, setShowSaveInput] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertConfig, setAlertConfig] = useState<{ title: string, message: string, type: "success" | "error" | "info" }>({ title: "", message: "", type: "info" })

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

  const handleSaveList = () => {
    if (!shipmentData) return
    setShowSaveInput(true)
  }

  const confirmSaveList = (listName: string) => {
    if (!shipmentData) return

    try {
      // Convert shipment items to saved list format
      const products = shipmentData.items.map(item => ({
        name: item.product,
        quantity: item.quantity
      }))

      const savedList = {
        id: `LIST-${Date.now()}`,
        name: listName,
        products: products,
        createdAt: new Date().toISOString(),
        itemCount: products.length,
        totalItems: products.reduce((sum, product) => sum + product.quantity, 0)
      }

      // Get existing saved lists or initialize empty array
      const existingListsJson = sessionStorage.getItem('savedLists')
      const existingLists = existingListsJson ? JSON.parse(existingListsJson) : []

      // Add new list to the beginning of the array
      const updatedLists = [savedList, ...existingLists]

      // Save updated lists to sessionStorage
      sessionStorage.setItem('savedLists', JSON.stringify(updatedLists))

      setAlertConfig({
        title: "Lista Guardada",
        message: "¡Lista guardada exitosamente!",
        type: "success"
      })
      setShowAlert(true)
    } catch (error) {
      console.error('Error saving list:', error)
      setAlertConfig({
        title: "Error",
        message: "Error al guardar la lista. Intenta de nuevo.",
        type: "error"
      })
      setShowAlert(true)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Layout
        topbarContent={
          <div className="flex items-center space-x-3">
            <MouseLogo size="sm" />
            <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              ¡Pedido Confirmado!
            </span>
          </div>
        }
      >
        <div className="max-w-2xl mx-auto px-4 py-12">
          {/* Success Card */}
          <Card className="border-green-500/30 bg-gradient-to-br from-green-900/30 to-emerald-800/20 backdrop-blur-sm">
            <CardContent className="pt-8">
              <div className="text-center">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <CheckCircle className="w-12 h-12 text-white" />
                  </div>
                  <MouseLogo size="md" className="absolute -top-2 -right-2" animated />
                </div>
                
                <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center">
                  <Star className="w-8 h-8 mr-3 text-yellow-400" />
                  ¡Pedido Confirmado!
                  <Heart className="w-8 h-8 ml-3 text-pink-400" />
                </h1>
                <p className="text-white/80 text-xl mb-8">
                  ¡Ratita procesó tu pedido exitosamente! 🎉
                </p>
              </div>

              {/* Order Details */}
              {shipmentData && (
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/20">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full p-3">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white flex items-center">
                      Detalles del Pedido
                      <Sparkles className="w-5 h-5 ml-2 text-cyan-400" />
                    </h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-white/20">
                      <span className="text-white/60 text-lg">Tienda</span>
                      <span className="font-bold text-white text-xl bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                        {shipmentData.store}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-white/20">
                      <span className="text-white/60 text-lg">Total</span>
                      <span className="font-bold text-2xl bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                        {formatPrice(shipmentData.total)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-white/60 text-lg">Fecha</span>
                      <span className="font-bold text-white">{formatDate(shipmentData.timestamp)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Next Steps */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-full p-3">
                    <Truck className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Próximos Pasos</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm font-bold">1</span>
                    </div>
                    <div>
                      <p className="font-bold text-white text-lg">Confirmación por email</p>
                      <p className="text-white/70">Recibirás una confirmación con los detalles de tu pedido</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm font-bold">2</span>
                    </div>
                    <div>
                      <p className="font-bold text-white text-lg">Preparación del envío</p>
                      <p className="text-white/70">La tienda preparará tu pedido en las próximas 24-48 horas</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm font-bold">3</span>
                    </div>
                    <div>
                      <p className="font-bold text-white text-lg">Seguimiento del envío</p>
                      <p className="text-white/70">Recibirás actualizaciones sobre el estado de tu envío</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save List Button */}
              {shipmentData && (
                <div className="mb-8">
                  <Button
                    variant="outline"
                    onClick={handleSaveList}
                    className="w-full border-cyan-400/50 text-cyan-400 hover:bg-cyan-900/20 backdrop-blur-sm text-lg py-3"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    Guardar Lista para Reutilizar
                  </Button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    sessionStorage.setItem('clearTempData', 'true')
                    router.push('/')
                  }}
                  className="flex-1 border-white/20 text-white/70 hover:bg-white/10 backdrop-blur-sm py-3"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Volver al Inicio
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white py-3 shadow-lg"
                  onClick={() => {
                    sessionStorage.setItem('clearTempData', 'true')
                    router.push('/')
                  }}
                >
                  <Package className="w-5 h-5 mr-2" />
                  Nuevo Pedido
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
      
      {/* Modals */}
      <InputModal
        isOpen={showSaveInput}
        onClose={() => setShowSaveInput(false)}
        onConfirm={confirmSaveList}
        title="Guardar Lista"
        message="¿Cómo quieres llamar a esta lista?"
        placeholder="Lista de compras"
        defaultValue={shipmentData ? `Lista de ${shipmentData.store}` : "Mi lista de compras"}
        confirmText="Guardar"
      />
      
      <AlertModal
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
      />
    </div>
  )
} 