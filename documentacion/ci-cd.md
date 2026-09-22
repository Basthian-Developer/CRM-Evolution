# CI/CD

El repositorio incluye un workflow que valida los pull requests hacia `main` y otro que publica el frontend en GitHub Pages cuando se actualiza `main`.

## Flujo de ramas y pull requests

El flujo de trabajo previsto es:

1. Crear una rama de trabajo a partir de `main` actualizada, por ejemplo `feat/clientes` o `fix/formulario-cliente`.
2. Implementar el cambio y ejecutar la validación local desde `frontend/`.
3. Subir la rama y abrir un PR con destino a `main`.
4. Revisar los cambios y esperar que el check `React check` termine correctamente.
5. Integrar el PR. El push resultante a `main` activa el despliegue.

La validación local reproduce esta secuencia:

```bash
cd frontend
npm ci
npm run lint
npm run build
```

## Validación de PR

El workflow [frontend-ci.yml](../.github/workflows/frontend-ci.yml), llamado `React CI`, se activa con eventos `pull_request` cuyo destino es `main`.

Su job `react-check`, visible como `React check`, se ejecuta en `ubuntu-latest` y realiza:

1. Checkout del repositorio.
2. Configuración de Node.js 22 y caché de npm basada en `frontend/package-lock.json`.
3. `npm ci` para instalar las dependencias del lockfile.
4. `npm run lint` para ejecutar ESLint.
5. `npm run build` para comprobar TypeScript y generar el build de Vite.

Los comandos npm usan `frontend/` como directorio de trabajo. Si un paso falla, la validación no se completa correctamente. Actualmente no se ejecutan pruebas automatizadas y el workflow no se activa por un push aislado a una rama sin PR.

## Protección de `main`

La política prevista exige que la validación pase antes del merge. Para hacerla obligatoria, la configuración del repositorio en GitHub debe incluir una regla de protección o ruleset aplicable a `main` que:

- Exija un pull request antes de integrar cambios.
- Exija el check `React check` como condición para el merge.
- Limite las excepciones que permitan omitir esas condiciones.

El YAML ejecuta el check, pero no configura la protección de la rama. El estado de estas reglas no puede confirmarse a partir de los archivos locales; debe verificarse en la configuración del repositorio en GitHub. Sin esa protección, un push directo a `main` puede activar el despliegue sin pasar por la validación del PR.

## Despliegue en GitHub Pages

El workflow [deploy-github-pages.yml](../.github/workflows/deploy-github-pages.yml), llamado `Desplegar en Github Pages`, se activa con un push a `main` o manualmente mediante `workflow_dispatch`.

El job `build` prepara Node.js 22, ejecuta `npm ci`, configura Pages y genera el build con:

```yaml
run: npm run build
env:
  VITE_BASE_PATH: /${{github.event.repository.name}}/
```

Después sube `frontend/dist` como artefacto de Pages. El job `deploy` depende de `build` y publica ese artefacto mediante `actions/deploy-pages@v4` en el entorno `github-pages`. La URL publicada se obtiene de la salida del paso de despliegue.

El workflow declara permisos `contents: read`, `pages: write` e `id-token: write`. Agrupa las ejecuciones en `github-pages` y cancela las que estén en curso cuando aparece una nueva ejecución del mismo grupo.

GitHub Pages debe estar configurado en el repositorio para publicar mediante GitHub Actions. Esa configuración externa tampoco se acredita con los archivos locales.

El workflow de despliegue ejecuta instalación y build; no repite ESLint ni depende directamente del workflow del PR. La protección de `main` es la que debe garantizar la validación previa al merge.

## `VITE_BASE_PATH`

En [vite.config.ts](../frontend/vite.config.ts), Vite carga las variables del modo activo y configura `base` con `env.VITE_BASE_PATH || '/'`.

| Entorno | Ruta base |
| --- | --- |
| Desarrollo sin variable | `/` |
| Workflow de Pages | `/<nombre-del-repositorio>/` |
| Build para este repositorio | `/CRM-Evolution/` |

La ruta base permite que los recursos procesados por Vite se referencien bajo el subdirectorio del sitio. Se aplica al generar el build: cambiarla requiere volver a construir y desplegar. Si el sitio se publica en la raíz de un dominio, habrá que ajustar el valor del workflow a `/`.

Para reproducir el build de Pages desde `frontend/` en Bash:

```bash
VITE_BASE_PATH=/CRM-Evolution/ npm run build
npm run preview -- --port 4173
```

Abrir `http://localhost:4173/CRM-Evolution/`.

Las rutas absolutas escritas directamente en JSX, como `/icons.svg`, siguen apuntando a la raíz del dominio. Para recursos de `public/`, usar la base de Vite, por ejemplo `${import.meta.env.BASE_URL}icons.svg`, cuando deban funcionar bajo el subdirectorio. La plantilla actual aún contiene referencias `/icons.svg`; configurar `base` no modifica automáticamente esas cadenas.

## Diagnóstico

- Si falla `npm ci`, revisar que `package.json` y `package-lock.json` se hayan actualizado juntos.
- Si falla `React check`, corregir los errores de lint o build y subir los cambios al PR.
- Si falla la publicación, revisar los logs, la configuración de Pages y las restricciones del entorno `github-pages`.
- Si el sitio carga sin algún recurso, revisar la ruta base y las rutas absolutas del frontend.

Consulta [desarrollo](desarrollo.md) para ejecutar estas comprobaciones en local o en Docker.
