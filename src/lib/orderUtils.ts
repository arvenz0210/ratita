/**
 * Utilidades para el manejo de pedidos confirmados y limpieza de carrito
 */

export interface ConfirmedOrder {
  orderId: string
  store: string
  total: number
  items: Array<{
    product: string
    quantity: number
    price: number
    total: number
  }>
  timestamp: string
  status: string
  confirmedAt: string
}

export interface ShipmentData {
  store: string
  total: number
  items: Array<{
    product: string
    quantity: number
    price: number
    total: number
  }>
  timestamp: string
}

/**
 * Guarda un pedido confirmado en el historial
 */
export const saveConfirmedOrder = (shipmentData: ShipmentData): ConfirmedOrder => {
  const confirmedOrder: ConfirmedOrder = {
    ...shipmentData,
    orderId: `ORDER-${Date.now()}`,
    status: 'confirmed',
    confirmedAt: new Date().toISOString()
  }
  
  // Get existing confirmed orders or initialize empty array
  const existingOrdersJson = sessionStorage.getItem('confirmedOrders')
  const existingOrders: ConfirmedOrder[] = existingOrdersJson ? JSON.parse(existingOrdersJson) : []
  
  // Add new order to the beginning of the array
  const updatedOrders = [confirmedOrder, ...existingOrders]
  
  // Save updated orders to sessionStorage
  sessionStorage.setItem('confirmedOrders', JSON.stringify(updatedOrders))
  
  return confirmedOrder
}

/**
 * Limpia todos los datos temporales del carrito
 */
export const clearCartData = (): void => {
  sessionStorage.removeItem('shipmentData')
  sessionStorage.removeItem('comparisonData')
  sessionStorage.removeItem('selectedStore')
  sessionStorage.removeItem('products')
  sessionStorage.removeItem('messages')
  sessionStorage.removeItem('currentProducts')
  sessionStorage.removeItem('currentMessages')
}

/**
 * Marca que se deben limpiar los datos temporales al regresar a la página principal
 */
export const markForClearing = (): void => {
  sessionStorage.setItem('clearTempData', 'true')
}

/**
 * Verifica y limpia los datos temporales si está marcado
 */
export const checkAndClearTempData = (): boolean => {
  const shouldClear = sessionStorage.getItem('clearTempData')
  if (shouldClear === 'true') {
    clearCartData()
    sessionStorage.removeItem('clearTempData')
    return true
  }
  return false
}

/**
 * Obtiene todos los pedidos confirmados
 */
export const getConfirmedOrders = (): ConfirmedOrder[] => {
  try {
    const ordersJson = sessionStorage.getItem('confirmedOrders')
    return ordersJson ? JSON.parse(ordersJson) : []
  } catch (error) {
    console.error('Error loading confirmed orders:', error)
    return []
  }
}

/**
 * Elimina un pedido confirmado del historial
 */
export const deleteConfirmedOrder = (orderId: string): ConfirmedOrder[] => {
  const orders = getConfirmedOrders()
  const updatedOrders = orders.filter(order => order.orderId !== orderId)
  sessionStorage.setItem('confirmedOrders', JSON.stringify(updatedOrders))
  return updatedOrders
}

/**
 * Elimina todos los pedidos confirmados
 */
export const clearAllConfirmedOrders = (): void => {
  sessionStorage.removeItem('confirmedOrders')
}

/**
 * Obtiene todas las listas guardadas
 */
export const getSavedLists = () => {
  try {
    const listsJson = sessionStorage.getItem('savedLists')
    return listsJson ? JSON.parse(listsJson) : []
  } catch (error) {
    console.error('Error loading saved lists:', error)
    return []
  }
}

/**
 * Elimina todas las listas guardadas
 */
export const clearAllSavedLists = (): void => {
  sessionStorage.removeItem('savedLists')
}

/**
 * Estructura de datos en sessionStorage después de implementar listas guardadas:
 * 
 * sessionStorage = {
 *   "confirmedOrders": [
 *     {
 *       "orderId": "ORDER-1703123456789",
 *       "store": "Carrefour",
 *       "total": 15420,
 *       "items": [...],
 *       "timestamp": "2024-01-15T10:30:00.000Z",
 *       "status": "confirmed",
 *       "confirmedAt": "2024-01-15T10:35:00.000Z"
 *     }
 *   ],
 *   "savedLists": [
 *     {
 *       "id": "LIST-1703123456789",
 *       "name": "Mi lista de milanesas",
 *       "products": [
 *         {"name": "Carne picada", "quantity": 1},
 *         {"name": "Pan rallado", "quantity": 1},
 *         {"name": "Huevos", "quantity": 6}
 *       ],
 *       "createdAt": "2024-01-15T10:30:00.000Z",
 *       "itemCount": 3,
 *       "totalItems": 8
 *     }
 *   ],
 *   "currentProducts": [...], // Carrito activo
 *   "currentMessages": [...], // Chat activo
 *   "clearTempData": "true" // Se borra automáticamente cuando la página principal lo procesa
 * }
 */ 