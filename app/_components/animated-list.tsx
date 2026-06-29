"use client";

import { motion } from "framer-motion";
import type { Gift } from "@/lib/types";

function GiftCard({ gift }: { gift: Gift }) {
  return (
    <li className="rounded-lg border border-gray-200 p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-medium text-gray-900">{gift.name}</p>
          {gift.description && (
            <p className="mt-1 text-sm text-gray-500">{gift.description}</p>
          )}
          {gift.approxPrice != null && (
            <p className="mt-1 text-sm text-gray-400">
              ~${gift.approxPrice.toLocaleString("es-AR")}
            </p>
          )}
        </div>
        {gift.purchaseLink && (
          <a
            href={gift.purchaseLink}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded bg-indigo-600 px-3 py-1 text-sm text-white hover:bg-indigo-700"
          >
            Ver
          </a>
        )}
      </div>
    </li>
  );
}

export default function AnimatedGiftList({ gifts }: { gifts: Gift[] }) {
  if (gifts.length === 0) {
    return <p className="text-gray-400">Todavía no hay regalos en la lista.</p>;
  }

  return (
    <ul className="space-y-3">
      {gifts.map((g, i) => (
        <motion.div
          key={g.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.07 }}
        >
          <GiftCard gift={g} />
        </motion.div>
      ))}
    </ul>
  );
}
