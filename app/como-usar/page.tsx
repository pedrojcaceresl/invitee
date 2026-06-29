import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cómo usar Invitee",
  description: "Aprendé a crear tu tarjeta de invitación y lista de regalos en minutos.",
};

const stepClass = "flex gap-5 items-start";
const numberClass =
  "shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-bold text-white";
const contentClass = "space-y-2 flex-1";

export default function ComoUsarPage() {
  return (
    <main className="mx-auto max-w-xl px-4 py-12 space-y-12">
      <header className="text-center">
        <Link
          href="/"
          className="mb-4 inline-block text-xs text-ink-muted hover:text-accent hover:underline"
        >
          ← Volver al inicio
        </Link>
        <h1 className="font-display text-3xl font-bold text-ink">Cómo usar Invitee</h1>
        <p className="mt-2 text-ink-muted">
          Creá tu tarjeta de invitación y lista de regalos en 4 pasos.
        </p>
      </header>

      <div className="space-y-8">
        <div className={stepClass}>
          <span className={numberClass}>1</span>
          <div className={contentClass}>
            <h2 className="font-display text-lg font-semibold text-ink">Creá tu evento</h2>
            <p className="text-sm text-ink-muted">
              Completá el nombre, tipo de evento, fecha y lugar. También podés agregar un mensaje
              personalizado para tus invitados. No necesitás crear una cuenta.
            </p>
            <div className="rounded-card border border-border bg-surface p-4">
              <p className="text-xs text-ink-muted">
                Tip: podés elegir entre Cumpleaños, Casamiento, Graduación, Baby Shower u Otro.
              </p>
            </div>
          </div>
        </div>

        <div className={stepClass}>
          <span className={numberClass}>2</span>
          <div className={contentClass}>
            <h2 className="font-display text-lg font-semibold text-ink">Personalizá la tarjeta</h2>
            <p className="text-sm text-ink-muted">
              Elegí entre <strong>3 estilos de diseño</strong> (Moderno, Elegante e Ilustrado). Subí
              una foto y descargá la tarjeta como imagen PNG. Tus invitados la van a ver cuando
              abras el link.
            </p>
            <div className="rounded-card border border-border bg-surface p-4">
              <p className="text-xs text-ink-muted">
                Tip: la foto es opcional. Si no subís una, la tarjeta usa solo texto y colores.
              </p>
            </div>
          </div>
        </div>

        <div className={stepClass}>
          <span className={numberClass}>3</span>
          <div className={contentClass}>
            <h2 className="font-display text-lg font-semibold text-ink">Agregá regalos</h2>
            <p className="text-sm text-ink-muted">
              En el panel de edición podés agregar, editar y borrar regalos. Cada regalo puede
              tener nombre, descripción, link de compra y precio aproximado.
            </p>
            <div className="rounded-card border border-border bg-surface p-4">
              <p className="text-xs text-ink-muted">
                Tip: poné el link a Mercado Libre o la tienda que prefieras para que tus invitados
                sepan dónde comprarlo.
              </p>
            </div>
          </div>
        </div>

        <div className={stepClass}>
          <span className={numberClass}>4</span>
          <div className={contentClass}>
            <h2 className="font-display text-lg font-semibold text-ink">Compartí el link</h2>
            <p className="text-sm text-ink-muted">
              Copiá el link público o compartilo directo por WhatsApp. Podés elegir qué ven tus
              invitados: solo la tarjeta, solo la lista de regalos, o ambas con un código QR. Si
              compartís en redes, la vista previa incluye tu tarjeta personalizada.
            </p>
            <div className="rounded-card border border-border bg-surface p-4">
              <p className="text-xs text-ink-muted">
                Tip: guardá el link de edición en un lugar seguro. Solo vos podés modificar el
                evento y los regalos.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 text-center">
        <Link
          href="/"
          className="inline-block rounded-control bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent/90"
        >
          Crear mi evento
        </Link>
      </div>
    </main>
  );
}
