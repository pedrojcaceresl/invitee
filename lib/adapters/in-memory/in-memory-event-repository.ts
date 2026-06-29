import type { EventRepository } from "@/lib/ports/event-repository";
import type { CreateEventResult, Event, NewEvent } from "@/lib/types";
import { randomUUID } from "crypto";

function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const suffix = randomUUID().slice(0, 4);
  return `${base}-${suffix}`;
}

export class InMemoryEventRepository implements EventRepository {
  private events = new Map<string, Event>();
  // Simulates the eventSecrets collection — never exposed outside this class
  private editTokens = new Map<string, string>();

  async createEvent(input: NewEvent): Promise<CreateEventResult> {
    const id = randomUUID();
    const slug = generateSlug(input.name);
    const editToken = randomUUID();
    const event: Event = {
      ...input,
      id,
      slug,
      customPhotoUrl: input.customPhotoUrl ?? null,
      createdAt: new Date(),
    };
    this.events.set(id, event);
    this.editTokens.set(id, editToken);
    return { event, editToken };
  }

  async getEventBySlug(slug: string): Promise<Event | null> {
    for (const event of this.events.values()) {
      if (event.slug === slug) return event;
    }
    return null;
  }

  async updateEvent(
    eventId: string,
    patch: Partial<Omit<Event, "id" | "slug" | "createdAt">>
  ): Promise<void> {
    const event = this.events.get(eventId);
    if (!event) throw new Error(`Event not found: ${eventId}`);
    this.events.set(eventId, { ...event, ...patch });
  }

  async validateEditToken(eventId: string, token: string): Promise<boolean> {
    return this.editTokens.get(eventId) === token;
  }

}
