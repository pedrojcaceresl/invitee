import type { GiftRepository } from "@/lib/ports/gift-repository";
import type { Gift, NewGift } from "@/lib/types";
import { randomUUID } from "crypto";

export class InMemoryGiftRepository implements GiftRepository {
  // eventId → giftId → Gift
  private gifts = new Map<string, Map<string, Gift>>();

  private bucketFor(eventId: string): Map<string, Gift> {
    if (!this.gifts.has(eventId)) this.gifts.set(eventId, new Map());
    return this.gifts.get(eventId)!;
  }

  async addGift(eventId: string, input: NewGift): Promise<Gift> {
    const gift: Gift = { ...input, id: randomUUID() };
    this.bucketFor(eventId).set(gift.id, gift);
    return gift;
  }

  async listGifts(eventId: string): Promise<Gift[]> {
    return Array.from(this.bucketFor(eventId).values());
  }

  async updateGift(
    eventId: string,
    giftId: string,
    patch: Partial<Omit<Gift, "id">>
  ): Promise<void> {
    const bucket = this.bucketFor(eventId);
    const gift = bucket.get(giftId);
    if (!gift) throw new Error(`Gift not found: ${giftId}`);
    bucket.set(giftId, { ...gift, ...patch });
  }

  async deleteGift(eventId: string, giftId: string): Promise<void> {
    this.bucketFor(eventId).delete(giftId);
  }
}
