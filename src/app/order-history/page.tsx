"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Layout } from "@/components/ui/layout"
import { ConfirmModal, AlertModal } from "@/components/ui/modal"
import { MouseLogo } from "@/components/ui/ratita-components"
import { Package, Store, Calendar, ShoppingCart, Trash2, Sparkles, CheckCircle } from "lucide-react"
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
      console.log(order)
      sessionStorage.removeItem('shipmentData')
      sessionStorage.removeItem('comparisonData')
      sessionStorage.removeItem('selectedStore')
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Layout>
          <div className="min-h-full flex items-center justify-center">
            <div className="text-center">
              <MouseLogo size="lg" className="mx-auto mb-6" animated />
              <p className="text-white/70 text-lg">Cargando historial de pedidos...</p>
              <p className="text-white/50 text-sm mt-2">Ratita está organizando tu historial</p>
            </div>
          </div>
        </Layout>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Layout
        topbarContent={
          <div className="flex items-center space-x-3">
            <MouseLogo size="sm" />
            <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Historial de Pedidos
            </span>
          </div>
        }
      >
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white flex items-center">
              <Package className="w-8 h-8 mr-3 text-cyan-400" />
              Historial de Pedidos
              <Sparkles className="w-6 h-6 ml-2 text-purple-400" />
            </h1>
            {confirmedOrders.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllOrders}
                className="text-red-400 border-red-400/50 hover:bg-red-900/20 backdrop-blur-sm"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Limpiar Historial
              </Button>
            )}
          </div>

          {confirmedOrders.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-12 border border-white/10">
                <MouseLogo size="xl" className="mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-white mb-3 flex items-center justify-center">
                  <Package className="w-6 h-6 mr-2 text-cyan-400" />
                  No hay pedidos confirmados
                </h2>
                <p className="text-white/70 mb-8 text-lg">
                  Cuando confirmes un pedido, aparecerá aquí en tu historial.
                </p>
                <Button
                  onClick={() => {
                    sessionStorage.setItem('clearTempData', 'true')
                    router.push('/')
                  }}
                  className="bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white shadow-lg"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Hacer un Pedido
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {confirmedOrders.map((order) => (
                <Card key={order.orderId} className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-full p-3">
                          <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-xl flex items-center">
                            Pedido #{order.orderId.split('-')[1]}
                            <Sparkles className="w-5 h-5 ml-2 text-green-400" />
                          </h3>
                          <div className="flex items-center space-x-6 text-sm text-white/60 mt-2">
                            <div className="flex items-center space-x-2">
                              <Store className="w-4 h-4 text-violet-400" />
                              <span>{order.store}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-cyan-400" />
                              <span>{formatDate(order.confirmedAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReorderItems(order)}
                          className="text-cyan-400 border-cyan-400/50 hover:bg-cyan-900/20 backdrop-blur-sm"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Reordenar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteOrder(order.orderId)}
                          className="text-red-400 border-red-400/50 hover:bg-red-900/20 backdrop-blur-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-3 bg-white/5 rounded-lg px-4 border border-white/10">
                          <div className="flex-1">
                            <span className="text-white font-medium">{item.product}</span>
                            <span className="text-cyan-400 ml-3 font-bold">x{item.quantity}</span>
                          </div>
                          <span className="text-white font-bold">{formatPrice(item.total)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-white/20">
                      <div className="flex justify-between items-center bg-gradient-to-r from-green-900/30 to-emerald-800/20 rounded-xl p-4 border border-green-500/30">
                        <span className="font-bold text-white text-xl flex items-center">
                          <Sparkles className="w-5 h-5 mr-2 text-green-400" />
                          Total
                        </span>
                        <span className="font-bold text-2xl bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
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
      </Layout>
      
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
    </div>
  )
} 