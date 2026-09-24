# Desarrollo

## Requisitos

- Git para obtener el repositorio y trabajar con ramas.
- Para desarrollo local: Node.js 22.12 o superior dentro de la rama 22, y npm. CI y Docker utilizan Node.js 22.
- Para desarrollo en contenedor: Docker con Docker Compose (`docker compose`). No es necesario instalar Node.js en el equipo si los comandos npm se ejecutan dentro del contenedor.

Los comandos Docker se ejecutan desde la raíz del repositorio. Los comandos npm locales se ejecutan desde `frontend/`.

## Desarrollo local

```bash
cd frontend
npm install
npm run dev:json
```

Abrir `http://localhost:3000`. El script ejecuta Vite con `--host 0.0.0.0 --port 3000`, y los cambios en el código se reflejan mediante recarga durante el desarrollo. Detener el servidor con `Ctrl+C`.

`npm install` instala las dependencias y puede actualizar `package-lock.json`. Para reproducir las versiones del lockfile, usar `npm ci`; este comando requiere que `package.json` y `package-lock.json` sean coherentes y reemplaza la instalación existente de `node_modules`.

## Modos y variables de entorno

| Modo | Desarrollo | Compilación | Fuente / router / base |
| --- | --- | --- | --- |
| JSON | `npm run dev:json` | `npm run build:json` | JSON / BrowserRouter / `/` |
| GitHub Pages | `npm run dev:github` | `npm run build:github` | JSON / HashRouter / `/CRM-Evolution/` |
| API (pendiente) | `npm run dev:api` | `npm run build:api` | API / BrowserRouter / `/` |

Los archivos `.env.json`, `.env.github-pages` y `.env.api` contienen `VITE_DATA_SOURCE`, `VITE_ROUTER` y `VITE_BASE_PATH`. `.env.api` también declara `VITE_API_URL`, todavía sin un repositorio API que la consuma. No hay implementación API completa: iniciar o compilar ese modo puede fallar por módulos ausentes.

Los scripts genéricos `dev` y `build` no seleccionan `.env.json`; sin variables adicionales, Vite usa JSON y `/` por defecto, y la aplicación elige BrowserRouter. Para reproducir una configuración concreta, utilizar su script explícito.

Login considera demo cualquier fuente distinta de `api`: muestra el aviso y «Entrar a la demo», que navega a `/dashboard`. Solo con `api` aparecen el formulario y Gmail. No hay autenticación real ni protección de rutas.

Las variables del frontend se aplican al iniciar el servidor o generar el build. Reiniciar después de cambiarlas. No colocar secretos en variables `VITE_*`.

## Desarrollo con Docker

El archivo [compose.yml](../compose.yml) define el servicio `dev` con la imagen `node:22-alpine`, directorio de trabajo `/app`, usuario `1000:1000`, montaje `./frontend:/app` y puerto `3000:3000`.

```bash
docker compose up -d
docker compose exec dev npm install
docker compose exec dev npm run dev
```

Abrir `http://localhost:3000`. El último comando mantiene Vite en la terminal; `Ctrl+C` detiene ese proceso, pero el contenedor sigue disponible.

También se puede ejecutar `docker compose up` sin `-d`, dejando los logs en una terminal y ejecutando los comandos `exec` en otra. El comando inicial del contenedor es `tail -f /dev/null`: levantar Compose por sí solo no instala dependencias ni inicia Vite.

Para abrir una shell o detener el entorno:

```bash
docker compose exec dev sh
docker compose down
```

La política `restart: unless-stopped` se aplica al contenedor; no reinicia automáticamente un servidor Vite lanzado con `exec`.

## Diferencias entre local y contenedor

| Aspecto | Local | Contenedor |
| --- | --- | --- |
| Node.js y npm | Instalados en el equipo. | Proporcionados por `node:22-alpine`. |
| Directorio de ejecución | `frontend/`. | `/app`, mediante `docker compose exec dev`. |
| Código y dependencias | En `frontend/`. | El montaje comparte `frontend/`, incluido `node_modules`. |
| Puerto de desarrollo | `3000` en el equipo. | `3000` del contenedor publicado en `3000` del equipo. |
| Permisos de archivos | Usuario local. | UID/GID `1000:1000`; deben tener permiso de escritura sobre `frontend/`. |

Al alternar entre el equipo y Alpine pueden existir dependencias nativas incompatibles en el `node_modules` compartido. Ejecutar `npm ci` en el entorno que se vaya a utilizar para reinstalarlas. No ejecutar ambos servidores de desarrollo a la vez sobre el mismo puerto.

Si el puerto 3000 está ocupado, liberarlo antes de iniciar Vite. Si Vite elige otro puerto, ese puerto no estará publicado por el Compose actual.

## Comandos habituales

Desde `frontend/`:

```bash
npm run lint
npm run build
npm run preview
```

- `lint`: ejecuta ESLint.
- `build`: ejecuta `tsc -b && vite build`, verifica TypeScript y genera `frontend/dist/`.
- `preview`: sirve el build existente de `dist`; no lo recompila ni cambia su fuente de datos. Aunque el script incluye `--mode json`, un artefacto generado con otro modo conserva los valores incorporados durante su build. No es un servidor de producción.

Para revisar el build localmente en un puerto explícito:

```bash
npm run preview -- --host 0.0.0.0 --port 4173
```

Abrir `http://localhost:4173`. Compose solo publica el puerto 3000; para revisar el build dentro del contenedor, detener antes Vite y reutilizar ese puerto:

```bash
docker compose exec dev npm run build
docker compose exec dev npm run preview -- --host 0.0.0.0 --port 3000
```

No hay script de pruebas automatizadas configurado actualmente.

## Convenciones de código

- TypeScript: comentarios cortos que expliquen el propósito, la fuente de los datos o una decisión relevante.
- JSX: comentarios para distinguir cabecera, resumen, filtros, contenido, estados y acciones.
- Mantener formato uniforme y evitar bloques JSX comprimidos en una sola línea.
- Obtener los datos mediante hooks; no incorporar llamadas a repositorios dentro de `table.tsx`.
- Definir columnas en la vista. Mantener estables columnas, listas vacías y resultados filtrados, siguiendo [arquitectura](arquitectura.md#estabilidad-de-renderizado).
- Usar Tailwind y los tokens de `index.css` para que las nuevas vistas hereden ambos temas. Mantener en ese archivo el CSS adicional, organizado y comentado.
- Añadir vistas bajo `pages/views`, su ruta relativa en `AppRouter.tsx` y el enlace en la lista de rutas de `Home.tsx`.

## Comprobación manual de la demo

1. Abrir `/`: comprobar aviso demo y ausencia de campos de correo/contraseña y Gmail.
2. Entrar al dashboard y comprobar carga de datos y navegación a Clientes, Interacciones y Tareas.
3. Probar búsqueda, filtros, estados vacíos y paginación de ambas tablas; filtrar desde una página posterior debe devolver a la primera.
4. Revisar el historial y sus filtros por tipo.
5. Marcar una tarea en Dashboard: el cambio es local, no se guarda ni se refleja en la tabla de Tareas.
6. Cambiar tema y contraer/expandir el Sidebar; comprobar logo, títulos y enlace activo.
7. Cambiar de vista y comprobar entrada suave. Con movimiento reducido, no debe animarse.
8. Usar Cerrar sesión para volver a `/`.
9. Revisar en pantalla estrecha el scroll horizontal de tablas y la disposición de Login.

No existe un script `npm test` ni una suite de regresión versionada. Las comprobaciones puntuales realizadas durante el desarrollo no sustituyen una suite automatizada del repositorio.

## Ruta base y validación antes del PR

Vite toma la ruta base de `VITE_BASE_PATH` y utiliza `/` si no está definida. Para el desarrollo habitual no hace falta crear un archivo `.env`. El despliegue a GitHub Pages carga `.env.github-pages` mediante `build:github`; consultar [CI/CD](ci-cd.md).

Antes de abrir un PR, reproducir la validación de CI desde `frontend/`:

```bash
npm ci
npm run lint
npm run build
```

En Docker, ejecutar los mismos comandos con el prefijo `docker compose exec dev` desde la raíz del repositorio. Las responsabilidades de cada carpeta se describen en [arquitectura](arquitectura.md).
