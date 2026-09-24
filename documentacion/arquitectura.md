# Arquitectura

El frontend utiliza React 19, TypeScript, Vite 8, React Router 8, Tailwind CSS 4, TanStack React Query 5, TanStack React Table 9.2.4 y Lucide React. Los rangos declarados están en [package.json](../frontend/package.json); el lockfile fija las versiones reproducibles.

## Estructura implementada

```text
frontend/
├── public/data/                 # clientes.json, interacciones.json y tareas.json
├── src/
│   ├── assets/                  # Recursos visuales
│   ├── components/
│   │   ├── Sidebar.tsx          # Navegación, tema y salida
│   │   └── table.tsx            # Tabla genérica de Clientes y Tareas
│   ├── config/
│   │   ├── dependencies/        # Construcción de repositorios y servicios
│   │   └── query/queryClient.ts # Caché compartida
│   ├── hooks/                   # useClientes, useInteracciones y useTareas
│   ├── models/                  # Tipos del dominio
│   ├── pages/
│   │   ├── Login.tsx            # Página independiente de acceso
│   │   ├── Home.tsx             # Layout del CRM
│   │   └── views/
│   │       ├── Dashboard.tsx
│   │       ├── Clientes.tsx
│   │       ├── Historial.tsx
│   │       └── Tareas.tsx
│   ├── repositories/
│   │   ├── interface/          # Contratos de lectura
│   │   └── json/               # Implementaciones disponibles
│   ├── router/AppRouter.tsx
│   ├── services/                # Acceso a repositorios desde los hooks
│   ├── main.tsx                 # StrictMode, QueryClientProvider y router
│   └── index.css                # Variables, temas, base y animaciones
├── .env.json
├── .env.api
├── .env.github-pages
└── vite.config.ts
```

En la raíz del proyecto permanecen `compose.yml`, `.github/workflows` y `documentacion`. Los alias de `utils` y `tests` están previstos, pero no hay implementaciones ni ejecutor de pruebas configurado allí.

## Páginas, vistas y rutas

[AppRouter.tsx](../frontend/src/router/AppRouter.tsx) define:

| Ruta lógica | Componente | Contenido |
| --- | --- | --- |
| `/` | `Login` | Acceso demo o formulario según fuente de datos. |
| `/dashboard` | `Home` + `Dashboard` | Resumen general; vista index. |
| `/dashboard/clientes` | `Home` + `Clientes` | Tabla de clientes. |
| `/dashboard/interacciones` | `Home` + `Historial` | Línea de tiempo de interacciones. |
| `/dashboard/tareas` | `Home` + `Tareas` | Tabla de tareas. |

Login y Home son páginas en `pages`; las cuatro vistas están en `pages/views`. Home renderiza las vistas mediante `Outlet`. Las rutas hijas usan paths relativos, como `clientes`.

Home define los enlaces del Sidebar y el estado del modo nocturno. `NavLink` determina el enlace activo; Inicio usa `end` para no quedar activo en todas las rutas del dashboard. El logo `Layers3` permanece visible al contraer el menú; el título admite varias líneas. Al pie aparecen el modo nocturno y Cerrar sesión.

El contenido de `Outlet` tiene una envoltura con `key={pathname}` y clase `view-transition`. Cada cambio de ruta inicia la animación y remonta la vista, sin desmontar el Sidebar. Cambiar filtros o tema no reinicia esa animación. El estado local de una vista no se conserva al abandonarla.

## Flujo de datos

```text
Vista → hook de React Query → servicio → repositorio → public/data/*.json
```

- Las vistas obtienen datos y estados de consulta mediante los hooks existentes.
- Los hooks usan claves `clientes`, `interacciones` y `tareas` en una caché compartida por `QueryClientProvider`.
- Los servicios reciben un repositorio por constructor y delegan `getAll`.
- `config/dependencies` crea las instancias reutilizadas por los hooks.
- Los contratos de `repositories/interface` permiten cambiar la fuente sin alterar las vistas.
- Los repositorios JSON hacen `fetch` con `import.meta.env.BASE_URL` y propagan errores HTTP. Esto permite cargar los datos bajo el subdirectorio de Pages.

`@data-source` se resuelve en Vite según `VITE_DATA_SOURCE`: `api` selecciona `repositories/api`; cualquier otro valor selecciona `repositories/json`. Actualmente solo está implementada la fuente JSON. La configuración de TypeScript declara ambas rutas de resolución, pero eso no crea la implementación API.

### Modelos

| Modelo | Campos y valores principales |
| --- | --- |
| Cliente | `id`, nombre, apellido, email, teléfono, empresa opcional, estado y fechas `fechaCreated`/`fechaUpdated`. Estados: `prospecto`, `cliente`, `inactivo`. |
| Interacción | `id`, `clienteId`, título, descripción opcional, fecha y tipo: `llamada`, `correo`, `reunion`, `nota`. |
| Tarea | `id`, `clienteId`, título, descripción opcional, estado, prioridad y fechas `fechaLimited` opcional, `fechaCreated`, `fechaCompleted`. Estados: `pendiente`, `completada`; prioridades: `baja`, `media`, `alta`. |

Los nombres exactos y tipos están en [models](../frontend/src/models). No se deben renombrar campos solo en una vista, pues también son parte del contrato con la fuente de datos.

## Tabla compartida

[components/table.tsx](../frontend/src/components/table.tsx) usa la API v9: `useTable`, `tableFeatures`, `rowPaginationFeature`, `createPaginatedRowModel` y `table.FlexRender`.

| Prop | Responsabilidad |
| --- | --- |
| `columns` | Definiciones `TableColumn<T>[]` creadas por la vista. |
| `data` | Registros con `id: string`, ya filtrados y ordenados por la vista. |
| `caption` | Descripción accesible de la tabla. |
| `isLoading`, `error`, `onRetry` | Carga, mensaje de error y reintento opcional. |
| `emptyMessage` | Texto cuando no hay resultados. |
| `minWidthClassName` | Ancho mínimo mediante una clase Tailwind. |

La tabla resuelve presentación, estados vacíos, scroll horizontal y paginación local de 10, 25 o 50 filas. No consulta servicios ni conoce clientes o tareas. La búsqueda, los filtros y el orden por fechas pertenecen a las vistas; no hay ordenamiento interactivo en los encabezados. Historial conserva su línea de tiempo y no usa este componente.

### Estabilidad de renderizado

- Configuración de features, estado inicial e identificación de filas se definen fuera del componente.
- Las listas vacías de respaldo son constantes; evitar `data ?? []` como entrada recreada en cada render.
- Clientes define columnas constantes fuera de su componente.
- Tareas memoiza columnas con `useMemo` y su función de nombre de cliente con `useCallback`.
- Ambas vistas memoizan los resultados filtrados antes de entregarlos a la tabla.
- La paginación pertenece a la tabla y no se sincroniza mediante efectos con la vista.
- `memo(Table)` evita renders de padres cuando las props permanecen iguales. No impide actualizaciones legítimas del estado o los datos.

Mantener estas referencias estables al añadir columnas o filtros evita reconstrucciones y reinicios innecesarios. Nunca modificar directamente los arrays recibidos de los hooks.

## Diseño y CSS

[index.css](../frontend/src/index.css) concentra los estilos globales y las variables que generan utilidades Tailwind:

| Tema | Fondo | Texto | Acento |
| --- | --- | --- | --- |
| Claro: vainilla y jade | `#FAF7E9` | `#35423D` | `#258474` |
| Nocturno: grafito y coral | `#232627` | `#ECECE7` | `#EC9C87` |

Las vistas usan tokens como `bg-panel`, `text-foreground`, `text-muted`, `border-border` y `bg-accent-soft`. `.dark-main` reasigna sus valores por herencia y `.dark-sidebar` aplica el fondo de navegación. Los colores no se duplican en cada vista.

Login combina el hero oscuro a la izquierda y el panel claro a la derecha; en pantallas pequeñas se apilan. Usa Urbanist para títulos y Epilogue para texto. La entrada de vistas dura 200 ms con fundido y desplazamiento de 6 px; `prefers-reduced-motion` desactiva la animación.

## Alias

Los alias deben mantenerse coherentes entre [vite.config.ts](../frontend/vite.config.ts) y [tsconfig.app.json](../frontend/tsconfig.app.json):

| Prefijos | Destino |
| --- | --- |
| `@assets`, `@components`, `@config`, `@hooks`, `@models` | Carpetas homónimas dentro de `src`. |
| `@pages`, `@repositories`, `@services`, `@router` | Carpetas homónimas dentro de `src`. |
| `@utils`, `@tests` | Carpetas previstas dentro de `src`. |
| `@data-source` | Repositorios JSON o API, según entorno. |

No existe un alias general `@/` en la configuración actual.
