import type { Cliente } from '@models/Cliente';
import Table, { type TableColumn } from '@components/table';
import { useCallback, useMemo, useState } from 'react';
import { CheckCheck, ClipboardList, Clock3, Search } from 'lucide-react';
import useTareas from '@hooks/useTareas';
import useClientes from '@hooks/useClientes';
import type { Tarea, EstadoTask, PrioridadTask } from '@models/Tarea';

const panel = 'rounded-2xl border border-border bg-panel';
const campo =
  'rounded-xl border border-border bg-panel px-3 py-2.5 text-sm text-foreground';
// Permite buscar sin distinguir mayúsculas ni tildes.
const normalizar = (texto: string) =>
  texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
const estados: { valor: EstadoTask | 'todos'; nombre: string }[] = [
  { valor: 'todos', nombre: 'Todas' },
  { valor: 'pendiente', nombre: 'Pendientes' },
  { valor: 'completada', nombre: 'Completadas' },
];

// Devuelve null si no hay una fecha válida para mostrar u ordenar.
function fechaValida(valor?: string) {
  if (!valor) return null;
  const fecha = new Date(`${valor.slice(0, 10)}T12:00:00`);
  return Number.isNaN(fecha.getTime()) ? null : fecha;
}

function Fecha({ valor, vacio }: { valor?: string; vacio: string }) {
  const fecha = fechaValida(valor);
  return fecha ? (
    <time dateTime={valor}>
      {new Intl.DateTimeFormat('es-CL', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(fecha)}
    </time>
  ) : (
    <span>{vacio}</span>
  );
}

// Referencias estables mientras llegan las respuestas de los hooks.
const TAREAS_VACIAS: Tarea[] = [];
const CLIENTES_VACIOS: Cliente[] = [];

export default function Tareas() {
  // Datos remotos y controles locales de búsqueda.
  const consultaTareas = useTareas();
  const consultaClientes = useClientes();
  const tareas = consultaTareas.data ?? TAREAS_VACIAS;
  const clientes = consultaClientes.data ?? CLIENTES_VACIOS;
  const [busqueda, setBusqueda] = useState('');
  const [estado, setEstado] = useState<EstadoTask | 'todos'>('todos');
  const [prioridad, setPrioridad] = useState<PrioridadTask | 'todas'>('todas');
  const [clienteId, setClienteId] = useState('todos');
  const [orden, setOrden] = useState('proximas');

  // Relaciona cada registro con el nombre de su cliente.
  const nombreCliente = useCallback(
    (id: string) => {
      const cliente = clientes.find((item) => item.id === id);
      if (cliente) return `${cliente.nombre} ${cliente.apellido}`;
      if (consultaClientes.isLoading) return 'Cargando cliente…';
      return id ? `Cliente ${id}` : 'Sin cliente';
    },
    [clientes, consultaClientes.isLoading],
  );
  // Solo reconstruye las columnas cuando cambia la información del cliente.
  const columnas = useMemo<TableColumn<Tarea>[]>(
    () => [
      {
        accessorKey: 'titulo',
        header: 'Tarea',
        cell: ({ row }) => {
          const tarea = row.original;
          return (
            <>
              <p className="wrap-break-word">{tarea.titulo}</p>
              {tarea.descripcion && (
                <p className="mt-1 text-xs leading-5 font-normal wrap-break-word text-muted">
                  {tarea.descripcion}
                </p>
              )}
            </>
          );
        },
      },
      {
        accessorKey: 'clienteId',
        header: 'Cliente',
        cell: ({ row }) => {
          const tarea = row.original;
          return <>{nombreCliente(tarea.clienteId)}</>;
        },
      },
      {
        accessorKey: 'prioridad',
        header: 'Prioridad',
        cell: ({ row }) => {
          const tarea = row.original;
          return (
            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${tarea.prioridad === 'alta' ? 'bg-warning-soft text-warning' : 'bg-subtle text-muted'}`}
            >
              {{ alta: 'Alta', media: 'Media', baja: 'Baja' }[tarea.prioridad]}
            </span>
          );
        },
      },
      {
        accessorKey: 'estado',
        header: 'Estado',
        cell: ({ row }) => {
          const tarea = row.original;
          return (
            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${tarea.estado === 'completada' ? 'bg-accent-soft text-accent' : 'bg-subtle text-muted'}`}
            >
              {tarea.estado === 'completada' ? 'Completada' : 'Pendiente'}
            </span>
          );
        },
      },
      {
        accessorKey: 'fechaLimited',
        header: 'Fecha límite',
        cell: ({ row }) => {
          const tarea = row.original;
          return <Fecha valor={tarea.fechaLimited} vacio="Sin fecha límite" />;
        },
      },
      {
        accessorKey: 'fechaCompleted',
        header: 'Completada',
        cell: ({ row }) => {
          const tarea = row.original;
          return (
            <Fecha
              valor={
                tarea.estado === 'completada' ? tarea.fechaCompleted : undefined
              }
              vacio="—"
            />
          );
        },
      },
    ],
    [nombreCliente],
  );
  // Conserva la referencia de los resultados para evitar reinicios de la tabla.
  const visibles = useMemo(
    () =>
      tareas
        .filter(
          (tarea) =>
            (estado === 'todos' || tarea.estado === estado) &&
            (prioridad === 'todas' || tarea.prioridad === prioridad) &&
            (clienteId === 'todos' || tarea.clienteId === clienteId) &&
            normalizar(
              `${tarea.titulo} ${tarea.descripcion ?? ''} ${nombreCliente(tarea.clienteId)}`,
            ).includes(normalizar(busqueda.trim())),
        )
        .sort((a, b) => {
          if (orden === 'recientes')
            return (
              (fechaValida(b.fechaCreated)?.getTime() ?? 0) -
              (fechaValida(a.fechaCreated)?.getTime() ?? 0)
            );
          const fechaA = fechaValida(a.fechaLimited)?.getTime() ?? Infinity;
          const fechaB = fechaValida(b.fechaLimited)?.getTime() ?? Infinity;
          return fechaA === fechaB
            ? a.titulo.localeCompare(b.titulo, 'es')
            : fechaA - fechaB;
        }),
    [tareas, estado, prioridad, clienteId, busqueda, orden, nombreCliente],
  );
  function limpiarFiltros() {
    setBusqueda('');
    setEstado('todos');
    setPrioridad('todas');
    setClienteId('todos');
    setOrden('proximas');
  }

  const resumen = [
    {
      titulo: 'Total de tareas',
      cantidad: tareas.length,
      Icono: ClipboardList,
    },
    {
      titulo: 'Pendientes',
      cantidad: tareas.filter((tarea) => tarea.estado === 'pendiente').length,
      Icono: Clock3,
    },
    {
      titulo: 'Completadas',
      cantidad: tareas.filter((tarea) => tarea.estado === 'completada').length,
      Icono: CheckCheck,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl p-4 text-foreground sm:p-8 lg:p-10">
      {/* Título y contexto de la vista. */}
      <header className="mb-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Cada paso cuenta
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Tareas
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          Consulta tus pendientes, revisa prioridades y encuentra el próximo
          paso de cada cliente.
        </p>
      </header>

      {/* Resumen de los registros, antes de aplicar filtros. */}
      <section
        className="mb-6 grid gap-4 sm:grid-cols-3"
        aria-label="Resumen de tareas"
      >
        {resumen.map(({ titulo, cantidad, Icono }) => (
          <article
            key={titulo}
            className={`${panel} flex items-center justify-between p-5`}
          >
            <div>
              <p className="text-sm text-muted">{titulo}</p>
              <p className="mt-2 text-3xl font-semibold">
                {consultaTareas.isLoading || consultaTareas.isError
                  ? '—'
                  : cantidad}
              </p>
            </div>
            <Icono size={22} className="text-accent" aria-hidden="true" />
          </article>
        ))}
      </section>

      {consultaClientes.isError && (
        <div
          role="alert"
          className="mb-4 rounded-xl bg-warning-soft p-4 text-sm text-warning"
        >
          No se pudieron cargar los nombres de clientes. Las tareas muestran sus
          identificadores.{' '}
          <button
            type="button"
            onClick={() => void consultaClientes.refetch()}
            className="font-semibold underline"
          >
            Reintentar clientes
          </button>
        </div>
      )}

      <section
        className={`${panel} min-w-0 overflow-hidden`}
        aria-label="Listado de tareas"
        aria-busy={consultaTareas.isLoading}
      >
        {/* Búsqueda, filtros y orden de las tareas. */}
        <div className="space-y-4 border-b border-border p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
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
            <label
              className={`${campo} flex min-w-0 items-center gap-2 focus-within:ring-2 focus-within:ring-accent`}
            >
              <Search
                size={17}
                className="shrink-0 text-muted"
                aria-hidden="true"
              />
              <span className="sr-only">Buscar tarea o cliente</span>
              <input
                type="search"
                value={busqueda}
                onChange={(event) => setBusqueda(event.target.value)}
                placeholder="Buscar tarea o cliente…"
                className="min-w-0 w-full bg-transparent outline-none placeholder:text-muted"
              />
            </label>
          </div>
          <div className="flex flex-wrap gap-3">
            <label className="flex flex-col gap-1 text-xs text-muted">
              Prioridad
              <select
                className={campo}
                value={prioridad}
                onChange={(event) =>
                  setPrioridad(event.target.value as PrioridadTask | 'todas')
                }
              >
                <option value="todas">Todas las prioridades</option>
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
            </label>
            <label className="flex min-w-0 flex-col gap-1 text-xs text-muted">
              Cliente
              <select
                className={`${campo} max-w-full sm:max-w-64`}
                value={clienteId}
                onChange={(event) => setClienteId(event.target.value)}
                disabled={
                  consultaClientes.isLoading || consultaClientes.isError
                }
              >
                <option value="todos">Todos los clientes</option>
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nombre} {cliente.apellido}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs text-muted">
              Orden
              <select
                className={campo}
                value={orden}
                onChange={(event) => setOrden(event.target.value)}
              >
                <option value="proximas">Fecha límite más próxima</option>
                <option value="recientes">Creación más reciente</option>
              </select>
            </label>
            <button
              type="button"
              onClick={limpiarFiltros}
              className="self-end rounded-lg px-3 py-2.5 text-sm text-accent hover:bg-accent-soft"
            >
              Limpiar filtros
            </button>
          </div>
        </div>

        {/* Tabla compartida: columnas y datos definidos en esta vista. */}
        <Table
          columns={columnas}
          data={visibles}
          caption="Tareas con cliente, prioridad, estado y fechas"
          minWidthClassName="min-w-220"
          isLoading={consultaTareas.isLoading}
          error={
            consultaTareas.isError
              ? 'No se pudieron cargar las tareas.'
              : undefined
          }
          onRetry={consultaTareas.refetch}
          emptyMessage={
            tareas.length === 0
              ? 'Todavía no hay tareas registradas.'
              : 'No encontramos tareas con estos filtros.'
          }
        />
      </section>
    </div>
  );
}
