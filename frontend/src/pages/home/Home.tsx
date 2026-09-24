// Imports generales
import { useState } from 'react';
import { House, Users, MessageSquare } from 'lucide-react'

// Hooks

// Componentes
import Sidebar from '@components/Sidebar';
import { Outlet } from 'react-router';

function Home() {

  // Variables
  const [modoNocturno, setModoNocturno] = useState<boolean>(false);

  const rutas = [
    { "nombre": "Inicio", "path": "/inicio", icon: House },
    { "nombre": "Clientes", "path": "/clientes", icon: Users },
    { "nombre": "Interacciones", "path": "/interacciones", icon: MessageSquare }
  ];

  return (
    <>
      {/* Pantalla principal */}
      <div className={`flex min-h-screen transition-all duration-300 ${modoNocturno ? 'dark-main' : ''}`}>
        <Sidebar
          titulo='Titulo'
          modoNocturno={modoNocturno}
          setModoNocturno={setModoNocturno}
          rutas={rutas} />

        <section className='main flex-1 transition-all duration-300'>
          <Outlet />
        </section>
      </div>
    </>
  )
}

export default Home