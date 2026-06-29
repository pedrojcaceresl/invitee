"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  slug: string;
  editToken: string;
}

function SealIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="32" cy="32" r="30" fill="#D9A441" />
      <circle
        cx="32"
        cy="32"
        r="24"
        fill="none"
        stroke="white"
        strokeWidth="1.5"
        strokeOpacity="0.5"
        strokeDasharray="4 3"
      />
      {/* I monogram with serifs */}
      <rect x="26" y="19" width="12" height="3" rx="1.5" fill="white" />
      <rect x="30.5" y="22" width="3" height="21" rx="1.5" fill="white" />
      <rect x="26" y="43" width="12" height="3" rx="1.5" fill="white" />
    </svg>
  );
}

export default function EventCreatedScreen({ slug, editToken }: Props) {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const publicUrl = `${origin}/e/${slug}`;
  const editUrl = `${origin}/e/${slug}/edit?t=${editToken}`;

  const [copiedPublic, setCopiedPublic] = useState(false);
  const [copiedEdit, setCopiedEdit] = useState(false);

  function copy(text: string, setter: (v: boolean) => void) {
    navigator.clipboard.writeText(text).then(() => {
      setter(true);
      setTimeout(() => setter(false), 2000);
    });
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-12">
      <div className="rounded-card border border-success/30 bg-success/10 p-6 text-center">
        <motion.div
          className="mx-auto mb-4 h-16 w-16"
          initial={{ scale: 0.2, rotate: -20, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <SealIcon />
        </motion.div>
        <h1 className="font-display text-2xl font-bold text-success">¡Evento creado!</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Compartí el link público con tus invitados y guardá el link de edición en un lugar seguro.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="mt-6 space-y-4"
      >
        <LinkBox
          label="Link público (compartí con tus invitados)"
          url={publicUrl}
          copied={copiedPublic}
          onCopy={() => copy(publicUrl, setCopiedPublic)}
        />
        <LinkBox
          label="Link de edición (guardalo, no lo pierdas)"
          url={editUrl}
          copied={copiedEdit}
          onCopy={() => copy(editUrl, setCopiedEdit)}
          warning
        />
      </motion.div>

      <div className="mt-6 flex gap-3">
        <a
          href={`/e/${slug}`}
          className="flex-1 rounded-control border border-border px-4 py-2.5 text-center text-sm font-medium text-ink hover:bg-paper"
        >
          Ver evento público
        </a>
        <a
          href={`/e/${slug}/edit?t=${editToken}`}
          className="flex-1 rounded-control bg-accent px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-accent/90"
        >
          Agregar regalos
        </a>
      </div>
    </main>
  );
}

function LinkBox({
  label,
  url,
  copied,
  onCopy,
  warning,
}: {
  label: string;
  url: string;
  copied: boolean;
  onCopy: () => void;
  warning?: boolean;
}) {
  return (
    <div
      className={`rounded-card border p-4 ${
        warning ? "border-seal-gold/30 bg-seal-gold/10" : "border-border bg-surface"
      }`}
    >
      <p className="mb-2 text-xs font-medium text-ink-muted">{label}</p>
      <div className="flex items-center gap-2">
        <input
          readOnly
          value={url}
          className="min-w-0 flex-1 rounded-control border border-border bg-paper px-2 py-1 text-xs text-ink"
        />
        <button
          onClick={onCopy}
          className="shrink-0 rounded-control bg-ink px-3 py-1 text-xs text-white hover:bg-ink/90"
        >
          {copied ? "✓" : "Copiar"}
        </button>
      </div>
    </div>
  );
}
