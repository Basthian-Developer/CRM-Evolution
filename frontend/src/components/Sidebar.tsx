// Imports generales
import { useState } from 'react';
import { Menu, Sun, Moon, type LucideIcon } from 'lucide-react';

// Hooks

// Iconos
import logo from '@assets/react.svg';
import { NavLink } from 'react-router';

// Interfaces
interface Ruta {
    nombre: string
    path: string
    icon?: LucideIcon
}

interface SidebarProps {
    titulo: string,
    modoNocturno: boolean
    setModoNocturno: React.Dispatch<React.SetStateAction<boolean>>
    rutas?: Ruta[]
}

export function Sidebar(props: SidebarProps) {

    // Variables
    const [menuExpandido, setMenuExpandido] = useState<boolean>(true);

    return (
        <>
            <aside
                className={`sidebar flex flex-col bg-primario py-5 px-2.5 transition-[width] duration-300 ${menuExpandido ? 'w-64' : 'w-15'
                    }
          ${props.modoNocturno ? 'dark-sidebar' : ''}`}
            >
                {/*Header*/}
                <div
                    className={`sidebar-header relative flex w-full items-center transition-[height] duration-300 ${menuExpandido ? 'h-10' : 'h-20'
                        }`}
                >
                    <div className='sidebar-hero flex h-10 w-10 shrink-0 items-center justify-center'>
                        <img
                            src={logo}
                            className='h-10 w-10'
                        />
                    </div>

                    <h2
                        className={`overflow-hidden whitespace-nowrap text-white transition-[max-width,opacity,margin] duration-300 ${menuExpandido
                            ? 'ml-3 max-w-40 opacity-100'
                            : 'ml-0 max-w-0 opacity-0'
                            }`}
                    >
                        {props.titulo}
                    </h2>

                    <button
                        type='button'
                        aria-label={menuExpandido ? 'Contraer menú' : 'Expandir menú'}
                        className={`absolute flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-[top,left,transform,background-color] duration-300 ease-in-out hover:bg-white/15 ${menuExpandido
                            ? 'left-full top-1/2 -translate-x-full -translate-y-1/2'
                            : 'left-1/2 top-16 -translate-x-1/2'
                            }`}
                        onClick={() => setMenuExpandido(prev => !prev)}
                    >
                        <Menu className='h-8 w-8 text-white/50' />
                    </button>
                </div>

                {/*Navegación */}
                <div className='flex flex-1 flex-col justify-center gap-2'>
                    {props.rutas && props.rutas.map((ruta) => {
                        const Icono = ruta.icon
                        return (
                            <NavLink
                                key={ruta.nombre}
                                to={ruta.path}
                                className={`flex items-center rounded-lg p-1 text-white/50 transition-[max-with, opacity, margin] duration-300 hover:bg-white/20`}
                            >
                                {Icono && <Icono className='h-8 w-8 shrink-0' />}
                                <p className={`flex h-8 items-center overflow-hidden whitespace-nowrap ${menuExpandido
                                    ? 'ml-3 max-w-40 opacity-100'
                                    : 'ml-0 min-w-0 opacity-0'
                                    }`}>
                                    {ruta.nombre}
                                </p>
                            </NavLink>
                        )
                    })}
                </div>

                {/*Modo nocturno */}
                <button className={`flex items-center gap-2 text-white/50 mt-auto rounded-lg hover:bg-white/15 transition-[with, padding] duration-300 p-1 ${menuExpandido
                    ? 'w-full px-2'
                    : 'w-8 justify-cente px-0'
                    }`}
                    onClick={() => props.setModoNocturno(prev => !prev)}>
                    {props.modoNocturno ? (
                        <Sun fill='currentColor' className='h-8 w-8 shrink-0' />
                    ) : (
                        <Moon className='h-8 w-8 shrink-0' />
                    )}

                    <p className={`overflow-hidden whitespace-nowrap ${menuExpandido
                        ? 'min-h-5 min-w-10 opacity-100'
                        : 'min-h-0 min-w-0 opacity-0'
                        }`}>Modo nocturno</p>
                </button>
            </aside>
        </>
    )
}

export default Sidebar