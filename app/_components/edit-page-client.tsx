"use client";

import { useState, useRef } from "react";
import type { Event, Gift } from "@/lib/types";
import { getTemplatesForType } from "@/lib/templates";
import type { Template } from "@/lib/templates";

interface Props {
  event: Event;
  initialGifts: Gift[];
  slug: string;
  editToken: string;
}

const inputClass =
  "w-full rounded-control border border-border bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-accent";

export default function EditPageClient({ event, initialGifts, slug, editToken }: Props) {
  const [gifts, setGifts] = useState<Gift[]>(initialGifts);
  const [currentTemplateId, setCurrentTemplateId] = useState(event.templateId);
  const [shareMode, setShareMode] = useState(event.shareMode);
  const [photoUrl, setPhotoUrl] = useState(event.customPhotoUrl);
  const [adding, setAdding] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [giftError, setGiftError] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const templates = getTemplatesForType(event.type);

  async function handleSelectShareMode(mode: string) {
    setShareMode(mode as typeof shareMode);
    await fetch(`/api/events/${slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-edit-token": editToken },
      body: JSON.stringify({ shareMode: mode }),
    });
  }

  async function handleSelectTemplate(templateId: string) {
    setCurrentTemplateId(templateId);
    await fetch(`/api/events/${slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-edit-token": editToken },
      body: JSON.stringify({ templateId }),
    });
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    setPhotoError(null);

    const form = new FormData();
    form.append("photo", file);

    try {
      const res = await fetch(`/api/events/${slug}/photo`, {
        method: "POST",
        headers: { "x-edit-token": editToken },
        body: form,
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error ?? "Error al subir foto");
      }
      const { url } = await res.json();
      setPhotoUrl(url);
    } catch (err) {
      setPhotoError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setUploadingPhoto(false);
    }
  }

  async function handleAddGift(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAdding(true);
    setGiftError(null);

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    const body = {
      name: data.name as string,
      description: (data.description as string) || null,
      purchaseLink: (data.purchaseLink as string) || null,
      approxPrice: data.approxPrice ? Number(data.approxPrice) : null,
      photoUrl: null,
    };

    try {
      const res = await fetch(`/api/events/${slug}/gifts`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-edit-token": editToken },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error ?? "Error al agregar regalo");
      }
      const gift: Gift = await res.json();
      setGifts((prev) => [...prev, gift]);
      form.reset();
    } catch (err) {
      setGiftError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(giftId: string) {
    const res = await fetch(`/api/events/${slug}/gifts/${giftId}`, {
      method: "DELETE",
      headers: { "x-edit-token": editToken },
    });
    if (res.ok) setGifts((prev) => prev.filter((g) => g.id !== giftId));
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-12 space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">{event.name}</h1>
          <p className="text-sm text-ink-muted">Panel de edición</p>
        </div>
        <a href={`/e/${slug}`} className="text-sm text-accent hover:underline">
          Ver evento →
        </a>
      </div>

      {/* Template selector */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-ink">Plantilla de tarjeta</h2>
        <div className="grid grid-cols-3 gap-3">
          {templates.map((t) => (
            <TemplatePreview
              key={t.id}
              template={t}
              selected={currentTemplateId === t.id}
              onSelect={() => handleSelectTemplate(t.id)}
            />
          ))}
        </div>
        <div className="mt-3 flex gap-3">
          <a
            href={`/api/events/${slug}/card`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-accent hover:underline"
          >
            Ver preview de tarjeta →
          </a>
          <a
            href={`/api/events/${slug}/card`}
            download={`invitacion-${slug}.png`}
            className="rounded-control bg-accent px-3 py-1.5 text-sm font-medium text-white hover:bg-accent/90"
          >
            Descargar tarjeta
          </a>
        </div>
      </section>

      {/* Share mode */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-ink">Modo de compartir</h2>
        <div className="grid grid-cols-3 gap-3">
          {(
            [
              { value: "list_only", label: "Solo lista", description: "Solo se ve la lista de regalos" },
              { value: "card_only", label: "Solo tarjeta", description: "Solo se ve la tarjeta" },
              { value: "combined", label: "Tarjeta + lista", description: "Tarjeta con QR a la lista" },
            ] as const
          ).map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSelectShareMode(opt.value)}
              className={`rounded-card border-2 p-3 text-left transition-colors ${
                shareMode === opt.value
                  ? "border-accent bg-accent/10"
                  : "border-border hover:border-ink-muted"
              }`}
            >
              <p className="text-sm font-semibold text-ink">{opt.label}</p>
              <p className="mt-0.5 text-xs text-ink-muted">{opt.description}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Photo upload */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-ink">Foto personalizada</h2>
        {photoUrl ? (
          <div className="mb-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photoUrl} alt="Foto del evento" className="h-40 w-full rounded-card object-cover" />
          </div>
        ) : (
          <p className="mb-3 text-sm text-ink-muted">Sin foto aún.</p>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handlePhotoUpload}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadingPhoto}
          className="rounded-control border border-border px-4 py-2 text-sm text-ink hover:bg-paper disabled:opacity-60"
        >
          {uploadingPhoto ? "Subiendo..." : photoUrl ? "Cambiar foto" : "Subir foto"}
        </button>
        {photoError && <p className="mt-2 text-sm text-error">{photoError}</p>}
      </section>

      {/* Add gift form */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-ink">Agregar regalo</h2>
        <form onSubmit={handleAddGift} className="space-y-3">
          <input name="name" type="text" required maxLength={200} placeholder="Nombre del regalo *" className={inputClass} />
          <input name="description" type="text" maxLength={500} placeholder="Descripción (opcional)" className={inputClass} />
          <input name="purchaseLink" type="url" placeholder="Link de compra (opcional)" className={inputClass} />
          <input name="approxPrice" type="number" min={0} step={1} placeholder="Precio aprox. (opcional)" className={inputClass} />
          {giftError && (
            <p className="rounded-control bg-error/10 px-3 py-2 text-sm text-error">{giftError}</p>
          )}
          <button
            type="submit"
            disabled={adding}
            className="w-full rounded-control bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent/90 disabled:opacity-60"
          >
            {adding ? "Agregando..." : "Agregar regalo"}
          </button>
        </form>
      </section>

      {/* Gift list */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-ink">
          Lista de regalos ({gifts.length})
        </h2>
        {gifts.length === 0 ? (
          <p className="text-ink-muted">Todavía no hay regalos.</p>
        ) : (
          <ul className="space-y-3">
            {gifts.map((g) => (
              <li
                key={g.id}
                className="flex items-start justify-between gap-3 rounded-card border border-border bg-surface p-4"
              >
                <div>
                  <p className="font-medium text-ink">{g.name}</p>
                  {g.description && <p className="mt-0.5 text-sm text-ink-muted">{g.description}</p>}
                  {g.approxPrice != null && (
                    <p className="mt-0.5 text-sm text-ink-muted">
                      ~${g.approxPrice.toLocaleString("es-AR")}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(g.id)}
                  className="shrink-0 text-sm text-error hover:text-error/80"
                >
                  Borrar
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

function TemplatePreview({
  template,
  selected,
  onSelect,
}: {
  template: Template;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`rounded-card border-2 p-3 text-left transition-colors ${
        selected ? "border-accent shadow-md" : "border-border hover:border-ink-muted"
      }`}
      style={{ backgroundColor: template.backgroundColor }}
    >
      <div style={{ fontSize: 28 }}>{template.emoji}</div>
      <div className="mt-1 text-xs font-semibold" style={{ color: template.textColor }}>
        {template.name}
      </div>
      <div className="mt-0.5 h-1 w-8 rounded" style={{ backgroundColor: template.accentColor }} />
    </button>
  );
}
