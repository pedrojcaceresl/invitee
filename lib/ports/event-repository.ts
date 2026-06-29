import type { CreateEventResult, Event, NewEvent } from "@/lib/types";

export interface EventRepository {
  createEvent(input: NewEvent): Promise<CreateEventResult>;
  getEventBySlug(slug: string): Promise<Event | null>;
  updateEvent(eventId: string, patch: Partial<Omit<Event, "id" | "slug" | "createdAt">>): Promise<void>;
  validateEditToken(eventId: string, token: string): Promise<boolean>;
}
