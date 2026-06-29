import { randomUUID } from "crypto";
import { db } from "@/lib/firebase/admin";
import type { GiftRepository } from "@/lib/ports/gift-repository";
import type { Gift, NewGift } from "@/lib/types";

function giftsCol(eventId: string) {
  return db.collection("events").doc(eventId).collection("gifts");
}

function docToGift(id: string, data: FirebaseFirestore.DocumentData): Gift {
  return {
    id,
    name: data.name,
    description: data.description ?? null,
    purchaseLink: data.purchaseLink ?? null,
    photoUrl: data.photoUrl ?? null,
    approxPrice: data.approxPrice ?? null,
  };
}

export class FirebaseGiftRepository implements GiftRepository {
  async addGift(eventId: string, input: NewGift): Promise<Gift> {
    const id = randomUUID();
    await giftsCol(eventId).doc(id).set(input);
    return { ...input, id };
  }

  async listGifts(eventId: string): Promise<Gift[]> {
    const snapshot = await giftsCol(eventId).get();
    return snapshot.docs.map((doc) => docToGift(doc.id, doc.data()));
  }

  async updateGift(
    eventId: string,
    giftId: string,
    patch: Partial<Omit<Gift, "id">>
  ): Promise<void> {
    await giftsCol(eventId).doc(giftId).update(patch);
  }

  async deleteGift(eventId: string, giftId: string): Promise<void> {
    await giftsCol(eventId).doc(giftId).delete();
  }
}
