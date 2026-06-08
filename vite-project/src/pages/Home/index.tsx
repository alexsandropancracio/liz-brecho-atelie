import "./home.css";
import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { animateHomeHero, animatePortalTransition, animatePortalCta } from "./home.animation";
import { ScrollTrigger } from "../../animations/gsap";
import { useRouteTransition } from "../../routes/RouteTransitionContext";

type HomeLocationState = {
  scrollTo?: "services";
  animateServicesReturn?: boolean;
  returnFrom?: "brecho" | "atelie";
} | null;

export function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const { startTransition } = useRouteTransition();

  const hasAnimatedRef = useRef(false);

  const locationState = location.state as HomeLocationState;

// 🔥 salvamos os valores antes de limpar o state
  const shouldScrollToServicesRef = useRef(
    locationState?.scrollTo === "services"
  );

  const shouldAnimateServicesReturnRef = useRef(
    locationState?.animateServicesReturn === true
  );

  const servicesReturnFromRef = useRef(
    locationState?.returnFrom
  );

  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    if (shouldScrollToServicesRef.current) {
      const servicesSection = document.querySelector(".home-services");

      servicesSection?.scrollIntoView({
        behavior: "auto",
        block: "start",
      });

      // 🔥 limpa o state depois de já ter salvo nos refs
      const timeoutId = window.setTimeout(() => {
        navigate(location.pathname, {
          replace: true,
          state: null,
        });
      }, 80);

      return () => {
        window.clearTimeout(timeoutId);
      };
    }

    window.scrollTo(0, 0);
  }, [location.pathname, navigate]);

useEffect(() => {
  if (hasAnimatedRef.current) return;

  hasAnimatedRef.current = true;

  const cleanupHomeHero = animateHomeHero({
    servicesReturnAnimation: shouldAnimateServicesReturnRef.current,
    servicesReturnFrom: servicesReturnFromRef.current,
  });

  const cleanupPortalTransition = animatePortalTransition();
  const cleanupPortalCta = animatePortalCta();

  window.requestAnimationFrame(() => {
    ScrollTrigger.refresh();
  });

  return () => {
    cleanupHomeHero?.();
    cleanupPortalTransition?.();
    cleanupPortalCta?.();
  };
}, []);

  function goToBrecho() {
    startTransition("right");
    navigate("/brecho");
  }

  function goToAtelie() {
    startTransition("left");
    navigate("/atelie");
  }

  return (
    <main className="home">
      <section className="hero">
        <div className="hero__content">
          <p className="hero__eyebrow">Brechó & Ateliê</p>

          <h1 className="hero__title">
            <span>Você não veste</span>
            <span>apenas roupa.</span>
            <span>Você veste história.</span>
          </h1>

          <p className="hero__description">
            Curadoria minimalista, peças únicas e criação autoral para quem
            enxerga estilo como identidade.
          </p>
        </div>

        <div className="hero__visual" aria-hidden="true">
          <span className="hero__line"></span>
          <span className="hero__word">LIZ</span>
          <span className="hero__line"></span>
        </div>
      </section>

      <div className="home-services-about-transition">
        <section className="home-services">
          <div className="home-services__content">
            <div className="home-services__header">
              <span className="home-services__eyebrow services-animate">
                Duas experiências
              </span>

              <h2 className="home-services__title services-animate">
                Entre a curadoria e a criação.
              </h2>
            </div>

            <div className="home-services__grid">
              <button
                type="button"
                className="service-card service-card--left"
                onClick={goToBrecho}
                aria-label="Explorar peças do Brechó"
              >
                <span className="service-card__number">01</span>

                <h3>Brechó</h3>

                <p>
                  Peças selecionadas com intenção, identidade e olhar editorial.
                  Cada escolha carrega uma história pronta para continuar.
                </p>

                <span className="service-card__link">Explorar peças</span>
              </button>

              <button
                type="button"
                className="service-card service-card--right"
                onClick={goToAtelie}
                aria-label="Conhecer criações do Ateliê"
              >
                <span className="service-card__number">02</span>

                <h3>Ateliê</h3>

                <p>
                  Criações autorais e ajustes pensados para valorizar quem
                  veste. Uma experiência feita com presença, forma e
                  significado.
                </p>

                <span className="service-card__link">Conhecer criações</span>
              </button>
            </div>
          </div>
        </section>

        <section className="home-about">
          <div className="home-about__decor home-about__decor--circle"></div>
          <div className="home-about__decor home-about__decor--line"></div>

          <div className="home-about__content">
            <div className="home-about__intro">
              <span className="home-about__eyebrow about-animate">
                Sobre a LIZ
              </span>

              <h2 className="home-about__title about-animate">
                Uma marca construída entre o tempo, a intenção e a identidade.
              </h2>
            </div>

            <div className="home-about__text">
              <p className="about-animate home-about__paragraph home-about__paragraph--one">
                A LIZ nasce do encontro entre o que já foi vivido e o que ainda
                será criado. Entre peças que carregam história e criações que
                surgem com propósito, cada detalhe é pensado para ir além do
                vestir.
              </p>

              <p className="about-animate home-about__paragraph home-about__paragraph--two">
                No brechó, a curadoria não é apenas estética. É sensível. Cada
                peça é escolhida pelo que transmite, pelo que comunica, pelo que
                permanece.
              </p>

              <p className="about-animate home-about__paragraph home-about__paragraph--three">
                No ateliê, o processo é outro. Mais íntimo, mais autoral. Aqui,
                a roupa nasce do corpo, da forma, da presença.
              </p>

              <p className="about-animate home-about__paragraph home-about__paragraph--four">
                A LIZ não acompanha tendências. A proposta é desacelerar,
                escolher melhor e vestir com intenção.
              </p>
            </div>

            <p className="home-about__closing about-animate">
              Porque estilo não é sobre o que está em alta. É sobre o que
              permanece em você.
            </p>
          </div>
        </section>
      </div>

      <section className="home-manifesto">
        <div className="home-manifesto__grid" aria-hidden="true"></div>

        <div className="home-manifesto__rings" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className="home-manifesto__top">
          <span className="manifesto-detail">Manifesto</span>
          <span className="manifesto-detail">Curadoria / Criação / Permanência</span>
        </div>

        <div className="home-manifesto__center">
          <h2 className="home-manifesto__title">
            <span className="manifesto-line">VESTIR É</span>
            <span className="manifesto-line manifesto-line--indent">ESCOLHER COM O QUE</span>
            <span className="manifesto-line manifesto-line--right">FAZER HISTÓRIA</span>
          </h2>
        </div>

        <div className="home-manifesto__bottom">
          <p className="manifesto-text">
            A LIZ nasce entre peças que carregam memória e criações feitas com
            intenção. Não seguimos tendências: buscamos presença, forma e identidade.
          </p>

          <div className="manifesto-meta">
            <span>01 / Tempo</span>
            <span>02 / Tendência</span>
            <span>03 / Identidade</span>
          </div>
        </div>
      </section>

<section className="portal-transition">

  <div className="portal-transition__sticky">

    <svg
      className="portal-transition__circle-svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <circle
        className="portal-transition__circle"
        cx="50"
        cy="50"
        r="0"
      />
    </svg>

    <div className="portal-transition__content">
      <h2>
        Vestir é atravessar o tempo...
      </h2>
    </div>

  </div>

  <div className="portal-transition__cta">

    <h2 className="portal-transition__cta-title">
      <span className="portal-transition__cta-line">
        <span>Então, não perca tempo.</span>
      </span>

      <span className="portal-transition__cta-line">
        <span>Oportunidades não esperam.</span>
      </span>
    </h2>

    <p>
      Consulte o catálogo, veja a disponibilidade ou fale conosco
      para encomendas e visitas à loja.
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

  <footer className="liz-footer">
  <div className="liz-footer__inner">
    <div className="liz-footer__brand">

      <p>
        Brechó & Ateliê — peças selecionadas com intenção, identidade e tempo.
      </p>
    </div>

    <nav className="liz-footer__nav" aria-label="Links institucionais">
      <a href="/politica-de-privacidade">Política de Privacidade</a>
      <a href="/informacoes-legais">Informações Legais</a>
      <a href="/localizacao">Localização</a>
    </nav>

    <div className="liz-footer__bottom">
      <span>© {new Date().getFullYear()} LIZ — Brechó & Ateliê. Todos os direitos reservados.</span>
    </div>
  </div>
</footer>

  </div>

</section>
  
    </main>
  );
}