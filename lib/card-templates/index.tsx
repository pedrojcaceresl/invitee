import type { Event } from "@/lib/types"
import type { CardEntry } from "./_types"
import { CardModernoLayout } from "./layouts/moderno"
import { CardEleganteLayout } from "./layouts/elegante"
import { CardIlustradoLayout } from "./layouts/ilustrado"

const ACCENT: Record<string, string> = {
  birthday: "#FF5A36",
  wedding: "#2C4A7C",
  graduation: "#1F7A5C",
  babyshower: "#D9A441",
  other: "#A23E5C",
}

const BACKGROUND = "#FAFAFC"
const TEXT = "#211D2C"

const EVENT_TYPES = ["birthday", "wedding", "graduation", "babyshower", "other"] as const

const registry = new Map<string, CardEntry>()

for (const type of EVENT_TYPES) {
  const accent = ACCENT[type]

  registry.set(`${type}-1`, {
    render: (event: Event) => (
      <CardModernoLayout event={event} accent={accent} background={BACKGROUND} text={TEXT} />
    ),
    fonts: [
      { family: "Space Grotesk", weight: 700 },
      { family: "Inter", weight: 400 },
      { family: "Inter", weight: 300 },
    ],
  })

  registry.set(`${type}-2`, {
    render: (event: Event) => (
      <CardEleganteLayout event={event} accent={accent} />
    ),
    fonts: [
      { family: "Fraunces", weight: 500 },
      { family: "Inter", weight: 400 },
      { family: "Inter", weight: 300 },
    ],
  })

  registry.set(`${type}-3`, {
    render: (event: Event) => (
      <CardIlustradoLayout event={event} accent={accent} />
    ),
    fonts: [
      { family: "Fredoka", weight: 600 },
      { family: "Inter", weight: 400 },
      { family: "Inter", weight: 300 },
    ],
  })
}

export function getCardTemplate(templateId: string): CardEntry | undefined {
  return registry.get(templateId)
}

export type { CardEntry, FontSpec, FontEntry } from "./_types"
export { loadFontsFor } from "./_fonts"
