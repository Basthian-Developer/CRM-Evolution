import type { NuevoCliente } from '@models/Cliente';
import { useState } from 'react';
import type { SubmitEvent } from 'react';
import type { EstadoCliente } from '@models/Cliente';
import useClientes from '@hooks/useClientes';
import FormModal from '@components/FormModal';

const campo =
  'mt-1 w-full rounded-lg border border-border bg-panel p-2.5 text-foreground';
const boton =
  'rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-on-accent disabled:opacity-50';

const valoresIniciales: NuevoCliente = {
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  empresa: '',
  estado: 'prospecto',
};

export default function FormulariosClientes() {
  // React conserva los valores durante la edición y ante errores de guardado.
  const [valores, setValores] = useState<NuevoCliente>(valoresIniciales);

  function cambiarCampo<K extends keyof NuevoCliente>(
    campo: K,
    valor: NuevoCliente[K],
  ) {
    setValores((actuales) => ({ ...actuales, [campo]: valor }));
  }

  const { crear } = useClientes();
  const [modal, setModal] = useState(false);
  const [aviso, setAviso] = useState('');

  function abrir() {
    crear.reset();
    setValores(valoresIniciales);
    setAviso('');
    setModal(true);
  }

  async function guardarCliente(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await crear.mutateAsync(valores);
      setAviso(
        'Cliente añadido. Revisa los filtros si no aparece en la tabla.',
      );
      return true;
    } catch {
      /* El modal conserva los campos y muestra el error del hook. */
      return false;
    }
  }

  return (
    <section className="mb-6" aria-label="Acciones de clientes">
      {/* Botones que abren los formularios. */}
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={abrir} className={boton}>
          Añadir cliente
        </button>
      </div>
      <p role="status" className="mt-3 text-sm text-accent">
        {aviso}
      </p>
      {/* Identificación y contacto del nuevo cliente. */}
      {modal && (
        <FormModal
          titulo="Añadir cliente"
          onClose={() => setModal(false)}
          onSubmit={guardarCliente}
          pendiente={crear.isPending}
          error={crear.error?.message}
          textoGuardar="Guardar cliente"
        >
          {/* Identificación y contacto. */}
          <label>
            Nombre
            <input
              name="nombre"
              value={valores.nombre}
              onChange={(event) => cambiarCampo('nombre', event.target.value)}
              required
              maxLength={100}
              className={campo}
            />
          </label>
          <label>
            Apellido
            <input
              name="apellido"
              value={valores.apellido}
              onChange={(event) => cambiarCampo('apellido', event.target.value)}
              required
              maxLength={100}
              className={campo}
            />
          </label>
          <label>
            Correo
            <input
              name="email"
              value={valores.email}
              onChange={(event) => cambiarCampo('email', event.target.value)}
              type="email"
              required
              maxLength={200}
              className={campo}
            />
          </label>
          <label>
            Teléfono
            <input
              name="telefono"
              value={valores.telefono}
              onChange={(event) => cambiarCampo('telefono', event.target.value)}
              type="tel"
              required
              maxLength={40}
              className={campo}
            />
          </label>
          <label>
            Empresa (opcional)
            <input
              name="empresa"
              value={valores.empresa ?? ''}
              onChange={(event) => cambiarCampo('empresa', event.target.value)}
              maxLength={150}
              className={campo}
            />
          </label>
          <label>
            Estado inicial
            <select
              name="estado"
              value={valores.estado}
              onChange={(event) =>
                cambiarCampo('estado', event.target.value as EstadoCliente)
              }
              className={campo}
            >
              <option value="prospecto">Prospecto</option>
              <option value="cliente">Cliente</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </label>
        </FormModal>
      )}
    </section>
  );
}
