import type { NuevoCliente } from '@models/Cliente';
import type { NuevaTarea } from '@models/Tarea';
import type { Cliente, EstadoCliente } from '@models/Cliente';
import type { Interaccion } from '@models/Interaccion';
import type { Tarea } from '@models/Tarea';

type DatosDemo = {
  clientes: Cliente[];
  interacciones: Interaccion[];
  tareas: Tarea[];
};

// Almacén de la sesión: nunca escribe en public/data ni en una API.
let datos: DatosDemo | undefined;
let carga: Promise<DatosDemo> | undefined;

async function leerJson<T>(archivo: string): Promise<T> {
  const response = await fetch(
    `${import.meta.env.BASE_URL}data/${archivo}.json`,
  );
  if (!response.ok)
    throw new Error(`No se pudo cargar ${archivo}: ${response.status}`);
  return response.json();
}

async function cargar(): Promise<DatosDemo> {
  if (datos) return datos;
  if (!carga) {
    carga = Promise.all([
      leerJson<Cliente[]>('clientes'),
      leerJson<Interaccion[]>('interacciones'),
      leerJson<Tarea[]>('tareas'),
    ])
      .then(([clientes, interacciones, tareas]) => {
        datos = { clientes, interacciones, tareas };
        return datos;
      })
      .catch((error) => {
        carga = undefined;
        throw error;
      });
  }
  return carga;
}

const estados: EstadoCliente[] = ['prospecto', 'cliente', 'inactivo'];
const etiquetas = {
  prospecto: 'Prospecto',
  cliente: 'Cliente',
  inactivo: 'Inactivo',
};

function textoObligatorio(valor: string, nombre: string) {
  const texto = valor.trim();
  if (!texto) throw new Error(`Completa el campo ${nombre}.`);
  return texto;
}

export const demoStore = {
  // Las copias evitan que una vista cambie accidentalmente el almacén.
  async clientes() {
    return structuredClone((await cargar()).clientes);
  },
  async tareas() {
    return structuredClone((await cargar()).tareas);
  },
  async interacciones() {
    return structuredClone((await cargar()).interacciones);
  },

  async crearCliente(entrada: NuevoCliente) {
    await cargar();
    const actual = datos!;
    const nombre = textoObligatorio(entrada.nombre, 'nombre');
    const apellido = textoObligatorio(entrada.apellido, 'apellido');
    const telefono = textoObligatorio(entrada.telefono, 'teléfono');
    const email = textoObligatorio(entrada.email, 'correo').toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      throw new Error('Escribe un correo válido.');
    if (!estados.includes(entrada.estado))
      throw new Error('Selecciona un estado válido.');
    if (
      actual.clientes.some((cliente) => cliente.email.toLowerCase() === email)
    )
      throw new Error('Ya existe un cliente con ese correo.');
    const fecha = new Date().toISOString();
    const cliente: Cliente = {
      id: crypto.randomUUID(),
      nombre,
      apellido,
      telefono,
      email,
      empresa: entrada.empresa?.trim() || undefined,
      estado: entrada.estado,
      fechaCreated: fecha,
      fechaUpdated: fecha,
    };
    datos = { ...actual, clientes: [cliente, ...actual.clientes] };
  },

  async crearTarea(entrada: NuevaTarea) {
    await cargar();
    const actual = datos!;
    if (!actual.clientes.some((cliente) => cliente.id === entrada.clienteId))
      throw new Error('Selecciona un cliente existente.');
    const titulo = textoObligatorio(entrada.titulo, 'título');
    if (!['alta', 'media', 'baja'].includes(entrada.prioridad))
      throw new Error('Selecciona una prioridad válida.');
    const fechaLimited = entrada.fechaLimited || undefined;
    if (
      fechaLimited &&
      (!/^\d{4}-\d{2}-\d{2}$/.test(fechaLimited) ||
        Number.isNaN(Date.parse(fechaLimited)) ||
        new Date(fechaLimited).toISOString().slice(0, 10) !== fechaLimited)
    )
      throw new Error('Selecciona una fecha válida.');
    const tarea: Tarea = {
      id: crypto.randomUUID(),
      clienteId: entrada.clienteId,
      titulo,
      descripcion: entrada.descripcion?.trim() || undefined,
      prioridad: entrada.prioridad,
      fechaLimited,
      estado: 'pendiente',
      fechaCreated: new Date().toISOString(),
      fechaCompleted: '',
    };
    datos = { ...actual, tareas: [tarea, ...actual.tareas] };
  },

  async cambiarEstado(clienteId: string, estado: EstadoCliente) {
    await cargar();
    const actual = datos!;
    const cliente = actual.clientes.find((item) => item.id === clienteId);
    if (!cliente) throw new Error('No se encontró el cliente.');
    if (!estados.includes(estado))
      throw new Error('Selecciona un estado válido.');
    if (cliente.estado === estado) return;
    const fecha = new Date().toISOString();
    const nota: Interaccion = {
      id: crypto.randomUUID(),
      clienteId,
      tipo: 'nota',
      fecha,
      titulo: 'Cambio de estado del cliente',
      descripcion: `${cliente.nombre} ${cliente.apellido}: ${etiquetas[cliente.estado]} → ${etiquetas[estado]}.`,
    };
    // Estado y nota se actualizan juntos, sin modificar el registro anterior.
    datos = {
      ...actual,
      clientes: actual.clientes.map((item) =>
        item.id === clienteId ? { ...item, estado, fechaUpdated: fecha } : item,
      ),
      interacciones: [nota, ...actual.interacciones],
    };
  },
};
