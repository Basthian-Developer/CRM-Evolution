import { useRef, useState } from 'react';
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
  const botonMovil = useRef<HTMLButtonElement>(null);
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);

  // Devuelve el foco al control antes de desactivar los enlaces del menú.
  function cerrarMenuMovil() {
    botonMovil.current?.focus({ preventScroll: true });
    setMenuMovilAbierto(false);
  }

  // Estado de expansión del menú.
  const [menuExpandido, setMenuExpandido] = useState<boolean>(true);

  return (
    <>
      {/* En móvil, la navegación ocupa una barra superior de ancho completo. */}
      <header className={`sidebar sticky top-0 z-30 w-full shrink-0 border-b border-white/10 px-4 py-3 shadow-lg shadow-black/10 md:hidden ${props.modoNocturno ? 'dark-sidebar' : ''}`}>
        <div
          onKeyDown={(event) => {
            if (event.key === 'Escape' && menuMovilAbierto) {
              event.preventDefault();
              cerrarMenuMovil();
            }
          }}
        >
          {/* Logo, nombre y control táctil del menú. */}
          <button
            ref={botonMovil}
            type="button"
            aria-expanded={menuMovilAbierto}
            aria-controls="navegacion-movil"
            onClick={() => {
              if (menuMovilAbierto) cerrarMenuMovil();
              else setMenuMovilAbierto(true);
            }}
            className="flex min-h-11 w-full items-center gap-3 rounded-xl text-left text-white"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-on-accent ring-1 ring-white/15">
              <Layers3 size={21} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1 text-lg font-semibold leading-tight wrap-anywhere">{props.titulo}</span>
            <span className="sr-only">Menú de navegación</span>
            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 motion-reduce:transition-none ${menuMovilAbierto ? 'bg-white/20' : 'bg-white/10'}`}>
              <Menu size={22} aria-hidden="true" />
            </span>
          </button>

          {/* Anima la altura y opacidad sin desmontar el menú; cerrado no recibe foco. */}
          <div
            id="navegacion-movil"
            inert={!menuMovilAbierto}
            className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out motion-reduce:transition-none ${menuMovilAbierto ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
          >
            <div className="min-h-0 overflow-hidden">
          {/* Desplegable con scroll para pantallas de poca altura. */}
          <div className="mt-3 max-h-[65dvh] space-y-3 overflow-y-auto border-t border-white/15 pt-3">
            <nav aria-label="Navegación móvil" className="grid gap-2">
              {props.rutas?.map((ruta) => {
                const Icono = ruta.icon;
                return (
                  <NavLink
                    key={ruta.path}
                    to={ruta.path}
                    end={ruta.end}
                    onClick={cerrarMenuMovil}
                    className={({ isActive }) => `flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors motion-reduce:transition-none ${isActive ? 'sidebar-link-active bg-accent font-semibold text-on-accent' : 'text-white/75 hover:bg-white/10 hover:text-white'}`}
                  >
                    {Icono && <Icono size={20} className="shrink-0" aria-hidden="true" />}
                    <span>{ruta.nombre}</span>
                  </NavLink>
                );
              })}
            </nav>

            {/* Tema y salida, siempre después de los enlaces. */}
            <div className="space-y-2 border-t border-white/15 pt-3">
              <button type="button" aria-pressed={props.modoNocturno} onClick={() => props.setModoNocturno((actual) => !actual)} className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-white/75 hover:bg-white/10 hover:text-white">
                {props.modoNocturno ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}
                <span>Modo nocturno</span>
              </button>
              <button type="button" onClick={() => { cerrarMenuMovil(); navigate('/', { replace: true }); }} className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-white/75 hover:bg-white/10 hover:text-white">
                <LogOut size={20} aria-hidden="true" />
                <span>Cerrar sesión</span>
              </button>
            </div>
          </div>
            </div>
          </div>
        </div>
      </header>

      {/* En escritorio se conserva el menú lateral contraíble. */}
      <aside
        className={`sidebar sticky top-0 h-dvh shrink-0 hidden md:flex flex-col border-r border-white/10 py-5 px-2.5 transition-[width] duration-500 ease-in-out motion-reduce:transition-none ${
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

          <div className="sidebar-hero mt-5 flex min-w-0 items-center">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-on-accent shadow-lg shadow-black/15 ring-1 ring-white/15">
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
                    `flex min-h-10 items-center rounded-xl p-1 transition-colors duration-200 ease-in-out motion-reduce:transition-none ${
                      isActive
                        ? 'sidebar-link-active bg-accent text-on-accent font-semibold shadow-md shadow-black/10 ring-1 ring-white/15'
                        : 'text-white/75 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  {Icono && <Icono className="h-8 w-8 shrink-0 p-1.5" />}
                  <p
                    className={`flex h-8 items-center overflow-hidden text-sm leading-none whitespace-nowrap transition-[max-width,opacity,margin-left] duration-500 ease-in-out motion-reduce:transition-none ${
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

        {/* Separador y acciones al pie, alineadas con los enlaces. */}
        <div className="mb-3 h-px shrink-0 bg-linear-to-r from-transparent via-white/20 to-transparent" aria-hidden="true" />
        <button
          type="button"
          aria-label="Modo nocturno"
          aria-pressed={props.modoNocturno}
          className="mt-auto flex w-full shrink-0 items-center rounded-xl p-1 text-white/75 transition-colors duration-500 ease-in-out motion-reduce:transition-none hover:bg-white/10 hover:text-white"
          onClick={() => props.setModoNocturno((prev) => !prev)}
        >
          {props.modoNocturno ? (
            <Sun
              className="h-8 w-8 shrink-0 p-1.5"
              aria-hidden="true"
            />
          ) : (
            <Moon className="h-8 w-8 shrink-0 p-1.5" aria-hidden="true" />
          )}

          <p
            className={`flex h-8 items-center overflow-hidden text-sm leading-none whitespace-nowrap transition-[max-width,opacity,margin-left] duration-500 ease-in-out motion-reduce:transition-none ${
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
          className="mt-2 flex w-full shrink-0 items-center rounded-xl p-1 text-white/75 transition-colors duration-500 ease-in-out motion-reduce:transition-none hover:bg-white/10 hover:text-white"
          onClick={() => navigate('/', { replace: true })}
        >
          <LogOut className="h-8 w-8 shrink-0 p-1.5" aria-hidden="true" />
          <span
            className={`flex h-8 items-center overflow-hidden text-sm leading-none whitespace-nowrap transition-[max-width,opacity,margin-left] duration-500 ease-in-out motion-reduce:transition-none ${
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
