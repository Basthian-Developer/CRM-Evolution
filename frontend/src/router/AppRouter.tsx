import { Route, Routes } from 'react-router';

import Login from '@pages/Login';
import Home from '@pages/Home';
import DashboardView from '@pages/views/Dashboard';
import ClientesView from '@pages/views/Clientes';
import HistorialView from '@pages/views/Historial';
import TareasView from '@pages/views/Tareas';

// Login es una página independiente; Home contiene las vistas del CRM.
export default function AppRouter() {
  return (
    <Routes>
      {/* Página de acceso. */}
      <Route path="/" element={<Login />} />
      {/* Layout compartido y sus vistas. */}
      <Route path="/dashboard" element={<Home />}>
        <Route index element={<DashboardView />} />
        <Route path="clientes" element={<ClientesView />} />
        <Route path="interacciones" element={<HistorialView />} />
        <Route path="tareas" element={<TareasView />} />
      </Route>
    </Routes>
  );
}
