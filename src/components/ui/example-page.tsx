"use client"

import { Layout } from "@/components/ui/layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Plus } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ExamplePage() {
  const router = useRouter()

  return (
    <Layout
      topbarContent={
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.back()}
            className="p-2 text-gray-300 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2 text-gray-300 hover:text-white"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      }
    >
      <div className="bg-gray-900 min-h-full">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-white mb-6">
            Ejemplo de página con Layout y Sidebar
          </h1>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Instrucciones de uso
              </h2>
              <div className="space-y-3 text-gray-300">
                <p>
                  Esta página muestra cómo usar el componente Layout en cualquier página.
                  El Layout incluye automáticamente:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Sidebar con menú de navegación</li>
                  <li>Topbar con botón de menú</li>
                  <li>Contenido personalizable en el topbar</li>
                  <li>Navegación consistente en toda la aplicación</li>
                </ul>
                <p className="mt-4">
                  Para usar el Layout, simplemente envuelve tu contenido con el componente
                  Layout y opcionalmente pasa contenido personalizado para el topbar.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
} 