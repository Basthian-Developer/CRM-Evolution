import { memo } from 'react';
import {
  createPaginatedRowModel,
  rowPaginationFeature,
  tableFeatures,
  useTable,
} from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';

// La configuración y los valores iniciales conservan su referencia entre renders.
const features = tableFeatures({
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
});
const initialState = { pagination: { pageIndex: 0, pageSize: 10 } };
const getRowId = (row: { id: string }) => row.id;

export type TableColumn<T extends { id: string }> = ColumnDef<
  typeof features,
  T
>;

interface TableProps<T extends { id: string }> {
  // La vista debe mantener columns y data estables (constantes o useMemo).
  columns: TableColumn<T>[];
  data: T[];
  caption: string;
  isLoading?: boolean;
  error?: string;
  onRetry?: () => void;
  emptyMessage?: string;
  minWidthClassName?: string;
}

function Table<T extends { id: string }>({
  columns,
  data,
  caption,
  isLoading = false,
  error,
  onRetry,
  emptyMessage = 'No hay resultados.',
  minWidthClassName = 'min-w-180',
}: TableProps<T>) {
  // El estado de paginación pertenece a la tabla, no se sincroniza con la vista.
  const table = useTable({ features, columns, data, getRowId, initialState });
  const rows = table.getRowModel().rows;
  const colSpan = Math.max(1, table.getAllLeafColumns().length);
  const { pageIndex, pageSize } = table.state.pagination;
  const buttonClass =
    'rounded-lg border border-border px-3 py-2 text-sm hover:bg-subtle disabled:cursor-not-allowed disabled:opacity-40';

  // Resuelve cada estado por separado para evitar condicionales anidados en el JSX.
  function renderizarFilas() {
    if (isLoading) {
      return (
        <tr>
          <td colSpan={colSpan} className="px-5 py-14 text-center text-muted">
            <span role="status">Cargando…</span>
          </td>
        </tr>
      );
    }
    if (error) {
      return (
        <tr>
          <td colSpan={colSpan} className="px-5 py-14 text-center">
            <p role="alert" className="text-warning">
              {error}
            </p>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="mt-3 rounded-lg bg-accent-soft px-4 py-2 text-accent"
              >
                Reintentar
              </button>
            )}
          </td>
        </tr>
      );
    }
    if (rows.length === 0) {
      return (
        <tr>
          <td colSpan={colSpan} className="px-5 py-14 text-center text-muted">
            {emptyMessage}
          </td>
        </tr>
      );
    }
    return rows.map((row) => (
      <tr key={row.id} className="transition-colors hover:bg-subtle/60">
        {row.getAllCells().map((cell, index) =>
          index === 0 ? (
            <th
              key={cell.id}
              scope="row"
              className="max-w-sm px-5 py-5 font-medium"
            >
              <table.FlexRender cell={cell} />
            </th>
          ) : (
            <td key={cell.id} className="px-5 py-5">
              <table.FlexRender cell={cell} />
            </td>
          ),
        )}
      </tr>
    ));
  }

  return (
    <div className="text-foreground" aria-busy={isLoading}>
      {/* Contenedor desplazable para pantallas pequeñas. */}
      <div
        className="max-w-full overflow-x-auto"
        tabIndex={0}
        role="region"
        aria-label={caption}
      >
        <table className={`w-full ${minWidthClassName} text-left text-sm`}>
          <caption className="sr-only">{caption}</caption>
          {/* Encabezados definidos por la vista. */}
          <thead className="bg-subtle text-xs text-muted">
            {table.getHeaderGroups().map((group) => (
              <tr key={group.id}>
                {group.headers.map((header) => (
                  <th
                    key={header.id}
                    scope="col"
                    colSpan={header.colSpan}
                    className="px-5 py-3 font-medium"
                  >
                    {!header.isPlaceholder && (
                      <table.FlexRender header={header} />
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          {/* Carga, errores, lista vacía o filas de la página actual. */}
          <tbody className="divide-y divide-border">{renderizarFilas()}</tbody>
        </table>
      </div>
      {/* Cantidad de resultados y controles de paginación. */}
      {!isLoading && !error && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-4">
          <p role="status" className="text-xs text-muted">
            {data.length ? pageIndex * pageSize + 1 : 0}–
            {Math.min((pageIndex + 1) * pageSize, data.length)} de {data.length}{' '}
            resultados
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <label className="text-xs text-muted">
              Filas{' '}
              <select
                value={pageSize}
                onChange={(event) =>
                  table.setPageSize(Number(event.target.value))
                }
                className="rounded-lg border border-border bg-panel px-2 py-2 text-foreground"
              >
                {[10, 25, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              className={buttonClass}
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
            >
              Anterior
            </button>
            <span className="text-xs text-muted">
              {pageIndex + 1} / {Math.max(1, table.getPageCount())}
            </span>
            <button
              type="button"
              className={buttonClass}
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Evita renders provocados por padres si ninguna prop cambió; conserva el genérico.
export default memo(Table) as typeof Table;
