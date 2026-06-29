import type { Event } from "@/lib/types"

export type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900

export interface FontSpec {
  family: string
  weight: FontWeight
}

export interface FontEntry {
  name: string
  data: ArrayBuffer
  weight: FontWeight
  style: "normal"
}

export interface CardEntry {
  render: (event: Event) => React.ReactElement
  fonts: FontSpec[]
}
