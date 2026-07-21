import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import { Home } from "../pages/Home";
import { Brecho } from "../pages/Brecho";
import { Atelie } from "../pages/Atelie";

import { PageRouteWrapper } from "../components/PageRouteWrapper";


export function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageRouteWrapper>
              <Home />
            </PageRouteWrapper>
          }
        />

        <Route
          path="/brecho"
          element={
            <PageRouteWrapper>
              <Brecho />
            </PageRouteWrapper>
          }
        />

        <Route
          path="/"
          element={
            <PageRouteWrapper>
              <Atelie />
            </PageRouteWrapper>
          }
        />

        <Route
          path="/sobre"
          element={
            <PageRouteWrapper>
              <div>Sobre</div>
            </PageRouteWrapper>
          }
        />

        <Route
          path="/contato"
          element={
            <PageRouteWrapper>
              <div>Contato</div>
            </PageRouteWrapper>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}