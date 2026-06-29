import { randomUUID } from "crypto";
import type { StorageProvider } from "@/lib/ports/storage-provider";

export class InMemoryStorageProvider implements StorageProvider {
  private files = new Map<string, Buffer>();

  async uploadPhoto(eventId: string, file: Blob, filename: string): Promise<string> {
    const ext = filename.split(".").pop() ?? "jpg";
    const key = `events/${eventId}/${randomUUID()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    this.files.set(key, buffer);
    return `in-memory://${key}`;
  }

  getFile(key: string): Buffer | undefined {
    return this.files.get(key);
  }
}
