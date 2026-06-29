export const EVENT_LABELS: Record<string, string> = {
  birthday: "Cumpleaños",
  wedding: "Boda",
  graduation: "Graduación",
  babyshower: "Baby Shower",
  other: "Celebración",
}

export function formatDate(dateStr: string | null): string | null {
  if (!dateStr) return null
  try {
    return new Date(dateStr).toLocaleDateString("es-AR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  } catch {
    return dateStr
  }
}

export function titleFontSize(name: string): number {
  if (name.length > 28) return 48
  if (name.length > 20) return 58
  if (name.length > 14) return 70
  return 82
}
