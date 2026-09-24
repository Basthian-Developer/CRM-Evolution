import { useState } from 'react';
import {
  Menu,
  Sun,
  Moon,
  LogOut,
  Layers3,
  type LucideIcon,
} from 'lucide-react';

import { NavLink, useNavigate } from 'react-router';

// Datos que recibe el menú desde Home.
interface Ruta {
  nombre: string;
  path: string;
  icon?: LucideIcon;
  end?: boolean;
}

interface SidebarProps {
  titulo: string;
  modoNocturno: boolean;
  setModoNocturno: React.Dispatch<React.SetStateAction<boolean>>;
  rutas?: Ruta[];
}

export function Sidebar(props: SidebarProps) {
  const navigate = useNavigate();

  // Estado de expansión del menú.
  const [menuExpandido, setMenuExpandido] = useState<boolean>(true);

  return (
    <>
      <aside
        className={`sidebar sticky top-0 h-screen shrink-0 flex flex-col bg-primario py-5 px-2.5 transition-[width] duration-500 ease-in-out motion-reduce:transition-none ${
          menuExpandido ? 'w-64' : 'w-15'
        }
          ${props.modoNocturno ? 'dark-sidebar' : ''}`}
      >
        {/* El logo permanece visible; el título se recoge sin desmontarse. */}
        <div className="sidebar-header flex w-full shrink-0 flex-col">
          <div className="relative h-8 w-full">
            <button
              type="button"
              aria-label={menuExpandido ? 'Contraer menú' : 'Expandir menú'}
              aria-expanded={menuExpandido}
              className="absolute right-1 top-0 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-500 ease-in-out hover:bg-white/15 motion-reduce:transition-none"
              onClick={() => setMenuExpandido((prev) => !prev)}
            >
              <Menu className="h-8 w-8 text-white/50" aria-hidden="true" />
            </button>
          </div>

          <div className="sidebar-hero mt-5 flex min-w-0 items-start">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-on-accent">
              <Layers3 size={21} aria-hidden="true" />
            </span>
            <div
              aria-hidden={!menuExpandido}
              className={`grid min-w-0 overflow-hidden transition-[grid-template-rows,opacity,margin-left] duration-500 ease-in-out motion-reduce:transition-none ${
                menuExpandido
                  ? 'ml-3 grid-rows-[1fr] opacity-100'
                  : 'ml-0 grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                <h2 className="w-46 text-2xl leading-tight whitespace-normal wrap-anywhere text-white">
                  {props.titulo}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Enlaces a las vistas y estado de la ruta activa. */}
        <div className="flex flex-1 flex-col justify-center gap-2">
          {props.rutas &&
            props.rutas.map((ruta) => {
              const Icono = ruta.icon;
              return (
                <NavLink
                  key={ruta.nombre}
                  to={ruta.path}
                  end={ruta.end}
                  aria-label={ruta.nombre}
                  className={({ isActive }) =>
                    `flex items-center rounded-lg p-1 transition-colors duration-200 ease-in-out motion-reduce:transition-none ${
                      isActive
                        ? 'bg-accent text-on-accent font-semibold'
                        : 'text-white/50 hover:bg-white/20 hover:text-white'
                    }`
                  }
                >
                  {Icono && <Icono className="h-8 w-8 shrink-0" />}
                  <p
                    className={`flex h-8 items-center overflow-hidden whitespace-nowrap transition-[max-width,opacity,margin-left] duration-500 ease-in-out motion-reduce:transition-none ${
                      menuExpandido
                        ? 'ml-3 max-w-40 opacity-100'
                        : 'ml-0 max-w-0 opacity-0'
                    }`}
                  >
                    {ruta.nombre}
                  </p>
                </NavLink>
              );
            })}
        </div>

        {/* Acciones al pie: tema y salida al Login. */}
        <button
          type="button"
          aria-label="Modo nocturno"
          aria-pressed={props.modoNocturno}
          className="mt-auto flex w-full shrink-0 items-center rounded-lg p-1 text-white/50 transition-colors duration-500 ease-in-out motion-reduce:transition-none hover:bg-white/20"
          onClick={() => props.setModoNocturno((prev) => !prev)}
        >
          {props.modoNocturno ? (
            <Sun
              fill="currentColor"
              className="h-8 w-8 shrink-0"
              aria-hidden="true"
            />
          ) : (
            <Moon className="h-8 w-8 shrink-0" aria-hidden="true" />
          )}

          <p
            className={`flex h-8 items-center overflow-hidden whitespace-nowrap transition-[max-width,opacity,margin-left] duration-500 ease-in-out motion-reduce:transition-none ${
              menuExpandido
                ? 'ml-3 max-w-40 opacity-100'
                : 'ml-0 max-w-0 opacity-0'
            }`}
          >
            Modo nocturno
          </p>
        </button>
        <button
          type="button"
          aria-label="Cerrar sesión"
          className="mt-2 flex w-full shrink-0 items-center rounded-lg p-1 text-white/50 transition-colors duration-500 ease-in-out motion-reduce:transition-none hover:bg-white/20"
          onClick={() => navigate('/', { replace: true })}
        >
          <LogOut className="h-8 w-8 shrink-0" aria-hidden="true" />
          <span
            className={`flex h-8 items-center overflow-hidden whitespace-nowrap transition-[max-width,opacity,margin-left] duration-500 ease-in-out motion-reduce:transition-none ${
              menuExpandido
                ? 'ml-3 max-w-40 opacity-100'
                : 'ml-0 max-w-0 opacity-0'
            }`}
          >
            Cerrar sesión
          </span>
        </button>
      </aside>
    </>
  );
}

export default Sidebar;
