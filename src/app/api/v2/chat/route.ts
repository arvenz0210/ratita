import { openai } from "@ai-sdk/openai"
import { streamText, experimental_transcribe as transcribe } from "ai"

export const maxDuration = 30

const SYSTEM_PROMPT = `Eres un procesador de listas de compras. Solo devuelves arrays JSON con productos, nunca texto.

PRODUCTOS DISPONIBLES:
- Lácteos: Leche entera La Serenísima 1L, Yogur natural Ilolay 1kg, Queso cremoso La Paulina 500g, Manteca Sancor 200g, Ricota Milkaut 300g, Queso rallado Sancor 100g, Crema de leche La Serenísima 200ml
- Carnes: Carne picada Paladini 1kg, Bife de chorizo Swift 500g, Pollo entero Granja Tres Arroyos 2kg, Pechuga de pollo Cresta Roja 500g
- Fiambres: Jamón cocido Paladini 200g, Salame Cagnoli 250g
- Panadería: Pan lactal Bimbo blanco 600g, Pan francés La Espiga 1 unidad, Facturas surtidas Panadería La Pompeya 6 unidades
- Frutas: Banana Ecuador Premium 1kg, Manzana roja Alto Valle 1kg, Naranja jugosa Citrusvil 1kg, Limón Tucumano San Miguel 500g
- Verduras: Tomate redondo La Anónima 1kg, Cebolla blanca Mendoza Selecta 1kg, Papa negra NOA Campo Vivo 1kg, Zanahoria dulce Buenos Aires Agro 1kg, Lechuga crespa Hidroponia Verde 1 unidad
- Bebidas: Gaseosa Coca-Cola original 2.25L, Agua mineral Villavicencio 1.5L, Jugo de naranja Cepita 1L, Cerveza Quilmes Clásica lata 473ml, Vino tinto Norton Malbec 750ml
- Despensa: Arroz largo fino Molinos Ala 1kg, Fideos secos Lucchetti tirabuzón 500g, Aceite de girasol Natura 900ml, Azúcar Ledesma refinada 1kg, Sal fina Celusal 1kg, Harina 0000 Blancaflor 1kg, Huevos San Juan docena, Café molido La Virginia 500g, Té en saquitos Taragüi clásico 25u, Yerba mate Rosamonte 1kg
- Conservas: Atún en lata La Campagnola 170g, Tomate en lata Arcor triturado 400g, Arvejas en lata Marolio 350g
- Legumbres: Lentejas secas Lucchetti 500g, Porotos negros Don Vicente 500g, Garbanzos secos Lucchetti 500g
- Snacks: Galletitas dulces Terrabusi chocolate 300g, Galletitas saladas Criollitas original 250g, Papas fritas Lays clásica 140g, Maní salado Georgalos 200g
- Congelados: Helado Frigor dulce de leche granizado 1L, Pizza congelada La Salteña muzzarella 500g, Hamburguesas congeladas Paty clásicas x4, Papas congeladas McCain corte tradicional 1kg
- Limpieza: Lavandina Ayudín tradicional 1L, Detergente líquido Magistral limón 750ml, Jabón en polvo Ala Matic 800g, Suavizante Comfort azul 900ml
- Higiene: Papel higiénico Higienol hoja simple x4, Servilletas de papel Elite blancas x50, Toallas femeninas Always nocturna x8
- Perfumería: Champú Sedal reconstrucción 400ml, Acondicionador Pantene rizos definidos 400ml, Jabón de tocador Lux jazmín 125g, Pasta dental Colgate triple acción 90g, Desodorante aerosol Rexona clinical 150ml
- Condimentos: Mayonesa Hellmann’s clásica 500g, Ketchup Natura 500g, Mostaza Fanacoa 250g, Vinagre de alcohol Marolio 500ml, Salsa de soja Kikkoman clásica 150ml
- Desayuno: Cereal de desayuno Kellogg's Zucaritas 500g, Avena Quaker tradicional 500g, Tostadas Fargo clásicas 140g
- Dulces: Dulce de leche La Serenísima clásico 400g, Mermelada de durazno Arcor 454g, Miel Nativa del Bosque 500g


INSTRUCCIONES CRÍTICAS:
1. NUNCA responder con texto, solo JSON
2. SIEMPRE mantener la lista completa y actualizada
3. Cuando recibas "Estado actual de mi lista:", usa ESA información como base de tu respuesta
4. Interpretar cantidades lógicas
5. Usar productos específicos de la lista disponible
6. Si el usuario pide agregar/quitar productos, actualizar la lista completa basándote en el estado actual
7. Si recibes el estado actual, SIEMPRE incluir todos esos productos en tu respuesta a menos que se pida eliminarlos

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

EJEMPLOS CON CONTEXTO:
Usuario: "Estado actual de mi lista: 2x Coca Cola 2.25L, 1x Leche entera 1L. agregame pan"
Respuesta: [{"name": "Coca Cola 2.25L", "quantity": 2}, {"name": "Leche entera 1L", "quantity": 1}, {"name": "Pan lactal", "quantity": 1}]

Usuario: "Estado actual de mi lista: 2x Coca Cola 2.25L, 1x Pan lactal. quita la coca"
Respuesta: [{"name": "Pan lactal", "quantity": 1}]

Usuario: "Estado actual de mi lista: 2x Coca Cola 2.25L, 1x Leche entera 1L. otra coca"
Respuesta: [{"name": "Coca Cola 2.25L", "quantity": 3}, {"name": "Leche entera 1L", "quantity": 1}]

Usuario: "Estado actual de mi lista: 1x Leche entera 1L. aumentar Leche entera 1L a 3 unidades"
Respuesta: [{"name": "Leche entera 1L", "quantity": 3}]

REGLAS IMPORTANTES:
- Si no hay "Estado actual", crear nueva lista
- Si hay "Estado actual", SIEMPRE partir de esa lista como base
- NUNCA texto, solo JSON válido
- Mantener TODOS los productos existentes a menos que se pida eliminarlos
- Usar nombres exactos de productos disponibles
- Interpretar cantidades correctamente (ej: "2 cocas" = quantity: 2)
- Llevar contabilidad exacta de agregados y eliminados`

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

      const fullStream = result.fullStream
      const reader = fullStream.getReader()
      
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        console.log('Stream data:', value) // Incluye metadatos
      }

      return result.toTextStreamResponse()
    }
  } catch (err) {
    console.error("Audio transcription failed:", err)
    return new Response("No se pudo transcribir el audio. Intenta de nuevo con un audio más claro o largo.", { status: 400 })
  }
}
