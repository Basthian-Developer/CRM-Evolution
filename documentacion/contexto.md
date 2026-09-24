# Contexto actual

CRM-Evolution es un CRM básico con un frontend funcional de demostración. Permite consultar clientes, interacciones y tareas desde archivos JSON. No hay backend, base de datos ni autenticación real implementados en este repositorio.

## Estado del frontend

| Área | Implementado |
| --- | --- |
| Acceso | Página Login con hero y panel de acceso. En JSON muestra un aviso de demo y permite entrar sin credenciales. |
| Navegación | Home contiene el Sidebar y las vistas anidadas. El enlace activo queda resaltado. |
| Dashboard | Indicadores, conversaciones recientes, tareas y distribución de clientes por estado. |
| Clientes | Tabla con búsqueda, filtros por estado y paginación. |
| Interacciones | Historial agrupado por día, búsqueda y filtros por tipo. |
| Tareas | Tabla con búsqueda, filtros por estado, prioridad y cliente; orden por fechas y paginación. |
| Datos | Hooks de React Query conectados a servicios y repositorios JSON. |
| Apariencia | Paletas claro/oscuro, diseño adaptable y entrada de vistas de 200 ms con movimiento reducido. |

## Límites de la demostración

- Los repositorios y servicios actuales ofrecen lectura mediante `getAll`; no hay operaciones de creación, edición o eliminación persistentes.
- Marcar una tarea en Dashboard cambia únicamente el estado local de esa vista. No modifica el JSON, la caché de tareas ni la tabla de Tareas. Los cambios se pierden al desmontar la vista o recargar.
- En el modo API, Login muestra el formulario y la opción Gmail. El formulario todavía navega al dashboard sin autenticar y Gmail está marcado como «Próximamente».
- «Cerrar sesión» vuelve a `/` reemplazando la entrada actual del historial. No invalida una sesión real, pues aún no existe.
- Las rutas no tienen protección de autenticación. El tema y la expansión del menú viven en estado React, sin persistencia entre recargas.
- La configuración contempla API, pero faltan sus implementaciones de repositorios. Los comandos API no representan una integración terminada.

## Documentos

- [Arquitectura](arquitectura.md): organización, rutas, datos, tabla reutilizable y estilos.
- [Desarrollo](desarrollo.md): ejecución, entornos, convenciones y verificaciones.
- [CI/CD](ci-cd.md): validación y despliegue en GitHub Pages.
- [Idea y alcance](idea.md): funcionalidades actuales y pendientes del CRM.
