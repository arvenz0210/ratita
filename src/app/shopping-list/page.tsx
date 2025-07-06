"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Layout } from "@/components/ui/layout"
import { ConfirmModal, AlertModal } from "@/components/ui/modal"
import { MouseLogo } from "@/components/ui/ratita-components"
import { ShoppingCart, Trash2, Calendar, Package, Plus, Sparkles } from "lucide-react"
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Layout>
          <div className="min-h-full flex items-center justify-center">
            <div className="text-center">
              <MouseLogo size="lg" className="mx-auto mb-6" animated />
              <p className="text-white/70 text-lg">Cargando listas guardadas...</p>
              <p className="text-white/50 text-sm mt-2">Ratita está organizando tus listas</p>
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
              Mis Listas Guardadas
            </span>
          </div>
        }
      >
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white flex items-center">
              <Package className="w-8 h-8 mr-3 text-cyan-400" />
              Mis Listas Guardadas
            </h1>
            {savedLists.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllLists}
                className="text-red-400 border-red-400/50 hover:bg-red-900/20 backdrop-blur-sm"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Limpiar Todo
              </Button>
            )}
          </div>

          {savedLists.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-12 border border-white/10">
                <MouseLogo size="xl" className="mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-white mb-3 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 mr-2 text-cyan-400" />
                  No hay listas guardadas
                </h2>
                <p className="text-white/70 mb-8 text-lg">
                  Crea una lista de compras y guárdala para usarla más tarde.
                </p>
                <Button
                  onClick={() => router.push('/')}
                  className="bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white shadow-lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Crear Nueva Lista
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {savedLists.map((list) => (
                <Card key={list.id} className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full p-3">
                          <Package className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-xl flex items-center">
                            {list.name}
                            <Sparkles className="w-5 h-5 ml-2 text-cyan-400" />
                          </h3>
                          <div className="flex items-center space-x-6 text-sm text-white/60 mt-2">
                            <div className="flex items-center space-x-2">
                              <ShoppingCart className="w-4 h-4 text-violet-400" />
                              <span>{list.itemCount} productos diferentes</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Package className="w-4 h-4 text-purple-400" />
                              <span>{list.totalItems} items total</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-cyan-400" />
                              <span>{formatDate(list.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleLoadList(list)}
                          className="text-cyan-400 border-cyan-400/50 hover:bg-cyan-900/20 backdrop-blur-sm"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Cargar al Carrito
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteList(list.id)}
                          className="text-red-400 border-red-400/50 hover:bg-red-900/20 backdrop-blur-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {list.products.slice(0, 6).map((product, index) => (
                        <div key={index} className="text-sm text-white bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
                          <span className="font-medium">{product.name}</span>
                          <span className="text-cyan-400 ml-2">x{product.quantity}</span>
                        </div>
                      ))}
                      {list.products.length > 6 && (
                        <div className="text-sm text-white/60 bg-white/5 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10 flex items-center justify-center">
                          <Sparkles className="w-4 h-4 mr-1 text-purple-400" />
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
      </Layout>
      
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
    </div>
  )
} 