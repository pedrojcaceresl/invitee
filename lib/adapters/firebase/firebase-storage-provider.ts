import { randomUUID } from "crypto";
import { storage } from "@/lib/firebase/admin";
import type { StorageProvider } from "@/lib/ports/storage-provider";

export class FirebaseStorageProvider implements StorageProvider {
  async uploadPhoto(eventId: string, file: Blob, filename: string): Promise<string> {
    const ext = filename.split(".").pop() ?? "jpg";
    const path = `events/${eventId}/${randomUUID()}.${ext}`;
    const bucket = storage.bucket();
    const fileRef = bucket.file(path);

    const buffer = Buffer.from(await file.arrayBuffer());
    await fileRef.save(buffer, { contentType: file.type || "image/jpeg" });
    await fileRef.makePublic();

    return fileRef.publicUrl();
  }
}
