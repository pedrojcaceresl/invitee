"use client";

import { useState } from "react";
import CreateEventForm from "@/app/_components/create-event-form";
import EventCreatedScreen from "@/app/_components/event-created-screen";

export default function HomePage() {
  const [created, setCreated] = useState<{ slug: string; editToken: string } | null>(null);

  if (created) {
    return <EventCreatedScreen slug={created.slug} editToken={created.editToken} />;
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-12">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Invitee</h1>
        <p className="mt-2 text-gray-500">
          Creá tu tarjeta de invitación y lista de regalos en segundos.
        </p>
      </header>
      <CreateEventForm onCreated={setCreated} />
    </main>
  );
}
