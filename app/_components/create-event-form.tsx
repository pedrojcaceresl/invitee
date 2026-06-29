"use client";

import { useState } from "react";

interface Props {
  onCreated: (result: { slug: string; editToken: string }) => void;
}

const EVENT_TYPES = [
  { value: "birthday", label: "Cumpleaños" },
  { value: "wedding", label: "Casamiento" },
  { value: "graduation", label: "Graduación" },
  { value: "babyshower", label: "Baby shower" },
  { value: "other", label: "Otro" },
] as const;

const inputClass =
  "mt-1 w-full rounded-control border border-border bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-accent";

const labelClass = "block text-sm font-medium text-ink-muted";

export default function CreateEventForm({ onCreated }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    const body = {
      name: data.name as string,
      type: data.type as string,
      date: (data.date as string) || null,
      location: (data.location as string) || null,
      message: (data.message as string) || null,
      templateId: "birthday-1",
      shareMode: "combined",
    };

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error ?? "Error al crear el evento");
      }

      const json = await res.json();
      onCreated({ slug: json.slug, editToken: json.editToken });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div id="tour-name">
        <label className={labelClass} htmlFor="name">
          Nombre del evento *
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          maxLength={100}
          placeholder="Cumple de Ana"
          className={inputClass}
        />
      </div>

      <div id="tour-type">
        <label className={labelClass} htmlFor="type">
          Tipo de evento *
        </label>
        <select id="type" name="type" required className={inputClass}>
          {EVENT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div id="tour-date">
        <label className={labelClass} htmlFor="date">
          Fecha
        </label>
        <input id="date" name="date" type="date" className={inputClass} />
      </div>

      <div id="tour-location">
        <label className={labelClass} htmlFor="location">
          Lugar
        </label>
        <input
          id="location"
          name="location"
          type="text"
          maxLength={200}
          placeholder="Casa de Ana, Palermo"
          className={inputClass}
        />
      </div>

      <div id="tour-message">
        <label className={labelClass} htmlFor="message">
          Mensaje para los invitados
        </label>
        <textarea
          id="message"
          name="message"
          maxLength={500}
          rows={3}
          placeholder="¡Todos invitados!"
          className={inputClass}
        />
      </div>

      {error && (
        <p className="rounded-control bg-error/10 px-3 py-2 text-sm text-error">{error}</p>
      )}

      <button
        id="tour-submit"
        type="submit"
        disabled={loading}
        className="w-full rounded-control bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent/90 disabled:opacity-60"
      >
        {loading ? "Creando..." : "Crear evento"}
      </button>
    </form>
  );
}
