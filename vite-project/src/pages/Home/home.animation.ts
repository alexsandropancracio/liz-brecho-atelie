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

  const title = document.querySelector(
    ".portal-transition__content h2"
  ) as HTMLElement | null;

  const cta = document.querySelector(
    ".portal-transition__cta"
  ) as HTMLElement | null;

  const ctaTitle = document.querySelector(
    ".portal-transition__cta h2"
  ) as HTMLElement | null;

  const ctaText = document.querySelector(
    ".portal-transition__cta p"
  ) as HTMLElement | null;

  const ctaButton = document.querySelector(
    ".portal-transition__button"
  ) as HTMLElement | null;

  if (
    !section ||
    !sticky ||
    !circle ||
    !content ||
    !title ||
    !cta ||
    !ctaTitle ||
    !ctaText ||
    !ctaButton
  ) {
    console.warn("Portal SVG circle transition: elementos não encontrados.");
    return;
  }

  const previousTrigger = ScrollTrigger.getById("portal-circle-sticky");
  previousTrigger?.kill(true);

  gsap.killTweensOf([
    circle,
    content,
    sticky,
    title,
    cta,
    ctaTitle,
    ctaText,
    ctaButton,
  ]);

  const ctx = gsap.context(() => {
    const mm = gsap.matchMedia();

    const portalEase = CustomEase.create(
      "lizPortalEase",
      "M0,0 C0.16,0.01 0.23,1 1,1"
    );

    const ctaEase = CustomEase.create(
      "lizCtaReveal",
      "M0,0 C0.19,1 0.22,1 1,1"
    );

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

      gsap.set(title, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        rotateX: 0,
        z: 0,
        filter: "blur(0px)",
        transformPerspective: 1000,
        transformOrigin: "center center",
      });

      gsap.set(sticky, {
        y: 0,
        clearProps: "transform",
      });

      gsap.set(cta, {
        autoAlpha: 0,
        y: 38,
        z: -120,
        scale: 0.96,
        rotateX: 8,
        filter: "blur(16px)",
        pointerEvents: "none",
        transformPerspective: 1200,
        transformOrigin: "center center",
      });

      gsap.set([ctaTitle, ctaText, ctaButton], {
        autoAlpha: 0,
        y: 34,
        z: -80,
        rotateX: 10,
        filter: "blur(14px)",
        transformPerspective: 1200,
        transformOrigin: "center center",
      });
    }

    /*
      DESKTOP
      Mantém o comportamento original, mas adiciona uma segunda cena
      para a CTA aparecer depois que o círculo domina a tela.
    */
    mm.add("(min-width: 769px)", () => {
      resetPortalState();

      gsap.set([ctaTitle, ctaText, ctaButton], {
  y: 0,
  z: 0,
  rotateX: 0,
  scale: 1,
});

gsap.set(ctaTitle, {
  autoAlpha: 0,
  scale: 0.985,
  filter: "blur(14px)",
});

gsap.set(ctaText, {
  autoAlpha: 0,
  scale: 0.99,
  filter: "blur(10px)",
});

gsap.set(ctaButton, {
  autoAlpha: 0,
  scale: 0.96,
  filter: "blur(8px)",
});

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

      tl.to(
        circle,
        {
          attr: {
            r: 3,
          },
          duration: 0.1,
          ease: "none",
        },
        0
      );

      tl.to(
        circle,
        {
          attr: {
            r: 18,
          },
          duration: 0.22,
          ease: "none",
        },
        0.1
      );

      tl.to(
        content,
        {
          autoAlpha: 0,
          scale: 0.12,
          y: -24,
          filter: "blur(12px)",
          duration: 0.4,
          ease: "none",
        },
        0.08
      );

      tl.to(
        title,
        {
          autoAlpha: 0,
          scale: 0.12,
          y: -34,
          z: -120,
          rotateX: -10,
          filter: "blur(14px)",
          duration: 0.42,
          ease: "none",
        },
        0.08
      );

      tl.to(
        circle,
        {
          attr: {
            r: 82,
          },
          duration: 0.58,
          ease: portalEase,
        },
        0.28
      );

      tl.to(
        cta,
        {
          autoAlpha: 1,
          y: 0,
          z: 0,
          scale: 1,
          rotateX: 0,
          filter: "blur(0px)",
          duration: 0.36,
          ease: ctaEase,
        },
        0.68
      );

      tl.to(
  cta,
  {
    autoAlpha: 1,
    pointerEvents: "auto",
    duration: 0.08,
    ease: "none",
  },
  0.38
);

tl.fromTo(
  ctaTitle,
  {
    autoAlpha: 0,
    filter: "blur(14px)",
  },
  {
    autoAlpha: 1,
    filter: "blur(0px)",
    duration: 0.18,
    ease: "none",
  },
  0.44
);

tl.fromTo(
  ctaText,
  {
    autoAlpha: 0,
    filter: "blur(10px)",
  },
  {
    autoAlpha: 1,
    filter: "blur(0px)",
    duration: 0.18,
    ease: "none",
  },
  0.62
);

tl.fromTo(
  ctaButton,
  {
    autoAlpha: 0,
    filter: "blur(8px)",
  },
  {
    autoAlpha: 1,
    filter: "blur(0px)",
    duration: 0.18,
    ease: "none",
  },
  0.78  
);

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
      Continua sem pin, sem fixed e sem sticky real.
      A camada visual ainda é movida com quickSetter.
    */
mm.add("(max-width: 768px)", () => {
  resetPortalState();

  gsap.set(cta, {
  autoAlpha: 0,
  y: 0,
  z: 0,
  rotateX: 0,
  scale: 1,
  filter: "blur(0px)",
  pointerEvents: "none",
});

gsap.set(ctaTitle, {
  autoAlpha: 0,
  y: 0,
  z: 0,
  rotateX: 0,
  scale: 1,
  filter: "blur(14px)",
});

gsap.set(ctaText, {
  autoAlpha: 0,
  y: 0,
  z: 0,
  rotateX: 0,
  scale: 1,
  filter: "blur(10px)",
});

gsap.set(ctaButton, {
  autoAlpha: 0,
  y: 0,
  z: 0,
  rotateX: 0,
  scale: 1,
  filter: "blur(8px)",
});

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
    MOBILE REFINADO:
    O círculo preenche a tela mais cedo.
    Depois ele continua crescendo levemente para garantir que não apareça sobra branca.
  */
  tl.to(
  circle,
  {
    attr: {
      r: 190,
    },
    duration: 1,
    ease: "none",
  },
  0
);

tl.to(
  title,
  {
    autoAlpha: 0,
    scale: 0.12,
    filter: "blur(10px)",
    duration: 0.38,
    ease: "none",
  },
  0
);

tl.to(
  content,
  {
    autoAlpha: 0,
    scale: 0.22,
    filter: "blur(10px)",
    duration: 0.36,
    ease: "none",
  },
  0
);

tl.to(
  cta,
  {
    autoAlpha: 1,
    pointerEvents: "auto",
    duration: 0.08,
    ease: "none",
  },
  0.38
);

tl.fromTo(
  ctaTitle,
  {
    autoAlpha: 0,
    filter: "blur(14px)",
  },
  {
    autoAlpha: 1,
    filter: "blur(0px)",
    duration: 0.18,
    ease: "none",
  },
  0.44
);

tl.fromTo(
  ctaText,
  {
    autoAlpha: 0,
    filter: "blur(10px)",
  },
  {
    autoAlpha: 1,
    filter: "blur(0px)",
    duration: 0.18,
    ease: "none",
  },
  0.62
);

tl.fromTo(
  ctaButton,
  {
    autoAlpha: 0,
    filter: "blur(8px)",
  },
  {
    autoAlpha: 1,
    filter: "blur(0px)",
    duration: 0.18,
    ease: "none",
  },
  0.78
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