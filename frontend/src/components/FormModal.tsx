import useAnimatedClose from '@hooks/useAnimatedClose';
import { useEffect, useId, useRef } from 'react';
import type { SubmitEvent, ReactNode } from 'react';
import { X } from 'lucide-react';

interface FormModalProps {
  titulo: string;
  children: ReactNode;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => Promise<boolean>;
  onClose: () => void;
  pendiente?: boolean;
  error?: string;
  textoGuardar?: string;
}

// Se monta al abrirlo. El dialog nativo mantiene el foco dentro del modal.
export default function FormModal({
  titulo,
  children,
  onSubmit,
  onClose,
  pendiente = false,
  error,
  textoGuardar = 'Guardar',
}: FormModalProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const tituloId = useId();
  const { cerrar, cerrando } = useAnimatedClose(dialog, onClose);

  useEffect(() => {
    const element = dialog.current;
    const origen = document.activeElement;
    const overflowAnterior = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      element?.close();
      document.body.style.overflow = overflowAnterior;
      if (origen instanceof HTMLElement && origen.isConnected)
        origen.focus({ preventScroll: true });
    };
  }, []);

  return (
    <dialog
      ref={dialog}
      data-cerrando={cerrando ? 'true' : undefined}
      aria-labelledby={tituloId}
      aria-busy={pendiente}
      onCancel={(event) => {
        event.preventDefault();
        if (!pendiente) cerrar();
      }}
      className="form-modal m-auto max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-xl overflow-y-auto rounded-2xl border border-border bg-panel p-0 text-foreground shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm"
    >
      {/* Título y cierre accesible. */}
      <header className="flex items-center justify-between gap-4 border-b border-border p-5">
        <h2 id={tituloId} className="text-2xl font-bold">
          {titulo}
        </h2>
        <button
          type="button"
          onClick={cerrar}
          disabled={pendiente || cerrando}
          aria-label="Cerrar formulario"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl hover:bg-subtle disabled:opacity-50"
        >
          <X size={20} aria-hidden="true" />
        </button>
      </header>
      {/* Los campos y la operación pertenecen al formulario que usa el modal. */}
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          if (pendiente || cerrando) return;
          // El formulario informa si guardó; los errores mantienen el modal abierto.
          if (await onSubmit(event)) cerrar();
        }}
        className="p-5"
      >
        <fieldset
          disabled={pendiente || cerrando}
          className="grid gap-4 text-sm sm:grid-cols-2"
        >
          {children}
        </fieldset>
        {error && (
          <p role="alert" className="mt-4 text-sm text-warning">
            {error}
          </p>
        )}
        {/* Acciones comunes de todos los formularios. */}
        <footer className="mt-6 flex flex-wrap justify-end gap-3 border-t border-border pt-4">
          <button
            type="button"
            onClick={cerrar}
            disabled={pendiente || cerrando}
            className="rounded-xl border border-border px-4 py-2.5 text-sm hover:bg-subtle disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={pendiente || cerrando}
            className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-on-accent disabled:opacity-50"
          >
            {pendiente ? 'Guardando…' : textoGuardar}
          </button>
        </footer>
      </form>
    </dialog>
  );
}
