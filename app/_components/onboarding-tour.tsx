"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export default function OnboardingTrigger() {
  const [started, setStarted] = useState(false);
  const driverRef = useRef<ReturnType<typeof driver> | null>(null);

  const startTour = useCallback(() => {
    setStarted(true);

    const d = driver({
      animate: true,
      showProgress: true,
      showButtons: ["next", "previous", "close"],
      doneBtnText: "¡Listo!",
      nextBtnText: "Siguiente",
      prevBtnText: "Anterior",
      progressText: "{{current}} de {{total}}",
      steps: [
        {
          element: "#tour-name",
          popover: {
            title: "Nombre del evento",
            description: "Elegí un nombre para tu evento. Va a aparecer en la tarjeta y en el link.",
            side: "bottom",
          },
        },
        {
          element: "#tour-type",
          popover: {
            title: "Tipo de evento",
            description: "Seleccioná el tipo. Cambia los colores y el estilo de la tarjeta.",
            side: "bottom",
          },
        },
        {
          element: "#tour-date",
          popover: {
            title: "Fecha y lugar",
            description: "Son opcionales, pero ayudan a tus invitados a organizarse.",
            side: "bottom",
          },
        },
        {
          element: "#tour-message",
          popover: {
            title: "Mensaje personal",
            description: "Dejale un mensaje a tus invitados. Va a aparecer en la tarjeta.",
            side: "top",
          },
        },
        {
          element: "#tour-submit",
          popover: {
            title: "¡Creá tu evento!",
            description: "Cuando esté listo, tocá acá. Vas a recibir un link para compartir y otro para editar.",
            side: "top",
          },
        },
      ],
      onDestroyed: () => {
        setStarted(false);
      },
    });

    driverRef.current = d;
    d.drive();
  }, []);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      driverRef.current?.destroy();
    };
  }, []);

  return (
    <button
      onClick={startTour}
      disabled={started}
      className="rounded-control border border-border px-3 py-1.5 text-xs font-medium text-ink-muted hover:border-accent hover:text-accent disabled:opacity-50"
    >
      {started ? "Tour en curso..." : "¿Cómo crear un evento?"}
    </button>
  );
}
