import { cache } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import QRCode from "qrcode";
import { getEventRepository, getGiftRepository } from "@/lib/data";
import AnimatedGiftList from "@/app/_components/animated-list";
import ShareButtons from "@/app/_components/share-buttons";

export const dynamic = "force-dynamic";

const BASE_URL = "https://invitee-navy.vercel.app";

const EVENT_LABELS: Record<string, string> = {
  birthday: "Cumpleaños",
  wedding: "Boda",
  graduation: "Graduación",
  babyshower: "Baby Shower",
  other: "Celebración",
};

const getEvent = cache(async (slug: string) => {
  return getEventRepository().getEventBySlug(slug);
});

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("es-AR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function buildDescription(event: Awaited<ReturnType<typeof getEvent>>): string {
  if (!event) return "";
  const parts: string[] = [EVENT_LABELS[event.type] ?? event.type];
  if (event.date) parts.push(formatDate(event.date));
  if (event.location) parts.push(event.location);
  if (event.message) parts.push(`"${event.message}"`);
  return parts.join(" · ");
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) return {};

  const title = `${event.name} — Invitee`;
  const description = buildDescription(event);
  const cardUrl = `${BASE_URL}/api/events/${slug}/card`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/e/${slug}`,
      type: "website",
      images: [
        {
          url: cardUrl,
          width: 1080,
          height: 1080,
          alt: `Tarjeta de invitación — ${event.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [cardUrl],
    },
  };
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  const event = await getEvent(slug);

  if (!event) notFound();

  const showCard = event.shareMode === "card_only" || event.shareMode === "combined";
  const showList = event.shareMode === "list_only" || event.shareMode === "combined";

  const gifts = showList ? await getGiftRepository().listGifts(event.id) : [];

  const publicUrl = `${BASE_URL}/e/${slug}`;
  const qrSvg =
    event.shareMode === "combined"
      ? await QRCode.toString(publicUrl, { type: "svg", margin: 1 })
      : null;

  return (
    <main className="mx-auto max-w-lg px-4 py-10 sm:py-14">
      <header className="mb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">
          {event.type}
        </p>
        <h1 className="font-display mt-2 text-3xl font-bold leading-tight text-ink sm:text-4xl">
          {event.name}
        </h1>
        {event.date && (
          <p className="mt-2 text-ink-muted">
            {new Date(event.date).toLocaleDateString("es-AR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        )}
        {event.location && <p className="mt-1 text-ink-muted">{event.location}</p>}
        {event.message && (
          <p className="mt-4 italic text-ink-muted">&ldquo;{event.message}&rdquo;</p>
        )}
      </header>

      {showCard && (
        <section className="mb-8 text-center">
          <a
            href={`/api/events/${slug}/card`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-card border border-border p-2 shadow-sm hover:border-accent hover:shadow-md transition-shadow"
            title="Ver tarjeta de invitación"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/events/${slug}/card`}
              alt="Tarjeta de invitación"
              width={340}
              height={340}
              className="rounded-card"
            />
          </a>
          <p className="mt-2 text-xs text-ink-muted">Tocá para descargar la tarjeta</p>
        </section>
      )}

      {showList && (
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-ink">Lista de regalos</h2>
          <AnimatedGiftList gifts={gifts} />
        </section>
      )}

      <ShareButtons slug={slug} />

      {qrSvg && (
        <section className="mt-10 flex flex-col items-center">
          <p className="mb-3 text-sm text-ink-muted">Compartí este QR con tus invitados</p>
          <div
            className="w-36 rounded-card border border-border p-3"
            dangerouslySetInnerHTML={{ __html: qrSvg }}
          />
        </section>
      )}
    </main>
  );
}
