import { Route, Routes } from "react-router";

import Home from "@pages/home/Home";

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
        </Routes>
    );
}