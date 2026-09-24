import {
  ArrowUpRight,
  Check,
  CheckCheck,
  Clock3,
  MessageSquare,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Cliente } from '@models/Cliente';
import type { Interaccion } from '@models/Interaccion';
import type { Tarea, EstadoTask } from '@models/Tarea';

import useClientes from '@hooks/useClientes';
import useTareas from '@hooks/useTareas';
import useInteracciones from '@hooks/useInteracciones';

// Los datos de esta vista se obtienen mediante los hooks del CRM.

// Muestra la fecha sin desplazar el día por la zona horaria.
const fechaCorta = (fecha: string) =>
  new Intl.DateTimeFormat('es-CL', { day: 'numeric', month: 'short' }).format(
    new Date(`${fecha.slice(0, 10)}T12:00:00`),
  );

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

export default function Dashboard() {
  const {
    data: dataClientes,
    error: errorClientes,
    isLoading: loadingClientes,
  } = useClientes();
  const clientes: Cliente[] = dataClientes ?? [];

  const {
    data: dataTareas,
    error: errorTareas,
    isLoading: loadingTareas,
  } = useTareas();
  const tareas: Tarea[] = dataTareas ?? [];

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

  // Guarda solo los cambios locales; la lista original siempre proviene del hook.
  const [estadosLocales, setEstadosLocales] = useState<
    Record<string, EstadoTask>
  >({});
  const listaTareas = tareas.map((tarea) => ({
    ...tarea,
    estado: estadosLocales[tarea.id] ?? tarea.estado,
  }));

  function alternarTarea(tarea: Tarea) {
    setEstadosLocales((actuales) => {
      const estadoActual = actuales[tarea.id] ?? tarea.estado;
      return {
        ...actuales,
        [tarea.id]: estadoActual === 'completada' ? 'pendiente' : 'completada',
      };
    });
  }
  const completadas = listaTareas.filter(
    (tarea) => tarea.estado === 'completada',
  ).length;
  const metricas = [
    {
      titulo: 'Clientes registrados',
      valor: clientes.length,
      detalle: `${clientes.filter((cliente) => cliente.estado === 'cliente').length} con relación activa`,
      icono: Users,
    },
    {
      titulo: 'Conversaciones',
      valor: interacciones.length,
      detalle: 'Interacciones registradas',
      icono: MessageSquare,
    },
    {
      titulo: 'Tareas pendientes',
      valor: listaTareas.length - completadas,
      detalle: 'Próximos pasos por resolver',
      icono: Clock3,
    },
    {
      titulo: 'Tareas completadas',
      valor: completadas,
      detalle: 'Cada paso cuenta',
      icono: CheckCheck,
    },
  ];

  useEffect(() => {
    if (!loadingClientes && errorClientes) {
      console.error(errorClientes);
    }
  }, [loadingClientes, errorClientes]);

  useEffect(() => {
    if (!loadingTareas && errorTareas) {
      console.error(errorTareas);
    }
  }, [loadingTareas, errorTareas]);

  useEffect(() => {
    if (!loadingInteractions && errorInteractions) {
      console.error(errorInteractions);
    }
  }, [loadingInteractions, errorInteractions]);

  return (
    <div className="mx-auto w-full max-w-7xl p-4 text-foreground sm:p-8 lg:p-10">
      {/* Título y contexto de la vista. */}
      <Cabecera
        seccion="Tu espacio de trabajo"
        titulo="Todo comienza con una conversación."
        descripcion="Una mirada a tus clientes, los últimos contactos y lo que viene después."
      />
      {/* Indicadores generales del CRM. */}
      <section
        aria-label="Resumen del CRM"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {metricas.map(({ titulo, valor, detalle, icono: Icono }) => (
          <article key={titulo} className={`${panel} p-5`}>
            <div className="mb-5 flex items-center justify-between gap-2">
              <p className="text-sm text-muted">{titulo}</p>
              <Icono size={19} className="text-accent" aria-hidden="true" />
            </div>
            <p className="text-4xl font-semibold tracking-tight">
              {valor.toString().padStart(2, '0')}
            </p>
            <p className="mt-2 text-xs text-muted">{detalle}</p>
          </article>
        ))}
      </section>
      <div className="mt-6 grid gap-6 xl:grid-cols-5">
        {/* Conversaciones recientes. */}
        <section className={`${panel} p-5 sm:p-6 xl:col-span-3`}>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold">Conversaciones recientes</h2>
            <MessageSquare
              size={18}
              className="text-muted"
              aria-hidden="true"
            />
          </div>
          <div className="divide-y divide-border">
            {interacciones.slice(0, 4).map((item) => (
              <article key={item.id} className="flex gap-3 py-4 first:pt-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <ArrowUpRight size={18} aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted">
                    {nombreCliente(item.clienteId)} ·{' '}
                    {item.tipo === 'reunion' ? 'reunión' : item.tipo}
                  </p>
                  <h3 className="mt-1 text-sm font-semibold">{item.titulo}</h3>
                </div>
                <time
                  dateTime={item.fecha}
                  className="shrink-0 text-xs text-muted"
                >
                  {fechaCorta(item.fecha)}
                </time>
              </article>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-subtle p-4">
            <p className="text-sm font-medium">
              El contexto hace la diferencia.
            </p>
            <p className="mt-1 text-xs leading-5 text-muted">
              Mantén cerca los acuerdos y detalles de cada conversación.
            </p>
          </div>
        </section>
        {/* Tareas y avances locales de la demostración. */}
        <section className={`${panel} p-5 sm:p-6 xl:col-span-2`}>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold">Próximos pasos</h2>
            <Etiqueta>
              {completadas}/{listaTareas.length}
            </Etiqueta>
          </div>
          <p className="mt-2 text-xs leading-5 text-muted">
            Marca tus avances en esta demostración.
          </p>
          <div className="mt-5 space-y-4">
            {listaTareas.map((tarea) => (
              <div key={tarea.id} className="flex gap-3">
                <button
                  type="button"
                  aria-label={`${tarea.estado === 'completada' ? 'Marcar pendiente' : 'Completar'}: ${tarea.titulo}`}
                  aria-pressed={tarea.estado === 'completada'}
                  onClick={() => alternarTarea(tarea)}
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border ${tarea.estado === 'completada' ? 'border-accent bg-accent text-on-accent' : 'border-border hover:border-accent'}`}
                >
                  {tarea.estado === 'completada' && (
                    <Check size={15} aria-hidden="true" />
                  )}
                </button>
                <div>
                  <p
                    className={`text-sm leading-5 ${tarea.estado === 'completada' ? 'text-muted line-through' : ''}`}
                  >
                    {tarea.titulo}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {nombreCliente(tarea.clienteId)}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Etiqueta
                      tono={tarea.prioridad === 'alta' ? 'warning' : 'neutral'}
                    >
                      Prioridad {tarea.prioridad}
                    </Etiqueta>
                    {tarea.fechaLimited && (
                      <span className="text-xs text-muted">
                        {fechaCorta(tarea.fechaLimited)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      {/* Distribución de la cartera por estado. */}
      <section className={`${panel} mt-6 p-5 sm:p-6`}>
        <h2 className="text-xl font-bold">Tu cartera, en perspectiva</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          {(['cliente', 'prospecto', 'inactivo'] as const).map((estado) => {
            const cantidad = clientes.filter(
              (cliente) => cliente.estado === estado,
            ).length;
            return (
              <div key={estado}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-muted">
                    {
                      {
                        cliente: 'Clientes activos',
                        prospecto: 'Prospectos',
                        inactivo: 'Inactivos',
                      }[estado]
                    }
                  </span>
                  <span>{cantidad}</span>
                </div>
                <meter
                  min={0}
                  max={clientes.length}
                  value={cantidad}
                  className="sr-only"
                  aria-label={estado}
                />
                <div className="flex gap-1" aria-hidden="true">
                  {clientes.map((cliente, indice) => (
                    <span
                      key={cliente.id}
                      className={`h-2 flex-1 rounded-full ${indice < cantidad ? 'bg-accent' : 'bg-subtle'}`}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
