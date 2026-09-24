import { useEffect, useState } from 'react';
import {
  Mail,
  MessageSquare,
  Phone,
  StickyNote,
  Users,
  Search,
} from 'lucide-react';
import type { TipoInteraction } from '@models/Interaccion';
import type { ReactNode } from 'react';
import type { Cliente } from '@models/Cliente';
import type { Interaccion } from '@models/Interaccion';
import useClientes from '@hooks/useClientes';
import useInteracciones from '@hooks/useInteracciones';

// Los datos de esta vista se obtienen mediante los hooks del CRM.

// Permite buscar sin distinguir mayúsculas ni tildes.
const normalizar = (texto: string) =>
  texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const panel = 'rounded-2xl border border-border bg-panel';

function Cabecera({
  seccion,
  titulo,
  descripcion,
  children,
}: {
  seccion: string;
  titulo: string;
  descripcion: string;
  children?: ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          {seccion}
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          {titulo}
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
          {descripcion}
        </p>
      </div>
      {children ?? (
        <span className="rounded-full border border-border px-3 py-1.5 text-xs text-muted">
          Datos de ejemplo
        </span>
      )}
    </header>
  );
}

function Etiqueta({
  children,
  tono = 'neutral',
}: {
  children: ReactNode;
  tono?: 'neutral' | 'accent' | 'warning';
}) {
  const colores = {
    neutral: 'bg-subtle text-muted',
    accent: 'bg-accent-soft text-accent',
    warning: 'bg-warning-soft text-warning',
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${colores[tono]}`}
    >
      {children}
    </span>
  );
}

function Busqueda({
  valor,
  cambiar,
  placeholder,
}: {
  valor: string;
  cambiar: (valor: string) => void;
  placeholder: string;
}) {
  return (
    <label className="flex min-w-0 items-center gap-2 rounded-xl border border-border bg-panel px-3 py-2.5 text-muted focus-within:ring-2 focus-within:ring-accent">
      <Search size={17} aria-hidden="true" />
      <span className="sr-only">{placeholder}</span>
      <input
        type="search"
        value={valor}
        onChange={(event) => cambiar(event.target.value)}
        placeholder={placeholder}
        className="w-full min-w-0 bg-transparent text-sm text-foreground outline-none placeholder:text-muted"
      />
    </label>
  );
}

const tipos = {
  llamada: { nombre: 'Llamada', icono: Phone },
  correo: { nombre: 'Correo', icono: Mail },
  reunion: { nombre: 'Reunión', icono: Users },
  nota: { nombre: 'Nota', icono: StickyNote },
};
const filtros: { valor: TipoInteraction | 'todos'; nombre: string }[] = [
  { valor: 'todos', nombre: 'Todas' },
  { valor: 'llamada', nombre: 'Llamadas' },
  { valor: 'correo', nombre: 'Correos' },
  { valor: 'reunion', nombre: 'Reuniones' },
  { valor: 'nota', nombre: 'Notas' },
];

export default function Historial() {
  const [busqueda, setBusqueda] = useState('');
  const [tipo, setTipo] = useState<TipoInteraction | 'todos'>('todos');

  const {
    data: dataClientes,
    error: errorClientes,
    isLoading: loadingClientes,
  } = useClientes();
  const clientes: Cliente[] = dataClientes ?? [];

  const {
    data: dataInteractions,
    error: errorInteractions,
    isLoading: loadingInteractions,
  } = useInteracciones();
  const interacciones: Interaccion[] = dataInteractions ?? [];

  // Relaciona cada registro con el nombre de su cliente.
  const nombreCliente = (id: string) => {
    const cliente = clientes.find((item) => item.id === id);
    return cliente ? `${cliente.nombre} ${cliente.apellido}` : 'Sin cliente';
  };

  // Filtra y ordena una copia; los datos del hook no se modifican.
  const visibles = interacciones
    .filter(
      (item) =>
        (tipo === 'todos' || item.tipo === tipo) &&
        normalizar(
          `${item.titulo} ${item.descripcion ?? ''} ${nombreCliente(item.clienteId)}`,
        ).includes(normalizar(busqueda.trim())),
    )
    .sort((a, b) => b.fecha.localeCompare(a.fecha));
  const dias = [...new Set(visibles.map((item) => item.fecha.slice(0, 10)))];

  useEffect(() => {
    if (!loadingClientes && errorClientes) {
      console.error(errorClientes);
    }
  }, [loadingClientes, errorClientes]);

  useEffect(() => {
    if (!loadingInteractions && errorInteractions) {
      console.error(errorInteractions);
    }
  }, [loadingInteractions, errorInteractions]);

  return (
    <div className="mx-auto w-full max-w-7xl p-4 text-foreground sm:p-8 lg:p-10">
      {/* Título y contexto de la vista. */}
      <Cabecera
        seccion="El hilo de cada relación"
        titulo="Interacciones"
        descripcion="Conversaciones, acuerdos y pequeños detalles que vale la pena recordar."
      />
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_260px]">
        <section className="min-w-0" aria-label="Historial de interacciones">
          {/* Búsqueda y filtros por tipo de conversación. */}
          <div className={`${panel} mb-7 space-y-4 p-4`}>
            <Busqueda
              valor={busqueda}
              cambiar={setBusqueda}
              placeholder="Buscar conversación o cliente…"
            />
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="Filtrar por tipo de interacción"
            >
              {filtros.map(({ valor, nombre }) => (
                <button
                  key={valor}
                  type="button"
                  aria-pressed={tipo === valor}
                  onClick={() => setTipo(valor)}
                  className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${tipo === valor ? 'bg-accent text-on-accent' : 'bg-subtle text-muted hover:bg-accent-soft hover:text-accent'}`}
                >
                  {nombre}
                </button>
              ))}
            </div>
          </div>
          <p role="status" className="mb-5 text-xs text-muted">
            {visibles.length} interacciones · Más recientes primero
          </p>
          {/* Línea de tiempo agrupada por día. */}
          {dias.map((dia) => (
            <section
              key={dia}
              className="mb-8"
              aria-label={`Interacciones del ${dia}`}
            >
              <h2 className="mb-4 text-sm font-semibold capitalize">
                <time dateTime={dia}>
                  {new Intl.DateTimeFormat('es-CL', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  }).format(new Date(`${dia}T12:00:00`))}
                </time>
              </h2>
              <ol className="ml-4 space-y-4 border-l border-border pl-7">
                {visibles
                  .filter((item) => item.fecha.startsWith(dia))
                  .map((item) => {
                    const Icono = tipos[item.tipo].icono;
                    return (
                      <li key={item.id} className="relative">
                        <span className="absolute -left-11 top-5 flex h-8 w-8 items-center justify-center rounded-full border-4 border-background bg-accent-soft text-accent">
                          <Icono size={13} aria-hidden="true" />
                        </span>
                        <article className={`${panel} p-5`}>
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <Etiqueta tono="accent">
                              {tipos[item.tipo].nombre}
                            </Etiqueta>
                            <time
                              dateTime={item.fecha}
                              className="text-xs text-muted"
                            >
                              {item.fecha.slice(11, 16)}
                            </time>
                          </div>
                          <h3 className="mt-3 text-lg font-bold">
                            {item.titulo}
                          </h3>
                          <p className="mt-2 text-sm leading-6 text-muted">
                            {item.descripcion}
                          </p>
                          <p className="mt-4 border-t border-border pt-3 text-xs font-medium">
                            {nombreCliente(item.clienteId)}
                          </p>
                        </article>
                      </li>
                    );
                  })}
              </ol>
            </section>
          ))}
          {/* Mensaje cuando no hay coincidencias. */}
          {visibles.length === 0 && (
            <div className={`${panel} p-10 text-center`}>
              <MessageSquare
                size={28}
                className="mx-auto mb-3 text-muted"
                aria-hidden="true"
              />
              <h2 className="text-lg font-bold">Sin conversaciones por aquí</h2>
              <p className="mt-2 text-sm text-muted">
                Prueba otro término o selecciona otro tipo.
              </p>
            </div>
          )}
        </section>
        {/* Resumen del historial completo. */}
        <aside className={`${panel} p-5`} aria-label="Resumen del historial">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">
            Cada contacto cuenta
          </p>
          <h2 className="mt-4 text-xl font-bold">Un historial compartido</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Todo el contexto de tus relaciones, conversación a conversación.
          </p>
          <dl className="mt-6 space-y-4">
            {filtros.slice(1).map(({ valor, nombre }) => (
              <div key={valor} className="flex justify-between gap-3 text-sm">
                <dt className="text-muted">{nombre}</dt>
                <dd className="font-semibold">
                  {interacciones.filter((item) => item.tipo === valor).length}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 border-t border-border pt-4 text-xs leading-5 text-muted">
            Resumen del historial completo de ejemplo.
          </p>
        </aside>
      </div>
    </div>
  );
}
