# CRM-Evolution

CRM básico para organizar clientes, conversaciones y tareas. Actualmente cuenta con una **demo funcional del frontend**, alimentada por archivos JSON y accesible sin credenciales.

## Funcionalidades

- **Dashboard:** indicadores, conversaciones recientes, próximos pasos y distribución de clientes.
- **Clientes:** tabla con búsqueda, filtros por estado y paginación.
- **Interacciones:** historial agrupado por día, con búsqueda y filtros por tipo de contacto.
- **Tareas:** tabla con filtros por cliente, estado y prioridad, orden por fechas y paginación.
- **Navegación:** Sidebar contraíble, sección activa resaltada y transiciones entre vistas.
- **Diseño:** interfaz adaptable, modo claro vainilla y jade, y modo nocturno grafito y coral.

## Ejecutar la demo

Requiere Node.js 22.12 o superior dentro de la rama 22 y npm. Desde la raíz del repositorio:

```bash
cd frontend
npm ci
npm run dev:json
```

Abrir [localhost:3000](http://localhost:3000) y seleccionar **Entrar a la demo**. No se necesita correo ni contraseña.

Los datos se cargan desde `frontend/public/data/`. Para trabajar con Docker, consultar la [guía de desarrollo](documentacion/desarrollo.md#desarrollo-con-docker).

## Tecnologías

React 19 · TypeScript · Vite 8 · React Router 8 · Tailwind CSS 4 · TanStack React Query 5 · TanStack React Table 9.2.4 · Lucide React.

Las versiones y comandos están definidos en [frontend/package.json](frontend/package.json).

## Organización

```text
frontend/
├── public/data/          # Datos JSON de la demo
└── src/
    ├── components/      # Sidebar y tabla reutilizable
    ├── pages/           # Login y Home
    │   └── views/       # Dashboard, Clientes, Historial y Tareas
    ├── hooks/           # Consultas con React Query
    ├── services/        # Acceso a los repositorios
    ├── repositories/    # Contratos e implementaciones JSON
    ├── models/          # Tipos de clientes, interacciones y tareas
    ├── config/          # Dependencias y caché compartida
    ├── router/          # Rutas de la aplicación
    └── index.css        # Variables, temas y estilos globales
```

El flujo de lectura es **vista → hook → servicio → repositorio**. Clientes y Tareas comparten `components/table.tsx`; cada vista define sus columnas y proporciona datos estables para evitar reinicios innecesarios de la tabla.

| Ruta | Contenido |
| --- | --- |
| `/` | Acceso a la demo |
| `/dashboard` | Resumen general |
| `/dashboard/clientes` | Clientes |
| `/dashboard/interacciones` | Historial |
| `/dashboard/tareas` | Tareas |

## Comandos

Ejecutar desde `frontend/`:

| Comando | Uso |
| --- | --- |
| `npm run dev:json` | Desarrollo con datos JSON. |
| `npm run lint` | Revisar el código con ESLint. |
| `npm run build:json` | Comprobar TypeScript y generar la demo en `dist/`. |
| `npm run preview` | Servir el build existente, después de compilar. |
| `npm run dev:github` | Desarrollo con la configuración de GitHub Pages. |
| `npm run build:github` | Compilar para GitHub Pages con rutas hash. |

La configuración de Pages usa la base `/CRM-Evolution/`. Los scripts `dev:api` y `build:api` están declarados, pero los repositorios API todavía no están implementados.

## Alcance actual

La demo permite consultar datos; todavía no hay backend, base de datos ni operaciones persistentes de creación, edición o eliminación.

Marcar tareas en Dashboard cambia solo el estado local de esa vista. No modifica los archivos JSON ni la tabla de Tareas y se pierde al salir de la vista o recargar.

El formulario del modo API es una interfaz pendiente de autenticación; Gmail no está conectado. No hay rutas protegidas y «Cerrar sesión» únicamente redirige al Login.

## Validación y despliegue

Los pull requests hacia `main` ejecutan instalación, ESLint y build. Los cambios en `main` activan el workflow de despliegue de la demo en GitHub Pages mediante `build:github`.

No hay un script `npm test` ni una suite automatizada versionada. La configuración y las comprobaciones manuales se detallan en las guías de desarrollo y CI/CD.

## Documentación

- [Contexto actual](documentacion/contexto.md): funcionalidades y límites de la demo.
- [Arquitectura](documentacion/arquitectura.md): capas, rutas, datos, tabla compartida y temas.
- [Desarrollo](documentacion/desarrollo.md): instalación, Docker, entornos y convenciones.
- [CI/CD](documentacion/ci-cd.md): validación de PR y publicación en Pages.
- [Idea y alcance](documentacion/idea.md): objetivo del producto y funcionalidades pendientes.
