
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import { Home } from "../pages/Home";
import { Brecho } from "../pages/Brecho";
import { PecaDetalhe } from "../pages/Brecho/PecaDetalhe";
import { Atelie } from "../pages/Atelie";

import { PageRouteWrapper } from "../components/PageRouteWrapper";

export function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        {/* Página principal: Loja do Brechó */}
        <Route
          path="/"
          element={
            <PageRouteWrapper>
              <Brecho />
            </PageRouteWrapper>
          }
        />

        {/*
          Rota original da loja do brechó.
          Mantida comentada para referência.

          <Route
            path="/brecho"
            element={
              <PageRouteWrapper>
                <Brecho />
              </PageRouteWrapper>
            }
          />
        */}


          Rota para detalhes de uma peça.

          <Route
            path="/peca/:id"
            element={
              <PageRouteWrapper>
                <PecaDetalhe />
              </PageRouteWrapper>
            }
          />


        {/*
          Rota do Ateliê.

          <Route
            path="/atelie"
            element={
              <PageRouteWrapper>
                <Atelie />
              </PageRouteWrapper>
            }
          />
        */}

        {/*
          Rota Sobre.

          <Route
            path="/sobre"
            element={
              <PageRouteWrapper>
                <div>Sobre</div>
              </PageRouteWrapper>
            }
          />
        */}

        {/*
          Rota Contato.

          <Route
            path="/contato"
            element={
              <PageRouteWrapper>
                <div>Contato</div>
              </PageRouteWrapper>
            }
          />
        */}

      </Routes>
    </AnimatePresence>
  );
}
