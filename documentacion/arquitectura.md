# Arquitectura

CRM-Evolution tiene un frontend construido con React 19, TypeScript y Vite. Actualmente conserva la pantalla inicial de Vite; las carpetas de capas están preparadas, pero aún no contienen la implementación funcional del CRM. No hay backend ni base de datos configurados en este repositorio.

## Estructura del proyecto

```text
CRM-Evolution/
├── .github/workflows/    # Validación de PR y despliegue
├── artefactos/           # Espacio reservado para artefactos del proyecto
├── config/              # Espacio reservado para configuración de infraestructura
├── documentacion/       # Documentación del proyecto
├── compose.yml          # Entorno Docker de desarrollo
└── frontend/
    ├── public/          # Archivos estáticos
    ├── src/
    │   ├── assets/      # Recursos importados desde el código
    │   ├── components/
    │   ├── pages/
    │   ├── models/
    │   ├── repositories/
    │   ├── services/
    │   ├── hooks/
    │   ├── utils/
    │   ├── tests/
    │   ├── main.tsx     # Montaje de React y estilos globales
    │   ├── App.tsx      # Componente raíz
    │   ├── App.css
    │   └── index.css
    ├── package.json
    ├── package-lock.json
    ├── vite.config.ts
    ├── eslint.config.js
    └── tsconfig*.json
```

Las carpetas vacías no se versionan en Git, por lo que pueden no aparecer en un clon nuevo hasta que incorporen archivos.

## Responsabilidades de las capas

Estas responsabilidades definen la convención para las próximas funcionalidades:

| Carpeta | Responsabilidad | Ejemplo previsto |
| --- | --- | --- |
| `components` | Elementos de interfaz reutilizables; reciben datos y comunican eventos. | Formulario o tarjeta de cliente. |
| `pages` | Pantallas que componen componentes y coordinan la interacción del usuario. | Listado de clientes o dashboard. |
| `models` | Tipos e interfaces del dominio, sin dependencias de React. | Cliente, interacción y tarea. |
| `repositories` | Acceso a datos y detalles de persistencia; aíslan la fuente de datos del resto de la aplicación. | Consultar o guardar clientes mediante una futura API. |
| `services` | Casos de uso y reglas de negocio; coordinan repositorios. | Registrar un cliente validando reglas del dominio. |
| `hooks` | Lógica reutilizable de React: estado, efectos y conexión de la interfaz con los servicios. | Cargar clientes y gestionar estados de carga y error. |
| `utils` | Funciones auxiliares independientes de React y de la persistencia. | Formatear fechas. |
| `tests` | Pruebas y recursos de apoyo para comprobar el comportamiento. | Pruebas de servicios y componentes. |

El flujo previsto es `pages/components → hooks → services → repositories`. Los modelos se comparten entre capas y las utilidades se usan donde corresponda. No es necesario crear un hook o servicio para cada interacción puramente visual.

Los componentes no deberían conocer detalles de persistencia; los repositorios no deberían depender de la interfaz. Actualmente no hay un ejecutor de pruebas ni un script `npm test` configurados.

## Alias de importación

Los alias están definidos en [vite.config.ts](../frontend/vite.config.ts), para resolver imports durante desarrollo y build, y en [tsconfig.app.json](../frontend/tsconfig.app.json), para TypeScript y el editor. Ambas configuraciones deben mantenerse sincronizadas.

| Prefijo | Destino relativo a `frontend/` |
| --- | --- |
| `@/` | `src/` |
| `@assets/` | `src/assets/` |
| `@components/` | `src/components/` |
| `@pages/` | `src/pages/` |
| `@models/` | `src/models/` |
| `@repositories/` | `src/repositories/` |
| `@services/` | `src/services/` |
| `@hooks/` | `src/hooks/` |
| `@utils/` | `src/utils/` |
| `@tests/` | `src/tests/` |

Por ejemplo, el código actual utiliza `import App from '@/App.tsx'` e `import heroImg from '@assets/hero.png'`. Los alias no crean las carpetas ni los módulos a los que apuntan.

## Configuración e infraestructura

Se reserva `/config`, en la raíz del repositorio, para configuración de infraestructura que se agregue en el futuro. Esta separación evita mezclar infraestructura con el código de la aplicación en `frontend/src`.

Actualmente `/config` está vacío. `compose.yml` permanece en la raíz, los workflows en `.github/workflows` y las configuraciones de Vite, TypeScript y ESLint en `frontend`, junto al proyecto que utilizan. La separación no implica que estos archivos ya se hayan trasladado a `/config`.

Consulta [desarrollo](desarrollo.md) para ejecutar el proyecto y [CI/CD](ci-cd.md) para el flujo de integración y despliegue.
