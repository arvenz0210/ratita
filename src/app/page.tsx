"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Edit3, Plus, SlidersHorizontal, Mic, AudioWaveform, Send, CircleArrowUp, ShoppingCart, Menu, Minus, Trash2, ArrowUp, Camera, Rocket, TrendingUp   } from "lucide-react"
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
  const [imageMethod, setImageMethod] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [isComparing, setIsComparing] = useState(false)
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      role: "user",
      content: input
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput("")
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

      // Parse the JSON response
      try {
        // Clean the response to extract JSON from markdown if present
        let cleanResult = result.trim()
        
        // Remove markdown code blocks if present
        if (cleanResult.startsWith('```json')) {
          cleanResult = cleanResult.replace(/^```json\s*/, '').replace(/\s*```$/, '')
        } else if (cleanResult.startsWith('```')) {
          cleanResult = cleanResult.replace(/^```\s*/, '').replace(/\s*```$/, '')
        }
        
        const productsList = JSON.parse(cleanResult)
        if (Array.isArray(productsList)) {
          setProducts(productsList)
        }
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError)
        console.log('Raw response:', result)
      }

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: result
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Failed to send message:', error)
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: "Lo siento, hubo un error al procesar tu mensaje."
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuantityChange = async (index: number, newQuantity: number) => {
    if (newQuantity < 0) return
    if (newQuantity === 0) {
      handleDeleteItem(index)
      return
    }
    const updatedProducts = [...products]
    updatedProducts[index].quantity = newQuantity
    setProducts(updatedProducts)

    // Update with AI
    try {
      const updateMessage = `Actualiza la cantidad de ${products[index].name} a ${newQuantity}`
      const userMessage: ChatMessage = {
        role: "user",
        content: updateMessage
      }

      const updatedMessages = [...messages, userMessage]
      setMessages(updatedMessages)

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

      // Parse the JSON response
      try {
        let cleanResult = result.trim()
        
        if (cleanResult.startsWith('```json')) {
          cleanResult = cleanResult.replace(/^```json\s*/, '').replace(/\s*```$/, '')
        } else if (cleanResult.startsWith('```')) {
          cleanResult = cleanResult.replace(/^```\s*/, '').replace(/\s*```$/, '')
        }
        
        const productsList = JSON.parse(cleanResult)
        if (Array.isArray(productsList)) {
          setProducts(productsList)
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
      console.error('Failed to update quantity:', error)
    }
  }

  const handleDeleteItem = async (index: number) => {
    const productToDelete = products[index]
    const updatedProducts = products.filter((_, i) => i !== index)
    setProducts(updatedProducts)

    // Update with AI
    try {
      const deleteMessage = `Elimina ${productToDelete.name} de la lista`
      const userMessage: ChatMessage = {
        role: "user",
        content: deleteMessage
      }

      const updatedMessages = [...messages, userMessage]
      setMessages(updatedMessages)

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

      // Parse the JSON response
      try {
        let cleanResult = result.trim()
        
        if (cleanResult.startsWith('```json')) {
          cleanResult = cleanResult.replace(/^```json\s*/, '').replace(/\s*```$/, '')
        } else if (cleanResult.startsWith('```')) {
          cleanResult = cleanResult.replace(/^```\s*/, '').replace(/\s*```$/, '')
        }
        
        const productsList = JSON.parse(cleanResult)
        if (Array.isArray(productsList)) {
          setProducts(productsList)
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
      console.error('Failed to delete item:', error)
    }
  }

  const getProductIcon = (productName: string): string => {
    const name = productName.toLowerCase()
    if (name.includes('leche') || name.includes('yogur') || name.includes('queso')) return '🥛'
    if (name.includes('carne') || name.includes('pollo') || name.includes('bife')) return '🥩'
    if (name.includes('pan') || name.includes('factura')) return '🍞'
    if (name.includes('fruta') || name.includes('banana') || name.includes('manzana') || name.includes('naranja') || name.includes('limón')) return '🍎'
    if (name.includes('verdura') || name.includes('tomate') || name.includes('cebolla') || name.includes('papa') || name.includes('zanahoria') || name.includes('lechuga')) return '🥬'
    if (name.includes('coca') || name.includes('agua') || name.includes('jugo') || name.includes('cerveza') || name.includes('vino')) return '🥤'
    if (name.includes('arroz') || name.includes('fideo') || name.includes('aceite') || name.includes('azúcar') || name.includes('sal') || name.includes('harina')) return '🍚'
    if (name.includes('huevo')) return '🥚'
    if (name.includes('café') || name.includes('té') || name.includes('yerba')) return '☕'
    if (name.includes('atún') || name.includes('tomate en lata') || name.includes('arveja')) return '🥫'
    if (name.includes('lenteja') || name.includes('poroto') || name.includes('garbanzo')) return '🫘'
    if (name.includes('galletita') || name.includes('papas fritas') || name.includes('maní')) return '🍪'
    if (name.includes('helado') || name.includes('pizza') || name.includes('hamburguesa')) return '🍦'
    if (name.includes('lavandina') || name.includes('detergente') || name.includes('jabón') || name.includes('suavizante')) return '🧴'
    if (name.includes('papel') || name.includes('servilleta') || name.includes('toalla')) return '🧻'
    if (name.includes('champú') || name.includes('acondicionador') || name.includes('pasta') || name.includes('desodorante')) return '🧴'
    if (name.includes('mayonesa') || name.includes('ketchup') || name.includes('mostaza') || name.includes('vinagre') || name.includes('salsa')) return '🍶'
    if (name.includes('cereal') || name.includes('avena') || name.includes('tostada')) return '🥣'
    if (name.includes('dulce') || name.includes('mermelada') || name.includes('miel')) return '🍯'
    return '🛒'
  }

  const getProductColor = (productName: string): string => {
    const name = productName.toLowerCase()
    if (name.includes('leche') || name.includes('yogur') || name.includes('queso')) return 'bg-blue-100'
    if (name.includes('carne') || name.includes('pollo') || name.includes('bife')) return 'bg-red-100'
    if (name.includes('pan') || name.includes('factura')) return 'bg-yellow-100'
    if (name.includes('fruta') || name.includes('banana') || name.includes('manzana') || name.includes('naranja') || name.includes('limón')) return 'bg-orange-100'
    if (name.includes('verdura') || name.includes('tomate') || name.includes('cebolla') || name.includes('papa') || name.includes('zanahoria') || name.includes('lechuga')) return 'bg-green-100'
    if (name.includes('coca') || name.includes('agua') || name.includes('jugo') || name.includes('cerveza') || name.includes('vino')) return 'bg-cyan-100'
    if (name.includes('arroz') || name.includes('fideo') || name.includes('aceite') || name.includes('azúcar') || name.includes('sal') || name.includes('harina')) return 'bg-amber-100'
    if (name.includes('huevo')) return 'bg-yellow-100'
    if (name.includes('café') || name.includes('té') || name.includes('yerba')) return 'bg-brown-100'
    if (name.includes('atún') || name.includes('tomate en lata') || name.includes('arveja')) return 'bg-gray-100'
    if (name.includes('lenteja') || name.includes('poroto') || name.includes('garbanzo')) return 'bg-orange-100'
    if (name.includes('galletita') || name.includes('papas fritas') || name.includes('maní')) return 'bg-yellow-100'
    if (name.includes('helado') || name.includes('pizza') || name.includes('hamburguesa')) return 'bg-pink-100'
    if (name.includes('lavandina') || name.includes('detergente') || name.includes('jabón') || name.includes('suavizante')) return 'bg-blue-100'
    if (name.includes('papel') || name.includes('servilleta') || name.includes('toalla')) return 'bg-white border border-gray-200'
    if (name.includes('champú') || name.includes('acondicionador') || name.includes('pasta') || name.includes('desodorante')) return 'bg-purple-100'
    if (name.includes('mayonesa') || name.includes('ketchup') || name.includes('mostaza') || name.includes('vinagre') || name.includes('salsa')) return 'bg-red-100'
    if (name.includes('cereal') || name.includes('avena') || name.includes('tostada')) return 'bg-yellow-100'
    if (name.includes('dulce') || name.includes('mermelada') || name.includes('miel')) return 'bg-amber-100'
    return 'bg-gray-100'
  }

  const handleComparePrices = async () => {
    if (products.length === 0) {
      alert('Agrega productos a tu lista antes de comparar precios')
      return
    }

    setIsComparing(true)
    
    try {
      const response = await fetch('/api/v2/compare-prices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ products })
      })

      if (!response.ok) {
        throw new Error('Failed to compare prices')
      }

      // Store the comparison data in sessionStorage for the comparison page
      const comparisonData = await response.json()
      sessionStorage.setItem('comparisonData', JSON.stringify(comparisonData))
      
      // Navigate to comparison page
      router.push('/comparison')
    } catch (error) {
      console.error('Error comparing prices:', error)
      alert('Error al comparar precios. Intenta de nuevo.')
    } finally {
      setIsComparing(false)
    }
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Topbar Navigation */}
      <div className="shadow-sm border-b border-gray-700 px-4 py-3">
          <div className="flex items-center space-x-3 justify-between">
            <Button variant="ghost" size="sm" className="p-2 text-gray-300 hover:text-white">
              <Menu className="w-5 h-5" />
            </Button>
              {/* <p className="text-md text-green-400 ml-auto">Ahorrado $62.520</p> */}
            {/* <div className="flex items-center space-x-2">   
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div> */}
          </div>
      </div>

      {/* Product List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 text-gray-400">
            <img src="/logo.png" alt="Ratita logo" className="w-40 h-40 mb-4" />
            <h1 className="text-4xl font-bold text-white mb-2">¡Hola! Lucas</h1>
            <p className="text-xl text-gray-400">Armemos juntos tu lista de compras</p>
          </div>
        ) : (
          products.map((product: Product, index: number) => (
            <Card key={index} className="shadow-sm bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className={`w-10 h-10 rounded-full ${getProductColor(product.name)} flex items-center justify-center text-lg`}>
                      {getProductIcon(product.name)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-100">{product.name}</h3>
                    </div>
                  </div>
                  
                  {/* Quantity Selector and Delete */}
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-8 h-8 p-0"
                      onClick={() => handleQuantityChange(index, product.quantity - 1)}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <div className="w-12 text-center">
                      <span className="font-medium text-gray-100">{product.quantity}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-8 h-8 p-0"
                      onClick={() => handleQuantityChange(index, product.quantity + 1)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {products.length > 0 && (
        <div className="flex justify-center">
          <Button 
            onClick={handleComparePrices}
            disabled={isComparing || products.length === 0}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 flex items-center space-x-2 disabled:opacity-50"
          >
            {isComparing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Comparando...</span>
              </>
            ) : (
              <>
                <Rocket className="w-4 h-4" />
                <span>Descubrí el mejor precio</span>
              </>
            )}
          </Button>
        </div>
      )}
      {/* Chat Interface */}
      <div className="bg-gray-800 p-4 m-4 rounded-lg">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu lista de compras..."
            className="w-full text-base text-gray-100 placeholder-gray-400 border border-none focus:outline-none focus:ring-none focus:ring-transparent resize-none"
            disabled={isLoading}
          />
          <div className="flex items-center justify-between">
            {/* <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2 text-gray-300 hover:text-white">
                  <Plus className="w-6 h-6" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2" sideOffset={10}>
                <div className="space-y-1">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-sm"
                    onClick={() => setImageMethod("clip")}
                  >
                    Clip imagen
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-sm"
                    onClick={() => setImageMethod("camera")}
                  >
                    Camera
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-sm"
                    onClick={() => setImageMethod("file")}
                  >
                    File
                  </Button>
                </div>
              </PopoverContent>
            </Popover> */}

            <div className="flex items-center">
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="text-white w-4"
              >
                <Camera className="w-9 h-9" />
              </Button>
            </div>

            <div className="flex items-center">
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="ml-2 text-white"
              >
                <Mic className="w-9 h-9" />
              </Button>
                <Button
                  type="submit"
                  variant="default"
                  size="icon"
                  className={`ml-2 rounded-sm ${
                    !input.trim() || isLoading
                      ? 'bg-gray-700'
                      : 'bg-white'
                  }`}
                  disabled={!input.trim() || isLoading}
                >
                  <ArrowUp
                    className={`w-9 h-9 ${
                      !input.trim() || isLoading
                        ? 'text-gray-400'
                        : 'text-black'
                    }`}
                  />
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
