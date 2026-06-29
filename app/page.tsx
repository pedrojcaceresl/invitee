"use client";

import { useState } from "react";
import Link from "next/link";
import CreateEventForm from "@/app/_components/create-event-form";
import EventCreatedScreen from "@/app/_components/event-created-screen";
import OnboardingTrigger from "@/app/_components/onboarding-tour";

export default function HomePage() {
  const [created, setCreated] = useState<{ slug: string; editToken: string } | null>(null);

  if (created) {
    return <EventCreatedScreen slug={created.slug} editToken={created.editToken} />;
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-12">
      <header className="mb-8 text-center">
        <h1 className="font-display text-3xl font-bold text-ink">Invitee</h1>
        <p className="mt-2 text-ink-muted">
          Creá tu tarjeta de invitación y lista de regalos en segundos.
        </p>
        <div className="mt-4 flex items-center justify-center gap-3">
          <OnboardingTrigger />
          <Link
            href="/como-usar"
            className="rounded-control border border-border px-3 py-1.5 text-xs font-medium text-ink-muted hover:border-accent hover:text-accent"
          >
            ¿Cómo usar?
          </Link>
        </div>
      </header>
      <CreateEventForm onCreated={setCreated} />
    </main>
  );
}
