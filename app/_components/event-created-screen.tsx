"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  slug: string;
  editToken: string;
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
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center"
      >
        <div className="text-4xl">🎉</div>
        <h1 className="mt-3 text-2xl font-bold text-green-800">¡Evento creado!</h1>
        <p className="mt-2 text-sm text-green-600">
          Compartí el link público con tus invitados y guardá el link de edición en un lugar seguro.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
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
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Ver evento público
        </a>
        <a
          href={`/e/${slug}/edit?t=${editToken}`}
          className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-indigo-700"
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
    <div className={`rounded-lg border p-4 ${warning ? "border-amber-200 bg-amber-50" : "border-gray-200"}`}>
      <p className="mb-2 text-xs font-medium text-gray-500">{label}</p>
      <div className="flex items-center gap-2">
        <input
          readOnly
          value={url}
          className="min-w-0 flex-1 rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700"
        />
        <button
          onClick={onCopy}
          className="shrink-0 rounded bg-gray-800 px-3 py-1 text-xs text-white hover:bg-gray-700"
        >
          {copied ? "✓" : "Copiar"}
        </button>
      </div>
    </div>
  );
}
