import "./brecho.css";
import {
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
  useMemo,
} from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import {
  useNavigate,
  useLocation,
  useNavigationType,
} from "react-router-dom";

import { gsap } from "../../animations/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCollectionNavigation } from "../../animations/hooks/useCollectionNavigation";

gsap.registerPlugin(ScrollTrigger);

import {
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
import lojaCompleta from "../../../assets/brecho/loja-completa.jfif";

import type { Category, Piece } from "./brecho.data";
import { getAvailablePieces } from "./brecho.service";

/* =======================================================
   TYPES
======================================================= */

type FilterCategory = "Todos" | Category;
type HighlightCategory = Category;

type CatalogReturnPosition = {
  scrollY: number;
  category: HighlightCategory;
  scrollLeft: number;
  activeFilter: FilterCategory;
};

/* =======================================================
   DATA
======================================================= */


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
    title: "Revisão e Cuidados",
    image: higienizacaoImage,
    description:
      "Quando necessário, realizamos pequenos reparos e ajustes. Um botão solto, um detalhe delicado ou um acabamento que merece atenção recebem o mesmo cuidado que dedicamos à escolha da peça.",
  },
  {
    id: "review",
    number: "03",
    title: "Higienização",
    image: revisaoImage,
    description:
      "Cada peça passa por um processo cuidadoso de higienização. Respeitamos as características de cada tecido para preservar sua qualidade, garantindo que chegue limpa, renovada e pronta para um novo capítulo.",
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
  const location = useLocation();
  const { startTransition } = useRouteTransition();

  /* =======================================================
   SUPABASE — CATÁLOGO
======================================================= */

  const [pieces, setPieces] = useState<Piece[]>([]);
  const [isLoadingPieces, setIsLoadingPieces] = useState(true);
  const [piecesError, setPiecesError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPieces() {
      try {
        setIsLoadingPieces(true);
        setPiecesError(null);

        const availablePieces = await getAvailablePieces();

        if (!cancelled) {
          setPieces(availablePieces);
        }
      } catch (error) {
        console.error("Erro ao carregar o catálogo da LIZ:", error);

        if (!cancelled) {
          setPiecesError(
            "Não foi possível carregar o acervo. Tente novamente."
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoadingPieces(false);
        }
      }
    }

    void loadPieces();

    return () => {
      cancelled = true;
    };
  }, []);

  // Informações recebidas quando voltamos dos detalhes de uma peça.
  const restoreCatalog = (
    location.state as { restoreCatalog?: CatalogReturnPosition } | null
  )?.restoreCatalog;

  // Identifica se esta montagem aconteceu após uma recarga do documento.
  const isReloadRef = useRef<boolean | null>(null);

  if (isReloadRef.current === null) {
    isReloadRef.current =
      sessionStorage.getItem("brecho:reload") === "1";

    if (isReloadRef.current) {
      sessionStorage.removeItem("brecho:reload");
    }
  }

  // Mantém o filtro anterior ao retornar, mas reinicia após F5.
  const [activeFilter, setActiveFilter] = useState<FilterCategory>(
    isReloadRef.current
      ? "Todos"
      : restoreCatalog?.activeFilter ?? "Todos"
  );

  const {
    getContainerRef,
    navigation,
    scrollToGroup,
    updateActiveGroup,
  } = useCollectionNavigation();

  /* =======================================================
     DRAG SCROLL
  ======================================================= */

  const isDragging = useRef(false);
  const isPointerDown = useRef(false);
  const hasDragged = useRef(false);

  const startX = useRef(0);
  const startY = useRef(0);
  const scrollLeft = useRef(0);

  const gestureDirection = useRef<"pending" | "horizontal" | "vertical">(
    "pending"
  );
  const finalContentRef = useRef<HTMLDivElement>(null);
  const finalImageRef = useRef<HTMLDivElement>(null);

  /* =======================================================
     STACKED CARDS REFS
  ======================================================= */
  
  useEffect(() => {
    const markReload = () => {
      sessionStorage.setItem("brecho:reload", "1");
    };

    window.addEventListener("beforeunload", markReload);

    return () => {
      window.removeEventListener("beforeunload", markReload);
    };
  }, []);


  /* =======================================================
     HERO ANIMATIONS
  ======================================================= */

  useLayoutEffect(() => {
    // Após F5, ignora qualquer posição salva e começa no topo.
    if (isReloadRef.current) {
      window.history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
      return;
    }

    // Sem posição salva, começa no topo.
    // Com posição salva, deixa o segundo efeito restaurá-la.
    if (!restoreCatalog) {
      window.history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
    }
  }, []);

  useLayoutEffect(() => {
    // Nunca restaura uma posição antiga depois de F5.
    if (isReloadRef.current || !restoreCatalog) return;

    const frameId = requestAnimationFrame(() => {
      // Restaura a posição vertical da página.
      window.scrollTo(0, restoreCatalog.scrollY);

      // Restaura a posição horizontal do carrossel.
      const scroller = document.querySelector<HTMLElement>(
        `.collection-highlight-scroll[data-category="${restoreCatalog.category}"]`
      );

      if (scroller) {
        scroller.scrollLeft = restoreCatalog.scrollLeft;
      }

      // Atualiza os cálculos das animações.
      ScrollTrigger.refresh();
    });

    return () => cancelAnimationFrame(frameId);
  }, []);


  useEffect(() => {
    const cleanupHero = animateHeroScroll();

    return () => cleanupHero?.();
  }, []);

  /* =======================================================
     COLLECTION FILTER ANIMATION
  ======================================================= */



useEffect(() => {
  if (isLoadingPieces) return;

  let cleanupAnimation: (() => void) | undefined;

  const frameId = requestAnimationFrame(() => {
    cleanupAnimation = animateCollectionEntrance();
    ScrollTrigger.refresh();
  });

  return () => {
    cancelAnimationFrame(frameId);
    cleanupAnimation?.();
  };
}, [activeFilter, isLoadingPieces, piecesError]);

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
    const mm = gsap.matchMedia();

    mm.add("(max-width: 768px)", () => {

        gsap.timeline({
            scrollTrigger: {
                trigger: ".curadoria-final",
                start: "top 60%",
                toggleActions: "play none none reverse",
                markers: false,
            }
        })
        .from(finalContentRef.current, {
            y: 40,
            opacity: 0,
            duration: 1,
            delay: 0.5,
            ease: "power3.out"
        })
        .from(finalImageRef.current, {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        }, "-=0.7");

    });

    mm.add("(min-width: 769px)", () => {

        gsap.timeline({
            scrollTrigger: {
                trigger: ".curadoria-final",
                start: "top 75%",
                toggleActions: "play none none reverse",
            }
        })
        .from(finalContentRef.current, {
            x: -150,
            opacity: 0,
            duration: 1.3,
            ease: "power3.out"
        })
        .from(finalImageRef.current, {
            xPercent: 30,
            opacity: 0,
            duration: 1.3,
            ease: "power3.out"
        }, "-=1");

    });

    return () => mm.revert();

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

  
function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
  // Ignora cliques de outros botões do mouse.
  if (event.pointerType === "mouse" && event.button !== 0) return;

  isPointerDown.current = true;
  isDragging.current = false;
  hasDragged.current = false;
  gestureDirection.current = "pending";

  startX.current = event.clientX;
  startY.current = event.clientY;
  scrollLeft.current = event.currentTarget.scrollLeft;
}

function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
  if (!isPointerDown.current) return;

  const deltaX = event.clientX - startX.current;
  const deltaY = event.clientY - startY.current;

  // Aguarda um pequeno movimento para identificar a intenção do usuário.
  if (gestureDirection.current === "pending") {
    if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < 6) return;

    gestureDirection.current =
      Math.abs(deltaX) > Math.abs(deltaY) ? "horizontal" : "vertical";
  }

  // Se o movimento for vertical, deixa a página rolar normalmente.
  if (gestureDirection.current === "vertical") return;

  // Só considera arraste depois de identificar movimento horizontal.
  if (!isDragging.current) {
    isDragging.current = true;
    hasDragged.current = true;

    event.currentTarget.classList.add("is-dragging");

    // Mantém o acompanhamento do ponteiro durante o arraste.
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  event.preventDefault();

  // Desloca o catálogo no sentido oposto ao movimento do ponteiro.
  event.currentTarget.scrollLeft = scrollLeft.current - deltaX * 1.4;
}

function handlePointerEnd(event: ReactPointerEvent<HTMLDivElement>) {
  isPointerDown.current = false;
  isDragging.current = false;

  event.currentTarget.classList.remove("is-dragging");

  // Libera a captura quando ela estiver ativa.
  if (event.currentTarget.hasPointerCapture(event.pointerId)) {
    event.currentTarget.releasePointerCapture(event.pointerId);
  }

  // Não zeramos hasDragged aqui: o clique subsequente ainda precisa
  // saber que houve um arraste. Um novo pointerdown redefine a referência.
}


  /* =======================================================
   GROUPED PIECES
======================================================= */

const groupedPieces = useMemo(() => {
  return HIGHLIGHT_CATEGORIES.reduce(
    (accumulator, category) => {
      accumulator[category] = pieces.filter(
        (piece) => piece.category === category
      );

      return accumulator;
    },
    {} as Record<HighlightCategory, Piece[]>
  );
}, [pieces]);

/* =======================================================
   FILTERED DATA
======================================================= */

const visibleCategories =
  activeFilter === "Todos"
    ? HIGHLIGHT_CATEGORIES
    : HIGHLIGHT_CATEGORIES.filter(
        (category) => category === activeFilter
      );

const visiblePieces =
  activeFilter === "Todos"
    ? pieces
    : pieces.filter(
        (piece) => piece.category === activeFilter
      );


  return (
    <main className="brecho">

      <section className="brecho-hero">

          <div className="brecho-hero__curtain">
            <div className="brecho-hero__curtain-left"></div>
            <div className="brecho-hero__curtain-right"></div>
          </div>

        {/*<button
          type="button"
          className="brecho-back"
          onClick={goBackToServices}
        >
          ← Voltar
        </button>*/}

        <div className="brecho-hero__content">
          <span className="brecho-hero__eyebrow">

          </span>
            
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
          <img src={lojaCompleta} alt="" />
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
            {(["Todos", "Feminino", "Masculino", "Infantil"] as FilterCategory[]).map(
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
          {isLoadingPieces && (
            <p className="collection-status" role="status">
              Carregando o acervo...
            </p>
          )}

          {!isLoadingPieces && piecesError && (
            <div className="collection-status" role="alert">
              <p>{piecesError}</p>

              <button
                type="button"
                onClick={() => window.location.reload()}
              >
                Tentar novamente
              </button>
            </div>
          )}

          {!isLoadingPieces &&
            !piecesError &&
            pieces.length === 0 && (
              <p className="collection-status" role="status">
                Nosso acervo está sendo preparado. Em breve, novas peças estarão disponíveis.
              </p>
            )}
        </div>

        {!isLoadingPieces &&
          !piecesError &&
          pieces.length > 0 &&
          visiblePieces.length === 0 && (
            <p className="collection-empty" role="status">
              Sem produtos disponíveis no momento.
            </p>
          )}

        {!isLoadingPieces &&
          !piecesError &&
          visiblePieces.length > 0 &&
          visibleCategories.map((category) => {
          const categoryPieces = groupedPieces[category];

          
return (
  <div className="collection-highlight-group" key={category}>
    <div className="collection-highlight-group__header">
      <span>{category}</span>
      <small>{categoryPieces.length} peças</small>
    </div>

    {categoryPieces.length === 0 ? (
      <p className="collection-empty" role="status">
        Sem produtos disponíveis no momento.
      </p>
    ) : (
      <>
        <div
          className="collection-highlight-scroll"
          data-category={category}
          ref={getContainerRef(category, categoryPieces.length)}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          onPointerLeave={handlePointerEnd}
          onScroll={() => updateActiveGroup(category)}
        >
          {categoryPieces.map((piece) => (
            <article
              className="collection-item"
              key={piece.id}
              onClick={(event) => {
                // Se houve arraste, cancela a navegação.
                if (hasDragged.current) {
                  event.preventDefault();
                  event.stopPropagation();
                  hasDragged.current = false;
                  return;
                }

                // Localiza o carrossel horizontal da peça.
                const scroller = event.currentTarget.closest(
                  ".collection-highlight-scroll"
                ) as HTMLDivElement | null;

                // Abre os detalhes preservando a posição do catálogo.
                navigate(`/peca/${encodeURIComponent(piece.id)}`, {
                  state: {
                    catalogPosition: {
                      scrollY: window.scrollY,
                      category,
                      scrollLeft: scroller?.scrollLeft ?? 0,
                      activeFilter,
                    } satisfies CatalogReturnPosition,
                  },
                });
              }}
            >
              <div
                className={`collection-item__image-wrapper ${
                  piece.images[0]?.url ? "" : "placeholder"
                }`}
              >
                {piece.images[0]?.url ? (
                  <img
                    className="collection-item__image"
                    src={piece.images[0].url}
                    alt={piece.images[0].alt}
                    loading="lazy"
                  />
                ) : (
                  <span className="placeholder-text">
                    Imagem em breve
                  </span>
                )}
              </div>

              <div className="collection-item__info">
                <div className="collection-item__details">
                  <div className="collection-item__size">
                    <span className="collection-item__label">
                      Tamanho
                    </span>
                    <span className="collection-item__value">
                      {piece.size}
                    </span>
                  </div>

                  <div className="collection-item__price">
                    <span className="collection-item__label">
                      Preço
                    </span>
                    <span className="collection-item__value">
                      {piece.price.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                  </div>
                </div>

                <h3 className="item-name">{piece.name}</h3>

                <p className="item-description">
                  {piece.description}
                </p>

                <a
                  className="collection-item__buy"
                  href={`https://wa.me/5511981898351?text=${encodeURIComponent(
                    `Olá! Tenho interesse nesta peça da LIZ.\n\n${piece.name}\nCódigo: ${piece.id}\nTamanho: ${piece.size}\nPreço: ${piece.price.toLocaleString(
                      "pt-BR",
                      {
                        style: "currency",
                        currency: "BRL",
                      }
                    )}\n\nLink do produto: ${window.location.origin}/brecho/peca/${encodeURIComponent(piece.id)}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                  aria-label={`Comprar ${piece.name} pelo WhatsApp`}
                >
                  Comprar
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="collection-highlight-navigation">
          {Array.from({
            length: navigation[category]?.totalGroups ?? 0,
          }).map((_, groupIndex) => {
            const isActive =
              navigation[category]?.activeGroup === groupIndex;

            return (
              <button
                key={groupIndex}
                type="button"
                className={`collection-highlight-navigation__button ${
                  isActive ? "is-active" : ""
                }`}
                aria-label={`Mostrar grupo ${groupIndex + 1} de ${category}`}
                aria-current={isActive ? "page" : undefined}
                onClick={() => scrollToGroup(category, groupIndex)}
              >
                {String(groupIndex + 1).padStart(2, "0")}
              </button>
            );
          })}
        </div>
      </>
    )}
  </div>
);

        })}
      </section>

    <section className="reveal-cards">
      {/* Sobre nós */}
      <div className="about-intro">
        <span className="about-eyebrow">
          LIZ — BRECHÓ & ATELIÊ
        </span>

        <h2 className="about-title">
          Sobre Nós
        </h2>

        <div className="about-text">
          <p className="about-highlight">
            Acreditamos que o estilo vai além do que se veste.
          </p>

          <p>
            A LIZ é um espaço dedicado a peças com personalidade,
            novas descobertas e à liberdade de construir um estilo
            que tenha a sua identidade.
          </p>

          <p>
            Cada escolha carrega a possibilidade de uma nova história.
            Queremos fazer parte da sua.
          </p>
        </div>

        <div className="about-footer">
          <span>MODA · IDENTIDADE · HISTÓRIAS</span>
          <span className="about-arrow" aria-hidden="true">
            ↓
          </span>
        </div>
        <h2>Como funciona?</h2>
      </div>

      {/* Cards existentes */}
      {PROCESS_STEPS.map((card) => (
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

          <div className="curadoria-final__content"
              ref={finalContentRef}>

        <h2 className="portal-transition__cta-title">
              <span className="portal-transition__cta-line">
                <span>Então, não perca tempo.</span>
              </span>

              <span className="portal-transition__cta-line">
                <span>Oportunidades não esperam.</span>
              </span>
            </h2>

            <p>
                Cada peça carrega memórias,
                detalhes e histórias que
                merecem continuar existindo.
            </p>

        <a
          className="portal-transition__button"
          href="https://wa.me/5500000000000"
          target="_blank"
          rel="noreferrer"
          aria-label="Falar com a LIZ pelo WhatsApp"
        >
          <span className="portal-transition__button-bg"></span>

          <span className="portal-transition__button-text">
            Fale Conosco
          </span>
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