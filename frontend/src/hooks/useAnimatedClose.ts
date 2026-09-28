import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

// Espera la salida visual antes de desmontar; evita cierres duplicados.
export default function useAnimatedClose(
  elemento: RefObject<HTMLDialogElement | null>,
  onClose: () => void,
  lateral = false,
) {
  const animacion = useRef<Animation | null>(null);
  const cierreIniciado = useRef(false);
  const [cerrando, setCerrando] = useState(false);

  useEffect(
    () => () => {
      animacion.current?.cancel();
    },
    [],
  );

  function cerrar() {
    if (cierreIniciado.current) return;
    const dialog = elemento.current;
    if (
      !dialog ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !dialog.animate
    ) {
      onClose();
      return;
    }
    cierreIniciado.current = true;
    setCerrando(true);
    animacion.current = dialog.animate(
      [
        { opacity: 1, transform: 'none' },
        {
          opacity: 0,
          transform: lateral
            ? 'translateX(100%)'
            : 'translateY(12px) scale(0.98)',
        },
      ],
      { duration: 220, easing: 'ease-in', fill: 'forwards' },
    );
    // Una cancelación por desmontaje no debe ejecutar otro cierre.
    void animacion.current.finished.then(onClose, () => {});
  }

  return { cerrar, cerrando };
}
