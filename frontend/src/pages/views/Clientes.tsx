import Table, { type TableColumn } from '@components/table';
import { useMemo, useState } from 'react';
import { Users, Search } from 'lucide-react';
import type { EstadoCliente } from '@models/Cliente';
import type { ReactNode } from 'react';
import type { Cliente } from '@models/Cliente';
import useClientes from '@hooks/useClientes';

// Muestra la fecha sin desplazar el día por la zona horaria.
const fechaCorta = (fecha: string) =>
  new Intl.DateTimeFormat('es-CL', { day: 'numeric', month: 'short' }).format(
    new Date(`${fecha.slice(0, 10)}T12:00:00`),
  );

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
      {children}
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

const estados: { valor: EstadoCliente | 'todos'; nombre: string }[] = [
  { valor: 'todos', nombre: 'Todos' },
  { valor: 'cliente', nombre: 'Clientes' },
  { valor: 'prospecto', nombre: 'Prospectos' },
  { valor: 'inactivo', nombre: 'Inactivos' },
];

// Referencia estable mientras llega la respuesta del hook.
const CLIENTES_VACIOS: Cliente[] = [];
// Las columnas no dependen del estado: se definen una sola vez.
const columnas: TableColumn<Cliente>[] = [
  {
    accessorKey: 'nombre',
    header: 'Nombre',
    cell: ({ row }) => {
      const cliente = row.original;
      return (
        <div className="flex items-center gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-semibold text-accent"
            aria-hidden="true"
          >
            {cliente.nombre[0]}
            {cliente.apellido[0]}
          </span>
          <span className="whitespace-nowrap">
            {cliente.nombre} {cliente.apellido}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'empresa',
    header: 'Empresa',
    cell: ({ row }) => {
      const cliente = row.original;
      return <>{cliente.empresa ?? 'Sin empresa'}</>;
    },
  },
  {
    accessorKey: 'email',
    header: 'Contacto',
    cell: ({ row }) => {
      const cliente = row.original;
      return (
        <>
          <p>{cliente.email}</p>
          <p className="mt-1 text-xs text-muted">{cliente.telefono}</p>
        </>
      );
    },
  },
  {
    accessorKey: 'estado',
    header: 'Estado',
    cell: ({ row }) => {
      const cliente = row.original;
      return (
        <Etiqueta
          tono={
            cliente.estado === 'cliente'
              ? 'accent'
              : cliente.estado === 'prospecto'
                ? 'warning'
                : 'neutral'
          }
        >
          {
            {
              cliente: 'Cliente',
              prospecto: 'Prospecto',
              inactivo: 'Inactivo',
            }[cliente.estado]
          }
        </Etiqueta>
      );
    },
  },
  {
    accessorKey: 'fechaUpdated',
    header: 'Actualización',
    cell: ({ row }) => {
      const cliente = row.original;
      return (
        <time dateTime={cliente.fechaUpdated}>
          {fechaCorta(cliente.fechaUpdated)}
        </time>
      );
    },
  },
];

export default function Clientes() {
  const [busqueda, setBusqueda] = useState('');
  const [estado, setEstado] = useState<EstadoCliente | 'todos'>('todos');

  const { data, error, isLoading, refetch } = useClientes();
  const clientes: Cliente[] = data ?? CLIENTES_VACIOS;

  // Conserva la referencia de los resultados para evitar reinicios de la tabla.
  const visibles = useMemo(
    () =>
      clientes.filter(
        (cliente) =>
          (estado === 'todos' || cliente.estado === estado) &&
          normalizar(
            `${cliente.nombre} ${cliente.apellido} ${cliente.empresa ?? ''} ${cliente.email} ${cliente.telefono}`,
          ).includes(normalizar(busqueda.trim())),
      ),
    [clientes, estado, busqueda],
  );

  return (
    <div className="mx-auto w-full max-w-7xl p-4 text-foreground sm:p-8 lg:p-10">
      {/* Título y contexto de la vista. */}
      <Cabecera
        seccion="Relaciones que crecen"
        titulo="Clientes"
        descripcion="Cada nombre, una historia. Tu cartera de contactos en un solo lugar."
      />
      {/* Resumen de los registros, antes de aplicar filtros. */}
      <section
        className="mb-6 grid gap-4 sm:grid-cols-3"
        aria-label="Resumen de clientes"
      >
        {estados.slice(1).map(({ valor, nombre }) => (
          <article
            key={valor}
            className={`${panel} flex items-center justify-between p-5`}
          >
            <div>
              <p className="text-sm text-muted">{nombre}</p>
              <p className="mt-2 text-3xl font-semibold">
                {clientes.filter((cliente) => cliente.estado === valor).length}
              </p>
            </div>
            <Users size={22} className="text-accent" aria-hidden="true" />
          </article>
        ))}
      </section>
      <section
        className={`${panel} min-w-0 overflow-hidden`}
        aria-label="Directorio de clientes"
      >
        {/* Búsqueda y filtros del listado. */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-5">
          <div
            className="flex flex-wrap gap-1"
            role="group"
            aria-label="Filtrar por estado"
          >
            {estados.map(({ valor, nombre }) => (
              <button
                key={valor}
                type="button"
                aria-pressed={estado === valor}
                onClick={() => setEstado(valor)}
                className={`rounded-lg px-3 py-2 text-sm transition-colors ${estado === valor ? 'bg-accent-soft font-medium text-accent' : 'text-muted hover:bg-subtle'}`}
              >
                {nombre}
              </button>
            ))}
          </div>
          <Busqueda
            valor={busqueda}
            cambiar={setBusqueda}
            placeholder="Buscar nombre, empresa, contacto…"
          />
        </div>
        {/* Tabla compartida: columnas y datos definidos en esta vista. */}
        <Table
          columns={columnas}
          data={visibles}
          caption="Clientes con empresa, contacto, estado y última actualización"
          isLoading={isLoading}
          error={error ? 'No se pudieron cargar los clientes.' : undefined}
          onRetry={refetch}
          emptyMessage={
            clientes.length === 0
              ? 'Todavía no hay clientes registrados.'
              : 'No encontramos clientes. Prueba otro nombre o estado.'
          }
        />
      </section>
    </div>
  );
}
