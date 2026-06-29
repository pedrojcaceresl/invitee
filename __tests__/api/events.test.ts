import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { InMemoryEventRepository } from "@/lib/adapters/in-memory/in-memory-event-repository";
import { InMemoryGiftRepository } from "@/lib/adapters/in-memory/in-memory-gift-repository";

// Shared holders so beforeEach can reset them between tests
const holder = {
  event: null as InMemoryEventRepository | null,
  gift: null as InMemoryGiftRepository | null,
};

vi.mock("@/lib/data", () => ({
  getEventRepository: () => holder.event,
  getGiftRepository: () => holder.gift,
  getStorageProvider: () => ({}),
}));

beforeEach(() => {
  holder.event = new InMemoryEventRepository();
  holder.gift = new InMemoryGiftRepository();
});

const baseEvent = {
  name: "Cumple de Ana",
  type: "birthday",
  date: "2026-08-15",
  location: "Casa de Ana",
  message: "¡Todos invitados!",
  templateId: "birthday-1",
  shareMode: "combined",
};

function postRequest(url: string, body: unknown, headers?: Record<string, string>) {
  return new NextRequest(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

describe("POST /api/events", () => {
  it("crea un evento y retorna slug + editToken", async () => {
    const { POST } = await import("@/app/api/events/route");
    const res = await POST(postRequest("http://localhost/api/events", baseEvent));

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.slug).toBeTruthy();
    expect(body.editToken).toBeTruthy();
    expect(body.slug).toContain("cumple");
  });

  it("rechaza body inválido con 400", async () => {
    const { POST } = await import("@/app/api/events/route");
    const res = await POST(postRequest("http://localhost/api/events", { name: "" }));
    expect(res.status).toBe(400);
  });
});

describe("POST /api/events/[slug]/gifts", () => {
  async function createEvent() {
    const { POST: postEvent } = await import("@/app/api/events/route");
    const res = await postEvent(postRequest("http://localhost/api/events", baseEvent));
    return res.json() as Promise<{ slug: string; editToken: string }>;
  }

  it("agrega un regalo con token válido", async () => {
    const { POST: postGifts } = await import("@/app/api/events/[slug]/gifts/route");
    const { slug, editToken } = await createEvent();

    const res = await postGifts(
      postRequest(
        `http://localhost/api/events/${slug}/gifts`,
        { name: "Libro de cocina", description: null, purchaseLink: null, photoUrl: null, approxPrice: null },
        { "x-edit-token": editToken }
      ),
      { params: Promise.resolve({ slug }) }
    );

    expect(res.status).toBe(201);
    const gift = await res.json();
    expect(gift.name).toBe("Libro de cocina");
    expect(gift.id).toBeTruthy();
  });

  it("rechaza con 403 cuando el token es inválido", async () => {
    const { POST: postGifts } = await import("@/app/api/events/[slug]/gifts/route");
    const { slug } = await createEvent();

    const res = await postGifts(
      postRequest(
        `http://localhost/api/events/${slug}/gifts`,
        { name: "Libro" },
        { "x-edit-token": "token-invalido" }
      ),
      { params: Promise.resolve({ slug }) }
    );

    expect(res.status).toBe(403);
  });

  it("rechaza con 403 cuando falta el token", async () => {
    const { POST: postGifts } = await import("@/app/api/events/[slug]/gifts/route");
    const { slug } = await createEvent();

    const res = await postGifts(
      postRequest(`http://localhost/api/events/${slug}/gifts`, { name: "Libro" }),
      { params: Promise.resolve({ slug }) }
    );

    expect(res.status).toBe(403);
  });

  it("retorna 404 para un slug inexistente", async () => {
    const { POST: postGifts } = await import("@/app/api/events/[slug]/gifts/route");

    const res = await postGifts(
      postRequest(
        "http://localhost/api/events/slug-que-no-existe/gifts",
        { name: "Libro" },
        { "x-edit-token": "cualquier-token" }
      ),
      { params: Promise.resolve({ slug: "slug-que-no-existe" }) }
    );

    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/events/[slug]/gifts/[id]", () => {
  async function setup() {
    const { POST: postEvent } = await import("@/app/api/events/route");
    const { POST: postGifts } = await import("@/app/api/events/[slug]/gifts/route");

    const { slug, editToken } = await (
      await postEvent(postRequest("http://localhost/api/events", baseEvent))
    ).json();

    const giftRes = await postGifts(
      postRequest(
        `http://localhost/api/events/${slug}/gifts`,
        { name: "Libro", description: null, purchaseLink: null, photoUrl: null, approxPrice: null },
        { "x-edit-token": editToken }
      ),
      { params: Promise.resolve({ slug }) }
    );
    const gift = await giftRes.json();

    return { slug, editToken, giftId: gift.id as string };
  }

  it("borra un regalo con token válido", async () => {
    const { DELETE } = await import("@/app/api/events/[slug]/gifts/[id]/route");
    const { slug, editToken, giftId } = await setup();

    const req = new NextRequest(`http://localhost/api/events/${slug}/gifts/${giftId}`, {
      method: "DELETE",
      headers: { "x-edit-token": editToken },
    });
    const res = await DELETE(req, { params: Promise.resolve({ slug, id: giftId }) });
    expect(res.status).toBe(204);
  });

  it("rechaza DELETE con token inválido", async () => {
    const { DELETE } = await import("@/app/api/events/[slug]/gifts/[id]/route");
    const { slug, giftId } = await setup();

    const req = new NextRequest(`http://localhost/api/events/${slug}/gifts/${giftId}`, {
      method: "DELETE",
      headers: { "x-edit-token": "token-malo" },
    });
    const res = await DELETE(req, { params: Promise.resolve({ slug, id: giftId }) });
    expect(res.status).toBe(403);
  });
});

describe("Flujo de integración completo", () => {
  it("crear evento → agregar 2 regalos → ambos quedan en el repositorio", async () => {
    const { POST: postEvent } = await import("@/app/api/events/route");
    const { POST: postGifts } = await import("@/app/api/events/[slug]/gifts/route");

    const { slug, editToken } = await (
      await postEvent(postRequest("http://localhost/api/events", baseEvent))
    ).json();

    const giftPayload = (name: string) => ({
      name,
      description: null,
      purchaseLink: null,
      photoUrl: null,
      approxPrice: null,
    });

    const headers = { "x-edit-token": editToken };
    const params = Promise.resolve({ slug });

    await postGifts(
      postRequest(`http://localhost/api/events/${slug}/gifts`, giftPayload("Regalo 1"), headers),
      { params }
    );
    await postGifts(
      postRequest(`http://localhost/api/events/${slug}/gifts`, giftPayload("Regalo 2"), headers),
      { params }
    );

    const event = await holder.event!.getEventBySlug(slug);
    const gifts = await holder.gift!.listGifts(event!.id);

    expect(gifts).toHaveLength(2);
    expect(gifts.map((g) => g.name)).toContain("Regalo 1");
    expect(gifts.map((g) => g.name)).toContain("Regalo 2");
  });
});
