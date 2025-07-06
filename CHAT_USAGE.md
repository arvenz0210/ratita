# Chat System Usage

This application now uses a custom chat API that processes user messages and returns events to modify the products list in real-time.

## How it works

1. **User sends a message** through the chat interface
2. **API processes the message** and generates appropriate events
3. **Events are applied** to update the products list on the client side
4. **UI updates** to reflect the changes

## Available Commands

### Test Command
- "Agregar Coca Cola" - Adds Coca Cola to test the system
- "coca cola" - Adds Coca Cola to test the system
- "cocacola" - Adds Coca Cola to test the system

### Adding Items
- "Agregar plátanos" - Adds bananas to the list
- "Añadir tomates" - Adds tomatoes to the list
- "Comprar plátanos" - Adds bananas to the list

### Removing Items
- "Quitar pan integral" - Removes bread from the list
- "Eliminar manzanas rojas" - Removes red apples from the list
- "Remover pan" - Removes bread from the list

### Updating Items
- "Cambiar leche a deslactosada" - Updates milk to lactose-free
- "Actualizar leche deslactosada" - Updates milk to lactose-free
- "Modificar leche" - Updates milk to lactose-free

### Clearing List
- "Limpiar lista" - Removes all items
- "Vaciar lista" - Removes all items
- "Borrar todo" - Removes all items

## Event Types

The API returns events with the following structure:

```typescript
interface ChatEvent {
  type: "ADD_ITEMS" | "REMOVE_ITEMS" | "UPDATE_ITEMS" | "REMOVE_ALL"
  items?: Product[]
  ids?: string[]
}
```

### ADD_ITEMS
Adds new products to the list
```json
{
  "type": "ADD_ITEMS",
  "items": [
    {
      "id": "new-id",
      "name": "Product Name",
      "brand": "Brand Name",
      "quantity": "1 kg",
      "icon": "🍌",
      "color": "bg-yellow-100"
    }
  ]
}
```

### REMOVE_ITEMS
Removes products by ID
```json
{
  "type": "REMOVE_ITEMS",
  "ids": ["1", "2"]
}
```

### UPDATE_ITEMS
Updates existing products
```json
{
  "type": "UPDATE_ITEMS",
  "items": [
    {
      "id": "3",
      "name": "Updated Name",
      "brand": "Updated Brand",
      "quantity": "2 piezas",
      "icon": "🥛",
      "color": "bg-blue-100"
    }
  ]
}
```

### REMOVE_ALL
Clears all products
```json
{
  "type": "REMOVE_ALL"
}
```

## API Endpoints

- `GET /api/chat` - Retrieves current products list
- `POST /api/chat` - Processes user message and returns events

### POST Request Body
```json
{
  "message": "User message here"
}
```

### POST Response
```json
{
  "message": "AI response message",
  "events": [...],
  "products": [...]
}
```

## Technical Implementation

- **Frontend**: React with TypeScript, uses useState and useEffect for state management
- **Backend**: Next.js API routes with mock data storage
- **Real-time Updates**: Events are processed immediately on the client side
- **Type Safety**: Full TypeScript support with proper interfaces 