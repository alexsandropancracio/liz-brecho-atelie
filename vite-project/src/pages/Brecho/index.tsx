import "./brecho.css";
import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "../../animations/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

import {
  animateBrechoPage,
  animateHeroScroll,
  animateCollectionEntrance,
  animateFilterChange,
} from "./brecho.animation";

import { useRouteTransition } from "../../routes/RouteTransitionContext";

type Category = "Todos" | "Feminino" | "Masculino" | "Infantil";
type HighlightCategory = Exclude<Category, "Todos">;

const MOCK_PIECES = Array.from({ length: 30 }, (_, i) => {
  const categories: HighlightCategory[] = ["Feminino", "Masculino", "Infantil"];

  return {
    id: String(i + 1).padStart(2, "0"),
    name: `LIZ Editorial — Peça ${i + 1}`,
    category: categories[i % 3],
    description: "Espaço reservado para proporções e caimento da peça.",
  };
});

const HIGHLIGHT_CATEGORIES: HighlightCategory[] = [
  "Feminino",
  "Masculino",
  "Infantil",
];

export function Brecho() {
  const navigate = useNavigate();
  const { startTransition } = useRouteTransition();

  const [activeFilter, setActiveFilter] = useState<Category>("Todos");
  

  const scrollRefs = useRef<HTMLDivElement[]>([]);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });

    const cleanup = animateBrechoPage();

    return () => {
      cleanup?.();
    };
  }, []);


  function goBackToServices() {
    startTransition("left");

    navigate("/", {
      state: {
        scrollTo: "services",
        animateServicesReturn: true,
        returnFrom: "brecho",
      },
    });
  }

useEffect(() => {
  const cleanupPage = animateBrechoPage();
  const cleanupHero = animateHeroScroll();

  return () => {
    cleanupPage?.();
    cleanupHero?.();
  };
}, []);

useEffect(() => {
  const timer = setTimeout(() => {
    ScrollTrigger.getAll().forEach((trigger) => {
      const element = trigger.vars.trigger as Element | undefined;

      if (
        element?.classList?.contains("collection-highlight-group") ||
        element?.classList?.contains("brecho-collection")
      ) {
        trigger.kill();
      }
    });

    animateCollectionEntrance();

    ScrollTrigger.refresh();
  }, 50);

  return () => clearTimeout(timer);
}, [activeFilter]);

  function handleMouseDown(event: MouseEvent<HTMLDivElement>) {
    const scrollElement = event.currentTarget;

    isDragging.current = true;
    startX.current = event.pageX - scrollElement.offsetLeft;
    scrollLeft.current = scrollElement.scrollLeft;

    scrollElement.classList.add("is-dragging");
  }

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    if (!isDragging.current) return;

    event.preventDefault();

    const scrollElement = event.currentTarget;
    const x = event.pageX - scrollElement.offsetLeft;
    const walk = (x - startX.current) * 1.4;

    scrollElement.scrollLeft = scrollLeft.current - walk;
  }

  function handleMouseUp(event: MouseEvent<HTMLDivElement>) {
    isDragging.current = false;
    event.currentTarget.classList.remove("is-dragging");
  }

  const visibleCategories =
    activeFilter === "Todos"
      ? HIGHLIGHT_CATEGORIES
      : HIGHLIGHT_CATEGORIES.filter((category) => category === activeFilter);

  const visiblePieces =
    activeFilter === "Todos"
      ? MOCK_PIECES
      : MOCK_PIECES.filter((piece) => piece.category === activeFilter);

  return (
    <main className="brecho">
      <section className="brecho-hero">

          <div className="brecho-hero__curtain">
            <div className="brecho-hero__curtain-left"></div>
            <div className="brecho-hero__curtain-right"></div>
          </div>

        <button
          type="button"
          className="brecho-back"
          onClick={goBackToServices}
        >
          ← Voltar
        </button>

        <div className="brecho-hero__content">
          <span className="brecho-hero__eyebrow"></span>

          <h1 className="brecho-hero__title">
            <span>Roupas que já viveram,</span>
            <span>agora encontram</span>
            <span> outra forma de existir.</span>
          </h1>

          <p className="brecho-hero__description">
            Uma curadoria silenciosa. Peças selecionadas com intenção, respeito
            à sua história e um olhar profundamente editorial sobre o que
            vestimos.
          </p>

          <div className="brecho-hero__meta">

          </div>
        </div>

        <div className="brecho-hero__visual" aria-hidden="true">
          <span></span>
        </div>
      </section>

      <section className="brecho-collection">
        <div className="collection-header">
          <div className="collection-top">
            <h2 className="section-title">Acervo</h2>

            <span className="collection-count">
              {visiblePieces.length} Peças
            </span>
          </div>

          <div className="collection-filters">
            {(["Todos", "Feminino", "Masculino", "Infantil"] as Category[]).map(
              (category) => (
                <button
                  key={category}
                  type="button"
                  className={`filter-btn ${
                    activeFilter === category ? "active" : ""
                  }`}
                  onClick={() => setActiveFilter(category)}
                >
                  {category}
                </button>
              )
            )}
          </div>
        </div>

        {visibleCategories.map((category, index) => {
          const categoryPieces = MOCK_PIECES.filter(
            (piece) => piece.category === category
          );

          return (
            <div className="collection-highlight-group" key={category}>
              <div className="collection-highlight-group__header">
                <span>{category}</span>
                <small>{categoryPieces.length} peças</small>
              </div>

              <div
                className="collection-highlight-scroll"
                ref={(element) => {
                  if (element) scrollRefs.current[index] = element;
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}

              >
                {categoryPieces.map((piece) => (
                  <article className="collection-item" key={piece.id}>
                    <div className="collection-item__image-wrapper placeholder">
                      <span className="placeholder-text">Espaço da Peça</span>

                      <div className="collection-item__overlay">
                        <span>Conhecer detalhes</span>
                      </div>
                    </div>

                    <div className="collection-item__info">
                      <div className="item-meta">
                        <span className="item-id">{piece.id}</span>
                        <span className="item-origin">{piece.category}</span>
                      </div>

                      <h3 className="item-name">{piece.name}</h3>

                      <p className="item-description">{piece.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      <section className="brecho-curadoria" id="curadoria">
        <div className="curadoria-grid">
          <div className="curadoria-image">
            <div className="curadoria-image__placeholder">
              <span className="placeholder-text">Acervo LIZ</span>
            </div>
          </div>

          <div className="curadoria-text-block">
            <h2 className="section-title">O Olhar</h2>

            <p className="large-text">
              A curadoria nasce do olhar, não da pressa.
            </p>

            <p>
              Não acreditamos no descarte. Acreditamos no reinício. Ao buscar o
              que já foi criado, procuramos a textura invisível do tempo, o
              toque da costura e a atemporalidade da forma. Cada peça em nosso
              acervo foi escolhida porque merece continuar sendo lida no mundo.
            </p>

            <div className="text-divider" />

            <p className="small-text">
              Memória materializada em tecido e modelagem.
            </p>
          </div>
        </div>
      </section>



      <section className="brecho-manifesto">
        <div className="manifesto-wrapper">
          <div className="manifesto-content">
            <p>“Você não veste apenas uma peça.</p>
            <p>Você faz história e tendência com ela.”</p>

            <span className="manifesto-author">— LIZ Ateliê & Brechó</span>
          </div>
        </div>
      </section>

      <section className="brecho-outro">
        <div className="brecho-outro-content">
          <h2>Uma experiência sem urgência.</h2>

          <p>
            Descubra as texturas, os detalhes da alfaiataria e a sutileza de
            vestir algo que compartilha da mesma identidade que a sua.
          </p>

          <button type="button" className="brecho-outro-cta">
            Explorar toda a curadoria
          </button>
        </div>
      </section>
    </main>
  );
}