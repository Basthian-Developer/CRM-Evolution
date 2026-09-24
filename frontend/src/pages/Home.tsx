import { useState } from 'react';
import { House, Users, MessageSquare, ClipboardList } from 'lucide-react';

import Sidebar from '@components/Sidebar';
import { Outlet, useLocation } from 'react-router';

function Home() {
  const { pathname } = useLocation();

  // Tema compartido por el Sidebar y la vista activa.
  const [modoNocturno, setModoNocturno] = useState<boolean>(false);

  // Cada enlace indica su ruta, etiqueta e icono.
  const rutas = [
    { nombre: 'Inicio', path: '/dashboard', icon: House, end: true },
    { nombre: 'Clientes', path: '/dashboard/clientes', icon: Users },
    {
      nombre: 'Interacciones',
      path: '/dashboard/interacciones',
      icon: MessageSquare,
    },
    { nombre: 'Tareas', path: '/dashboard/tareas', icon: ClipboardList },
  ];

  return (
    <>
      {/* Pantalla principal */}
      <div
        className={`flex min-h-screen items-start transition-all duration-300 ${modoNocturno ? 'dark-main' : ''}`}
      >
        {/* Menú lateral persistente entre cambios de vista. */}
        <Sidebar
          titulo="CRM Evolution"
          modoNocturno={modoNocturno}
          setModoNocturno={setModoNocturno}
          rutas={rutas}
        />

        {/* Contenido de la ruta seleccionada. */}
        <section className="main flex-1">
          {/* Solo la vista se anima al cambiar de ruta; el Sidebar permanece montado. */}
          <div key={pathname} className="view-transition">
            <Outlet />
          </div>
        </section>
      </div>
    </>
  );
}

export default Home;
