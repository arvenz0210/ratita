import React, { useState, useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mic, Volume2, Utensils, Coffee, Apple, ShoppingBasket } from "lucide-react"

// Mouse Logo Component (Ratita Mascot)
interface MouseLogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  animated?: boolean
}

export function MouseLogo({ size = "md", className = "", animated = false }: MouseLogoProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-24 w-24",
  }

  return (
    <div className={`${sizeClasses[size]} ${className} ${animated ? "animate-bounce" : ""}`}>
      <Image src="/logo.png" alt="Ratita Mascot" className="w-full h-full object-contain" width={48} height={48} />
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

export function VoiceButton({ onStartRecording, onStopRecording, isRecording, disabled, size = "md" }: VoiceButtonProps) {
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
      {isRecording && (
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 to-pink-600 animate-ping"
          style={{
            opacity: 0.4 + pulseIntensity * 0.3,
          }}
        />
      )}

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
  isRecording: boolean
}

export function VoiceRecordingModal({ isOpen, isRecording }: VoiceRecordingModalProps) {
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
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative z-10 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 mx-4 max-w-sm">
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

export function ChatSuggestions({ onSuggestionClick }: ChatSuggestionsProps) {
  const suggestions = [
    {
      icon: <Utensils className="h-5 w-5" />,
      title: "Ingredientes para milanesas",
      description: "Carne, pan rallado, huevos...",
      prompt: "Ingredientes para milanesas",
      gradient: "from-red-500 to-pink-600",
    },
    {
      icon: <Coffee className="h-5 w-5" />,
      title: "Desayuno completo",
      description: "Leche, pan, mermelada...",
      prompt: "Desayuno completo",
      gradient: "from-amber-500 to-orange-600",
    },
    {
      icon: <Apple className="h-5 w-5" />,
      title: "Frutas y verduras",
      description: "Productos frescos de temporada",
      prompt: "Frutas y verduras",
      gradient: "from-green-500 to-emerald-600",
    },
    {
      icon: <ShoppingBasket className="h-5 w-5" />,
      title: "Compra mensual",
      description: "Productos básicos del hogar",
      prompt: "Compra mensual",
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