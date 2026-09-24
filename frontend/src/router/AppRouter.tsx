import { Route, Routes } from "react-router";

import Home from "@pages/home/Home";

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Home />} >
                <Route
                    path="/inicio" element={<h1>Inicio</h1>} />
                <Route
                    path="/clientes" element={<h1>Clientes</h1>} />
                <Route
                    path="/interacciones" element={<h1>Interacciones</h1>} />
            </Route>
        </Routes>
    );
}