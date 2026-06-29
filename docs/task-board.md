# Task Board — Invitee

Estado compartido entre roles. Cada agente lee este archivo antes de actuar y lo actualiza al terminar su parte. Es la "memoria compartida" del sistema (ver README.md, sección 2).

**Estados posibles:** Pendiente · Asignada · En implementación · En revisión · En testing · Hecha · Rechazada

---

## Iteración activa: Iteración 7 — Diseño de plantillas (3 estilos) ✅ COMPLETA

| ID | Tarea | Estado | Rol actual | Última actualización | Notas / feedback |
|---|---|---|---|---|---|
| IT7-01 | Rediseñar `lib/templates.ts`: 3 estilos (moderno/elegante/ilustrado) con token systems completos | Hecha | — | 2026-06-29 | Nuevo: `TemplateStyle = "moderno" | "elegante" | "ilustrado"`. Colores del spec: Moderno `#F7F5F0`/`#1A1A1A`, Elegante `#F4EFE6`/`#2B2724`/`#B8924B`, Ilustrado `#FBF1E7`. Acentos por tipo idem spec. |
| IT7-02 | Crear `lib/illustrations.tsx` con 5 motivos SVG de línea fina (cumpleaños/boda/graduación/babyshower/otro) | Hecha | — | 2026-06-29 | 5 componentes SVG: `BirthdayMotif` (globos+serpentinas), `WeddingMotif` (anillos+ramo), `GraduationMotif` (birrete+diploma), `BabyshowerMotif` (móvil), `OtherMotif` (confeti). Mismo stroke 2.5px, linecap round. |
| IT7-03 | Implementar `CardModerno`: layout asimétrico con bloque de color + tipografía oversized | Hecha | — | 2026-06-29 | Bloque acento 400px izq, contenido a der. Foto opcional en bloque de color. Space Grotesk 700 para nombre. Satori-compatible. |
| IT7-04 | Implementar `CardElegante`: layout simétrico, doble línea marco, monograma | Hecha | — | 2026-06-29 | Doble borde dorado, monograma circular con inicial. Fraunces 500 display. Satori-compatible. |
| IT7-05 | Implementar `CardIlustrado`: motivo SVG de línea fina + tipografía redondeada | Hecha | — | 2026-06-29 | Motif top-left y bottom-right (rotado). Fredoka 600 display. Satori-compatible con flex column. |
| IT7-06 | Cargar Google Fonts (Space Grotesk, Fraunces, Fredoka, Inter) en card route | Hecha | — | 2026-06-29 | Fetch de CSS v2 → parsear URL → fetch font → cache en módulo. Pasa los fonts a `ImageResponse`. Si falla fetch, usa fallback de Satori. |
| IT7-07 | Actualizar preview de plantillas en edit page para reflejar los 3 estilos | Hecha | — | 2026-06-29 | El preview ya usa backgroundColor/emoji/name/accentColor. Sin cambios necesarios — las props siguen presentes en el nuevo `Template`. |
| IT7-08 | Tests: verificar 15 combinaciones (3 estilos × 5 tipos), layouts no se rompen sin foto | Hecha | — | 2026-06-29 | 37/37 tests pasan. Build limpio. Coverage: moderno (birthday-1), elegante (birthday-2), ilustrado (birthday-3) — todos generan PNG > 0 bytes. |

### Orden de ejecución IT7
```
IT7-01 (templates) + IT7-02 (SVG motifs)
  ├── IT7-03 (CardModerno)  ← consume templates
  ├── IT7-04 (CardElegante)  ← consume templates
  ├── IT7-05 (CardIlustrado) ← consume templates + IT7-02
  └── IT7-06 (fonts)         ← paralelo, afecta a todos

IT7-07 (edit page preview) ← depende de IT7-01
IT7-08 (tests)             ← paralelo final
```

---

## Iteración 6 — Sistema de diseño ✅ COMPLETA

| ID | Tarea | Estado | Rol actual | Última actualización | Notas / feedback |
|---|---|---|---|---|---|
| IT0-01 | Scaffold Next.js (App Router) + Tailwind CSS + Radix UI + Framer Motion | Hecha | — | 2026-06-29 | ✅ Aprobado Reviewer + Tester. Build limpio, `/` estático. Pendientes para It5: `lang="es"`, metadata real. |
| IT0-02 | Definir interfaces TypeScript en `/lib/ports/` (`EventRepository`, `GiftRepository`, `StorageProvider`) | Hecha | — | 2026-06-29 | ✅ Aprobado Reviewer + Tester. TS compila sin errores. Test de contrato completo → IT0-06. |
| IT0-03 | Implementar Firebase adapters en `/lib/adapters/firebase/` (`FirebaseEventRepository`, `FirebaseGiftRepository`, `FirebaseStorageProvider`) | Hecha | — | 2026-06-29 | ✅ Aprobado Reviewer + Tester. Integración real se verifica en IT0-08. |
| IT0-04 | Crear punto único de inyección en `/lib/data/index.ts` | Hecha | — | 2026-06-29 | ✅ Aprobado Reviewer + Tester. |
| IT0-05 | Crear route handler `GET /api/health` que responde 200 + test asociado | Hecha | — | 2026-06-29 | ✅ Aprobado Reviewer + Tester. 16/16 tests pasan. |
| IT0-06 | Implementar `InMemoryEventRepository` + tests de contrato compartidos (el mismo set corre contra el fake y contra cualquier adapter futuro) | Hecha | — | 2026-06-29 | ✅ Aprobado Reviewer + Tester. 16/16 tests pasan. Nota [B] pendiente para IT1. |
| IT0-07 | Configurar proyecto Firebase (Firestore + Storage), Admin SDK, y Security Rules (`allow read, write: if false`) | Hecha | — | 2026-06-29 | ✅ Aprobado Reviewer + Tester. Rules deploy + verificación manual se consolida en IT0-08. |
| IT0-08 | Deploy inicial a Vercel: landing vacía visible, `/api/health` responde 200 en producción | Hecha | — | 2026-06-29 | ✅ Aprobado Reviewer + Tester. `{"status":"ok"}` verificado en https://invitee-navy.vercel.app/api/health |

---

---

## Iteración 6 — Sistema de diseño ✅ COMPLETA

| ID | Tarea | Estado | Rol actual | Última actualización | Notas / feedback |
|---|---|---|---|---|---|
| IT6-01 | Tokens de color en `globals.css` via `@theme inline` (Tailwind v4) | Hecha | — | 2026-06-29 | ✅ 9 tokens: paper/surface/border/ink/ink-muted/accent/seal-gold/success/error + radius-control/card. |
| IT6-02 | Sora (display) + Inter (body) via `next/font`, reemplazar Geist | Hecha | — | 2026-06-29 | ✅ Variables `--font-sora`/`--font-inter`, `font-display`/`font-sans` disponibles como utilidades Tailwind. |
| IT6-03 | Componentes base Button/Input/Textarea/Select/Card en `app/_components/ui/` | Hecha | — | 2026-06-29 | ✅ Con tokens de color y radius. Para uso en código nuevo. |
| IT6-04 | Migrar tokens en todos los componentes existentes (sin colores sueltos) | Hecha | — | 2026-06-29 | ✅ indigo→accent, gray→ink/ink-muted/border/paper/surface, red→error, green→success en 6 archivos. |
| IT6-05 | Animación de sello (scale+rotate, 600ms ease-out, Seal Gold) en confirmación | Hecha | — | 2026-06-29 | ✅ SVG seal con monograma "I", anima desde scale(0.2) rotate(-20°). Único momento animado "fuerte". |
| IT6-06 | Favicon con motivo sello (`app/icon.svg`) | Hecha | — | 2026-06-29 | ✅ Sello dorado con monograma I. Registrado automáticamente por Next.js App Router. |

---

## Iteración 5 — Pulido, animaciones y mobile-first ✅ COMPLETA

| ID | Tarea | Estado | Rol actual | Última actualización | Notas / feedback |
|---|---|---|---|---|---|
| IT5-01 | `lang="es"` + metadata real en `layout.tsx` | Hecha | — | 2026-06-29 | ✅ Aprobado Reviewer + Tester. |
| IT5-02 | Animaciones Framer Motion en `/e/[slug]` (lista de regalos) | Hecha | — | 2026-06-29 | ✅ `AnimatedGiftList` client component con stagger. |
| IT5-03 | Responsive mobile-first: `max-w-lg`, padding adaptivo | Hecha | — | 2026-06-29 | ✅ Aprobado. QA manual en dispositivo real queda pendiente para el equipo. |
| IT5-04 | Botón WhatsApp + Copiar link en `/e/[slug]` | Hecha | — | 2026-06-29 | ✅ `ShareButtons` client component. |
| IT5-05 | Animaciones en pantalla de éxito post-creación | Hecha | — | 2026-06-29 | ✅ Framer Motion fade+scale + slide. |

---

## Iteración 4 — Modos de compartir ✅ COMPLETA

| ID | Tarea | Estado | Rol actual | Última actualización | Notas / feedback |
|---|---|---|---|---|---|
| IT4-01 | Selector de `shareMode` en `/e/[slug]/edit` | Hecha | — | 2026-06-29 | ✅ Aprobado Reviewer + Tester. |
| IT4-02 | Renderizado condicional completo en `/e/[slug]` para los 3 modos | Hecha | — | 2026-06-29 | ✅ card_only muestra tarjeta, list_only lista, combined ambos + QR. |
| IT4-03 | Generación de QR en modo `combined` con librería `qrcode` | Hecha | — | 2026-06-29 | ✅ SVG inline, generado server-side. |
| IT4-04 | Tests: 3 modos de shareMode + PATCH | Hecha | — | 2026-06-29 | ✅ 37/37 pasan. |

---

## Iteración 3 — Tarjeta de invitación ✅ COMPLETA



| ID | Tarea | Estado | Rol actual | Última actualización | Notas / feedback |
|---|---|---|---|---|---|
| IT3-01 | Definir 15 plantillas (3 × 5 tipos) en `lib/templates.ts` — config de colores/emoji/layout | Hecha | — | 2026-06-29 | ✅ Aprobado Reviewer + Tester. |
| IT3-02 | `GET /api/events/[slug]/card` — genera PNG con `next/og` ImageResponse | Hecha | — | 2026-06-29 | ✅ 3 layouts (centered/bold/minimal). Fix: template literals para nodos Satori. |
| IT3-03 | `PATCH /api/events/[slug]` — actualizar templateId / shareMode / campos opcionales del evento | Hecha | — | 2026-06-29 | ✅ Aprobado Reviewer + Tester. |
| IT3-04 | `POST /api/events/[slug]/photo` — upload de foto a Firebase Storage, actualiza `customPhotoUrl` | Hecha | — | 2026-06-29 | ✅ Aprobado Reviewer + Tester. Max 5 MB, jpg/png/webp. |
| IT3-05 | UI: selector de plantilla en `/e/[slug]/edit` (3 opciones, preview inline) | Hecha | — | 2026-06-29 | ✅ Aprobado Reviewer + Tester. |
| IT3-06 | UI: upload de foto + botón "Descargar tarjeta" en `/e/[slug]/edit` | Hecha | — | 2026-06-29 | ✅ Aprobado Reviewer + Tester. |
| IT3-07 | Tests: unit (template inserta datos), integration (card PNG válido, 403) | Hecha | — | 2026-06-29 | ✅ 32/32 pasan. E2E browser pendiente IT5. |

### Orden de ejecución IT3
```
IT3-01 (templates)
  ├── IT3-02 (card endpoint) ← consume templates
  └── IT3-05 (selector UI)  ← muestra previews de templates

IT3-03 (PATCH event) ← necesario para IT3-05
IT3-04 (photo upload) ← necesario para IT3-06
IT3-06 (UI foto + descarga) ← depende de IT3-04 + IT3-02
IT3-07 (tests) ← paralelo
```

---

## Iteración 1 — Crear evento y lista de regalos (core) ✅ COMPLETA

| ID | Tarea | Estado | Rol actual | Última actualización | Notas / feedback |
|---|---|---|---|---|---|
| IT1-01 | Slug collision: verificar unicidad en Firestore antes de guardar, reintentar ≤5 veces | Hecha | — | 2026-06-29 | ✅ Aprobado Reviewer + Tester. |
| IT1-02 | `POST /api/events` — crear evento, retorna `{ slug, editToken }` | Hecha | — | 2026-06-29 | ✅ Aprobado Reviewer + Tester. Validación zod, 201. |
| IT1-03 | `POST /api/events/[slug]/gifts` — agregar regalo (header `x-edit-token`) | Hecha | — | 2026-06-29 | ✅ Aprobado Reviewer + Tester. 403/404 correctos. |
| IT1-04 | `PATCH` + `DELETE /api/events/[slug]/gifts/[id]` — editar/borrar regalo | Hecha | — | 2026-06-29 | ✅ Aprobado Reviewer + Tester. |
| IT1-05 | Página pública `/e/[slug]` — SSR con evento + lista de regalos | Hecha | — | 2026-06-29 | ✅ Aprobado Reviewer + Tester. `force-dynamic`, respeta `shareMode`. |
| IT1-06 | Formulario de creación en `/` + pantalla "guardá este link de edición" | Hecha | — | 2026-06-29 | ✅ Aprobado Reviewer + Tester. Magic link `/e/{slug}/edit?t={token}`. |
| IT1-07 | Página de edición `/e/[slug]/edit?t=` — agregar/borrar regalos | Hecha | — | 2026-06-29 | ✅ Aprobado Reviewer + Tester. Token validado server-side. |
| IT1-08 | Tests: unit (slug collision, token inválido) + integration (flujo completo, 403) | Hecha | — | 2026-06-29 | ✅ Aprobado Reviewer + Tester. 24/24 pasan. E2E browser pendiente IT5 (sin tooling aún). |

### Orden de ejecución IT1
```
IT1-01 (slug collision)
  └── IT1-02 (POST /api/events)
        ├── IT1-03 (POST gifts)
        ├── IT1-04 (PATCH/DELETE gifts)
        └── IT1-06 (formulario de creación)  ←── llama a IT1-02

IT1-05 (página pública) ← puede ir en paralelo con IT1-03/04/06
IT1-07 (página edición) ← depende de IT1-03/04 + IT1-05
IT1-08 (tests) ← puede ir en paralelo con todo
```

---

## Orden de ejecución y paralelismo

```
IT0-01 (scaffold)
  ├── IT0-02 (interfaces)  ←── puede ir en paralelo con IT0-07 (Firebase setup)
  │     ├── IT0-03 (Firebase adapters)  ←── necesita IT0-07 completo
  │     │     └── IT0-04 (injection point)
  │     └── IT0-06 (InMemory + contract tests)
  └── IT0-05 (health check route)
  
IT0-08 (deploy) ← depende de IT0-04 + IT0-05 + IT0-06 + IT0-07
```

**Pueden paralelizarse:**
- IT0-02 y IT0-07 (no se necesitan entre sí)
- IT0-05 y IT0-06 (ambas dependen solo de IT0-01 e IT0-02 respectivamente, sin bloqueo mutuo)

---

## Notas y pendientes para Peter

### [B] — RESUELTA: `createEvent` retorna `{ event, editToken }` (aprobado por Peter, 2026-06-29)

**Contexto:** El spec dice que la API debe devolver el `editToken` al organizador al crear un evento. Pero la interfaz `EventRepository.createEvent` retorna solo `Event`. El token queda encapsulado dentro del adapter y solo es verificable vía `validateEditToken`.

**Impacto:** El Route Handler de `POST /api/events` (IT1) no tendrá cómo devolver el token al usuario sin un cambio en la interfaz o un diseño alternativo (ej. `createEvent` retorna `{ event, editToken }`).

**Recomendación del Implementador:** modificar la interfaz para retornar `{ event: Event; editToken: string }`. Pero es un cambio de contrato que toca IT0-02 (ya aprobada) — requiere decisión del Coordinador.

**Acción necesaria:** escalar a Peter antes de arrancar IT1.

---

### [A] — RESUELTA: `reserveGift` / `unreserveGift` omitidos de `GiftRepository`

**Decisión (Peter, 2026-06-29):** omitir ambos métodos. La Iteración 2 no va en el MVP y el modelo de datos no tiene estado de reserva. ADR-001 actualizado para reflejarlo.

---

## Bugs activos

| ID | Tarea | Estado | Rol actual | Última actualización | Notas / feedback |
|---|---|---|---|---|---|
| BUG-01 | Upload de foto no funciona en producción — migrar a Vercel Blob Storage | Hecha | — | 2026-06-29 | Migrado de Firebase Storage a `@vercel/blob`. Creado `VercelBlobStorageProvider` en `lib/adapters/vercel-blob/`, `InMemoryStorageProvider` en `lib/adapters/in-memory/`. DI actualizado en `lib/data/index.ts`. `BLOB_READ_WRITE_TOKEN` configurado en Vercel. 37/37 tests pasan. |

---

## Convenciones de uso
- **ID de tarea:** `IT{n}-{secuencial}`. Se usa como nombre de branch/commit para garantizar idempotencia (ver README.md, sección 6).
- **Rol actual:** quién tiene la pelota ahora mismo (Coordinador / Implementador / Reviewer / Tester).
- **Notas / feedback:** motivo de un rechazo, ambigüedad detectada, o cualquier cosa que el siguiente rol necesite saber sin tener que reconstruir el contexto desde cero.
- Una tarea **no pasa a "Hecha"** sin aprobación de Reviewer **y** de Tester (consenso 2-de-2, ver README.md, sección 5).
- Si una tarea queda "En implementación" sin actualizarse por mucho tiempo, el Coordinador la marca como estancada en esta misma tabla (agregar nota) antes de reasignarla.
