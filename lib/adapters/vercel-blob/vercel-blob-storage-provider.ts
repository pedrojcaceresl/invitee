import { randomUUID } from "crypto";
import { put } from "@vercel/blob";
import type { StorageProvider } from "@/lib/ports/storage-provider";

export class VercelBlobStorageProvider implements StorageProvider {
  async uploadPhoto(eventId: string, file: Blob, filename: string): Promise<string> {
    const ext = filename.split(".").pop() ?? "jpg";
    const path = `events/${eventId}/${randomUUID()}.${ext}`;

    const { url } = await put(path, file, {
      access: "public",
      addRandomSuffix: false,
    });

    return url;
  }
}
