"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Edit3, Plus, SlidersHorizontal, Mic, AudioWaveform, Send, CircleArrowUp, ShoppingCart, Menu } from "lucide-react"
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
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Topbar Navigation */}
      <div className="bg-white shadow-sm border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="p-2">
              <Menu className="w-5 h-5" />
              
            </Button>
            <div>
              <p className="text-sm text-gray-500">Ya ahorraste $62.520</p>
            </div>
          </div>
          
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
                <ShoppingCart className="w-4 h-4" />
                <span>Ahorrar</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Product List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {products.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Tu lista de compras está vacía</p>
            <p className="text-sm">Escribe algo como "agregame leche y pan" para empezar</p>
          </div>
        ) : (
          products.map((product: Product, index: number) => (
            <Card key={index} className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-full ${getProductColor(product.name)} flex items-center justify-center text-xl`}>
                      {getProductIcon(product.name)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-500">Cantidad: {product.quantity}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Chat Interface */}
      <div className="bg-white p-4 border-t">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Escribe tu lista de compras..."
            className="w-full rounded-2xl bg-gray-100 px-4 py-3 text-base text-gray-900 placeholder-gray-400 shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <div className="flex items-center justify-between px-2 pt-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2 text-gray-700 hover:text-black">
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
            </Popover>

            {/* <button type="button" className="p-2 text-gray-700 hover:text-black focus:outline-none">
              <Mic className="w-6 h-6" />
            </button> */}
            {input ? (
              <button type="submit" className="p-2 bg-black rounded-full text-white flex items-center justify-center ml-2 disabled:opacity-50" disabled={!input.trim() || isLoading}>
                <CircleArrowUp className="w-6 h-6" />
              </button>
            ) : (
              <button type="submit" className="p-2 rounded-full text-black flex items-center justify-center ml-2" disabled={!input.trim() || isLoading}>
                <Mic className="w-6 h-6" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
