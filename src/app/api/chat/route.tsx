import { NextResponse } from 'next/server';

interface Product {
  id: string;
  name: string;
  brand: string;
  quantity: string;
  icon: string;
  color: string;
}

interface ChatEvent {
  type: 'ADD_ITEMS' | 'REMOVE_ITEMS' | 'UPDATE_ITEMS' | 'REMOVE_ALL';
  items?: Product[];
  ids?: string[];
}

// Mock products database - Start with empty list
let products: Product[] = [];

// Helper function to generate new ID
const generateId = () => Math.random().toString(36).substr(2, 9);

// Mock AI response generator
const generateAIResponse = (message: string): { message: string; events: ChatEvent[] } => {
  const lowerMessage = message.toLowerCase();
  
  // Test command to add Coca Cola
  if (lowerMessage.includes('coca cola') || lowerMessage.includes('cocacola')) {
    return {
      message: "Agregando Coca Cola a tu lista de compras",
      events: [
        {
          type: "ADD_ITEMS",
          items: [
            {
              id: generateId(),
              name: "Coca Cola",
              brand: "Coca-Cola - 2L",
              quantity: "1 botella",
              icon: "🥤",
              color: "bg-red-100",
            }
          ]
        }
      ]
    };
  }
  
  if (lowerMessage.includes('agregar') || lowerMessage.includes('añadir') || lowerMessage.includes('comprar')) {
    if (lowerMessage.includes('plátano') || lowerMessage.includes('banana')) {
      return {
        message: "Agregando plátanos a tu lista de compras",
        events: [
          {
            type: "ADD_ITEMS",
            items: [
              {
                id: generateId(),
                name: "Plátanos",
                brand: "Orgánicos - 1kg",
                quantity: "1 kg",
                icon: "🍌",
                color: "bg-yellow-100",
              }
            ]
          }
        ]
      };
    }
    if (lowerMessage.includes('tomate') || lowerMessage.includes('jitomate')) {
      return {
        message: "Agregando tomates a tu lista",
        events: [
          {
            type: "ADD_ITEMS",
            items: [
              {
                id: generateId(),
                name: "Tomates Rojos",
                brand: "Orgánicos - 500g",
                quantity: "500g",
                icon: "🍅",
                color: "bg-red-100",
              }
            ]
          }
        ]
      };
    }
  }
  
  if (lowerMessage.includes('quitar') || lowerMessage.includes('eliminar') || lowerMessage.includes('remover')) {
    if (lowerMessage.includes('pan') || lowerMessage.includes('integral')) {
      return {
        message: "Quitando el pan integral de tu lista",
        events: [
          {
            type: "REMOVE_ITEMS",
            ids: ["1"]
          }
        ]
      };
    }
    if (lowerMessage.includes('manzana') || lowerMessage.includes('rojas')) {
      return {
        message: "Quitando las manzanas rojas de tu lista",
        events: [
          {
            type: "REMOVE_ITEMS",
            ids: ["2"]
          }
        ]
      };
    }
  }
  
  if (lowerMessage.includes('actualizar') || lowerMessage.includes('cambiar') || lowerMessage.includes('modificar')) {
    if (lowerMessage.includes('leche') && lowerMessage.includes('deslactosada')) {
      return {
        message: "Cambiando la leche a deslactosada",
        events: [
          {
            type: "UPDATE_ITEMS",
            items: [
              {
                id: "3",
                name: "Leche Deslactosada",
                brand: "Lala - 1L",
                quantity: "2 piezas",
                icon: "🥛",
                color: "bg-blue-100",
              }
            ]
          }
        ]
      };
    }
  }
  
  if (lowerMessage.includes('limpiar') || lowerMessage.includes('vaciar') || lowerMessage.includes('borrar todo')) {
    return {
      message: "Limpiando toda tu lista de compras",
      events: [
        {
          type: "REMOVE_ALL"
        }
      ]
    };
  }
  
  return {
    message: "No entiendo ese comando. Puedes agregar, quitar, actualizar o limpiar productos de tu lista.",
    events: []
  };
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Generate AI response with events
    const aiResponse = generateAIResponse(message);
    
    // Apply events to the mock database
    aiResponse.events.forEach(event => {
      switch (event.type) {
        case 'ADD_ITEMS':
          if (event.items) {
            products = [...products, ...event.items];
          }
          break;
        case 'REMOVE_ITEMS':
          if (event.ids) {
            products = products.filter(product => !event.ids!.includes(product.id));
          }
          break;
        case 'UPDATE_ITEMS':
          if (event.items) {
            event.items.forEach(updatedItem => {
              const index = products.findIndex(p => p.id === updatedItem.id);
              if (index !== -1) {
                products[index] = updatedItem;
              }
            });
          }
          break;
        case 'REMOVE_ALL':
          products = [];
          break;
      }
    });

    return NextResponse.json({
      message: aiResponse.message,
      events: aiResponse.events,
      products: products // Return current state for sync
    });
    
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve current products
export async function GET() {
  return NextResponse.json({ products });
} 