import { notFound, redirect } from "next/navigation";
import { getEventRepository, getGiftRepository } from "@/lib/data";
import EditPageClient from "@/app/_components/edit-page-client";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ t?: string }>;
}

export default async function EditPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { t: token } = await searchParams;

  if (!token) redirect(`/e/${slug}`);

  const repo = getEventRepository();
  const event = await repo.getEventBySlug(slug);
  if (!event) notFound();

  const isValid = await repo.validateEditToken(event.id, token);
  if (!isValid) redirect(`/e/${slug}`);

  const gifts = await getGiftRepository().listGifts(event.id);

  return (
    <EditPageClient
      event={event}
      initialGifts={gifts}
      slug={slug}
      editToken={token}
    />
  );
}
