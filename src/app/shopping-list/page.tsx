"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckSquare, Square } from "lucide-react"
import { useRouter } from "next/navigation"

interface ShoppingItem {
  product: string
  quantity: number
  price: number
  total: number
}

interface ShipmentData {
  store: string
  total: number
  items: ShoppingItem[]
  timestamp: string
}

export default function ShoppingListPage() {
  const [shipment, setShipment] = useState<ShipmentData | null>(null)
  const [checked, setChecked] = useState<{ [key: string]: boolean }>({})
  const router = useRouter()

  useEffect(() => {
    const data = sessionStorage.getItem("shipmentData")
    if (data) {
      const parsed: ShipmentData = JSON.parse(data)
      setShipment(parsed)
      // Initialize checked state
      const initialChecked: { [key: string]: boolean } = {}
      parsed.items.forEach(item => {
        initialChecked[item.product] = false
      })
      setChecked(initialChecked)
    }
  }, [])

  const handleToggle = (product: string) => {
    setChecked(prev => ({ ...prev, [product]: !prev[product] }))
  }

  if (!shipment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center text-gray-200">
          <p>No hay lista de compras disponible.</p>
          <Button className="mt-4" onClick={() => router.push("/")}>Volver al inicio</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 px-4 py-8">
      <div className="max-w-xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-green-200 mb-2">Lista de compras</h1>
          <p className="text-lg text-gray-300">Supermercado: <span className="font-semibold text-green-400">{shipment.store}</span></p>
          <p className="text-md text-gray-400">Total estimado: <span className="font-semibold text-green-300">${shipment.total.toLocaleString("es-AR")}</span></p>
        </div>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <ul className="space-y-3">
              {shipment.items.map(item => (
                <li key={item.product} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-700 transition">
                  <button
                    className="mr-3 focus:outline-none"
                    onClick={() => handleToggle(item.product)}
                    aria-label={checked[item.product] ? "Desmarcar" : "Marcar como comprado"}
                  >
                    {checked[item.product] ? (
                      <CheckSquare className="w-6 h-6 text-green-400" />
                    ) : (
                      <Square className="w-6 h-6 text-gray-400" />
                    )}
                  </button>
                  <div className="flex-1">
                    <span className={`text-lg ${checked[item.product] ? "line-through text-gray-500" : "text-gray-100"}`}>{item.product}</span>
                    <span className="ml-2 text-gray-400 text-sm">x{item.quantity}</span>
                  </div>
                  <span className="text-green-300 font-semibold ml-2">${item.price.toLocaleString("es-AR")}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 