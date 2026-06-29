import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { InMemoryEventRepository } from "@/lib/adapters/in-memory/in-memory-event-repository";
import { InMemoryGiftRepository } from "@/lib/adapters/in-memory/in-memory-gift-repository";

const holder = {
  event: null as InMemoryEventRepository | null,
  gift: null as InMemoryGiftRepository | null,
};

vi.mock("@/lib/data", () => ({
  getEventRepository: () => holder.event,
  getGiftRepository: () => holder.gift,
  getStorageProvider: () => ({}),
}));

// qrcode genera SVG con operaciones de red/FS — mockeamos para test aislado
vi.mock("qrcode", () => ({
  default: { toString: vi.fn().mockResolvedValue("<svg>QR</svg>") },
}));

beforeEach(() => {
  holder.event = new InMemoryEventRepository();
  holder.gift = new InMemoryGiftRepository();
});

const base = {
  name: "Cumple de Ana",
  type: "birthday" as const,
  date: "2026-08-15",
  location: "Casa de Ana",
  message: "¡Todos invitados!",
  templateId: "birthday-1",
  shareMode: "combined" as const,
  customPhotoUrl: null,
};

describe("PATCH /api/events/[slug] — shareMode", () => {
  it("actualiza shareMode a list_only", async () => {
    const { PATCH } = await import("@/app/api/events/[slug]/route");
    const { event, editToken } = await holder.event!.createEvent(base);

    const req = new NextRequest(`http://localhost/api/events/${event.slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-edit-token": editToken },
      body: JSON.stringify({ shareMode: "list_only" }),
    });
    const res = await PATCH(req, { params: Promise.resolve({ slug: event.slug }) });
    expect(res.status).toBe(204);

    const updated = await holder.event!.getEventBySlug(event.slug);
    expect(updated!.shareMode).toBe("list_only");
  });

  it("actualiza shareMode a card_only", async () => {
    const { PATCH } = await import("@/app/api/events/[slug]/route");
    const { event, editToken } = await holder.event!.createEvent(base);

    const req = new NextRequest(`http://localhost/api/events/${event.slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-edit-token": editToken },
      body: JSON.stringify({ shareMode: "card_only" }),
    });
    const res = await PATCH(req, { params: Promise.resolve({ slug: event.slug }) });
    expect(res.status).toBe(204);

    const updated = await holder.event!.getEventBySlug(event.slug);
    expect(updated!.shareMode).toBe("card_only");
  });
});

describe("Renderizado condicional por shareMode (lógica de datos)", () => {
  it("list_only: solo carga regalos, no card", async () => {
    const { event } = await holder.event!.createEvent({ ...base, shareMode: "list_only" });
    await holder.gift!.addGift(event.id, { name: "Libro", description: null, purchaseLink: null, photoUrl: null, approxPrice: null });

    const updated = await holder.event!.getEventBySlug(event.slug);
    expect(updated!.shareMode).toBe("list_only");

    const gifts = await holder.gift!.listGifts(event.id);
    expect(gifts).toHaveLength(1);
  });

  it("card_only: shareMode es card_only, lista no se muestra", async () => {
    const { event } = await holder.event!.createEvent({ ...base, shareMode: "card_only" });
    const updated = await holder.event!.getEventBySlug(event.slug);
    expect(updated!.shareMode).toBe("card_only");
  });

  it("combined: shareMode es combined", async () => {
    const { event } = await holder.event!.createEvent({ ...base, shareMode: "combined" });
    const updated = await holder.event!.getEventBySlug(event.slug);
    expect(updated!.shareMode).toBe("combined");
  });
});
