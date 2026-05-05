import "./atelie.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { animateAtelie } from "./atelie.animation";
import { useRouteTransition } from "../../routes/RouteTransitionContext";

export function Atelie() {
  const navigate = useNavigate();
  const { startTransition } = useRouteTransition();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });

    const cleanup = animateAtelie();

    return () => {
      cleanup?.();
    };
  }, []);
  
    function goBackToServices() {
    startTransition("right");

    navigate("/", {
        state: {
        scrollTo: "services",
        animateServicesReturn: true,
        returnFrom: "atelie",
        },
    });
    }

  return (
    <main className="atelie">
      <section className="atelie-hero">
        {/* 🔥 BOTÃO VOLTAR */}
        <button
          type="button"
          className="atelie-back"
          onClick={goBackToServices}
        >
          Voltar → 
        </button>

        <div className="atelie-hero__content">
          <span className="atelie-hero__eyebrow">Ateliê LIZ</span>

          <h1 className="atelie-hero__title">
            <span>Forma em construção.</span>
            <span>Intenção em cada gesto.</span>
          </h1>

          <p className="atelie-hero__description">
            Entre tecido, tempo e presença, cada peça nasce como um
            processo. Não é apenas vestir, é revelar identidade através
            da forma.
          </p>

          <div className="atelie-hero__meta">
            <span>02</span>
            <span>Criação autoral</span>
          </div>
        </div>

        <div className="atelie-hero__visual" aria-hidden="true">
          <span>LIZ</span>
        </div>
      </section>
    </main>
  );
}