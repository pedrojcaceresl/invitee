import { describe, it, expect, beforeEach } from "vitest";
import type { EventRepository } from "@/lib/ports/event-repository";
import type { NewEvent } from "@/lib/types";

const baseEvent: NewEvent = {
  name: "Cumple de Ana",
  type: "birthday",
  date: "2026-08-15",
  location: "Casa de Ana",
  message: "¡Todos invitados!",
  templateId: "birthday-1",
  shareMode: "combined",
};

export function runEventRepositoryContractTests(
  factory: () => EventRepository
) {
  describe("EventRepository — contract", () => {
    let repo: EventRepository;

    beforeEach(() => {
      repo = factory();
    });

    it("createEvent devuelve evento con id, slug, createdAt y editToken", async () => {
      const { event, editToken } = await repo.createEvent(baseEvent);
      expect(event.id).toBeTruthy();
      expect(event.slug).toBeTruthy();
      expect(event.createdAt).toBeInstanceOf(Date);
      expect(event.name).toBe(baseEvent.name);
      expect(editToken).toBeTruthy();
    });

    it("slug generado contiene el nombre del evento normalizado", async () => {
      const { event } = await repo.createEvent(baseEvent);
      expect(event.slug).toContain("cumple");
    });

    it("createEvent con el mismo nombre genera slugs distintos", async () => {
      const { event: a } = await repo.createEvent(baseEvent);
      const { event: b } = await repo.createEvent(baseEvent);
      expect(a.slug).not.toBe(b.slug);
    });

    it("getEventBySlug devuelve el evento creado", async () => {
      const { event: created } = await repo.createEvent(baseEvent);
      const found = await repo.getEventBySlug(created.slug);
      expect(found).not.toBeNull();
      expect(found!.id).toBe(created.id);
    });

    it("getEventBySlug devuelve null para un slug inexistente", async () => {
      const result = await repo.getEventBySlug("slug-que-no-existe");
      expect(result).toBeNull();
    });

    it("updateEvent modifica los campos permitidos", async () => {
      const { event } = await repo.createEvent(baseEvent);
      await repo.updateEvent(event.id, { name: "Cumple de Ana (actualizado)" });
      const updated = await repo.getEventBySlug(event.slug);
      expect(updated!.name).toBe("Cumple de Ana (actualizado)");
    });

    it("validateEditToken retorna true con el token correcto", async () => {
      const { event, editToken } = await repo.createEvent(baseEvent);
      expect(await repo.validateEditToken(event.id, editToken)).toBe(true);
    });

    it("validateEditToken retorna false con un token incorrecto", async () => {
      const { event } = await repo.createEvent(baseEvent);
      expect(await repo.validateEditToken(event.id, "token-invalido")).toBe(false);
    });
  });
}
