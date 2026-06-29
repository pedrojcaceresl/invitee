export type EventType = "birthday" | "wedding" | "graduation" | "babyshower" | "other";
export type ShareMode = "list_only" | "card_only" | "combined";

export interface Event {
  id: string;
  slug: string;
  name: string;
  type: EventType;
  date: string | null;
  location: string | null;
  message: string | null;
  templateId: string;
  customPhotoUrl: string | null;
  shareMode: ShareMode;
  createdAt: Date;
}

export type NewEvent = Omit<Event, "id" | "slug" | "createdAt" | "customPhotoUrl"> & {
  customPhotoUrl?: string | null;
};

export interface Gift {
  id: string;
  name: string;
  description: string | null;
  purchaseLink: string | null;
  photoUrl: string | null;
  approxPrice: number | null;
}

export type NewGift = Omit<Gift, "id">;

export interface CreateEventResult {
  event: Event;
  editToken: string;
}
