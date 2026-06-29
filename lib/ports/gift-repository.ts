import type { Gift, NewGift } from "@/lib/types";

export interface GiftRepository {
  addGift(eventId: string, input: NewGift): Promise<Gift>;
  listGifts(eventId: string): Promise<Gift[]>;
  updateGift(eventId: string, giftId: string, patch: Partial<Omit<Gift, "id">>): Promise<void>;
  deleteGift(eventId: string, giftId: string): Promise<void>;
}
