import "./brecho.css";
import { useEffect, useRef, useState, useLayoutEffect } from "react";
import type { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";

import { gsap } from "../../animations/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

import {
  animateBrechoPage,
  animateHeroScroll,
  animateCollectionEntrance,
  animateBrechoProcessStackWithHeaders,
  animateThemeTransition,
} from "./brecho.animation";

import { useRouteTransition } from "../../routes/RouteTransitionContext";

import selecaoImage from "../../../assets/brecho/img1.png";
import higienizacaoImage from "../../../assets/brecho/img2.png";
import revisaoImage from "../../../assets/brecho/img3.png";
import preparacaoImage from "../../../assets/brecho/img4.png";
import toqueFinalImage from "../../../assets/brecho/img5.png";

/* =======================================================
   TYPES
======================================================= */

type Category = "Todos" | "Feminino" | "Masculino" | "Infantil";
type HighlightCategory = Exclude<Category, "Todos">;

/* =======================================================
   DATA
======================================================= */

const MOCK_PIECES = Array.from({ length: 30 }, (_, i) => {
  const categories: HighlightCategory[] = [
    "Feminino",
    "Masculino",
    "Infantil",
  ];

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

const PROCESS_STEPS = [
  {
    id: "selection",
    number: "01",
    title: "Seleção",
    image: selecaoImage,
    description:
      "A curadoria começa antes mesmo da peça chegar ao acervo. Observamos modelagem, tecido, caimento e estado de conservação. Nem tudo entra. Escolhemos apenas aquilo que acreditamos merecer continuar sua história.",
  },
  {
    id: "cleaning",
    number: "02",
    title: "Higienização",
    image: higienizacaoImage,
    description:
      "Cada peça passa por um processo cuidadoso de higienização. Respeitamos as características de cada tecido para preservar sua qualidade, garantindo que chegue limpa, renovada e pronta para um novo capítulo.",
  },
  {
    id: "review",
    number: "03",
    title: "Revisão e Cuidados",
    image: revisaoImage,
    description:
      "Quando necessário, realizamos pequenos reparos e ajustes. Um botão solto, um detalhe delicado ou um acabamento que merece atenção recebem o mesmo cuidado que dedicamos à escolha da peça.",
  },
  {
    id: "preparation",
    number: "04",
    title: "Preparação Final",
    image: preparacaoImage,
    description:
      "Antes da entrega, cada peça é cuidadosamente passada e revisada. Acreditamos que a apresentação faz parte da experiência, e cada dobra, textura e detalhe importa.",
  },
  {
    id: "final-touch",
    number: "05",
    title: "Toque Final",
    image: toqueFinalImage,
    description:
      "Finalizamos cada peça com uma fragrância suave para tecidos e um cuidado especial na apresentação. Queremos que a experiência comece no instante em que a embalagem é aberta.",
  },
];

/* =======================================================
   COMPONENT
======================================================= */

export function Brecho() {
  const navigate = useNavigate();
  const { startTransition } = useRouteTransition();

  const [activeFilter, setActiveFilter] = useState<Category>("Todos");

  /* =======================================================
     DRAG SCROLL
  ======================================================= */

  const scrollRefs = useRef<HTMLDivElement[]>([]);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const finalContentRef = useRef<HTMLDivElement>(null);
  const finalImageRef = useRef<HTMLDivElement>(null);

  /* =======================================================
     STACKED CARDS REFS
  ======================================================= */


  /* =======================================================
     HERO ANIMATIONS
  ======================================================= */

  useEffect(() => {
    window.scrollTo(0, 0);

    const cleanup = animateBrechoPage();

    return () => cleanup?.();
  }, []);

  useEffect(() => {
    const cleanupHero = animateHeroScroll();

    return () => cleanupHero?.();
  }, []);

  /* =======================================================
     COLLECTION FILTER ANIMATION
  ======================================================= */

  useEffect(() => {
    const timer = setTimeout(() => {

      
      ScrollTrigger.getAll().forEach((trigger) => {
        const el = trigger.vars.trigger as Element | undefined;

        if (
          el?.classList?.contains("collection-highlight-group") ||
          el?.classList?.contains("brecho-collection")
        ) {
          trigger.kill();
        }
      });

      animateCollectionEntrance();
      ScrollTrigger.refresh();
    }, 50);

    return () => clearTimeout(timer);
  }, [activeFilter]);

  /* =======================================================
     STACKED CARDS
  ======================================================= */

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      animateBrechoProcessStackWithHeaders();
    });

    return () => ctx.revert();
  }, []);

  /* =======================================================
     FINAL
  ======================================================= */

useEffect(() => {
  const cleanup = animateThemeTransition();

  return () => cleanup?.();
}, []);

useEffect(() => {

    const ctx = gsap.context(() => {

        const tl = gsap.timeline({

            scrollTrigger: {
                trigger: ".curadoria-final",
                start: "top 75%",
                toggleActions: "play none none reverse",
            }

        });

        tl.from(finalContentRef.current, {

            x: -150,
            opacity: 0,
            duration: 1.3,
            ease: "power3.out"

        })

        .from(finalImageRef.current, {

            xPercent:30,
            opacity: 0,
            duration: 1.3,
            ease: "power3.out"

        }, "-=1");

    });

    return () => ctx.revert();

}, []);

  /* =======================================================
     NAVIGATION
  ======================================================= */

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

  /* =======================================================
     DRAG SCROLL
  ======================================================= */

  function handleMouseDown(event: MouseEvent<HTMLDivElement>) {
    const el = event.currentTarget;

    isDragging.current = true;
    startX.current = event.pageX - el.offsetLeft;
    scrollLeft.current = el.scrollLeft;

    el.classList.add("is-dragging");
  }

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    if (!isDragging.current) return;

    event.preventDefault();

    const el = event.currentTarget;
    const x = event.pageX - el.offsetLeft;
    const walk = (x - startX.current) * 1.4;

    el.scrollLeft = scrollLeft.current - walk;
  }

  function handleMouseUp(event: MouseEvent<HTMLDivElement>) {
    isDragging.current = false;
    event.currentTarget.classList.remove("is-dragging");
  }

  /* =======================================================
     FILTERED DATA
  ======================================================= */

  const visibleCategories =
    activeFilter === "Todos"
      ? HIGHLIGHT_CATEGORIES
      : HIGHLIGHT_CATEGORIES.filter((c) => c === activeFilter);

  const visiblePieces =
    activeFilter === "Todos"
      ? MOCK_PIECES
      : MOCK_PIECES.filter((p) => p.category === activeFilter);

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
      

<section className="reveal-cards">
  {PROCESS_STEPS.map((card, i) => (
    <div className="reveal-card" key={card.id}>
      <article className="card">
        <img src={card.image} alt={card.title} />

        <div className="card-content">
          <h2>{card.title}</h2>
          <p>{card.description}</p>
        </div>
      </article>
    </div>
  ))}
</section>

<section className="theme-transition">
  <div className="theme-transition__trigger">
  </div>
</section>

<section className="curadoria-final">

  <div className="curadoria-final__frame">

    <div className="curadoria-final__hero">

      <div
          className="curadoria-final__content"
          ref={finalContentRef}
      >

        <h2>
            Pronta para um
            <br />
            novo capítulo.
        </h2>

        <p>
            Cada peça carrega memórias,
            detalhes e histórias que
            merecem continuar existindo.
        </p>

        <a className="curadoria-final__button">
            Encontrar minha próxima peça
        </a>

    </div>


    <div className="curadoria-final__visual">

        <div 
          className="curadoria-final__image"
          ref={finalImageRef}
        />

    </div>

    </div>

    <footer className="liz-footer">
      <div className="liz-footer__inner">
        <div className="liz-footer__brand">

          <p>Peças selecionadas com intenção, identidade e tempo.</p>
          
        </div>

        <nav className="liz-footer__nav" aria-label="Links institucionais">
          <a href="/politica-de-privacidade">Política de Privacidade</a>
          <a href="/informacoes-legais">Informações Legais</a>
          <a href="/localizacao">Localização</a>
        </nav>

        <div className="liz-footer__bottom">
          <span>© {new Date().getFullYear()} — LIZ — Brechó & Ateliê. Todos os direitos reservados.</span>
        </div>
      </div>
    </footer>

  </div>


</section>

    </main>
  );
}