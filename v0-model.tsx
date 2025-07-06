"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Send,
  User,
  Trash2,
  Plus,
  Minus,
  CheckCircle,
  Sparkles,
  ShoppingBag,
  Settings,
  Mic,
  Volume2,
  ShoppingBasket,
  Coffee,
  Utensils,
  Apple,
} from "lucide-react"

// ==================== TYPES ====================
interface Product {
  id: string
  name: string
  brand: string
  size: string
  price: number
  category: string
  keywords: string[]
  image: string
  available: boolean
  store: string
  description?: string
}

interface CartItem {
  id: string
  name: string
  quantity: number
  category: string
  price: number
  brand: string
  size: string
}

// ==================== DATABASE ====================
const PRODUCT_DATABASE: Product[] = [
  // LÁCTEOS
  {
    id: "leche-serenisima-1l",
    name: "Leche La Serenísima Entera 1L",
    brand: "La Serenísima",
    size: "1L",
    price: 890,
    category: "Lácteos",
    keywords: ["leche", "entera", "serenisima", "lacteo"],
    image: "/placeholder.svg?height=100&width=100",
    available: true,
    store: "Coto",
    description: "Leche entera pasteurizada",
  },
  {
    id: "leche-sancor-desc-1l",
    name: "Leche Sancor Descremada 1L",
    brand: "Sancor",
    size: "1L",
    price: 850,
    category: "Lácteos",
    keywords: ["leche", "descremada", "sancor", "lacteo"],
    image: "/placeholder.svg?height=100&width=100",
    available: true,
    store: "Coto",
  },
  {
    id: "yogur-serenisima-natural",
    name: "Yogur La Serenísima Natural 1kg",
    brand: "La Serenísima",
    size: "1kg",
    price: 1250,
    category: "Lácteos",
    keywords: ["yogur", "natural", "serenisima", "lacteo"],
    image: "/placeholder.svg?height=100&width=100",
    available: true,
    store: "Coto",
  },
  {
    id: "queso-cremoso-la-paulina",
    name: "Queso Cremoso La Paulina 300g",
    brand: "La Paulina",
    size: "300g",
    price: 2100,
    category: "Lácteos",
    keywords: ["queso", "cremoso", "paulina", "lacteo"],
    image: "/placeholder.svg?height=100&width=100",
    available: true,
    store: "Coto",
  },
  {
    id: "manteca-la-serenisima",
    name: "Manteca La Serenísima 200g",
    brand: "La Serenísima",
    size: "200g",
    price: 980,
    category: "Lácteos",
    keywords: ["manteca", "serenisima", "lacteo"],
    image: "/placeholder.svg?height=100&width=100",
    available: true,
    store: "Coto",
  },

  // PANADERÍA
  {
    id: "pan-lactal-bimbo",
    name: "Pan Lactal Bimbo Grande",
    brand: "Bimbo",
    size: "Grande",
    price: 1200,
    category: "Panadería",
    keywords: ["pan", "lactal", "bimbo", "panaderia"],
    image: "/placeholder.svg?height=100&width=100",
    available: true,
    store: "Coto",
  },
  {
    id: "pan-lactal-fargo-integral",
    name: "Pan Lactal Fargo Integral",
    brand: "Fargo",
    size: "Mediano",
    price: 1350,
    category: "Panadería",
    keywords: ["pan", "lactal", "integral", "fargo", "panaderia"],
    image: "/placeholder.svg?height=100&width=100",
    available: true,
    store: "Coto",
  },
  {
    id: "galletitas-oreo",
    name: "Galletitas Oreo Original 118g",
    brand: "Oreo",
    size: "118g",
    price: 850,
    category: "Panadería",
    keywords: ["galletitas", "oreo", "dulces", "panaderia"],
    image: "/placeholder.svg?height=100&width=100",
    available: true,
    store: "Coto",
  },

  // CARNES Y FRESCOS
  {
    id: "carne-picada-especial",
    name: "Carne Picada Especial 1kg",
    brand: "Coto",
    size: "1kg",
    price: 3200,
    category: "Carnes",
    keywords: ["carne", "picada", "especial", "kilo", "fresco"],
    image: "/placeholder.svg?height=100&width=100",
    available: true,
    store: "Coto",
  },
  {
    id: "nalga-milanesas",
    name: "Nalga para Milanesas 1kg",
    brand: "Coto",
    size: "1kg",
    price: 4500,
    category: "Carnes",
    keywords: ["nalga", "milanesas", "carne", "kilo", "fresco"],
    image: "/placeholder.svg?height=100&width=100",
    available: true,
    store: "Coto",
  },
  {
    id: "pollo-entero",
    name: "Pollo Entero Fresco 1.5kg",
    brand: "Coto",
    size: "1.5kg aprox",
    price: 2800,
    category: "Carnes",
    keywords: ["pollo", "entero", "fresco", "ave"],
    image: "/placeholder.svg?height=100&width=100",
    available: true,
    store: "Coto",
  },
  {
    id: "huevos-blancos-12",
    name: "Huevos Blancos x12 Granja del Sol",
    brand: "Granja del Sol",
    size: "12 unidades",
    price: 1450,
    category: "Frescos",
    keywords: ["huevos", "blancos", "docena", "granja", "fresco"],
    image: "/placeholder.svg?height=100&width=100",
    available: true,
    store: "Coto",
  },

  // FRUTAS Y VERDURAS
  {
    id: "banana-ecuador",
    name: "Banana Ecuador 1kg",
    brand: "Coto",
    size: "1kg",
    price: 890,
    category: "Frutas",
    keywords: ["banana", "ecuador", "fruta", "kilo"],
    image: "/placeholder.svg?height=100&width=100",
    available: true,
    store: "Coto",
  },
  {
    id: "manzana-roja",
    name: "Manzana Roja 1kg",
    brand: "Coto",
    size: "1kg",
    price: 1200,
    category: "Frutas",
    keywords: ["manzana", "roja", "fruta", "kilo"],
    image: "/placeholder.svg?height=100&width=100",
    available: true,
    store: "Coto",
  },
  {
    id: "papa-blanca",
    name: "Papa Blanca 1kg",
    brand: "Coto",
    size: "1kg",
    price: 650,
    category: "Verduras",
    keywords: ["papa", "blanca", "verdura", "kilo"],
    image: "/placeholder.svg?height=100&width=100",
    available: true,
    store: "Coto",
  },
  {
    id: "cebolla-blanca",
    name: "Cebolla Blanca 1kg",
    brand: "Coto",
    size: "1kg",
    price: 580,
    category: "Verduras",
    keywords: ["cebolla", "blanca", "verdura", "kilo"],
    image: "/placeholder.svg?height=100&width=100",
    available: true,
    store: "Coto",
  },
  {
    id: "tomate-perita",
    name: "Tomate Perita 1kg",
    brand: "Coto",
    size: "1kg",
    price: 1100,
    category: "Verduras",
    keywords: ["tomate", "perita", "verdura", "kilo"],
    image: "/placeholder.svg?height=100&width=100",
    available: true,
    store: "Coto",
  },
  {
    id: "lechuga-criolla",
    name: "Lechuga Criolla Unidad",
    brand: "Coto",
    size: "1 unidad",
    price: 450,
    category: "Verduras",
    keywords: ["lechuga", "criolla", "verdura", "unidad"],
    image: "/placeholder.svg?height=100&width=100",
    available: true,
    store: "Coto",
  },

  // ALMACÉN
  {
    id: "arroz-gallo-oro",
    name: "Arroz Gallo Oro 1kg",
    brand: "Gallo",
    size: "1kg",
    price: 950,
    category: "Almacén",
    keywords: ["arroz", "gallo", "oro", "kilo", "almacen"],
    image: "/placeholder.svg?height=100&width=100",
    available: true,
    store: "Coto",
  },
  {
    id: "fideos-matarazzo",
    name: "Fideos Matarazzo Spaghetti 500g",
    brand: "Matarazzo",
    size: "500g",
    price: 870,
    category: "Pastas",
    keywords: ["fideos", "matarazzo", "spaghetti", "pasta", "almacen"],
    image: "/placeholder.svg?height=100&width=100",
    available: true,
    store: "Coto",
  },
  {
    id: "aceite-natura",
    name: "Aceite Natura Girasol 900ml",
    brand: "Natura",
    size: "900ml",
    price: 1890,
    category: "Aceites",
    keywords: ["aceite", "natura", "girasol", "almacen"],
    image: "/placeholder.svg?height=100&width=100",
    available: true,
    store: "Coto",
  },
  {
    id: "sal-celusal",
    name: "Sal Fina Celusal 1kg",
    brand: "Celusal",
    size: "1kg",
    price: 320,
    category: "Condimentos",
    keywords: ["sal", "fina", "celusal", "condimento", "almacen"],
    image: "/placeholder.svg?height=100&width=100",
    available: true,
    store: "Coto",
  },
  {
    id: "azucar-ledesma",
    name: "Azúcar Ledesma 1kg",
    brand: "Ledesma",
    size: "1kg",
    price: 780,
    category: "Endulzantes",
    keywords: ["azucar", "ledesma", "kilo", "endulzante", "almacen"],
    image: "/placeholder.svg?height=100&width=100",
    available: true,
    store: "Coto",
  },
  {
    id: "harina-0000-morixe",
    name: "Harina 0000 Morixe 1kg",
    brand: "Morixe",
    size: "1kg",
    price: 650,
    category: "Harinas",
    keywords: ["harina", "0000", "morixe", "kilo", "almacen"],
    image: "/placeholder.svg?height=100&width=100",
    available: true,
    store: "Coto",
  },

  // CONDIMENTOS Y ESPECIAS
  {
    id: "pan-rallado-favorita",
    name: "Pan Rallado Favorita 500g",
    brand: "Favorita",
    size: "500g",
    price: 650,
    category: "Condimentos",
    keywords: ["pan", "rallado", "favorita", "condimento", "milanesas"],
    image: "/placeholder.svg?height=100&width=100",
    available: true,
    store: "Coto",
  },
  {
    id: "oregano-alicante",
    name: "Orégano Alicante 25g",
    brand: "Alicante",
    size: "25g",
    price: 280,
    category: "Condimentos",
    keywords: ["oregano", "alicante", "condimento", "especia"],
    image: "/placeholder.svg?height=100&width=100",
    available: true,
    store: "Coto",
  },
  {
    id: "ajo-en-polvo",
    name: "Ajo en Polvo Alicante 100g",
    brand: "Alicante",
    size: "100g",
    price: 420,
    category: "Condimentos",
    keywords: ["ajo", "polvo", "alicante", "condimento", "especia"],
    image: "/placeholder.svg?height=100&width=100",
    available: true,
    store: "Coto",
  },

  // BEBIDAS
  {
    id: "coca-cola-2l",
    name: "Coca Cola Original 2L",
    brand: "Coca Cola",
    size: "2L",
    price: 1450,
    category: "Bebidas",
    keywords: ["coca", "cola", "gaseosa", "bebida", "2l"],
    image: "/placeholder.svg?height=100&width=100",
    available: true,
    store: "Coto",
  },
  {
    id: "agua-villa-del-sur",
    name: "Agua Villa del Sur 2L",
    brand: "Villa del Sur",
    size: "2L",
    price: 650,
    category: "Bebidas",
    keywords: ["agua", "villa", "sur", "bebida", "2l"],
    image: "/placeholder.svg?height=100&width=100",
    available: true,
    store: "Coto",
  },
  {
    id: "jugo-baggio-naranja",
    name: "Jugo Baggio Naranja 1L",
    brand: "Baggio",
    size: "1L",
    price: 890,
    category: "Bebidas",
    keywords: ["jugo", "baggio", "naranja", "bebida", "1l"],
    image: "/placeholder.svg?height=100&width=100",
    available: true,
    store: "Coto",
  },

  // LIMPIEZA
  {
    id: "detergente-magistral",
    name: "Detergente Magistral 750ml",
    brand: "Magistral",
    size: "750ml",
    price: 1200,
    category: "Limpieza",
    keywords: ["detergente", "magistral", "limpieza", "lavar"],
    image: "/placeholder.svg?height=100&width=100",
    available: true,
    store: "Coto",
  },
  {
    id: "lavandina-ayudin",
    name: "Lavandina Ayudín 1L",
    brand: "Ayudín",
    size: "1L",
    price: 580,
    category: "Limpieza",
    keywords: ["lavandina", "ayudin", "limpieza", "blanqueador"],
    image: "/placeholder.svg?height=100&width=100",
    available: true,
    store: "Coto",
  },
  {
    id: "papel-higienico-higienol",
    name: "Papel Higiénico Higienol x4",
    brand: "Higienol",
    size: "4 rollos",
    price: 1350,
    category: "Higiene",
    keywords: ["papel", "higienico", "higienol", "baño", "rollos"],
    image: "/placeholder.svg?height=100&width=100",
    available: true,
    store: "Coto",
  },

  // DESAYUNO Y MERIENDA
  {
    id: "cafe-la-virginia",
    name: "Café La Virginia Molido 250g",
    brand: "La Virginia",
    size: "250g",
    price: 1450,
    category: "Desayuno",
    keywords: ["cafe", "virginia", "molido", "desayuno", "merienda"],
    image: "/placeholder.svg?height=100&width=100",
    available: true,
    store: "Coto",
  },
  {
    id: "te-la-virginia",
    name: "Té La Virginia x25 saquitos",
    brand: "La Virginia",
    size: "25 saquitos",
    price: 890,
    category: "Desayuno",
    keywords: ["te", "virginia", "saquitos", "desayuno", "merienda"],
    image: "/placeholder.svg?height=100&width=100",
    available: true,
    store: "Coto",
  },
  {
    id: "mermelada-arcor-durazno",
    name: "Mermelada Arcor Durazno 390g",
    brand: "Arcor",
    size: "390g",
    price: 980,
    category: "Desayuno",
    keywords: ["mermelada", "arcor", "durazno", "dulce", "desayuno"],
    image: "/placeholder.svg?height=100&width=100",
    available: true,
    store: "Coto",
  },
  {
    id: "cereales-nesquik",
    name: "Cereales Nesquik 340g",
    brand: "Nesquik",
    size: "340g",
    price: 1650,
    category: "Desayuno",
    keywords: ["cereales", "nesquik", "chocolate", "desayuno"],
    image: "/placeholder.svg?height=100&width=100",
    available: true,
    store: "Coto",
  },
]

// ==================== COMPONENTS ====================

// Mouse Logo Component
interface MouseLogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  animated?: boolean
}

function MouseLogo({ size = "md", className = "", animated = false }: MouseLogoProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-24 w-24",
  }

  return (
    <div className={`${sizeClasses[size]} ${className} ${animated ? "animate-bounce" : ""}`}>
      <img src="/images/logo-ratita.png" alt="Ratita Mascot" className="w-full h-full object-contain" />
    </div>
  )
}

// Voice Button Component
interface VoiceButtonProps {
  onStartRecording: () => void
  onStopRecording: () => void
  isRecording: boolean
  disabled?: boolean
  size?: "sm" | "md" | "lg" | "xl"
}

function VoiceButton({ onStartRecording, onStopRecording, isRecording, disabled, size = "md" }: VoiceButtonProps) {
  const [pulseIntensity, setPulseIntensity] = useState(0)
  const isPressedRef = useRef(false)
  const [isPressed, setIsPressed] = useState(false)

  const sizeClasses = {
    sm: "h-10 w-10",
    md: "h-12 w-12",
    lg: "h-14 w-14",
    xl: "h-16 w-16",
  }

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
    xl: "h-7 w-7",
  }

  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setPulseIntensity(Math.random())
      }, 150)
      return () => clearInterval(interval)
    }
  }, [isRecording])

  // Global event listeners
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isPressedRef.current && !disabled) {
        isPressedRef.current = false
        setIsPressed(false)
        onStopRecording()
      }
    }

    const handleGlobalTouchEnd = () => {
      if (isPressedRef.current && !disabled) {
        isPressedRef.current = false
        setIsPressed(false)
        onStopRecording()
      }
    }

    document.addEventListener("mouseup", handleGlobalMouseUp, { capture: true })
    document.addEventListener("touchend", handleGlobalTouchEnd, { capture: true })
    document.addEventListener("touchcancel", handleGlobalTouchEnd, { capture: true })

    return () => {
      document.removeEventListener("mouseup", handleGlobalMouseUp, { capture: true })
      document.removeEventListener("touchend", handleGlobalTouchEnd, { capture: true })
      document.removeEventListener("touchcancel", handleGlobalTouchEnd, { capture: true })
    }
  }, [disabled, onStopRecording])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (disabled) return

      isPressedRef.current = true
      setIsPressed(true)
      onStartRecording()
    },
    [disabled, onStartRecording],
  )

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (disabled) return

      isPressedRef.current = true
      setIsPressed(true)
      onStartRecording()
    },
    [disabled, onStartRecording],
  )

  return (
    <div className="relative">
      {/* Animated rings when recording */}
      {isRecording && (
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 to-pink-600 animate-ping"
          style={{
            opacity: 0.4 + pulseIntensity * 0.3,
          }}
        />
      )}

      {/* Main button */}
      <Button
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        disabled={disabled}
        size="lg"
        className={`
          relative z-10 ${sizeClasses[size]} rounded-full p-0 transition-all duration-200 transform select-none
          ${
            isRecording
              ? "bg-gradient-to-r from-red-500 to-pink-600 scale-110 shadow-xl shadow-red-500/50"
              : isPressed
                ? "bg-gradient-to-r from-violet-700 to-purple-800 scale-105 shadow-lg shadow-violet-500/40"
                : "bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 active:scale-95 shadow-lg shadow-violet-500/30"
          }
          border-0
        `}
        style={{
          touchAction: "none",
          userSelect: "none",
          WebkitUserSelect: "none",
          WebkitTouchCallout: "none",
        }}
      >
        <Mic className={`${iconSizes[size]} text-white ${isRecording ? "animate-pulse" : ""}`} />
      </Button>

      {/* Recording indicator */}
      {isRecording && (
        <div className="absolute -top-1 -right-1 z-20">
          <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse">
            <div className="h-full w-full bg-red-400 rounded-full animate-pulse" />
          </div>
        </div>
      )}
    </div>
  )
}

// Voice Recording Modal Component
interface VoiceRecordingModalProps {
  isOpen: boolean
  onClose: () => void
  onStartRecording?: () => void
  onStopRecording?: () => void
  isRecording: boolean
}

function VoiceRecordingModal({ isOpen, onClose, isRecording }: VoiceRecordingModalProps) {
  const [audioLevels, setAudioLevels] = useState<number[]>([])

  useEffect(() => {
    if (isOpen && isRecording) {
      const interval = setInterval(() => {
        const newLevels = Array.from({ length: 8 }, () => Math.random() * 100)
        setAudioLevels(newLevels)
      }, 100)
      return () => clearInterval(interval)
    }
  }, [isOpen, isRecording])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none">
      {/* Subtle backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Compact content */}
      <div className="relative z-10 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 mx-4 max-w-sm">
        {/* Mouse mascot */}
        <div className="text-center mb-4">
          <MouseLogo size="lg" className="mx-auto mb-3" animated />
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Volume2 className="h-4 w-4 text-cyan-400 animate-pulse" />
            <h3 className="text-lg font-bold text-white">{isRecording ? "Escuchando..." : "Listo"}</h3>
          </div>
          <p className="text-white/70 text-sm">
            {isRecording ? "Dime qué necesitas comprar" : "Mantén presionado para hablar"}
          </p>
        </div>

        {/* Audio visualization */}
        {isRecording && (
          <div className="flex items-end justify-center space-x-1 h-12 mb-4">
            {audioLevels.map((level, index) => (
              <div
                key={index}
                className="bg-gradient-to-t from-cyan-500 to-purple-600 rounded-full transition-all duration-100 ease-out"
                style={{
                  width: "3px",
                  height: `${Math.max(6, level * 0.4)}px`,
                  opacity: 0.7 + (level / 100) * 0.3,
                }}
              />
            ))}
          </div>
        )}

        {/* Status indicator */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-white/10 rounded-full px-3 py-1">
            <div className={`w-2 h-2 rounded-full ${isRecording ? "bg-red-500 animate-pulse" : "bg-gray-400"}`} />
            <span className="text-xs text-white/80">{isRecording ? "Grabando" : "En espera"}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Chat Suggestions Component
interface ChatSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void
}

function ChatSuggestions({ onSuggestionClick }: ChatSuggestionsProps) {
  const suggestions = [
    {
      icon: <Utensils className="h-5 w-5" />,
      title: "Ingredientes para milanesas",
      description: "Carne, pan rallado, huevos...",
      prompt: "Necesito ingredientes para hacer milanesas para 4 personas",
      gradient: "from-red-500 to-pink-600",
    },
    {
      icon: <Coffee className="h-5 w-5" />,
      title: "Desayuno completo",
      description: "Leche, pan, mermelada...",
      prompt: "Quiero armar un desayuno completo para toda la semana",
      gradient: "from-amber-500 to-orange-600",
    },
    {
      icon: <Apple className="h-5 w-5" />,
      title: "Frutas y verduras",
      description: "Productos frescos de temporada",
      prompt: "Necesito frutas y verduras frescas para la semana",
      gradient: "from-green-500 to-emerald-600",
    },
    {
      icon: <ShoppingBasket className="h-5 w-5" />,
      title: "Compra mensual",
      description: "Productos básicos del hogar",
      prompt: "Ayudame a armar una lista de compras mensual con productos básicos",
      gradient: "from-blue-500 to-cyan-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {suggestions.map((suggestion, index) => (
        <Card
          key={index}
          className="cursor-pointer hover:scale-105 transition-all duration-300 bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 group"
          onClick={() => onSuggestionClick(suggestion.prompt)}
        >
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div
                className={`w-10 h-10 bg-gradient-to-r ${suggestion.gradient} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
              >
                {suggestion.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-white mb-1 group-hover:text-cyan-300 transition-colors">
                  {suggestion.title}
                </h4>
                <p className="text-xs text-white/60 group-hover:text-white/80 transition-colors">
                  {suggestion.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// ==================== MAIN COMPONENT ====================
export default function RatitaChat() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [lastAddedProduct, setLastAddedProduct] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [showVoiceModal, setShowVoiceModal] = useState(false)
  const [userName] = useState("Lucas")
  const recordingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: "/api/chat",
    onError: (error) => {
      console.error("💥 Chat error:", error)
    },
    onFinish: (message) => {
      console.log("✅ Message finished:", message.content)

      try {
        const content = message.content
        const lines = content.split("\n")
        const productLines = lines.filter((line) => line.trim().startsWith("PRODUCT:"))

        productLines.forEach((line) => {
          const productName = line.replace("PRODUCT:", "").trim()
          if (productName) {
            addToCart(productName)
            setLastAddedProduct(productName)
            setTimeout(() => setLastAddedProduct(null), 3000)
          }
        })
      } catch (error) {
        console.error("💥 Error parsing AI response:", error)
      }
    },
  })

  const addToCart = (productName: string) => {
    const product = PRODUCT_DATABASE.find(
      (p) =>
        p.name.toLowerCase() === productName.toLowerCase() ||
        p.name.includes(productName) ||
        productName.includes(p.name),
    )

    if (!product) {
      console.warn("Product not found in database:", productName)
      return false
    }

    const existingItem = cart.find((item) => item.name.toLowerCase() === productName.toLowerCase())

    if (existingItem) {
      setCart((prevCart) =>
        prevCart.map((item) => (item.id === existingItem.id ? { ...item, quantity: item.quantity + 1 } : item)),
      )
    } else {
      const newItem: CartItem = {
        id: product.id,
        name: product.name,
        quantity: 1,
        category: product.category,
        price: product.price,
        brand: product.brand,
        size: product.size,
      }
      setCart((prevCart) => [...prevCart, newItem])
    }
    return true
  }

  const updateQuantity = (id: string, change: number) => {
    setCart(
      (prevCart) =>
        prevCart
          .map((item) => {
            if (item.id === id) {
              const newQuantity = Math.max(0, item.quantity + change)
              return newQuantity === 0 ? null : { ...item, quantity: newQuantity }
            }
            return item
          })
          .filter(Boolean) as CartItem[],
    )
  }

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id))
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleSuggestionClick = (suggestion: string) => {
    handleInputChange({ target: { value: suggestion } } as any)
    setTimeout(() => {
      handleSubmit({ preventDefault: () => {} } as any)
    }, 100)
  }

  const handleStartRecording = () => {
    if (isRecording) return
    console.log("🎤 Started recording")
    setIsRecording(true)
    setShowVoiceModal(true)
  }

  const handleStopRecording = () => {
    if (!isRecording) return
    console.log("🎤 Stopped recording")
    setIsRecording(false)
    setShowVoiceModal(false)

    // Simulate processing
    setTimeout(() => {
      const voiceInputs = [
        "Necesito ingredientes para hacer milanesas",
        "Quiero comprar frutas y verduras",
        "Necesito productos para el desayuno",
        "Quiero hacer una compra básica",
      ]
      const randomInput = voiceInputs[Math.floor(Math.random() * voiceInputs.length)]
      handleInputChange({ target: { value: randomInput } } as any)
      setTimeout(() => {
        handleSubmit({ preventDefault: () => {} } as any)
      }, 500)
    }, 800)
  }

  const clearCart = () => {
    setCart([])
  }

  const exportList = () => {
    const listText = cart.map((item) => `${item.quantity}x ${item.name} - $${item.price * item.quantity}`).join("\n")
    const totalText = `\n\nTotal: ${totalItems} productos - $${totalPrice.toLocaleString()}`

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

  useEffect(() => {
    return () => {
      if (recordingTimeoutRef.current) {
        clearTimeout(recordingTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      {/* Voice Recording Modal */}
      <VoiceRecordingModal
        isOpen={showVoiceModal}
        onClose={() => setShowVoiceModal(false)}
        onStartRecording={handleStartRecording}
        onStopRecording={handleStopRecording}
        isRecording={isRecording}
      />

      {/* Mobile Header */}
      <header className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MouseLogo size="sm" />
            <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Ratita
            </span>
          </div>

          <div className="flex items-center space-x-3">
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
      </header>

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

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
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

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <MouseLogo size="xl" className="mx-auto mb-6" animated />
              <h3 className="text-2xl font-bold text-white mb-4">¿Qué vamos a comprar hoy?</h3>
              <p className="text-white/70 mb-6">Elegí una opción rápida o háblame</p>
              <ChatSuggestions onSuggestionClick={handleSuggestionClick} />
            </div>
          )}

          {messages.map((message, index) => (
            <div key={message.id} className="space-y-3">
              {/* Message */}
              <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-violet-600 to-purple-700 text-white shadow-lg"
                      : "bg-white/10 text-white backdrop-blur-sm border border-white/20"
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.role === "assistant" && <MouseLogo size="sm" />}
                    {message.role === "user" && <User className="h-4 w-4 mt-1 flex-shrink-0" />}
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content.replace(/PRODUCT:\s*[^\n\r]+/g, "").trim()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Show added products after assistant messages */}
              {message.role === "assistant" && index === messages.length - 1 && cart.length > 0 && (
                <div className="space-y-2">
                  <p className="text-white/60 text-xs px-2">Productos en tu lista:</p>
                  <div className="grid gap-2">
                    {cart.slice(-3).map((item) => (
                      <Card key={item.id} className="bg-white/5 border-white/10 backdrop-blur-sm">
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-white truncate">{item.name}</p>
                              <div className="flex items-center space-x-2 text-xs text-white/60">
                                <span>{item.brand}</span>
                                <span>•</span>
                                <span className="font-semibold text-green-400">${item.price}</span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2 ml-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQuantity(item.id, -1)}
                                className="h-7 w-7 p-0 bg-white/10 border-white/20 text-white hover:bg-white/20"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>

                              <span className="text-sm font-medium w-6 text-center text-white">{item.quantity}</span>

                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQuantity(item.id, 1)}
                                className="h-7 w-7 p-0 bg-white/10 border-white/20 text-white hover:bg-white/20"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>

                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeFromCart(item.id)}
                                className="h-7 w-7 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {cart.length > 3 && (
                      <p className="text-white/50 text-xs text-center">y {cart.length - 3} productos más...</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/20">
                <div className="flex items-center space-x-2">
                  <MouseLogo size="sm" animated />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area - Fixed at bottom */}
        <div className="border-t border-white/10 bg-black/20 backdrop-blur-xl">
          {/* Cart Summary Bar */}
          {cart.length > 0 && (
            <div className="px-4 py-2 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="h-4 w-4 text-cyan-400" />
                  <span className="text-sm text-white">{totalItems} productos</span>
                  <span className="text-sm text-white/60">•</span>
                  <span className="text-sm font-semibold text-green-400">${totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={clearCart}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/20 h-8 px-3"
                  >
                    Limpiar
                  </Button>
                  <Button
                    size="sm"
                    onClick={exportList}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 h-8 px-4"
                  >
                    Exportar
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4">
            <form onSubmit={handleSubmit} className="flex items-center space-x-3">
              <div className="flex-1 relative">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Dime qué necesitas comprar..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pr-12 h-12 rounded-xl backdrop-blur-sm focus:bg-white/20 focus:border-violet-400"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 h-8 w-8 p-0 rounded-lg"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              {/* Voice Button */}
              <VoiceButton
                onStartRecording={handleStartRecording}
                onStopRecording={handleStopRecording}
                isRecording={isRecording}
                disabled={isLoading}
                size="md"
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
