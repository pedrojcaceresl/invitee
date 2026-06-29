# ADR-001: Capa de datos como interfaz intercambiable (Repository / Ports & Adapters)

## Estado
Aceptado

## Contexto
El MVP usa Firebase (Firestore + Storage) por velocidad de desarrollo. Pero no queremos que esa elección quede esparcida por toda la app: si en el futuro se necesita migrar a una API REST propia, a otra base de datos, o simplemente testear sin depender de Firebase real, no debería implicar reescribir Route Handlers, lógica de negocio ni componentes.

## Decisión
Se define una capa de **interfaces (ports)** que declara las operaciones de datos que la app necesita, sin saber dónde ni cómo se persisten. La implementación con Firebase es un **adapter** que cumple esa interfaz. Todo el código de negocio depende únicamente de la interfaz — nunca importa Firebase directamente.

**Ubicación de las interfaces:** `/lib/ports/`
```ts
interface EventRepository {
  createEvent(input: NewEvent): Promise<Event>
  getEventBySlug(slug: string): Promise<Event | null>
  updateEvent(eventId: string, patch: Partial<Event>): Promise<void>
  validateEditToken(eventId: string, token: string): Promise<boolean>
}

interface GiftRepository {
  addGift(eventId: string, input: NewGift): Promise<Gift>
  listGifts(eventId: string): Promise<Gift[]>
  updateGift(eventId: string, giftId: string, patch: Partial<Gift>): Promise<void>
  deleteGift(eventId: string, giftId: string): Promise<void>
  // reserveGift / unreserveGift eliminados — Iteración 2 removida del MVP (ver spec, sección 5)
}

interface StorageProvider {
  uploadPhoto(eventId: string, file: File): Promise<string> // url
}
```

**Implementación inicial (adapter):** `/lib/adapters/firebase/`
- `FirebaseEventRepository implements EventRepository`
- `FirebaseGiftRepository implements GiftRepository`
- `FirebaseStorageProvider implements StorageProvider`

**Punto único de selección del adapter:**
```ts
// /lib/data/index.ts
export function getEventRepository(): EventRepository {
  return new FirebaseEventRepository(); // único lugar que cambiaría si se migra
}
```

Si más adelante se migra a una API REST propia, se crea `RestEventRepository implements EventRepository` y se cambia esa única línea. El resto del código no se toca.

## Consecuencias

**Positivas**
- Migrar de Firebase a otra cosa no implica reescribir lógica de negocio
- Permite testear con un `InMemoryEventRepository` fake en lugar de Firebase real (tests más rápidos, sin red)
- Obliga a definir el contrato de datos explícitamente desde el día 1, lo que ayuda a detectar ambigüedades temprano

**Negativas / trade-offs**
- Una capa de abstracción extra desde el día 1 = algo más de boilerplate en el MVP
- Riesgo de abstracción prematura si nunca se migra — mitigación: no generalizar para soportar múltiples backends a la vez, solo dejar la puerta abierta con UNA implementación real (Firebase) detrás de la interfaz

## Alternativas consideradas
- **Acoplar todo directamente a Firebase:** más rápido al inicio, pero migración futura cara y arriesgada (tocar todo el código a la vez)
- **Usar un ORM genérico (ej. Prisma) como capa de abstracción:** descartado — Prisma no tiene buen soporte nativo para Firestore (pensado para SQL/Mongo), agregaría una dependencia más para un alcance chico

## Impacto en el plan de iteraciones
Se agrega a la **Iteración 0** la definición de las interfaces y el adapter de Firebase (ver spec actualizado).