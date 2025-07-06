"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Layout } from "@/components/ui/layout"
import { ConfirmModal, InputModal, AlertModal } from "@/components/ui/modal"
import { GradientDiffusionScanner } from "@/components/ui/gradient-diffusion-scanner"
import { MouseLogo, VoiceButton, VoiceRecordingModal, ChatSuggestions } from "@/components/ui/ratita-components"
import { 
  Plus, 
  Minus, 
  Camera, 
  Rocket, 
  X, 
  Save, 
  Send,
  Trash2,
  CheckCircle,
  Sparkles,
  ShoppingBag,
  Settings
} from "lucide-react"
import { useRouter } from "next/navigation"

interface Product {
  name: string
  quantity: number
}



interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

export default function SupermarketChat() {
  const [products, setProducts] = useState<Product[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isComparing, setIsComparing] = useState(false)
  const [lastAddedProduct] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [showVoiceModal, setShowVoiceModal] = useState(false)
  const [userName] = useState("Lucas")

  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()


  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  // Modal states
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [showSaveInput, setShowSaveInput] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertConfig, setAlertConfig] = useState<{ title: string, message: string, type: "success" | "error" | "info" }>({ title: "", message: "", type: "info" })

  // Load persisted data when component mounts
  useEffect(() => {
    const loadedFromList = sessionStorage.getItem('loadedFromList')
    if (loadedFromList === 'true') {
      sessionStorage.removeItem('loadedFromList')
    }
    
    const shouldClearData = sessionStorage.getItem('clearTempData')
    if (shouldClearData === 'true') {
      sessionStorage.removeItem('shipmentData')
      sessionStorage.removeItem('comparisonData')
      sessionStorage.removeItem('selectedStore')
      sessionStorage.removeItem('clearTempData')
      sessionStorage.removeItem('currentProducts')
      sessionStorage.removeItem('currentMessages')
    }
    
    try {
      const savedProducts = sessionStorage.getItem('currentProducts')
      const savedMessages = sessionStorage.getItem('currentMessages')
      
      if (savedProducts) {
        const parsedProducts = JSON.parse(savedProducts)
        if (Array.isArray(parsedProducts)) {
          setProducts(parsedProducts)
        }
      }
      
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages)
        if (Array.isArray(parsedMessages)) {
          setMessages(parsedMessages)
        }
      }
    } catch (error) {
      console.error('Error loading persisted data:', error)
      sessionStorage.removeItem('currentProducts')
      sessionStorage.removeItem('currentMessages')
    }
  }, [])

  // Save products to sessionStorage whenever they change
  useEffect(() => {
    if (products.length > 0) {
      sessionStorage.setItem('currentProducts', JSON.stringify(products))
    } else {
      sessionStorage.removeItem('currentProducts')
    }
  }, [products])

  // Save messages to sessionStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem('currentMessages', JSON.stringify(messages))
    } else {
      sessionStorage.removeItem('currentMessages')
    }
  }, [messages])

  // Funciones existentes mantenidas
  const handleClearList = () => {
    setShowClearConfirm(true)
  }

  const confirmClearList = () => {
    setProducts([])
    setMessages([])
    sessionStorage.removeItem('currentProducts')
    sessionStorage.removeItem('currentMessages')
  }

  const handleSaveList = () => {
    if (products.length === 0) return
    setShowSaveInput(true)
  }

  const confirmSaveList = (listName: string) => {
    try {
      const savedList = {
        id: `LIST-${Date.now()}`,
        name: listName,
        products: products,
        createdAt: new Date().toISOString(),
        itemCount: products.length,
        totalItems: products.reduce((sum, product) => sum + product.quantity, 0)
      }

      const existingListsJson = sessionStorage.getItem('savedLists')
      const existingLists = existingListsJson ? JSON.parse(existingListsJson) : []
      const updatedLists = [savedList, ...existingLists]
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

  const handleSuggestionClick = async (suggestion: string) => {
    if (isLoading) return

    const userMessage: ChatMessage = {
      role: "user",
      content: suggestion
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput(suggestion)
    setIsLoading(true)

    try {
      const response = await fetch('/api/v2/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: updatedMessages })
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No response body')
      }

      let result = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        const chunk = new TextDecoder().decode(value)
        result += chunk
      }

      try {
        let cleanResult = result.trim()
        if (cleanResult.startsWith('```json')) {
          cleanResult = cleanResult.replace(/^```json\s*/, '').replace(/\s*```$/, '')
        } else if (cleanResult.startsWith('```')) {
          cleanResult = cleanResult.replace(/^```\s*/, '').replace(/\s*```$/, '')
        }

        const productsList = JSON.parse(cleanResult)
        if (Array.isArray(productsList)) {
          setProducts(prevProducts => mergeProducts(prevProducts, productsList, userMessage.content))
        }
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError)
      }

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: result
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const mergeProducts = (existingProducts: Product[], newProducts: Product[], userMessage: string): Product[] => {
    console.log('=== MERGE PRODUCTS DEBUG ===')
    console.log('User message:', userMessage)
    console.log('Existing products:', existingProducts)
    console.log('New products from backend:', newProducts)
    
    const merged = [...existingProducts]
    
    newProducts.forEach(newProduct => {
      const existingIndex = merged.findIndex(p => 
        p.name.toLowerCase() === newProduct.name.toLowerCase()
      )
      
      if (existingIndex >= 0) {
        const existingQuantity = merged[existingIndex].quantity
        console.log(`Product "${newProduct.name}" already exists with quantity ${existingQuantity}`)
        console.log(`Backend returns total quantity: ${newProduct.quantity}`)
        
        // El backend SIEMPRE devuelve la cantidad total deseada, no la cantidad a agregar
        // Así que simplemente usamos la cantidad del backend como nueva cantidad total
        merged[existingIndex] = {
          ...merged[existingIndex],
          quantity: newProduct.quantity
        }
        console.log(`Updated quantity from ${existingQuantity} to ${newProduct.quantity}`)
      } else {
        merged.push(newProduct)
        console.log(`New product "${newProduct.name}" added with quantity ${newProduct.quantity}`)
      }
    })
    
    console.log('Final merged products:', merged)
    console.log('=== END MERGE PRODUCTS DEBUG ===')
    
    return merged
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if ((!input.trim() && !selectedImage) || isLoading) return

    const userMessage: ChatMessage = {
      role: "user",
      content: selectedImage ? `[Imagen adjunta] ${input || 'Procesá esta imagen para crear una lista de compras'}` : input
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput("")
    setIsLoading(true)

    try {
      let response
      if (selectedImage) {
        const formData = new FormData()
        formData.append('image', selectedImage)
        formData.append('messages', JSON.stringify(updatedMessages))
        
        response = await fetch('/api/v2/chat', {
          method: 'POST',
          body: formData
        })
      } else {
        response = await fetch('/api/v2/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ messages: updatedMessages })
        })
      }

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No response body')
      }

      let result = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        const chunk = new TextDecoder().decode(value)
        result += chunk
      }

      try {
        let cleanResult = result.trim()
        if (cleanResult.startsWith('```json')) {
          cleanResult = cleanResult.replace(/^```json\s*/, '').replace(/\s*```$/, '')
        } else if (cleanResult.startsWith('```')) {
          cleanResult = cleanResult.replace(/^```\s*/, '').replace(/\s*```$/, '')
        }

        const productsList = JSON.parse(cleanResult)
        if (Array.isArray(productsList)) {
          setProducts(prevProducts => mergeProducts(prevProducts, productsList, userMessage.content))
        }
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError)
      }

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: result
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsLoading(false)
      clearImage()
    }
  }

  const handleImageUpload = (file: File) => {
    setSelectedImage(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageUpload(e.target.files[0])
    }
  }



  const clearImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
    if (cameraInputRef.current) cameraInputRef.current.value = ""
  }

  const handleQuantityChange = async (index: number, newQuantity: number) => {
    if (newQuantity < 1) {
      await handleDeleteItem(index)
      return
    }

    const updatedProducts = products.map((product, i) => 
      i === index ? { ...product, quantity: newQuantity } : product
    )
    setProducts(updatedProducts)

    const productName = products[index].name
    const change = newQuantity - products[index].quantity
    const action = change > 0 ? 'aumentar' : 'disminuir'
    const userMessage: ChatMessage = {
      role: "user",
      content: `${action} ${productName} a ${newQuantity} unidades`
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)

    try {
      const response = await fetch('/api/v2/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: updatedMessages })
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No response body')
      }

      let result = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        const chunk = new TextDecoder().decode(value)
        result += chunk
      }

      // Solo agregar el mensaje del asistente, NO procesar productos
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: result
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const handleDeleteItem = async (index: number) => {
    const productToDelete = products[index]
    const updatedProducts = products.filter((_, i) => i !== index)
    setProducts(updatedProducts)

    const userMessage: ChatMessage = {
      role: "user",
      content: `eliminar ${productToDelete.name} de la lista`
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)

    try {
      const response = await fetch('/api/v2/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: updatedMessages })
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No response body')
      }

      let result = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        const chunk = new TextDecoder().decode(value)
        result += chunk
      }

      // Solo agregar el mensaje del asistente, NO procesar productos
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: result
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const getProductIcon = (productName: string): string => {
    const name = productName.toLowerCase()
    if (name.includes('carne') || name.includes('pollo') || name.includes('milanesa')) return '🥩'
    if (name.includes('leche') || name.includes('yogur') || name.includes('queso')) return '🥛'
    if (name.includes('pan') || name.includes('galletita') || name.includes('tostada')) return '🍞'
    if (name.includes('fruta') || name.includes('manzana') || name.includes('banana')) return '🍎'
    if (name.includes('verdura') || name.includes('tomate') || name.includes('lechuga')) return '🥬'
    if (name.includes('arroz') || name.includes('fideo') || name.includes('pasta')) return '🍝'
    if (name.includes('aceite') || name.includes('condimento') || name.includes('sal')) return '🧈'
    if (name.includes('gaseosa') || name.includes('agua') || name.includes('jugo')) return '🥤'
    if (name.includes('limpieza') || name.includes('detergente') || name.includes('lavandina')) return '🧽'
    if (name.includes('cafe') || name.includes('te') || name.includes('desayuno')) return '☕'
    return '🛒'
  }

  const getProductColor = (productName: string): string => {
    const name = productName.toLowerCase()
    if (name.includes('carne') || name.includes('pollo') || name.includes('milanesa')) return 'bg-red-500'
    if (name.includes('leche') || name.includes('yogur') || name.includes('queso')) return 'bg-blue-500'
    if (name.includes('pan') || name.includes('galletita') || name.includes('tostada')) return 'bg-yellow-500'
    if (name.includes('fruta') || name.includes('manzana') || name.includes('banana')) return 'bg-green-500'
    if (name.includes('verdura') || name.includes('tomate') || name.includes('lechuga')) return 'bg-green-600'
    if (name.includes('arroz') || name.includes('fideo') || name.includes('pasta')) return 'bg-orange-500'
    if (name.includes('aceite') || name.includes('condimento') || name.includes('sal')) return 'bg-purple-500'
    if (name.includes('gaseosa') || name.includes('agua') || name.includes('jugo')) return 'bg-cyan-500'
    if (name.includes('limpieza') || name.includes('detergente') || name.includes('lavandina')) return 'bg-indigo-500'
    if (name.includes('cafe') || name.includes('te') || name.includes('desayuno')) return 'bg-amber-500'
    return 'bg-gray-500'
  }

  const handleComparePrices = async () => {
    if (products.length === 0) return

    setIsComparing(true)
    
    try {
      console.log('=== COMPARING PRICES DEBUG ===')
      console.log('Products to compare:', products)
      
      // Llamar a la API de comparación de precios
      const response = await fetch('/api/v2/compare-prices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ products })
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      const comparisonResult = await response.json()
      console.log('API Response:', comparisonResult)
      
      // Guardar los datos completos de comparación en sessionStorage
      sessionStorage.setItem('comparisonData', JSON.stringify(comparisonResult))
      
      console.log('Comparison data saved to sessionStorage')
      console.log('=== END COMPARING PRICES DEBUG ===')
      
      // Redireccionar a la página de comparación
      router.push('/comparison')
    } catch (error) {
      console.error('Error comparing prices:', error)
      setAlertConfig({
        title: "Error",
        message: "Error al comparar precios. Intenta de nuevo.",
        type: "error"
      })
      setShowAlert(true)
    } finally {
      setIsComparing(false)
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        
        await handleAudioSubmit(audioBlob)
      }

      mediaRecorder.start()
      setIsRecording(true)
      setShowVoiceModal(true)
    } catch (error) {
      console.error('Error starting recording:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setShowVoiceModal(false)
    }
  }

  const handleAudioSubmit = async (audio: Blob) => {
    setIsLoading(true)
    const userMessage: ChatMessage = {
      role: "user",
      content: `[Audio de lista de compras]`
    }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput("")
    
    try {
      const formData = new FormData()
      formData.append('audio', audio, 'audio.webm')
      formData.append('messages', JSON.stringify(updatedMessages))
      
      const response = await fetch('/api/v2/chat', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        throw new Error('Failed to get response')
      }
      
      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No response body')
      }
      
      let result = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = new TextDecoder().decode(value)
        result += chunk
      }
      
      try {
        let cleanResult = result.trim()
        if (cleanResult.startsWith('```json')) {
          cleanResult = cleanResult.replace(/^```json\s*/, '').replace(/\s*```$/, '')
        } else if (cleanResult.startsWith('```')) {
          cleanResult = cleanResult.replace(/^```\s*/, '').replace(/\s*```$/, '')
        }
        
        const productsList = JSON.parse(cleanResult)
        if (Array.isArray(productsList)) {
          setProducts(prevProducts => mergeProducts(prevProducts, productsList, userMessage.content))
        }
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError)
      }
      
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: result
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Failed to send audio:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const totalItems = products.reduce((sum, product) => sum + product.quantity, 0)

  const exportList = () => {
    const listText = products.map((product) => `${product.quantity}x ${product.name}`).join("\n")
    const totalText = `\n\nTotal: ${totalItems} productos`

    if (navigator.share) {
      navigator.share({
        title: "Mi Lista de Compras - Ratita",
        text: listText + totalText,
      })
    } else {
      navigator.clipboard.writeText(listText + totalText)
      alert("Lista copiada al portapapeles")
    }
  }

  // Topbar content con el nuevo diseño de Ratita
  const topbarContent = (
    <div className="flex items-center space-x-3">
      <MouseLogo size="sm" />
      <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
        Ratita
      </span>
      <div className="flex items-center space-x-3 ml-auto">
        {totalItems > 0 && (
          <>
            <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
              <ShoppingBag className="h-3 w-3 mr-1" />
              {totalItems}
            </Badge>
            <Button
              size="sm"
              variant="ghost"
              onClick={exportList}
              className="text-white/70 hover:text-white hover:bg-white/10 p-2"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Layout 
        showTopbar={true} 
        topbarContent={topbarContent}
      >
        {/* Voice Recording Modal */}
        <VoiceRecordingModal
          isOpen={showVoiceModal}
          isRecording={isRecording}
        />

        {/* Success notification */}
        {lastAddedProduct && (
          <div className="fixed top-16 left-4 right-4 z-50 animate-in slide-in-from-top">
            <Alert className="bg-gradient-to-r from-green-500/90 to-emerald-600/90 border-green-400/50 text-white backdrop-blur-sm">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                ✨ <strong>{lastAddedProduct}</strong> agregado al carrito
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Main Content with new Ratita style */}
        <div className="flex flex-col h-full">
          {/* Chat Header */}
          <div className="px-4 py-4 border-b border-white/10 bg-black/10">
            <div className="flex items-center space-x-3">
              <MouseLogo size="md" animated={isLoading} />
              <div>
                <h1 className="text-xl font-bold text-white flex items-center space-x-2">
                  <span>¡Hola! {userName}</span>
                  <Sparkles className="h-4 w-4 text-yellow-400 animate-pulse" />
                </h1>
                <p className="text-white/70 text-sm">Tu asistente de compras inteligente</p>
              </div>
            </div>
          </div>

          {/* Product List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {products.length === 0 ? (
              <div className="text-center py-8">
                <MouseLogo size="xl" className="mx-auto mb-6" animated />
                <h3 className="text-2xl font-bold text-white mb-4">¿Qué vamos a comprar hoy?</h3>
                <p className="text-white/70 mb-6">Elegí una opción rápida o háblame</p>
                <ChatSuggestions onSuggestionClick={handleSuggestionClick} />
              </div>
            ) : (
              <>
                {products.map((product: Product, index: number) => (
                  <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1">
                          <div className={`w-10 h-10 rounded-full ${getProductColor(product.name)} flex items-center justify-center text-lg`}>
                            {getProductIcon(product.name)}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-white">{product.name}</h3>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(index, product.quantity - 1)}
                            className="h-7 w-7 p-0 bg-white/10 border-white/20 text-white hover:bg-white/20"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-6 text-center text-white">{product.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(index, product.quantity + 1)}
                            className="h-7 w-7 p-0 bg-white/10 border-white/20 text-white hover:bg-white/20"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteItem(index)}
                            className="h-7 w-7 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {/* Action Buttons */}
                <div className="flex flex-col space-y-3 pt-4">
                  <Button 
                    onClick={handleComparePrices}
                    disabled={isComparing || products.length === 0}
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white border-0 shadow-lg"
                  >
                    <Rocket className="w-4 h-4 mr-2" />
                    {isComparing ? "Comparando..." : "Descubrí el mejor precio"}
                  </Button>
                  
                  <div className="flex justify-center space-x-3">
                    <Button 
                      onClick={handleSaveList}
                      variant="outline"
                      className="border-green-600 text-green-400 hover:bg-green-900/20"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Guardar lista
                    </Button>
                    <Button 
                      onClick={handleClearList}
                      variant="outline"
                      className="border-red-600 text-red-400 hover:bg-red-900/20"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Limpiar lista
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Chat Input Area */}
          <div className="border-t border-white/10 bg-black/20 backdrop-blur-xl p-4">
            <form onSubmit={handleSubmit} className="flex items-center space-x-3">
              <div className="flex-1 relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Dime qué necesitas comprar..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pr-12 h-12 rounded-xl backdrop-blur-sm focus:bg-white/20 focus:border-violet-400"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  disabled={isLoading || (!input.trim() && !selectedImage)}
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 h-8 w-8 p-0 rounded-lg"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              {/* Camera Button */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                className="text-white/70 hover:text-white hover:bg-white/10 h-12 w-12"
              >
                <Camera className="h-5 w-5" />
              </Button>

              {/* Voice Button */}
              <VoiceButton
                onStartRecording={startRecording}
                onStopRecording={stopRecording}
                isRecording={isRecording}
                disabled={isLoading}
                size="md"
              />
            </form>

            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-4 relative">
                <div className="relative inline-block">
                  <Image 
                    src={imagePreview} 
                    alt="Preview" 
                    className="max-w-full h-[100px] w-[100px] object-cover rounded-lg"
                    width={100}
                    height={100}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -top-2 -right-2 text-white bg-red-500 hover:bg-red-600 p-0 h-6 w-6 rounded-full"
                    onClick={clearImage}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Loading Overlay */}
        {(isLoading || isComparing) && (
          <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="flex flex-col items-center">
              <GradientDiffusionScanner 
                width={160} 
                height={100} 
                duration={2}
                primaryColor="#4CAF50"
                scanColor="#2196F3"
              />
              <p className="text-white text-lg mt-4 font-medium">
                {isComparing ? "Comparando precios..." : "Procesando tu solicitud..."}
              </p>
            </div>
          </div>
        )}
        
        {/* Modals */}
        <ConfirmModal
          isOpen={showClearConfirm}
          onClose={() => setShowClearConfirm(false)}
          onConfirm={confirmClearList}
          title="Limpiar Lista"
          message="¿Estás seguro de que quieres limpiar toda la lista? Esta acción no se puede deshacer."
          confirmText="Limpiar"
          confirmVariant="destructive"
        />
        
        <InputModal
          isOpen={showSaveInput}
          onClose={() => setShowSaveInput(false)}
          onConfirm={confirmSaveList}
          title="Guardar Lista"
          message="¿Cómo quieres llamar a esta lista?"
          placeholder="Mi lista de compras"
          defaultValue="Mi lista de compras"
          confirmText="Guardar"
        />
        
        <AlertModal
          isOpen={showAlert}
          onClose={() => setShowAlert(false)}
          title={alertConfig.title}
          message={alertConfig.message}
          type={alertConfig.type}
        />
      </Layout>
    </div>
  )
}
