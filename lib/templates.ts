export type TemplateLayout = "centered" | "bold" | "minimal";

export interface Template {
  id: string;
  eventType: string;
  name: string;
  emoji: string;
  backgroundColor: string;
  accentColor: string;
  textColor: string;
  layout: TemplateLayout;
}

const templates: Template[] = [
  // Birthday
  { id: "birthday-1", eventType: "birthday", name: "Globos", emoji: "🎂", backgroundColor: "#fef3c7", accentColor: "#f59e0b", textColor: "#78350f", layout: "centered" },
  { id: "birthday-2", eventType: "birthday", name: "Confetti", emoji: "🎉", backgroundColor: "#fdf4ff", accentColor: "#a855f7", textColor: "#4a044e", layout: "bold" },
  { id: "birthday-3", eventType: "birthday", name: "Minimal", emoji: "🎈", backgroundColor: "#f0fdf4", accentColor: "#22c55e", textColor: "#14532d", layout: "minimal" },
  // Wedding
  { id: "wedding-1", eventType: "wedding", name: "Romántico", emoji: "💍", backgroundColor: "#fff1f2", accentColor: "#f43f5e", textColor: "#881337", layout: "centered" },
  { id: "wedding-2", eventType: "wedding", name: "Elegante", emoji: "🌹", backgroundColor: "#fdf8f0", accentColor: "#c9a96e", textColor: "#3d2a00", layout: "bold" },
  { id: "wedding-3", eventType: "wedding", name: "Jardín", emoji: "🌸", backgroundColor: "#f0fdf4", accentColor: "#4ade80", textColor: "#14532d", layout: "minimal" },
  // Graduation
  { id: "graduation-1", eventType: "graduation", name: "Diploma", emoji: "🎓", backgroundColor: "#eff6ff", accentColor: "#3b82f6", textColor: "#1e3a8a", layout: "centered" },
  { id: "graduation-2", eventType: "graduation", name: "Logro", emoji: "🏆", backgroundColor: "#fefce8", accentColor: "#eab308", textColor: "#713f12", layout: "bold" },
  { id: "graduation-3", eventType: "graduation", name: "Futuro", emoji: "🚀", backgroundColor: "#f8fafc", accentColor: "#64748b", textColor: "#0f172a", layout: "minimal" },
  // Baby shower
  { id: "babyshower-1", eventType: "babyshower", name: "Celeste", emoji: "👶", backgroundColor: "#eff6ff", accentColor: "#60a5fa", textColor: "#1e3a8a", layout: "centered" },
  { id: "babyshower-2", eventType: "babyshower", name: "Rosa", emoji: "🍼", backgroundColor: "#fdf4ff", accentColor: "#e879f9", textColor: "#701a75", layout: "bold" },
  { id: "babyshower-3", eventType: "babyshower", name: "Neutro", emoji: "🐻", backgroundColor: "#fefce8", accentColor: "#d97706", textColor: "#451a03", layout: "minimal" },
  // Other
  { id: "other-1", eventType: "other", name: "Fiesta", emoji: "🥳", backgroundColor: "#fff7ed", accentColor: "#f97316", textColor: "#431407", layout: "centered" },
  { id: "other-2", eventType: "other", name: "Clásico", emoji: "✨", backgroundColor: "#f8fafc", accentColor: "#6366f1", textColor: "#1e1b4b", layout: "bold" },
  { id: "other-3", eventType: "other", name: "Simple", emoji: "🎊", backgroundColor: "#f0fdf4", accentColor: "#10b981", textColor: "#064e3b", layout: "minimal" },
];

export function getTemplatesForType(eventType: string): Template[] {
  return templates.filter((t) => t.eventType === eventType);
}

export function getTemplate(id: string): Template | undefined {
  return templates.find((t) => t.id === id);
}

export function defaultTemplateId(eventType: string): string {
  return `${eventType}-1`;
}
