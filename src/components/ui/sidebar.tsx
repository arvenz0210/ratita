"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { 
  Home, 
  ShoppingCart, 
  BarChart3, 
  Package, 
  CheckCircle, 
  X, 
  Menu,
  User,
  Settings,
  HelpCircle,
  History
} from "lucide-react"
import { useRouter, usePathname } from "next/navigation"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

interface MenuItem {
  icon: React.ReactNode
  label: string
  path: string
  description?: string
}

const menuItems: MenuItem[] = [
  {
    icon: <Home className="w-5 h-5" />,
    label: "Lista de Compras",
    path: "/",
    description: "Crea tu lista de compras"
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    label: "Comparar Precios",
    path: "/comparison",
    description: "Compara precios entre supermercados"
  },
  {
    icon: <History className="w-5 h-5" />,
    label: "Historial de Pedidos",
    path: "/order-history",
    description: "Tus pedidos confirmados"
  },
  {
    icon: <ShoppingCart className="w-5 h-5" />,
    label: "Mis Listas",
    path: "/shopping-list",
    description: "Historial de listas guardadas"
  },
  {
    icon: <Package className="w-5 h-5" />,
    label: "Confirmación de Envío",
    path: "/shipment-confirmation",
    description: "Confirma tu pedido"
  },
  {
    icon: <CheckCircle className="w-5 h-5" />,
    label: "Pedido Confirmado",
    path: "/shipment-congrats",
    description: "Estado de tu pedido"
  }
]

const userItems: MenuItem[] = [
  {
    icon: <User className="w-5 h-5" />,
    label: "Mi Perfil",
    path: "/profile",
    description: "Gestiona tu cuenta"
  },
  {
    icon: <Settings className="w-5 h-5" />,
    label: "Configuración",
    path: "/settings",
    description: "Preferencias de la app"
  },
  {
    icon: <HelpCircle className="w-5 h-5" />,
    label: "Ayuda",
    path: "/help",
    description: "Soporte y preguntas frecuentes"
  }
]

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const handleItemClick = (path: string) => {
    router.push(path)
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-80 bg-gray-900 border-r border-gray-700 z-50 transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <img src="/logo.png" alt="Ratita" className="w-8 h-8" />
              <h2 className="text-xl font-bold text-white">Ratita</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">Lucas</p>
                <p className="text-gray-400 text-sm">Ahorrado $62,520</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto">
            <nav className="p-4">
              <div className="space-y-2">
                <h3 className="text-xs uppercase text-gray-400 font-semibold tracking-wider mb-3">
                  Navegación
                </h3>
                {menuItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleItemClick(item.path)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      pathname === item.path
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {item.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium">{item.label}</p>
                      {item.description && (
                        <p className="text-xs text-gray-400">{item.description}</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-8 space-y-2">
                <h3 className="text-xs uppercase text-gray-400 font-semibold tracking-wider mb-3">
                  Cuenta
                </h3>
                {userItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleItemClick(item.path)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      pathname === item.path
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {item.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium">{item.label}</p>
                      {item.description && (
                        <p className="text-xs text-gray-400">{item.description}</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </nav>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-700">
            <p className="text-xs text-gray-400 text-center">
              © 2024 Ratita. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

// Hook para usar el sidebar en cualquier componente
export function useSidebar() {
  const [isOpen, setIsOpen] = useState(false)

  const openSidebar = () => setIsOpen(true)
  const closeSidebar = () => setIsOpen(false)
  const toggleSidebar = () => setIsOpen(!isOpen)

  return {
    isOpen,
    openSidebar,
    closeSidebar,
    toggleSidebar
  }
} 