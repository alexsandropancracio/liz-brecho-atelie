import { gsap } from "../../animations/gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.config({
  ignoreMobileResize: true,
});

gsap.registerPlugin(CustomEase);

type AnimateHomeHeroOptions = {
  servicesReturnAnimation?: boolean;
  servicesReturnFrom?: "brecho" | "atelie";
};

export function animateHomeHero(options: AnimateHomeHeroOptions = {}) {
  const container = document.querySelector(".home");

  if (!container) return;

  const eyebrow = container.querySelector(".hero__eyebrow");
  const titleLines = container.querySelectorAll(".hero__title span");
  const description = container.querySelector(".hero__description");
  const visual = container.querySelector(".hero__visual");
  const lines = container.querySelectorAll(".hero__line");
  const word = container.querySelector(".hero__word");

  const servicesSection = container.querySelector(".home-services");
  const servicesTransition = container.querySelector(
    ".home-services-about-transition"
  );
  const servicesContent = container.querySelector(".home-services__content");
  const servicesItems = container.querySelectorAll(".services-animate");
  const servicesGrid = container.querySelector(".home-services__grid");
  const serviceCards = container.querySelectorAll(".service-card");

  const aboutItems = container.querySelectorAll(".about-animate");

  const animations: gsap.core.Animation[] = [];
  const observers: IntersectionObserver[] = [];
  const scrollTriggers: ScrollTrigger[] = [];

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  function createServicesSmokeTransition() {
  if (
    !servicesTransition ||
    !servicesSection ||
    !servicesContent ||
    prefersReducedMotion ||
    isMobile
  ) {
    return;
  }

  const servicesSmokeTl = gsap.timeline({
    scrollTrigger: {
      trigger: servicesTransition,
      start: "top center",
      end: "bottom bottom",
      scrub: 1.2,
      invalidateOnRefresh: true,
    },
  });

  animations.push(servicesSmokeTl);

  if (servicesSmokeTl.scrollTrigger) {
    scrollTriggers.push(servicesSmokeTl.scrollTrigger);
  }

  servicesSmokeTl
    .to(
      servicesContent,
      {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.25,
        ease: "none",
      }
    )
    .to(
      servicesContent,
      {
        opacity: 0,
        y: -80,
        scale: 0.96,
        filter: "blur(18px)",
        duration: 0.75,
        ease: "none",
      }
    );

  window.setTimeout(() => {
    ScrollTrigger.refresh();
  }, 120);
}

  // HERO
  gsap.set([eyebrow, titleLines, description, visual, lines, word], {
    opacity: 0,
  });

  gsap.set(titleLines, {
    y: 80,
    filter: "blur(10px)",
  });

  gsap.set(description, {
    y: 28,
  });

  gsap.set(visual, {
    scaleY: 0.96,
  });

  gsap.set(lines, {
    scale: 0,
    transformOrigin: "center",
  });

  gsap.set(word, {
    y: 24,
    letterSpacing: "0.22em",
  });

  const heroTl = gsap.timeline({
    defaults: {
      ease: "power3.out",
    },
  });

  animations.push(heroTl);

  heroTl
    .to(eyebrow, {
      opacity: 1,
      duration: 0.6,
    })
    .to(
      titleLines,
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1,
        stagger: 0.12,
      },
      "-=0.2"
    )
    .to(
      description,
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
      },
      "-=0.45"
    )
    .to(
      visual,
      {
        opacity: 1,
        scaleY: 1,
        duration: 0.8,
      },
      "-=0.9"
    )
    .to(
      lines,
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.12,
      },
      "-=0.5"
    )
    .to(
      word,
      {
        opacity: 0.08,
        y: 0,
        letterSpacing: "0.12em",
        duration: 1,
      },
      "-=0.6"
    );

  // SERVICES ENTRANCE
  if (servicesSection && servicesItems.length > 0 && serviceCards.length > 0) {
    let hasAnimatedServices = false;

    if (options.servicesReturnAnimation) {
      const servicesReturnX =
        options.servicesReturnFrom === "atelie" ? -72 : 72;

      const servicesGridReturnX =
        options.servicesReturnFrom === "atelie" ? -120 : 120;

      gsap.set(servicesContent, {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        filter: "blur(0px)",
      });

      gsap.set(servicesItems, {
        opacity: 0,
        x: servicesReturnX,
        y: 0,
        filter: "blur(10px)",
      });

      gsap.set(servicesGrid, {
        opacity: 0,
        x: servicesGridReturnX,
        y: 0,
        scale: 0.985,
        filter: "blur(14px)",
      });

      gsap.set(serviceCards, {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
      });

      const servicesReturnTl = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
        delay: 0.25,
        onComplete: () => {
          gsap.set([servicesItems, servicesGrid, serviceCards], {
            clearProps: "x,y,filter,opacity,scale",
          });

          createServicesSmokeTransition();
        },
      });

      animations.push(servicesReturnTl);

      servicesReturnTl
        .to(servicesItems, {
          opacity: 1,
          x: 0,
          filter: "blur(0px)",
          duration: 0.85,
          stagger: 0.1,
        })
        .to(
          servicesGrid,
          {
            opacity: 1,
            x: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 1,
          },
          "-=0.45"
        );
    } else {
      gsap.set(servicesItems, {
        opacity: 0,
        y: 36,
        filter: "blur(8px)",
      });

      gsap.set(serviceCards, {
        opacity: 0,
        y: 56,
        scale: 0.97,
        filter: "blur(8px)",
      });

      const servicesObserver = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting || hasAnimatedServices) return;

          hasAnimatedServices = true;

          gsap.to(servicesItems, {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
          });

          gsap.to(serviceCards, {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.9,
            stagger: 0.14,
            ease: "power3.out",
            delay: 0.2,
            onComplete: () => {
              gsap.set([...servicesItems, ...serviceCards], {
                clearProps: "x,y,filter,opacity,scale",
              });
            },
          });

          servicesObserver.unobserve(servicesSection);
        },
        {
          threshold: 0.25,
        }
      );

      servicesObserver.observe(servicesSection);
      observers.push(servicesObserver);

      createServicesSmokeTransition();
    }
  } else {
    createServicesSmokeTransition();
  }

  // ABOUT
  if (aboutItems.length > 0) {
    aboutItems.forEach((item, index) => {
      const direction = index % 2 === 0 ? -32 : 32;

      gsap.set(item, {
        opacity: 0,
        x: direction,
        scale: 0.985,
        clipPath: "inset(0% 12% 0% 12%)",
      });

      const aboutObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            gsap.to(item, {
              opacity: 1,
              x: 0,
              scale: 1,
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.15,
              ease: "expo.out",
            });
          } else {
            gsap.to(item, {
              opacity: 0,
              x: direction,
              scale: 0.985,
              clipPath: "inset(0% 12% 0% 12%)",
              duration: 0.55,
              ease: "power2.out",
            });
          }
        },
        {
          threshold: 0.28,
        }
      );

      aboutObserver.observe(item);
      observers.push(aboutObserver);
    });
  }

const manifestoSection = container.querySelector(".home-manifesto");
const manifestoGrid = container.querySelector(".home-manifesto__grid");
const manifestoRings = container.querySelectorAll(".home-manifesto__rings span");
const manifestoDetails = container.querySelectorAll(
  ".manifesto-detail, .manifesto-meta span"
);
const manifestoLines = container.querySelectorAll(".manifesto-line");
const manifestoText = container.querySelector(".manifesto-text");

if (manifestoSection && manifestoLines.length > 0) {
  const manifestoEase = CustomEase.create(
    "manifestoEditorialEase",
    "0.76, 0, 0.24, 1"
  );

  gsap.set(manifestoGrid, {
    opacity: 0,
  });

  gsap.set(manifestoRings, {
    opacity: 0,
    scale: 0.72,
    x: 0,
    y: 0,
    filter: "blur(10px)",
    transformOrigin: "50% 50%",
  });


  gsap.set(manifestoLines, {
    opacity: 0,
    yPercent: 120,
    filter: "blur(8px)",
    clipPath: "inset(0% 0% 100% 0%)",
  });

  gsap.set(manifestoDetails, {
    opacity: 0,
    x: -24,
    filter: "blur(6px)",
  });

  gsap.set(manifestoText, {
    opacity: 0,
    x: 32,
    filter: "blur(8px)",
  });

  const manifestoTl = gsap.timeline({
    scrollTrigger: {
      trigger: manifestoSection,
      start: "top 100%",
      end: "center 70%",
      scrub: 1.2,
      invalidateOnRefresh: true,
    },
  });

  animations.push(manifestoTl);

  if (manifestoTl.scrollTrigger) {
    scrollTriggers.push(manifestoTl.scrollTrigger);
  }

  manifestoTl
    .to(
      manifestoGrid,
      {
        opacity: 0.35,
        ease: "none",
      },
      0
    )

    .to(
      manifestoRings,
      {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        stagger: 0.08,
        ease: manifestoEase,
      },
      0.08
    )

    .to(
      manifestoLines,
      {
        opacity: 1,
        yPercent: 0,
        filter: "blur(0px)",
        clipPath: "inset(0% 0% 0% 0%)",
        stagger: 0.08,
        ease: manifestoEase,
      },
      0.34
    )

    .to(
      manifestoDetails,
      {
        opacity: 1,
        x: 0,
        filter: "blur(0px)",
        stagger: 0.05,
        ease: manifestoEase,
      },
      0.62
    )

    .to(
      manifestoText,
      {
        opacity: 1,
        x: 0,
        filter: "blur(0px)",
        ease: manifestoEase,
      },
      0.72
    );
}



  return () => {
    animations.forEach((animation) => animation.kill());

    observers.forEach((observer) => {
      observer.disconnect();
    });

    scrollTriggers.forEach((trigger) => {
      trigger.kill();
    });
  };
}

export function animatePortalTransition() {
  const section = document.querySelector(
    ".portal-transition"
  ) as HTMLElement | null;

  const sticky = document.querySelector(
    ".portal-transition__sticky"
  ) as HTMLElement | null;

  const circle = document.querySelector(
    ".portal-transition__circle"
  ) as SVGCircleElement | null;

  const content = document.querySelector(
    ".portal-transition__content"
  ) as HTMLElement | null;

  if (!section || !sticky || !circle || !content) {
    console.warn("Portal SVG circle transition: elementos não encontrados.");
    return;
  }

  const previousTrigger = ScrollTrigger.getById("portal-circle-sticky");
  previousTrigger?.kill(true);

  gsap.killTweensOf([circle, content, sticky]);

  const ctx = gsap.context(() => {
    const mm = gsap.matchMedia();

    function resetPortalState() {
      gsap.set(circle, {
        attr: {
          cx: 50,
          cy: 50,
          r: 0,
        },
        fill: "#050505",
      });

      gsap.set(content, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
      });

      gsap.set(sticky, {
        y: 0,
        clearProps: "transform",
      });
    }

    /*
      DESKTOP
      Mantém o comportamento original.
    */
    mm.add("(min-width: 769px)", () => {
      resetPortalState();

      const tl = gsap.timeline({
        scrollTrigger: {
          id: "portal-circle-sticky",
          trigger: section,
          start: "top top",
          end: "center 80%",
          scrub: true,
          markers: false,
          invalidateOnRefresh: true,
        },
      });

      tl.to(circle, {
        attr: {
          r: 3,
        },
        duration: 0.12,
        ease: "none",
      });

      tl.to(circle, {
        attr: {
          r: 18,
        },
        duration: 0.25,
        ease: "none",
      });

      tl.to(
        content,
        {
          autoAlpha: 0,
          scale: 0.1,
          filter: "blur(10px)",
          duration: 0.4,
          ease: "none",
        },
        0.08
      );

      tl.to(circle, {
        attr: {
          r: 80,
        },
        duration: 0.63,
        ease: "none",
      });

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });

      return () => {
        tl.scrollTrigger?.kill(true);
        tl.kill();
      };
    });

    /*
      MOBILE
      Simula a viewport parada movendo a camada visual junto com o scroll.
      Esse foi o caminho que funcionou no seu projeto.
    */
mm.add("(max-width: 768px)", () => {
  resetPortalState();

  const mobileEnd = () => {
    const scrollDistance = section.offsetHeight - window.innerHeight;
    return `+=${scrollDistance}`;
  };

  const setStickyY = gsap.quickSetter(sticky, "y", "px");

 const updateStickyPosition = (self: ScrollTrigger) => {
  const distance = self.scroll() - self.start;
  const maxDistance = self.end - self.start;

  const rawY = gsap.utils.clamp(0, maxDistance, distance);
  const y = Math.round(rawY);

  setStickyY(y);
  };

  const tl = gsap.timeline({
    scrollTrigger: {
      id: "portal-circle-sticky",
      trigger: section,
      start: "top top",
      end: mobileEnd,
      scrub: true,
      markers: false,
      invalidateOnRefresh: true,
      anticipatePin: 1,

      onUpdate: updateStickyPosition,
      onRefresh: updateStickyPosition,

      onLeaveBack: () => {
        setStickyY(0);
      },
    },
  });

  /*
    Agora o círculo cresce de forma contínua durante a timeline inteira.
    Ele não vai mais "parar no meio".
  */
  tl.to(
    circle,
    {
      attr: {
        r: 140,
      },
      duration: 1,
      ease: "none",
    },
    0
  );

  /*
    Agora o título começa a animar logo quando o círculo começa a crescer.
    Se quiser começar instantaneamente, use 0.
    Se quiser um pequeno respiro, use 0.04 ou 0.06.
  */
  tl.to(
    content,
    {
      autoAlpha: 0,
      scale: 0.20,
      filter: "blur(8px)",
      duration: 0.38,
      ease: "none",
    },
    0.00
  );

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  });

  document.fonts?.ready.then(() => {
    ScrollTrigger.refresh();
  });

  return () => {
    setStickyY(0);

    tl.scrollTrigger?.kill(true);
    tl.kill();
  };
});

    return () => {
      mm.revert();
    };
  }, section);

  return () => {
    ctx.revert();
  };
}