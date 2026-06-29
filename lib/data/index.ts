import { FirebaseEventRepository } from "@/lib/adapters/firebase/firebase-event-repository";
import { FirebaseGiftRepository } from "@/lib/adapters/firebase/firebase-gift-repository";
import { VercelBlobStorageProvider } from "@/lib/adapters/vercel-blob/vercel-blob-storage-provider";
import type { EventRepository } from "@/lib/ports/event-repository";
import type { GiftRepository } from "@/lib/ports/gift-repository";
import type { StorageProvider } from "@/lib/ports/storage-provider";

// Único lugar que cambia si se migra de Firebase a otro backend
export function getEventRepository(): EventRepository {
  return new FirebaseEventRepository();
}

export function getGiftRepository(): GiftRepository {
  return new FirebaseGiftRepository();
}

export function getStorageProvider(): StorageProvider {
  return new VercelBlobStorageProvider();
}
