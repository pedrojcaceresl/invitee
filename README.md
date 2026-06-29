# Invitee

Creá en minutos una tarjeta de invitación y lista de regalos para tu evento, compartible con un solo link. Sin login.

[invitee-navy.vercel.app](https://invitee-navy.vercel.app)

---

## Qué hace

- Creá un evento (cumpleaños, boda, graduación, baby shower, otro)
- Elegí entre **3 estilos de tarjeta**: Moderno, Elegante, Ilustrado
- Subí una foto personalizada
- Agregá una lista de regalos con links de compra
- Elegí cómo compartir: solo tarjeta, solo lista, o tarjeta + QR a la lista
- Descargá la tarjeta como PNG
- Compartí con un solo link — cada evento recibe preview con OG metadata

---

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 16 (App Router) |
| Estilos | Tailwind CSS v4, Radix UI |
| Animaciones | Framer Motion |
| Tipografía | Sora (display), Inter (body) |
| Base de datos | Firebase Firestore |
| Archivos | Vercel Blob Storage |
| Generación de imágenes | `next/og` (Satori) |
| QR | `qrcode` |
| Validación | Zod v4 |
| Tests | Vitest |
| Deploy | Vercel |

---

## Arquitectura

El proyecto sigue el patrón **Ports & Adapters**: los Route Handlers no importan Firebase directamente. Llaman a interfaces en `/lib/ports/` cuya implementación actual está en `/lib/adapters/`. Esto permite migrar a otro backend cambiando un solo archivo.

```
lib/
├── ports/          → Interfaces (EventRepository, GiftRepository, StorageProvider)
├── adapters/
│   ├── firebase/   → Implementaciones con Firebase Admin SDK
│   ├── in-memory/  → Fakes para tests
│   └── vercel-blob/→ Upload de fotos con Vercel Blob
├── data/index.ts   → Punto único de inyección
├── templates.ts    → 15 plantillas (3 estilos × 5 tipos de evento)
├── illustrations.tsx → 5 motivos SVG de línea fina (Estilo Ilustrado)
└── types.ts        → Tipos compartidos
```

---

## Cómo correr localmente

### Requisitos

- Node.js 18+
- Un proyecto Firebase con Firestore habilitado
- Una cuenta Vercel con Blob Storage habilitado

### Instalación

```bash
git clone https://github.com/pedrojcaceresl/invitee.git
cd invitee
npm install
```

### Variables de entorno

Copiá `.env.example` a `.env.local` y completá:

```bash
cp .env.example .env.local
```

Variables requeridas:

| Variable | Descripción |
|---|---|
| `FIREBASE_PROJECT_ID` | ID del proyecto Firebase |
| `FIREBASE_CLIENT_EMAIL` | Email de la service account |
| `FIREBASE_PRIVATE_KEY` | Private key de la service account |
| `FIREBASE_STORAGE_BUCKET` | Bucket de Firebase Storage (requerido por Admin SDK, aunque no se use para uploads) |
| `BLOB_READ_WRITE_TOKEN` | Token de Vercel Blob Storage |

### Desarrollo

```bash
npm run dev        # Servidor en http://localhost:3000
npm run test       # 37 tests con Vitest
npm run test:watch # Tests en modo watch
npm run lint       # ESLint
npm run build      # Build de producción
```

---

## Proyecto

Hecho con amor por [Pedro](https://www.linkedin.com/in/pedrojcaceresl/).
