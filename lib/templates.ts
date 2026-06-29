export type TemplateStyle = "moderno" | "elegante" | "ilustrado";

export interface Template {
  id: string;
  eventType: string;
  name: string;
  style: TemplateStyle;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  emoji: string;
}

const ACCENT: Record<string, string> = {
  birthday: "#FF5A36",
  wedding: "#2C4A7C",
  graduation: "#1F7A5C",
  babyshower: "#D9A441",
  other: "#A23E5C",
};

const MODERNO_BASE = "#F7F5F0";
const MODERNO_TEXT = "#1A1A1A";

const ELEGANTE_BASE = "#F4EFE6";
const ELEGANTE_TEXT = "#2B2724";
const ELEGANTE_BORDER = "#B8924B";

const ILUSTRADO_BASE = "#FBF1E7";

const EVENT_TYPES = ["birthday", "wedding", "graduation", "babyshower", "other"] as const;
const STYLES: { style: TemplateStyle; suffix: string; label: string; emoji: string }[] = [
  { style: "moderno", suffix: "1", label: "Moderno", emoji: "◼" },
  { style: "elegante", suffix: "2", label: "Elegante", emoji: "◆" },
  { style: "ilustrado", suffix: "3", label: "Ilustrado", emoji: "✿" },
];

const templates: Template[] = EVENT_TYPES.flatMap((type) =>
  STYLES.map((s) => {
    const id = `${type}-${s.suffix}`;
    const accent = ACCENT[type];
    switch (s.style) {
      case "moderno":
        return { id, eventType: type, name: s.label, style: s.style, backgroundColor: MODERNO_BASE, textColor: MODERNO_TEXT, accentColor: accent, emoji: s.emoji };
      case "elegante":
        return { id, eventType: type, name: s.label, style: s.style, backgroundColor: ELEGANTE_BASE, textColor: ELEGANTE_TEXT, accentColor: ELEGANTE_BORDER, emoji: s.emoji };
      case "ilustrado":
        return { id, eventType: type, name: s.label, style: s.style, backgroundColor: ILUSTRADO_BASE, textColor: MODERNO_TEXT, accentColor: accent, emoji: s.emoji };
    }
  })
);

export function getTemplatesForType(eventType: string): Template[] {
  return templates.filter((t) => t.eventType === eventType);
}

export function getTemplate(id: string): Template | undefined {
  return templates.find((t) => t.id === id);
}

export function defaultTemplateId(eventType: string): string {
  return `${eventType}-1`;
}
