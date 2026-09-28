import type { NuevaTarea } from '@models/Tarea';
import { useState } from 'react';
import type { SubmitEvent } from 'react';
import type { Cliente } from '@models/Cliente';
import type { PrioridadTask } from '@models/Tarea';
import useTareas from '@hooks/useTareas';
import FormModal from '@components/FormModal';

const campo =
  'mt-1 w-full rounded-lg border border-border bg-panel p-2.5 text-foreground';

const valoresIniciales: NuevaTarea = {
  clienteId: '',
  titulo: '',
  descripcion: '',
  prioridad: 'media',
  fechaLimited: '',
};

export default function FormularioTarea({ clientes }: { clientes: Cliente[] }) {
  // React conserva los valores durante la edición y ante errores de guardado.
  const [valores, setValores] = useState<NuevaTarea>(valoresIniciales);

  function cambiarCampo<K extends keyof NuevaTarea>(
    campo: K,
    valor: NuevaTarea[K],
  ) {
    setValores((actuales) => ({ ...actuales, [campo]: valor }));
  }

  const { crear } = useTareas();
  const [abierto, setAbierto] = useState(false);
  const [aviso, setAviso] = useState('');

  async function guardar(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await crear.mutateAsync(valores);
      setAviso('Tarea añadida. Revisa los filtros si no aparece en la tabla.');
      return true;
    } catch {
      /* Conserva los campos y muestra el error del hook. */
      return false;
    }
  }

  return (
    <section className="mb-6" aria-label="Acciones de tareas">
      {/* Apertura del formulario y resultado de la operación. */}
      <button
        type="button"
        disabled={!clientes.length}
        onClick={() => {
          crear.reset();
          setValores(valoresIniciales);
          setAviso('');
          setAbierto(true);
        }}
        className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-on-accent disabled:opacity-50"
      >
        Añadir tarea
      </button>
      {!clientes.length && (
        <p className="mt-2 text-sm text-muted">
          Primero añade un cliente desde Clientes.
        </p>
      )}
      <p role="status" className="mt-3 text-sm text-accent">
        {aviso}
      </p>
      {/* Campos específicos; el modal aporta foco, errores y acciones. */}
      {abierto && (
        <FormModal
          titulo="Añadir tarea"
          onClose={() => setAbierto(false)}
          onSubmit={guardar}
          pendiente={crear.isPending}
          error={crear.error?.message}
          textoGuardar="Guardar tarea"
        >
          <label>
            Título
            <input
              name="titulo"
              value={valores.titulo}
              onChange={(event) => cambiarCampo('titulo', event.target.value)}
              required
              maxLength={200}
              className={campo}
            />
          </label>
          <label>
            Cliente
            <select
              name="clienteId"
              value={valores.clienteId}
              onChange={(event) =>
                cambiarCampo('clienteId', event.target.value)
              }
              required
              className={campo}
            >
              <option value="" disabled>
                Selecciona un cliente
              </option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nombre} {cliente.apellido}
                </option>
              ))}
            </select>
          </label>
          <label>
            Prioridad
            <select
              name="prioridad"
              value={valores.prioridad}
              onChange={(event) =>
                cambiarCampo('prioridad', event.target.value as PrioridadTask)
              }
              className={campo}
            >
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
            </select>
          </label>
          <label>
            Fecha límite (opcional)
            <input
              name="fechaLimited"
              value={valores.fechaLimited ?? ''}
              onChange={(event) =>
                cambiarCampo('fechaLimited', event.target.value)
              }
              type="date"
              className={campo}
            />
          </label>
          <label className="sm:col-span-2">
            Descripción (opcional)
            <textarea
              name="descripcion"
              value={valores.descripcion ?? ''}
              onChange={(event) =>
                cambiarCampo('descripcion', event.target.value)
              }
              maxLength={2000}
              rows={3}
              className={campo}
            />
          </label>
        </FormModal>
      )}
    </section>
  );
}
