"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Edit3, Plus, SlidersHorizontal, Mic, AudioWaveform, Send, CircleArrowUp } from "lucide-react"

interface Product {
  id: string
  name: string
  brand: string
  quantity: string
  icon: string
  color: string
}

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
}

interface ChatEvent {
  type: "ADD_ITEMS" | "REMOVE_ITEMS" | "UPDATE_ITEMS" | "REMOVE_ALL"
  items?: Product[]
  ids?: string[]
}

export default function SupermarketChat() {
  const [products, setProducts] = useState<Product[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [imageMethod, setImageMethod] = useState<string>("")

  const [isLoading, setIsLoading] = useState(false)

  // Load initial products
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/chat')
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Failed to fetch products:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input })
      })

      const data = await response.json()
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message
      }

      setMessages(prev => [...prev, assistantMessage])
      
      // Apply events to update products
      if (data.events) {
        data.events.forEach((event: ChatEvent) => {
          switch (event.type) {
            case 'ADD_ITEMS':
              if (event.items) {
                setProducts(prev => [...prev, ...event.items!])
              }
              break
            case 'REMOVE_ITEMS':
              if (event.ids) {
                setProducts(prev => prev.filter(product => !event.ids!.includes(product.id)))
              }
              break
            case 'UPDATE_ITEMS':
              if (event.items) {
                setProducts(prev => prev.map(product => {
                  const updatedItem = event.items!.find(item => item.id === product.id)
                  return updatedItem || product
                }))
              }
              break
            case 'REMOVE_ALL':
              setProducts([])
              break
          }
        })
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Lo siento, hubo un error al procesar tu mensaje."
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">

      {/* Product List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {products.map((product: Product) => (
          <Card key={product.id} className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-full ${product.color} flex items-center justify-center text-xl`}>
                    {product.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.brand}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{product.quantity}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chat Messages */}
      {/* {messages.length > 0 && (
        <div className="bg-white border-t p-4 max-h-40 overflow-y-auto">
          <div className="space-y-2">
            {messages.slice(-3).map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      )} */}

      {/* Chat Interface */}
      <div className="bg-white p-4 border-t">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask anything"
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
            <button type="button" className="p-2 text-gray-700 hover:text-black focus:outline-none">
              <Mic className="w-6 h-6" />
            </button>
            {input ? (
              <div className="p-2 bg-black rounded-full text-white flex items-center justify-center ml-2 disabled:opacity-50">
                <CircleArrowUp className="w-6 h-6" />
              </div>
            ) : (
              <button type="submit" className="p-2 bg-black rounded-full text-white flex items-center justify-center ml-2 disabled:opacity-50" disabled={!input.trim() || isLoading}>
                <AudioWaveform className="w-6 h-6" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
