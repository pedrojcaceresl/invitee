import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { InMemoryEventRepository } from "@/lib/adapters/in-memory/in-memory-event-repository";

const holder = { event: null as InMemoryEventRepository | null };

vi.mock("@/lib/data", () => ({
  getEventRepository: () => holder.event,
  getGiftRepository: () => ({}),
  getStorageProvider: () => ({}),
}));

beforeEach(() => {
  holder.event = new InMemoryEventRepository();
});

const baseEvent = {
  name: "Cumple de Ana",
  type: "birthday" as const,
  date: "2026-08-15",
  location: "Casa de Ana",
  message: "¡Todos invitados!",
  templateId: "birthday-1",
  shareMode: "combined" as const,
  customPhotoUrl: null,
};

describe("GET /api/events/[slug]/card", () => {
  it("devuelve una imagen PNG para un evento existente", async () => {
    const { GET } = await import("@/app/api/events/[slug]/card/route");
    const { event } = await holder.event!.createEvent(baseEvent);

    const req = new NextRequest(`http://localhost/api/events/${event.slug}/card`);
    const res = await GET(req, { params: Promise.resolve({ slug: event.slug }) });

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toMatch(/image\//);
    const buffer = await res.arrayBuffer();
    expect(buffer.byteLength).toBeGreaterThan(0);
  });

  it("retorna 404 para slug inexistente", async () => {
    const { GET } = await import("@/app/api/events/[slug]/card/route");
    const req = new NextRequest("http://localhost/api/events/no-existe/card");
    const res = await GET(req, { params: Promise.resolve({ slug: "no-existe" }) });
    expect(res.status).toBe(404);
  });

  it("genera tarjeta con layout bold", async () => {
    const { GET } = await import("@/app/api/events/[slug]/card/route");
    const { event } = await holder.event!.createEvent({ ...baseEvent, templateId: "birthday-2" });

    const req = new NextRequest(`http://localhost/api/events/${event.slug}/card`);
    const res = await GET(req, { params: Promise.resolve({ slug: event.slug }) });

    expect(res.status).toBe(200);
    const buffer = await res.arrayBuffer();
    expect(buffer.byteLength).toBeGreaterThan(0);
  });

  it("genera tarjeta con layout minimal", async () => {
    const { GET } = await import("@/app/api/events/[slug]/card/route");
    const { event } = await holder.event!.createEvent({ ...baseEvent, templateId: "birthday-3" });

    const req = new NextRequest(`http://localhost/api/events/${event.slug}/card`);
    const res = await GET(req, { params: Promise.resolve({ slug: event.slug }) });

    expect(res.status).toBe(200);
    const buffer = await res.arrayBuffer();
    expect(buffer.byteLength).toBeGreaterThan(0);
  });
});

describe("PATCH /api/events/[slug]", () => {
  it("actualiza templateId con token válido", async () => {
    const { PATCH } = await import("@/app/api/events/[slug]/route");
    const { event, editToken } = await holder.event!.createEvent(baseEvent);

    const req = new NextRequest(`http://localhost/api/events/${event.slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-edit-token": editToken },
      body: JSON.stringify({ templateId: "birthday-2" }),
    });
    const res = await PATCH(req, { params: Promise.resolve({ slug: event.slug }) });
    expect(res.status).toBe(204);

    const updated = await holder.event!.getEventBySlug(event.slug);
    expect(updated!.templateId).toBe("birthday-2");
  });

  it("rechaza PATCH con token inválido", async () => {
    const { PATCH } = await import("@/app/api/events/[slug]/route");
    const { event } = await holder.event!.createEvent(baseEvent);

    const req = new NextRequest(`http://localhost/api/events/${event.slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-edit-token": "malo" },
      body: JSON.stringify({ templateId: "birthday-2" }),
    });
    const res = await PATCH(req, { params: Promise.resolve({ slug: event.slug }) });
    expect(res.status).toBe(403);
  });
});

describe("lib/templates", () => {
  it("devuelve 3 plantillas por tipo de evento", async () => {
    const { getTemplatesForType } = await import("@/lib/templates");
    for (const type of ["birthday", "wedding", "graduation", "babyshower", "other"]) {
      expect(getTemplatesForType(type)).toHaveLength(3);
    }
  });

  it("getTemplate devuelve undefined para id inexistente", async () => {
    const { getTemplate } = await import("@/lib/templates");
    expect(getTemplate("no-existe")).toBeUndefined();
  });
});
