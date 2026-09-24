# CRM v0.1: idea y alcance

El objetivo es centralizar clientes, conversaciones y próximos pasos en un CRM básico. La implementación actual es una demo de consulta con JSON; el CRUD y la autenticación forman parte del trabajo pendiente.

## Funcionalidades

| Área | Disponible | Pendiente |
| --- | --- | --- |
| Dashboard | Indicadores, actividad reciente, cartera y tareas con cambios locales de estado. | Persistir los cambios de tareas. |
| Clientes | Listado, búsqueda, filtros y paginación. | Crear, editar, eliminar y consultar una ficha con historial individual. |
| Interacciones | Historial de llamadas, correos, reuniones y notas; búsqueda y filtros. | Registrar y modificar interacciones. |
| Tareas | Tabla, filtros por cliente/estado/prioridad, orden por fechas y paginación. | Crear, editar, completar y persistir desde el listado. |
| Acceso | Entrada directa a la demo; presentación del formulario en modo API. | Autenticación, permisos, protección de rutas y cierre de sesión real. |
| Fuente de datos | Repositorios JSON y contratos compartidos. | Implementaciones API y persistencia en backend. |

## Flujo objetivo

1. Registrar un posible cliente como prospecto.
2. Contactarlo y registrar la llamada o conversación.
3. Crear una tarea, por ejemplo «Enviar cotización mañana».
4. Realizar el seguimiento y completar la tarea.
5. Registrar nuevas interacciones y cambiar el estado a cliente cuando corresponda.

Este flujo describe el objetivo del producto. Hoy se pueden explorar los registros que lo representan, pero no guardar nuevos clientes, interacciones o tareas.

Consulta [contexto](contexto.md) para conocer los límites actuales y [arquitectura](arquitectura.md) para la organización técnica.
