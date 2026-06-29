import type { FontSpec, FontEntry } from "./_types"

const fontCache = new Map<string, ArrayBuffer>()

async function loadFont(family: string, weight: number): Promise<ArrayBuffer | null> {
  const key = `${family}:${weight}`
  if (fontCache.has(key)) return fontCache.get(key)!
  try {
    const cssUrl = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@${weight}`
    const css = await fetch(cssUrl).then((r) => r.text())
    const urlMatch = css.match(/url\((https:\/\/fonts\.gstatic\.com\/s\/[^)]+)\)/)
    if (!urlMatch) return null
    const data = await fetch(urlMatch[1]).then((r) => r.arrayBuffer())
    fontCache.set(key, data)
    return data
  } catch {
    return null
  }
}

export async function loadFontsFor(specs: FontSpec[]): Promise<FontEntry[]> {
  const results = await Promise.all(
    specs.map(async (spec) => {
      const data = await loadFont(spec.family, spec.weight)
      if (!data) return null
      return { name: spec.family, data, weight: spec.weight, style: "normal" as const }
    })
  )
  return results.filter((r): r is FontEntry => r !== null)
}
