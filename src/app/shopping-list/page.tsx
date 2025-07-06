"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Layout } from "@/components/ui/layout"
import { ConfirmModal, AlertModal } from "@/components/ui/modal"
import { ShoppingCart, Trash2, Calendar, Package, Plus } from "lucide-react"
import { useRouter } from "next/navigation"

interface Product {
  name: string
  quantity: number
}

interface SavedList {
  id: string
  name: string
  products: Product[]
  createdAt: string
  itemCount: number
  totalItems: number
}

export default function ShoppingListPage() {
  const [savedLists, setSavedLists] = useState<SavedList[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Modal states
  const [showLoadConfirm, setShowLoadConfirm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [selectedList, setSelectedList] = useState<SavedList | null>(null)
  const [alertConfig, setAlertConfig] = useState<{ title: string, message: string, type: "success" | "error" | "info" }>({ title: "", message: "", type: "info" })

  useEffect(() => {
    loadSavedLists()
  }, [])

  const loadSavedLists = () => {
    try {
      const listsJson = sessionStorage.getItem('savedLists')
      if (listsJson) {
        const lists: SavedList[] = JSON.parse(listsJson)
        setSavedLists(lists)
      }
    } catch (error) {
      console.error('Error loading saved lists:', error)
    } finally {
      setIsLoading(false)
    }
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

  const handleLoadList = (list: SavedList) => {
    setSelectedList(list)
    setShowLoadConfirm(true)
  }

  const confirmLoadList = () => {
    if (!selectedList) return
    
    try {
      // Save the products to current session
      sessionStorage.setItem('currentProducts', JSON.stringify(selectedList.products))
      
      // Clear current messages to start fresh
      sessionStorage.removeItem('currentMessages')
      
      // Mark that temp data should be cleared when returning to main page
      sessionStorage.setItem('clearTempData', 'true')
      
      // Navigate to main page
      router.push('/')
    } catch (error) {
      console.error('Error loading list:', error)
      setAlertConfig({
        title: "Error",
        message: "Error al cargar la lista. Intenta de nuevo.",
        type: "error"
      })
      setShowAlert(true)
    }
  }

  const handleDeleteList = (listId: string) => {
    const listToDelete = savedLists.find(list => list.id === listId)
    if (!listToDelete) return

    setSelectedList(listToDelete)
    setShowDeleteConfirm(true)
  }

  const confirmDeleteList = () => {
    if (!selectedList) return
    
    try {
      const updatedLists = savedLists.filter(list => list.id !== selectedList.id)
      setSavedLists(updatedLists)
      sessionStorage.setItem('savedLists', JSON.stringify(updatedLists))
      
      setAlertConfig({
        title: "Lista Eliminada",
        message: "Lista eliminada exitosamente",
        type: "success"
      })
      setShowAlert(true)
    } catch (error) {
      console.error('Error deleting list:', error)
      setAlertConfig({
        title: "Error",
        message: "Error al eliminar la lista. Intenta de nuevo.",
        type: "error"
      })
      setShowAlert(true)
    }
  }

  const clearAllLists = () => {
    setShowClearAllConfirm(true)
  }

  const confirmClearAllLists = () => {
    sessionStorage.removeItem('savedLists')
    setSavedLists([])
    setAlertConfig({
      title: "Listas Eliminadas",
      message: "Todas las listas han sido eliminadas exitosamente",
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
            <p className="text-gray-400">Cargando listas guardadas...</p>
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
            <h1 className="text-2xl font-bold text-white">Mis Listas Guardadas</h1>
            {savedLists.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllLists}
                className="text-red-400 border-red-400 hover:bg-red-900/20"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Limpiar Todo
              </Button>
            )}
          </div>

          {savedLists.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-300 mb-2">
                No hay listas guardadas
              </h2>
              <p className="text-gray-500 mb-6">
                Crea una lista de compras y guárdala para usarla más tarde.
              </p>
              <Button
                onClick={() => router.push('/')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Crear Nueva Lista
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {savedLists.map((list) => (
                <Card key={list.id} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Package className="w-6 h-6 text-blue-400" />
                        <div>
                          <h3 className="font-semibold text-white text-lg">
                            {list.name}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                            <div className="flex items-center space-x-1">
                              <ShoppingCart className="w-4 h-4" />
                              <span>{list.itemCount} productos diferentes</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Package className="w-4 h-4" />
                              <span>{list.totalItems} items total</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(list.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleLoadList(list)}
                          className="text-blue-400 border-blue-400 hover:bg-blue-900/20"
                        >
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          Cargar al Carrito
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteList(list.id)}
                          className="text-red-400 border-red-400 hover:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {list.products.slice(0, 6).map((product, index) => (
                        <div key={index} className="text-sm text-gray-300 bg-gray-700 rounded px-2 py-1">
                          {product.name} x{product.quantity}
                        </div>
                      ))}
                      {list.products.length > 6 && (
                        <div className="text-sm text-gray-400 bg-gray-700 rounded px-2 py-1">
                          +{list.products.length - 6} más...
                        </div>
                      )}
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
        isOpen={showLoadConfirm}
        onClose={() => setShowLoadConfirm(false)}
        onConfirm={confirmLoadList}
        title="Cargar Lista"
        message={`¿Cargar "${selectedList?.name}" en tu carrito activo? Esto reemplazará los productos actuales.`}
        confirmText="Cargar"
      />
      
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDeleteList}
        title="Eliminar Lista"
        message={`¿Estás seguro de que quieres eliminar "${selectedList?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        confirmVariant="destructive"
      />
      
      <ConfirmModal
        isOpen={showClearAllConfirm}
        onClose={() => setShowClearAllConfirm(false)}
        onConfirm={confirmClearAllLists}
        title="Eliminar Todas las Listas"
        message="¿Estás seguro de que quieres eliminar todas las listas guardadas? Esta acción no se puede deshacer."
        confirmText="Eliminar Todas"
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