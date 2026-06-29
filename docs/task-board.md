# Task Board — Invitee

Estado compartido entre roles. Cada agente lee este archivo antes de actuar y lo actualiza al terminar su parte. Es la "memoria compartida" del sistema (ver README.md, sección 2).

**Estados posibles:** Pendiente · Asignada · En implementación · En revisión · En testing · Hecha · Rechazada

---

## Iteración activa: Iteración 0 — Setup y esqueleto

| ID | Tarea | Estado | Rol actual | Última actualización | Notas / feedback |
|---|---|---|---|---|---|
| IT0-01 | Scaffold Next.js (App Router) + Tailwind CSS + Radix UI + Framer Motion | Asignada | Implementador | 2026-06-29 | Punto de partida. Todo lo demás depende de este. |
| IT0-02 | Definir interfaces TypeScript en `/lib/ports/` (`EventRepository`, `GiftRepository`, `StorageProvider`) | Pendiente | — | 2026-06-29 | Ver nota [A] sobre `reserveGift`/`unreserveGift` — requiere decisión de Peter antes de implementar. |
| IT0-03 | Implementar Firebase adapters en `/lib/adapters/firebase/` (`FirebaseEventRepository`, `FirebaseGiftRepository`, `FirebaseStorageProvider`) | Pendiente | — | 2026-06-29 | Depende de IT0-01 e IT0-02. Requiere que IT0-07 (Firebase setup) esté hecho para poder conectar. |
| IT0-04 | Crear punto único de inyección en `/lib/data/index.ts` | Pendiente | — | 2026-06-29 | Depende de IT0-03. |
| IT0-05 | Crear route handler `GET /api/health` que responde 200 + test asociado | Pendiente | — | 2026-06-29 | Depende de IT0-01. Independiente de Firebase. |
| IT0-06 | Implementar `InMemoryEventRepository` + tests de contrato compartidos (el mismo set corre contra el fake y contra cualquier adapter futuro) | Pendiente | — | 2026-06-29 | Depende de IT0-02. Puede ir en paralelo con IT0-03 y IT0-07. |
| IT0-07 | Configurar proyecto Firebase (Firestore + Storage), Admin SDK, y Security Rules (`allow read, write: if false`) | Pendiente | — | 2026-06-29 | Tarea manual + configuración de variables de entorno. Puede ir en paralelo con IT0-02 y IT0-06. |
| IT0-08 | Deploy inicial a Vercel: landing vacía visible, `/api/health` responde 200 en producción | Pendiente | — | 2026-06-29 | Depende de todas las anteriores. Definición de Hecho de la iteración. |

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

### [A] — RESUELTA: `reserveGift` / `unreserveGift` omitidos de `GiftRepository`

**Decisión (Peter, 2026-06-29):** omitir ambos métodos. La Iteración 2 no va en el MVP y el modelo de datos no tiene estado de reserva. ADR-001 actualizado para reflejarlo.

---

## Convenciones de uso
- **ID de tarea:** `IT{n}-{secuencial}`. Se usa como nombre de branch/commit para garantizar idempotencia (ver README.md, sección 6).
- **Rol actual:** quién tiene la pelota ahora mismo (Coordinador / Implementador / Reviewer / Tester).
- **Notas / feedback:** motivo de un rechazo, ambigüedad detectada, o cualquier cosa que el siguiente rol necesite saber sin tener que reconstruir el contexto desde cero.
- Una tarea **no pasa a "Hecha"** sin aprobación de Reviewer **y** de Tester (consenso 2-de-2, ver README.md, sección 5).
- Si una tarea queda "En implementación" sin actualizarse por mucho tiempo, el Coordinador la marca como estancada en esta misma tabla (agregar nota) antes de reasignarla.
