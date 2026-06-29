# Spec: Invitee — Especificación Técnica
**Metodología:** Spec-Driven Development — Requerimientos (formato EARS) → Diseño → Iteraciones con tests.

---

## 0. Resumen del producto
App para crear, en minutos, una tarjeta de invitación y/o lista de regalos para un evento (cumpleaños, boda, graduación, baby shower, otro), compartible con un solo link/imagen. Sin login. Uso inicial: grupo de amigos.

## 1. Stack técnico
| Capa | Tecnología | Notas |
|---|---|---|
| Frontend | Next.js (App Router) | SSR para la página pública del evento |
| Estilos | Tailwind CSS + Radix UI | Tailwind para layout/estilos, Radix para componentes accesibles (modal, dropdown, toggle) |
| Animaciones | Framer Motion | Transiciones de página, micro-interacciones en formularios y tarjeta |
| Datos | Firebase Firestore | Base de datos principal |
| Archivos | Firebase Storage | Fotos subidas por el organizador |
| Generación de imagen | `@vercel/og` o `satori` + `html-to-image` | Para exportar la tarjeta como PNG descargable |
| Deploy | Vercel | Tier gratuito suficiente para este alcance |

## 2. Decisiones de arquitectura clave

### 2.1 Acceso a datos: servidor, no cliente
**No se expone Firestore directamente al cliente.** Todo el acceso (lectura/escritura) pasa por **Next.js Route Handlers / Server Actions**.

Motivo: como no hay Firebase Auth (decidimos evitar login), validar el `editToken` con Firestore Security Rules del lado del cliente sería frágil. Validarlo en el servidor es simple y seguro.

**Firestore Security Rules:** denegar todo acceso directo desde el cliente (`allow read, write: if false;`). Todo pasa por el servidor.

### 2.2 Capa de datos intercambiable (Repository / Ports & Adapters) — ADR-001
Los Route Handlers no llaman a Firebase directamente. Llaman a interfaces (`EventRepository`, `GiftRepository`, `StorageProvider`, definidas en `/lib/ports/`), y la implementación con Firebase (`/lib/adapters/firebase/`) es solo una de esas implementaciones posibles. Esto permite migrar a una API REST propia (u otra base de datos) más adelante cambiando un único punto de inyección, sin tocar lógica de negocio.

Detalle completo de interfaces, implementación y trade-offs: ver **ADR-001 (`adr-001-capa-de-datos.md`)**.

## 3. Modelo de datos (Firestore)

**Colección `events`**
```
{
  id: string (auto),
  slug: string (público, único, ej: "cumple-de-juan-9f2a"),
  name: string,
  type: "birthday" | "wedding" | "graduation" | "babyshower" | "other",
  date: string | null,
  location: string | null,
  message: string | null,
  templateId: string,            // referencia a plantilla estática (no Firestore, ver punto 4)
  customPhotoUrl: string | null,
  shareMode: "list_only" | "card_only" | "combined",
  createdAt: timestamp
}
```

**Colección `eventSecrets`** (NUNCA expuesta al cliente, solo Admin SDK)
```
{
  eventId: string,
  editToken: string (hash)
}
```

**Subcolección `events/{eventId}/gifts`**
```
{
  id: string (auto),
  name: string,
  description: string | null,
  purchaseLink: string | null,
  photoUrl: string | null,
  approxPrice: number | null
}
```
*(sin estado de reserva — ver Iteración 2, removida)*

## 4. Plantillas de tarjeta
**Decisión:** 3 plantillas por tipo de evento, generadas con IA (una sola vez, no en runtime). Al ser un set fijo y chico, viven como **assets estáticos** (imágenes base + config de layout en un JSON del repo), no como colección de Firestore — evita una capa de complejidad innecesaria para algo que no cambia dinámicamente.

```
/templates/birthday-1.json (+ preview.png)
/templates/birthday-2.json
/templates/birthday-3.json
/templates/wedding-1.json
... etc
```

---

## 5. Iteraciones

### Iteración 0 — Setup y esqueleto
**Objetivo:** proyecto corriendo en producción, vacío pero deployado.

**Tareas**
- Crear proyecto Next.js + Tailwind + Radix + Framer Motion
- Crear proyecto Firebase (Firestore + Storage), configurar Admin SDK en el servidor
- Configurar Security Rules (deny all desde cliente)
- **Definir interfaces `EventRepository`, `GiftRepository`, `StorageProvider` en `/lib/ports/`** (ver ADR-001)
- **Implementar `FirebaseEventRepository`, `FirebaseGiftRepository`, `FirebaseStorageProvider` en `/lib/adapters/firebase/`**
- **Crear punto único de inyección (`/lib/data/index.ts`) que devuelve el adapter activo**
- Deploy inicial a Vercel con variables de entorno

**Tests**
- `test: health check API route responde 200`
- `test: Admin SDK puede leer/escribir en Firestore desde el servidor`
- `test: cliente NO puede leer/escribir Firestore directamente` (verificación manual de rules)
- `test: InMemoryEventRepository fake cumple el contrato de EventRepository` (test de contrato compartido — el mismo set de tests corre contra el fake y, más adelante, contra cualquier adapter nuevo)

**Definición de Hecho:** la app deployada muestra una landing vacía y el health check pasa.

---

### Iteración 1 — Crear evento y lista de regalos (core)

**Requerimientos (EARS)**
- CUANDO el organizador envía el formulario de creación de evento, EL SISTEMA DEBE generar un `slug` público único y un `editToken` privado, y devolver ambos al organizador.
- CUANDO el organizador agrega un regalo usando su `editToken`, EL SISTEMA DEBE guardarlo en la subcolección `gifts` del evento correspondiente.
- SI el `editToken` enviado no coincide con el del evento, ENTONCES EL SISTEMA DEBE rechazar la operación de escritura.
- CUANDO cualquier persona visita `/e/{slug}`, EL SISTEMA DEBE mostrar el evento y su lista de regalos sin requerir login.
- EL SISTEMA NO DEBE permitir que nadie excepto el organizador (vía `editToken`) agregue, edite o borre regalos. *(decisión: solo el organizador agrega regalos, sin límite de cantidad)*

**Tareas**
- API: `POST /api/events` (crear evento)
- API: `POST /api/events/:slug/gifts` (agregar regalo, valida editToken)
- API: `PATCH/DELETE /api/events/:slug/gifts/:id` (editar/borrar, valida editToken)
- Página pública `/e/[slug]` (SSR, lista de regalos)
- Formulario de creación + pantalla "guardá este link de edición"

**Tests**
- Unit: generación de slug es única (colisión → reintenta)
- Unit: validación de editToken rechaza tokens incorrectos
- Integration: crear evento → agregar 2 regalos → `GET /e/{slug}` los devuelve
- Integration: intento de agregar regalo con token inválido → 403
- E2E: flujo completo "crear evento → agregar regalo → ver página pública"

**Definición de Hecho:** un evento real se puede crear, editar y ver públicamente de punta a punta.

---

### Iteración 2 — Reservar regalo — **REMOVIDA**

**Motivo:** esta feature entraba en conflicto directo con el objetivo de "sorpresa": para que el organizador pudiera deshacer una reserva por error, necesitaba ver qué estaba reservado — y en el caso más común, el organizador ES quien recibe los regalos.

**Decisión:** se elimina del MVP. La lista solo muestra los regalos disponibles, sin estado de reserva.

**Trade-off aceptado:** vuelve a ser posible que dos invitados regalen lo mismo (el problema que la feature buscaba evitar). Era "nice to have", no core, así que el trade-off se acepta a cambio de simplicidad y de no romper la sorpresa.

**Si se reconsidera en el futuro:** la forma correcta sería ocultar el estado de reservas a nivel de API cuando el organizador es también el receptor, y delegar el "deshacer" al invitado que reservó (vía un token personal), no al organizador. Queda en el backlog (sección 6).

---

### Iteración 3 — Tarjeta de invitación

**Requerimientos (EARS)**
- CUANDO el organizador elige una plantilla, EL SISTEMA DEBE mostrar una vista previa con los datos del evento ya completados.
- CUANDO el organizador sube una foto propia, EL SISTEMA DEBE guardarla en Firebase Storage y asociarla al evento.
- CUANDO el organizador solicita descargar la tarjeta, EL SISTEMA DEBE generar una imagen PNG con la plantilla + datos + foto.

**Tareas**
- Selector de plantilla (3 opciones por tipo de evento)
- Upload de foto a Firebase Storage
- Endpoint de generación de imagen (`@vercel/og` / `satori`)
- Botón "Descargar tarjeta"

**Tests**
- Unit: el render de plantilla inserta correctamente nombre/fecha/lugar/mensaje
- Integration: subir foto → URL se guarda en el evento → aparece en la tarjeta generada
- Integration: generación de imagen devuelve un PNG válido (content-type, tamaño > 0)
- E2E: elegir plantilla → subir foto → descargar tarjeta con esos datos

**Definición de Hecho:** se puede generar y descargar una tarjeta personalizada para cualquier evento.

---

### Iteración 4 — Modos de compartir

**Requerimientos (EARS)**
- CUANDO el organizador selecciona `shareMode = "list_only"`, EL SISTEMA DEBE mostrar solo la lista de regalos en `/e/{slug}`.
- CUANDO el organizador selecciona `shareMode = "card_only"`, EL SISTEMA DEBE mostrar solo la tarjeta, sin referencias a regalos.
- CUANDO el organizador selecciona `shareMode = "combined"`, EL SISTEMA DEBE mostrar la tarjeta con un botón/QR que enlaza a la lista de regalos.

**Tareas**
- Selector de `shareMode` en el panel de edición
- Renderizado condicional en `/e/[slug]` según `shareMode`
- Generación de QR (en modo combinado) apuntando al slug

**Tests**
- Integration: cada valor de `shareMode` renderiza el contenido correcto (3 casos)
- Integration: el QR generado en modo combinado decodifica a la URL correcta del evento
- E2E: cambiar `shareMode` después de creado el evento se refleja en la página pública

**Definición de Hecho:** el organizador controla qué ve el invitado, y puede cambiarlo en cualquier momento.

---

### Iteración 5 — Pulido, animaciones y mobile-first

**Tareas**
- Animaciones de entrada/transición con Framer Motion (tarjeta, lista de regalos, estados de reserva)
- Revisión responsive completa (mobile-first real, no solo "que entre")
- Botón "Compartir a WhatsApp" (deep link `wa.me`) y "Copiar link"
- Performance check (imágenes optimizadas, lazy loading)

**Tests**
- Manual QA checklist en dispositivos reales (iOS/Android, distintos anchos)
- Lighthouse mobile score (definir umbral, ej. Performance > 85)
- E2E visual (smoke test de que no rompe nada después de las animaciones)

**Definición de Hecho:** la experiencia se siente pulida y rápida en mobile, que es el canal principal de uso.

---
### Iteración 6 — Sistema de diseño
 
**Dirección:** limpio, minimalista, moderno, fácil de usar. Solo modo claro (no se implementa modo oscuro). El "tono de evento" vive en las plantillas de tarjeta (Iteración 3), no en el shell de la app — esto mantiene la interfaz minimalista sin perder identidad festiva donde corresponde. El único gesto celebratorio en el shell es la animación de sello al confirmar la creación de un evento; el resto se mantiene deliberadamente quieto.
 
**Tokens de color**
| Token | Hex | Uso |
|---|---|---|
| Paper (bg) | `#FAFAFC` | Fondo de página |
| Surface | `#FFFFFF` | Cards, inputs |
| Border | `#E7E4ED` | Bordes, divisores |
| Ink | `#211D2C` | Texto principal |
| Ink Muted | `#6E6A7C` | Texto secundario |
| Accent (Azul tinta) | `#2C4A7C` | Botón primario, links, focus ring |
| Seal Gold | `#D9A441` | Acento celebratorio puntual (sello de confirmación) |
| Success | `#3F8361` | Confirmaciones de formulario |
| Error | `#C1453C` | Errores de validación |
 
**Tipografía**
| Rol | Fuente | Uso |
|---|---|---|
| Display | Sora (600/700) | Encabezados, nombre del evento, marca "Invitee" |
| Body / UI | Inter (400/500) | Formularios, texto de cuerpo, botones, labels |
 
**Otros tokens**
- Radio de borde: `10px` controles (botón, input), `16px` cards/tarjeta
- Espaciado base: `4px`, ritmo vertical en múltiplos de 8/12/16/24
- Motion: transiciones rápidas y simples (fade/slide, sin bounce) en general; la animación de "sello" (scale + rotate, ~600ms ease-out) es la única excepción deliberada, reservada al momento de crear un evento o generar la tarjeta
**Requerimientos (EARS)**
- EL SISTEMA DEBE implementar únicamente modo claro en el MVP.
- EL SISTEMA DEBE usar los tokens de color y tipografía definidos en esta sección en todos los componentes — sin colores o fuentes ad-hoc fuera de este set.
- CUANDO se crea un evento exitosamente, EL SISTEMA DEBE reproducir la animación de sello una sola vez como confirmación.
**Tareas**
- Configurar el theme de Tailwind con estos tokens (color, radius, spacing)
- Cargar Sora e Inter vía `next/font`
- Construir componentes base sobre Radix (Button primario/ghost, Input, Card) con estos estilos
- Implementar la animación de sello con Framer Motion en la confirmación de creación de evento
- Definir favicon/logomark basado en el motivo del sello
**Tests**
- Visual: capturas de los componentes base contra esta tabla de tokens
- Accesibilidad: contraste de texto cumple WCAG AA (ink sobre paper, blanco sobre azul tinta)
- Manual: la animación de sello se dispara una sola vez por creación, no en cada render
**Definición de Hecho:** toda la UI usa estos tokens de forma consistente, sin colores sueltos, y el sello es el único momento animado "fuerte" de la app.
 
---

### Iteración 7 — Diseño de las plantillas de tarjeta (3 estilos)
 
**Objetivo:** que las 3 plantillas por tipo de evento (15 combinaciones en total) tengan un sistema de diseño real detrás — no "estilo libre" sin criterio. Se definen **3 arquetipos de estilo**, cada uno con su propio sistema de color/tipografía/layout, aplicados consistentemente a los 5 tipos de evento.
 
**Por qué 3 arquetipos fijos en vez de 15 diseños sueltos:** mantiene coherencia visual dentro de cada estilo (alguien que elige "Elegante" para una boda y alguien que elige "Elegante" para un cumpleaños deberían sentir la misma calidad de diseño), y hace que agregar un tipo de evento nuevo en el futuro sea aplicar los 3 sistemas ya definidos, no diseñar de cero.
 
#### Estilo 1 — Moderno
| Token | Valor |
|---|---|
| Base | Marfil `#F7F5F0` |
| Texto | Tinta `#1A1A1A` |
| Acento (varía por tipo de evento) | Cumpleaños `#FF5A36` · Boda `#2C4A7C` · Graduación `#1F7A5C` · Baby shower `#D9A441` · Otro `#A23E5C` |
| Display | Geométrico oversized, mayúsculas (ej. Space Grotesk 700) |
| Body | Inter 400, chico, alineado a un borde |
 
**Layout:** asimétrico. Un bloque sólido del color de acento cubre ~35-40% del lienzo en un lado; el nombre del evento, en tipografía oversized, se recorta sobre el borde entre el bloque de color y el fondo claro — la tipografía funciona como elemento gráfico, no solo como texto. La foto (si se sube) va en un recuadro chico y nítido, nunca de fondo completo.
**Firma:** el nombre del evento tratado como pieza gráfica recortada sobre el bloque de color.
 
#### Estilo 2 — Elegante
| Token | Valor |
|---|---|
| Base | Marfil cálido `#F4EFE6` |
| Texto | Carbón `#2B2724` |
| Detalle (línea, no relleno) | Dorado `#B8924B` |
| Display | Serif refinado (ej. Fraunces 500, letterspacing leve en mayúsculas) |
| Body | Inter 300, muy liviano |
 
**Layout:** simétrico, centrado, márgenes generosos. Doble línea fina enmarca el contenido, como una tarjetería impresa. Un monograma o inicial del nombre del evento sobre el título — no un ícono genérico.
**Firma:** el marco de línea doble + el monograma. La elegancia vive en el espacio en blanco y la tipografía, sin adornos de más.
 
#### Estilo 3 — Ilustrado
| Token | Valor |
|---|---|
| Base | Pastel cálido `#FBF1E7` |
| Acento (mismo set que Moderno, para coherencia cross-estilo) | Cumpleaños `#FF5A36` · Boda `#2C4A7C` · Graduación `#1F7A5C` · Baby shower `#D9A441` · Otro `#A23E5C` |
| Display | Redondeado/amigable (ej. Fredoka 600) |
| Body | Inter 400 |
 
**Layout:** un motivo ilustrado en SVG de línea fina enmarca el contenido — varía por tipo de evento: globos + serpentinas (cumpleaños), ramo/anillos (boda), birrete + diploma (graduación), móvil de cuna (baby shower), confeti genérico (otro). El motivo se diseña una sola vez por tipo de evento (5 motivos en total) y se reutiliza en este estilo.
**Firma:** la técnica del trazo — mismo grosor de línea y estilo en los 5 motivos, aunque el objeto cambie. Es la consistencia lo que da la sensación de sistema, no la variedad de objetos.
 
**Requerimientos (EARS)**
- CUANDO el organizador elige un estilo de plantilla, EL SISTEMA DEBE aplicar el token system completo de ese estilo (color, tipografía, layout) — nunca una mezcla entre estilos.
- EL SISTEMA DEBE renderizar correctamente los 3 estilos con o sin foto subida, sin que el layout se rompa en ningún caso.
- EL SISTEMA DEBE mantener legibilidad (contraste WCAG AA) del texto sobre cada combinación de fondo/acento, en los 5 tipos de evento.
**Tareas**
- Implementar cada estilo como componente de maquetado parametrizado (nombre, fecha, lugar, mensaje, foto opcional), compatible con `satori`
- Diseñar los 5 motivos SVG de línea fina para el Estilo Ilustrado (uno por tipo de evento)
- Generar los 15 previews estáticos (3 estilos × 5 tipos) para el selector de plantilla
- Revisar contraste de texto en las 15 combinaciones
**Tests**
- Visual: cada combinación renderiza sin overlap de texto con un nombre de evento largo (ej. "Cumpleaños de cincuenta años de la abuela Margarita")
- Integration: el componente de plantilla no rompe el layout cuando no hay foto subida
- Accesibilidad: contraste de texto cumple WCAG AA en las 15 combinaciones
- E2E: elegir cada uno de los 3 estilos en el selector → la tarjeta generada refleja el sistema de diseño correcto
**Definición de Hecho:** las 15 combinaciones (3 estilos × 5 tipos de evento) están terminadas, documentadas como sistema (no como diseños sueltos), y ninguna se rompe con texto largo o sin foto.

---

## 8. Fuera de alcance (backlog futuro)
- Cuentas de usuario / login social
- Múltiples eventos por usuario logueado
- Notificaciones
- "Regalo grupal" con aportes/cuotas
- Marcar regalo como reservado (removido del MVP por conflicto con la sorpresa — ver Iteración 2; si se reincorpora, requiere ocultarlo del organizador-receptor y delegar el "deshacer" al invitado)
- QR para imprimir en invitaciones físicas
- Modo privado con contraseña
- Editor de tarjeta con personalización libre de colores/fuentes
- Analytics de visitas
- Multi-idioma
- Agregar regalos por invitados (decisión: solo el organizador puede agregar)
- Modo oscuro

---

## 9. Decisiones registradas (changelog)
| Pregunta | Decisión |
|---|---|
| Plantillas por tipo de evento | 3 |
| Diseño de plantillas | Generadas con IA |
| Reservar regalo | Eliminado del MVP (conflicto con sorpresa) |
| Agregar regalos por cualquiera | No, solo organizador |
| Límite de regalos por evento | No hay límite |
| Almacenamiento | Firebase (Firestore + Storage) |
| Capa de datos | Ports & Adapters sobre Firebase (ADR-001) |
| Frontend | Next.js + Tailwind + Radix |
| Animaciones | Framer Motion |
| Color de acento | Azul tinta `#2C4A7C` |
| Tipografía | Sora (display) + Inter (body) |
| Modo oscuro | No incluido en el MVP |