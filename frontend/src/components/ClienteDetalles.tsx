import useAnimatedClose from '@hooks/useAnimatedClose';
import { useEffect, useId, useRef, useState } from 'react';
import type { SubmitEvent, RefObject } from 'react';
import { X, UserRound, Pencil } from 'lucide-react';
import type { Cliente, EstadoCliente } from '@models/Cliente';
import useClientes from '@hooks/useClientes';

interface ClienteDetallesProps {
  cliente: Cliente;
  onClose: () => void;
  focoAlternativo: RefObject<HTMLDivElement | null>;
}

const estados: Record<EstadoCliente, string> = {
  prospecto: 'Prospecto',
  cliente: 'Cliente',
  inactivo: 'Inactivo',
};
const fecha = (valor: string) => {
  const dia = new Date(`${valor.slice(0, 10)}T12:00:00`);
  return Number.isNaN(dia.getTime())
    ? 'Sin fecha'
    : new Intl.DateTimeFormat('es-CL', { dateStyle: 'medium' }).format(dia);
};

export default function ClienteDetalles({
  cliente,
  onClose,
  focoAlternativo,
}: ClienteDetallesProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const tituloId = useId();
  const { cerrar, cerrando } = useAnimatedClose(dialog, onClose, true);
  const botonEstado = useRef<HTMLButtonElement>(null);
  const selectorEstado = useRef<HTMLSelectElement>(null);

  function cerrarEditor() {
    botonEstado.current?.focus({ preventScroll: true });
    setEditando(false);
  }
  const [editando, setEditando] = useState(false);
  const [estado, setEstado] = useState(cliente.estado);
  const [aviso, setAviso] = useState('');
  const { cambiarEstado } = useClientes();

  // El dialog nativo bloquea el fondo y mantiene la navegación de teclado dentro.
  useEffect(() => {
    const element = dialog.current;
    const origen = document.activeElement;
    const alternativa = focoAlternativo.current;
    const overflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      element?.close();
      document.body.style.overflow = overflow;
      // El enlace original puede desaparecer si el estado cambia el filtro activo.
      const destino =
        origen instanceof HTMLElement && origen.isConnected
          ? origen
          : alternativa;
      destino?.focus({ preventScroll: true });
    };
  }, [focoAlternativo]);

  useEffect(() => {
    if (editando) selectorEstado.current?.focus({ preventScroll: true });
  }, [editando]);

  async function guardar(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (cambiarEstado.isPending || estado === cliente.estado || cerrando)
      return;
    try {
      await cambiarEstado.mutateAsync({ id: cliente.id, estado });
      cerrarEditor();
      setAviso(
        'Estado actualizado. El cambio quedó registrado en Interacciones.',
      );
    } catch {
      /* Mantiene abierto el editor y muestra el error del hook. */
    }
  }

  return (
    <dialog
      ref={dialog}
      data-cerrando={cerrando ? 'true' : undefined}
      aria-labelledby={tituloId}
      aria-busy={cambiarEstado.isPending}
      onCancel={(event) => {
        event.preventDefault();
        if (!cambiarEstado.isPending) cerrar();
      }}
      className="cliente-detalles fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-full max-w-md overflow-y-auto border-l border-border bg-panel p-0 text-foreground shadow-2xl backdrop:bg-black/40 backdrop:backdrop-blur-sm"
    >
      {/* Cabecera y cierre del panel. */}
      <header className="flex items-center justify-between gap-4 border-b border-border p-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-accent">
            Clientes
          </p>
          <h2 id={tituloId} className="mt-1 text-2xl font-bold">
            Detalles del cliente
          </h2>
        </div>
        <button
          type="button"
          onClick={cerrar}
          disabled={cambiarEstado.isPending || cerrando}
          aria-label="Cerrar detalles"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl hover:bg-subtle disabled:opacity-50"
        >
          <X size={22} aria-hidden="true" />
        </button>
      </header>
      <div className="space-y-6 p-5 sm:p-6">
        {/* Identidad y estado actual. */}
        <section className="rounded-2xl bg-accent-soft p-5">
          <UserRound
            size={26}
            className="mb-3 text-accent"
            aria-hidden="true"
          />
          <h3 className="text-2xl font-bold wrap-anywhere">
            {cliente.nombre} {cliente.apellido}
          </h3>
          <p className="mt-1 text-sm text-muted">
            {cliente.empresa || 'Sin empresa'}
          </p>
          <span className="mt-4 inline-flex rounded-full bg-panel px-3 py-1 text-xs font-semibold text-accent">
            {estados[cliente.estado]}
          </span>
        </section>
        {/* Datos de contacto y fechas del registro. */}
        <section aria-label="Información del cliente">
          <dl className="space-y-4 text-sm">
            {[
              ['Correo electrónico', cliente.email],
              ['Teléfono', cliente.telefono],
              ['Fecha de registro', fecha(cliente.fechaCreated)],
              ['Última actualización', fecha(cliente.fechaUpdated)],
            ].map(([nombre, valor]) => (
              <div key={nombre}>
                <dt className="text-xs text-muted">{nombre}</dt>
                <dd className="mt-1 wrap-anywhere">
                  {valor || 'Sin información'}
                </dd>
              </div>
            ))}
          </dl>
        </section>
        {/* Modificaciones para este cliente: no se necesita volver a seleccionarlo. */}
        <section
          className="border-t border-border pt-5"
          aria-label="Modificar estado"
        >
          <button
            ref={botonEstado}
            aria-expanded={editando}
            aria-controls={`${tituloId}-editor`}
            type="button"
            aria-disabled={cambiarEstado.isPending || cerrando}
            onClick={() => {
              if (cambiarEstado.isPending || cerrando) return;
              if (editando) {
                cerrarEditor();
                return;
              }
              setEstado(cliente.estado);
              cambiarEstado.reset();
              setAviso('');
              setEditando(true);
            }}
            className="flex min-h-11 items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-on-accent"
          >
            <Pencil size={16} aria-hidden="true" />
            Cambiar estado
          </button>
          {/* El editor conserva su altura animable y no admite foco al ocultarse. */}
          <div
            id={`${tituloId}-editor`}
            inert={!editando}
            className={`grid transition-[grid-template-rows,opacity] duration-250 ease-in-out motion-reduce:transition-none ${editando ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
          >
            <div className="min-h-0 overflow-hidden">
              <form onSubmit={guardar} className="pt-4">
                <label className="block text-sm font-medium">
                  Nuevo estado
                  <select
                    ref={selectorEstado}
                    value={estado}
                    onChange={(event) =>
                      setEstado(event.target.value as EstadoCliente)
                    }
                    disabled={cambiarEstado.isPending || cerrando}
                    className="mt-2 w-full rounded-xl border border-border bg-panel p-3 text-foreground"
                  >
                    {Object.entries(estados).map(([valor, nombre]) => (
                      <option key={valor} value={valor}>
                        {nombre}
                      </option>
                    ))}
                  </select>
                </label>
                <p className="mt-2 text-xs leading-5 text-muted">
                  Cada cambio se registra como una nota en el historial de
                  interacciones.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={
                      cambiarEstado.isPending || estado === cliente.estado
                    }
                    className="min-h-11 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-on-accent disabled:opacity-50"
                  >
                    {cambiarEstado.isPending ? 'Guardando…' : 'Guardar cambio'}
                  </button>
                  <button
                    type="button"
                    disabled={cambiarEstado.isPending || cerrando}
                    onClick={() => {
                      cerrarEditor();
                      cambiarEstado.reset();
                    }}
                    className="min-h-11 rounded-xl border border-border px-4 py-2 text-sm hover:bg-subtle disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                </div>
                {cambiarEstado.isError && (
                  <p role="alert" className="mt-3 text-sm text-warning">
                    {cambiarEstado.error.message}
                  </p>
                )}
              </form>
            </div>
          </div>
          <p
            key={aviso}
            role="status"
            className="confirmacion-estado mt-3 text-sm leading-6 text-accent"
          >
            {aviso}
          </p>
        </section>
      </div>
    </dialog>
  );
}
