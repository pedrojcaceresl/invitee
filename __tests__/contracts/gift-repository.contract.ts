import { describe, it, expect, beforeEach } from "vitest";
import type { GiftRepository } from "@/lib/ports/gift-repository";
import type { NewGift } from "@/lib/types";

const EVENT_ID = "test-event-id";

const baseGift: NewGift = {
  name: "Libro de recetas",
  description: "El que le gusta a la festejada",
  purchaseLink: "https://example.com/libro",
  photoUrl: null,
  approxPrice: 2500,
};

export function runGiftRepositoryContractTests(factory: () => GiftRepository) {
  describe("GiftRepository — contract", () => {
    let repo: GiftRepository;

    beforeEach(() => {
      repo = factory();
    });

    it("addGift devuelve regalo con id", async () => {
      const gift = await repo.addGift(EVENT_ID, baseGift);
      expect(gift.id).toBeTruthy();
      expect(gift.name).toBe(baseGift.name);
    });

    it("listGifts devuelve lista vacía para evento sin regalos", async () => {
      const gifts = await repo.listGifts(EVENT_ID);
      expect(gifts).toEqual([]);
    });

    it("listGifts devuelve todos los regalos del evento", async () => {
      await repo.addGift(EVENT_ID, baseGift);
      await repo.addGift(EVENT_ID, { ...baseGift, name: "Vino" });
      const gifts = await repo.listGifts(EVENT_ID);
      expect(gifts).toHaveLength(2);
    });

    it("listGifts no mezcla regalos de eventos distintos", async () => {
      await repo.addGift(EVENT_ID, baseGift);
      await repo.addGift("otro-evento", { ...baseGift, name: "Otro" });
      const gifts = await repo.listGifts(EVENT_ID);
      expect(gifts).toHaveLength(1);
    });

    it("updateGift modifica el regalo correctamente", async () => {
      const gift = await repo.addGift(EVENT_ID, baseGift);
      await repo.updateGift(EVENT_ID, gift.id, { name: "Libro actualizado" });
      const gifts = await repo.listGifts(EVENT_ID);
      expect(gifts[0].name).toBe("Libro actualizado");
    });

    it("deleteGift elimina el regalo", async () => {
      const gift = await repo.addGift(EVENT_ID, baseGift);
      await repo.deleteGift(EVENT_ID, gift.id);
      const gifts = await repo.listGifts(EVENT_ID);
      expect(gifts).toHaveLength(0);
    });
  });
}
