import { openai } from "@ai-sdk/openai"
import { streamText, experimental_transcribe as transcribe } from "ai"

export const maxDuration = 30

const SYSTEM_PROMPT = `Eres un procesador de listas de compras. Solo devuelves arrays JSON con productos, nunca texto.

PRODUCTOS DISPONIBLES:
- Lácteos: Leche entera 1L, Yogur natural 1kg, Queso cremoso, Manteca 200g, Ricota, Queso rallado 100g, Crema de leche 200ml
- Carnes: Carne picada, Bife de chorizo, Pollo entero, Pechuga de pollo
- Fiambres: Jamón cocido, Salame  
- Panadería: Pan lactal, Pan francés, Facturas surtidas
- Frutas: Banana, Manzana roja, Naranja, Limón
- Verduras: Tomate, Cebolla, Papa, Zanahoria, Lechuga
- Bebidas: Coca Cola 2.25L, Agua mineral 1.5L, Jugo de naranja 1L, Cerveza lata 473ml, Vino tinto 750ml
- Despensa: Arroz largo fino 1kg, Fideos secos 500g, Aceite de girasol 900ml, Azúcar 1kg, Sal fina 1kg, Harina 0000 1kg, Huevos, Café molido 500g, Té en saquitos, Yerba mate 1kg
- Conservas: Atún en lata, Tomate en lata, Arvejas en lata
- Legumbres: Lentejas secas 500g, Porotos negros 500g, Garbanzos 500g
- Snacks: Galletitas dulces, Galletitas saladas, Papas fritas, Maní salado
- Congelados: Helado 1L, Pizza congelada, Hamburguesas congeladas, Papas congeladas
- Limpieza: Lavandina 1L, Detergente líquido 750ml, Jabón en polvo 800g, Suavizante 900ml
- Higiene: Papel higiénico x4, Servilletas de papel, Toallas femeninas
- Perfumería: Champú 400ml, Acondicionador 400ml, Jabón de tocador, Pasta dental, Desodorante aerosol
- Condimentos: Mayonesa 500g, Ketchup 500g, Mostaza 250g, Vinagre 500ml, Salsa de soja 150ml
- Desayuno: Cereal de desayuno 500g, Avena 500g, Tostadas 140g
- Dulces: Dulce de leche 400g, Mermelada de durazno 454g, Miel 500g

INSTRUCCIONES:
1. NUNCA responder con texto, solo JSON
2. Mantener lista actualizada de productos en cada conversación
3. Interpretar cantidades lógicas
4. Usar productos específicos de la lista disponible

FORMATO DE RESPUESTA:
SIEMPRE responde SOLO con este JSON:

[
  {
    "name": "Coca Cola 2.25L",
    "quantity": 2
  },
  {
    "name": "Leche entera 1L", 
    "quantity": 1
  }
]

EJEMPLOS:
Usuario: "agregame 2 cocas y leche"
Respuesta: [{"name": "Coca Cola 2.25L", "quantity": 2}, {"name": "Leche entera 1L", "quantity": 1}]

Usuario: "también pan"
Respuesta: [{"name": "Coca Cola 2.25L", "quantity": 2}, {"name": "Leche entera 1L", "quantity": 1}, {"name": "Pan lactal", "quantity": 1}]

Usuario: "quita la leche"
Respuesta: [{"name": "Coca Cola 2.25L", "quantity": 2}, {"name": "Pan lactal", "quantity": 1}]

IMPORTANTE:
- NUNCA texto, solo JSON válido
- Mantener lista completa actualizada
- Usar nombres exactos de productos disponibles
- Interpretar cantidades (ej: "2 cocas" = quantity: 2)
`

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type')
    
    if (contentType?.includes('multipart/form-data')) {
      const formData = await req.formData()
      const audioFile = formData.get('audio') as File | null
      const imageFile = formData.get('image') as File | null
      const messages = JSON.parse(formData.get('messages') as string)

      if (audioFile) {
        // Transcribe audio using Whisper
        const audioBuffer = Buffer.from(await audioFile.arrayBuffer())
        const transcriptionResult = await transcribe({
          model: openai.transcription("whisper-1"),
          audio: audioBuffer,
        })
        const transcript = transcriptionResult.text?.trim()
        if (!transcript) {
          throw new Error("No transcript generated")
        }
        const audioMessage = {
          role: "user" as const,
          content: transcript
        }
        const updatedMessages = [...messages, audioMessage]
        const result = streamText({
          model: openai("gpt-4o"),
          system: SYSTEM_PROMPT,
          messages: updatedMessages,
        })

        console.log(result)

        return result.toTextStreamResponse()
      } else if (imageFile) {
        // Convert file to base64
        const bytes = await imageFile.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const base64Image = buffer.toString('base64')
        const mimeType = imageFile.type
        const imageMessage = {
          role: "user" as const,
          content: [
            {
              type: "image" as const,
              image: `data:${mimeType};base64,${base64Image}`
            },
            {
              type: "text" as const,
              text: "Procesa esta imagen de lista de compras y actualiza la lista de productos."
            }
          ]
        }
        const updatedMessages = [...messages, imageMessage]
        const result = streamText({
          model: openai("gpt-4o"),
          system: SYSTEM_PROMPT,
          messages: updatedMessages,
        })
        return result.toTextStreamResponse()
      } else {
        return new Response('No audio or image provided', { status: 400 })
      }
    } else {
      // Handle regular text messages
      const { messages } = await req.json()
      const result = streamText({
        model: openai("gpt-4o"),
        system: SYSTEM_PROMPT,
        messages,
      })
      return result.toTextStreamResponse()
    }
  } catch (err) {
    console.error("Audio transcription failed:", err)
    return new Response("No se pudo transcribir el audio. Intenta de nuevo con un audio más claro o largo.", { status: 400 })
  }
}
