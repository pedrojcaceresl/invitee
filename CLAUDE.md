@AGENTS.md

# Proyecto: Invitee

App para crear tarjetas de invitación y listas de regalos compartibles con un link. Sin login.

## Al inicio de cada sesión

1. Leer `docs/task-board.md` para saber el estado actual del proyecto.
2. Leer `docs/spec-invitee.md` si la tarea toca requerimientos o iteraciones.
3. Leer `docs/adr-001-capa-de-datos.md` si la tarea toca la capa de datos.

## Al final de cada sesión o actividad significativa

Actualizar `docs/task-board.md` con el estado real de cada tarea trabajada. El task board es la fuente de verdad compartida entre sesiones y entre roles (Coordinador, Implementador, Reviewer, Tester).

## Roles disponibles

Los roles están definidos en `docs/`: `coordinador.md`, `implementador.md`, `reviewer.md`, `tester.md`.
El flujo es: Coordinador planifica → Implementador ejecuta → Reviewer aprueba → Tester valida → Hecha.
Una tarea no pasa a "Hecha" sin aprobación de Reviewer Y Tester.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind v4 · Radix UI · Framer Motion · Firebase Admin SDK · Vitest

## Regla de arquitectura (ADR-001)

El código de negocio y los Route Handlers NUNCA importan Firebase directamente.
Todo acceso a datos va por las interfaces en `/lib/ports/` → implementadas en `/lib/adapters/firebase/`.
El punto de inyección único es `/lib/data/index.ts`.

## URLs

- Producción: https://invitee-navy.vercel.app
- Firebase: https://console.firebase.google.com/project/invitee-238ce
