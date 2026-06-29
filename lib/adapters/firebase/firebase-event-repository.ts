import { createHash, randomUUID } from "crypto";
import { FieldValue } from "firebase-admin/firestore";
import { db } from "@/lib/firebase/admin";
import type { EventRepository } from "@/lib/ports/event-repository";
import type { CreateEventResult, Event, NewEvent } from "@/lib/types";

function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${base}-${randomUUID().slice(0, 4)}`;
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function docToEvent(id: string, data: FirebaseFirestore.DocumentData): Event {
  return {
    id,
    slug: data.slug,
    name: data.name,
    type: data.type,
    date: data.date ?? null,
    location: data.location ?? null,
    message: data.message ?? null,
    templateId: data.templateId,
    customPhotoUrl: data.customPhotoUrl ?? null,
    shareMode: data.shareMode,
    createdAt: data.createdAt.toDate(),
  };
}

export class FirebaseEventRepository implements EventRepository {
  private async generateUniqueSlug(name: string, attempt = 0): Promise<string> {
    if (attempt >= 5) throw new Error("No se pudo generar un slug único");
    const slug = generateSlug(name);
    const existing = await db.collection("events").where("slug", "==", slug).limit(1).get();
    if (!existing.empty) return this.generateUniqueSlug(name, attempt + 1);
    return slug;
  }

  async createEvent(input: NewEvent): Promise<CreateEventResult> {
    const id = randomUUID();
    const slug = await this.generateUniqueSlug(input.name);
    const editToken = randomUUID();

    const eventData = {
      slug,
      name: input.name,
      type: input.type,
      date: input.date ?? null,
      location: input.location ?? null,
      message: input.message ?? null,
      templateId: input.templateId,
      customPhotoUrl: input.customPhotoUrl ?? null,
      shareMode: input.shareMode,
      createdAt: FieldValue.serverTimestamp(),
    };

    const batch = db.batch();
    batch.set(db.collection("events").doc(id), eventData);
    batch.set(db.collection("eventSecrets").doc(id), {
      eventId: id,
      editToken: hashToken(editToken),
    });
    await batch.commit();

    return {
      event: {
        ...input,
        id,
        slug,
        customPhotoUrl: input.customPhotoUrl ?? null,
        createdAt: new Date(),
      },
      editToken,
    };
  }

  async getEventBySlug(slug: string): Promise<Event | null> {
    const snapshot = await db
      .collection("events")
      .where("slug", "==", slug)
      .limit(1)
      .get();

    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return docToEvent(doc.id, doc.data());
  }

  async updateEvent(
    eventId: string,
    patch: Partial<Omit<Event, "id" | "slug" | "createdAt">>
  ): Promise<void> {
    await db.collection("events").doc(eventId).update(patch);
  }

  async validateEditToken(eventId: string, token: string): Promise<boolean> {
    const doc = await db.collection("eventSecrets").doc(eventId).get();
    if (!doc.exists) return false;
    return doc.data()!.editToken === hashToken(token);
  }
}
