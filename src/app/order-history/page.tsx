"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Layout } from "@/components/ui/layout"
import { ConfirmModal, AlertModal } from "@/components/ui/modal"
import { Package, Store, Calendar, ShoppingCart, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface ConfirmedOrder {
  orderId: string
  store: string
  total: number
  items: Array<{
    product: string
    quantity: number
    price: number
    total: number
  }>
  timestamp: string
  status: string
  confirmedAt: string
}

export default function OrderHistoryPage() {
  const [confirmedOrders, setConfirmedOrders] = useState<ConfirmedOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Modal states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<ConfirmedOrder | null>(null)
  const [alertConfig, setAlertConfig] = useState<{ title: string, message: string, type: "success" | "error" | "info" }>({ title: "", message: "", type: "info" })

  useEffect(() => {
    loadConfirmedOrders()
  }, [])

  const loadConfirmedOrders = () => {
    try {
      const ordersJson = sessionStorage.getItem('confirmedOrders')
      if (ordersJson) {
        const orders: ConfirmedOrder[] = JSON.parse(ordersJson)
        setConfirmedOrders(orders)
      }
    } catch (error) {
      console.error('Error loading confirmed orders:', error)
    } finally {
      setIsLoading(false)
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

  const handleDeleteOrder = (orderId: string) => {
    const orderToDelete = confirmedOrders.find(order => order.orderId === orderId)
    if (!orderToDelete) return

    setSelectedOrder(orderToDelete)
    setShowDeleteConfirm(true)
  }

  const confirmDeleteOrder = () => {
    if (!selectedOrder) return
    
    try {
      const updatedOrders = confirmedOrders.filter(order => order.orderId !== selectedOrder.orderId)
      setConfirmedOrders(updatedOrders)
      sessionStorage.setItem('confirmedOrders', JSON.stringify(updatedOrders))
      
      setAlertConfig({
        title: "Pedido Eliminado",
        message: "El pedido ha sido eliminado del historial",
        type: "success"
      })
      setShowAlert(true)
    } catch (error) {
      console.error('Error deleting order:', error)
      setAlertConfig({
        title: "Error",
        message: "Error al eliminar el pedido. Intenta de nuevo.",
        type: "error"
      })
      setShowAlert(true)
    }
  }

  const handleReorderItems = (order: ConfirmedOrder) => {
    try {
      // Create new shopping list from this order
      const products = order.items.map(item => ({
        name: item.product,
        quantity: item.quantity
      }))
      
      // Clear any existing temporary data
      sessionStorage.removeItem('shipmentData')
      sessionStorage.removeItem('comparisonData')
      sessionStorage.removeItem('selectedStore')
      
      // Set up new shopping session (this would typically be handled by the AI chat)
      // For now, we'll redirect to the main page and let the user add items manually
      sessionStorage.setItem('clearTempData', 'true')
      router.push('/')
    } catch (error) {
      console.error('Error reordering items:', error)
    }
  }

  const clearAllOrders = () => {
    setShowClearAllConfirm(true)
  }

  const confirmClearAllOrders = () => {
    sessionStorage.removeItem('confirmedOrders')
    setConfirmedOrders([])
    setAlertConfig({
      title: "Historial Eliminado",
      message: "Todo el historial de pedidos ha sido eliminado",
      type: "success"
    })
    setShowAlert(true)
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="bg-gray-900 min-h-full flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-400">Cargando historial de pedidos...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="bg-gray-900 min-h-full">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">Historial de Pedidos</h1>
            {confirmedOrders.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllOrders}
                className="text-red-400 border-red-400 hover:bg-red-900/20"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Limpiar Historial
              </Button>
            )}
          </div>

          {confirmedOrders.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-300 mb-2">
                No hay pedidos confirmados
              </h2>
              <p className="text-gray-500 mb-6">
                Cuando confirmes un pedido, aparecerá aquí en tu historial.
              </p>
              <Button
                onClick={() => {
                  sessionStorage.setItem('clearTempData', 'true')
                  router.push('/')
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Hacer un Pedido
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {confirmedOrders.map((order) => (
                <Card key={order.orderId} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Package className="w-5 h-5 text-green-400" />
                        <div>
                          <h3 className="font-semibold text-white">
                            Pedido #{order.orderId.split('-')[1]}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                            <div className="flex items-center space-x-1">
                              <Store className="w-4 h-4" />
                              <span>{order.store}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(order.confirmedAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReorderItems(order)}
                          className="text-blue-400 border-blue-400 hover:bg-blue-900/20"
                        >
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          Reordenar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteOrder(order.orderId)}
                          className="text-red-400 border-red-400 hover:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-1 text-sm">
                          <div className="flex-1">
                            <span className="text-gray-300">{item.product}</span>
                            <span className="text-gray-500 ml-2">x{item.quantity}</span>
                          </div>
                          <span className="text-gray-300">{formatPrice(item.total)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-gray-700">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-300">Total</span>
                        <span className="font-bold text-green-400 text-lg">
                          {formatPrice(order.total)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Modals */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDeleteOrder}
        title="Eliminar Pedido"
        message={`¿Estás seguro de que quieres eliminar el pedido #${selectedOrder?.orderId.split('-')[1]} del historial? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        confirmVariant="destructive"
      />
      
      <ConfirmModal
        isOpen={showClearAllConfirm}
        onClose={() => setShowClearAllConfirm(false)}
        onConfirm={confirmClearAllOrders}
        title="Eliminar Historial"
        message="¿Estás seguro de que quieres eliminar todo el historial de pedidos? Esta acción no se puede deshacer."
        confirmText="Eliminar Todo"
        confirmVariant="destructive"
      />
      
      <AlertModal
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
      />
    </Layout>
  )
} 