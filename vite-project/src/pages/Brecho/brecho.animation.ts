import { gsap } from "../../animations/gsap";

export function animateBrechoPage() {
  const container = document.querySelector(".brecho");

  if (!container) return;

  const backButton = container.querySelector(".brecho-back");
  const eyebrow = container.querySelector(".brecho-hero__eyebrow");
  const titleLines = container.querySelectorAll(".brecho-hero__title span");
  const description = container.querySelector(".brecho-hero__description");
  const meta = container.querySelector(".brecho-hero__meta");
  const visual = container.querySelector(".brecho-hero__visual");

  const animations: gsap.core.Animation[] = [];

  // 🔥 Estado inicial (sem Y pra evitar diagonal)
  gsap.set([backButton, eyebrow, titleLines, description, meta, visual], {
    opacity: 0,
  });

  gsap.set([backButton, eyebrow, description, meta], {
    x: -36,
    y: 0,
    filter: "blur(8px)",
  });

  gsap.set(titleLines, {
    x: -72,
    y: 0,
    filter: "blur(10px)",
  });

  gsap.set(visual, {
    x: -56,
    y: 0,
    scale: 0.97,
    filter: "blur(14px)",
  });

  const tl = gsap.timeline({
    defaults: {
      ease: "power3.out",
    },
    delay: 0.25,
  });

  animations.push(tl);

  // 🔥 Entrada (100% horizontal)
  tl.to(backButton, {
    opacity: 1,
    x: 0,
    y: 0,
    filter: "blur(0px)",
    duration: 0.7,
  })
    .to(
      eyebrow,
      {
        opacity: 1,
        x: 0,
        y: 0,
        filter: "blur(0px)",
        duration: 0.65,
      },
      "-=0.35"
    )
    .to(
      titleLines,
      {
        opacity: 1,
        x: 0,
        y: 0,
        filter: "blur(0px)",
        duration: 1,
        stagger: 0.12,
      },
      "-=0.25"
    )
    .to(
      description,
      {
        opacity: 1,
        x: 0,
        y: 0,
        filter: "blur(0px)",
        duration: 0.8,
      },
      "-=0.5"
    )
    .to(
      meta,
      {
        opacity: 1,
        x: 0,
        y: 0,
        filter: "blur(0px)",
        duration: 0.75,
      },
      "-=0.5"
    )
    .to(
      visual,
      {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 1,
      },
      "-=0.85"
    );

  return () => {
    animations.forEach((animation) => animation.kill());
  };
}



export function animateHeroScroll() {
  const hero = document.querySelector(".brecho-hero");

  if (!hero) return;

  const eyebrow = hero.querySelector(".brecho-hero__eyebrow");
  const title = hero.querySelector(".brecho-hero__title");
  const description = hero.querySelector(".brecho-hero__description");
  const meta = hero.querySelector(".brecho-hero__meta");
  const visual = hero.querySelector(".brecho-hero__visual");

  const curtainLeft = hero.querySelector(
    ".brecho-hero__curtain-left"
  );

  const curtainRight = hero.querySelector(
    ".brecho-hero__curtain-right"
  );

  if (
    !eyebrow ||
    !title ||
    !description ||
    !meta ||
    !visual ||
    !curtainLeft ||
    !curtainRight
  ) {
    return;
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: "top top",

      // Ajuste fino depois entre 80% e 120%
      end: "bottom 20%",
      scrub: 1.2,

      // DEBUG
      // markers: true,
    },
  });

  /* =====================
     FASE 1
     TEXTO SOME
  ===================== */

  tl.to(
    [eyebrow, title, description, meta],
    {
      opacity: 0,
      y: -40,
      filter: "blur(16px)",
      stagger: 0.05,
      ease: "none",
    },
    0.45
  );

  /* =====================
     FASE 2
     IMAGEM SOME
  ===================== */

  tl.to(
    visual,
    {
      opacity: 0,
      scale: 1.08,
      filter: "blur(24px)",
      ease: "none",
    },
    0.55
  );

  /* =====================
     FASE 3
     CORTINA ABRE
  ===================== */

  tl.to(
    curtainLeft,
    {
      xPercent: -120,
      duration: 1,
      ease: "none",
    },
    0.85
  );

  tl.to(
    curtainRight,
    {
      xPercent: 120,
      duration: 1,
      ease: "none",
    },
    0.85
  );

  return () => {
    tl.kill();
  };
}


export function animateCollectionEntrance() {
  const collection = document.querySelector(".brecho-collection");

  if (!collection) return;

  const top = collection.querySelector(".collection-top");

  const filters = collection.querySelectorAll(
    ".collection-filters .filter-btn"
  );

  const groups = collection.querySelectorAll(
    ".collection-highlight-group"
  );

  const animations: gsap.core.Animation[] = [];

  /* =====================================
     HEADER DA COLLECTION
  ===================================== */

  const headerTl = gsap.timeline({
    scrollTrigger: {
      trigger: collection,
      start: "top 50%",
      end: "top 10%",
      scrub: true,
    },
  });

  /* ACERVO */

  headerTl.fromTo(
    top,
    {
      opacity: 0,
      y: 120,
      scale: 0.92,
      filter: "blur(30px)",
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      ease: "none",
      duration: 0.55,
    }
  );

  /* FILTROS */

  headerTl.fromTo(
    filters,
    {
      opacity: 0,
      y: 40,
      filter: "blur(20px)",
    },
    {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      stagger: 0.12,
      ease: "none",
      duration: 0.45,
    },
    0.25
  );

  animations.push(headerTl);

  /* =====================================
     CATEGORIAS
  ===================================== */

  groups.forEach((group) => {
    const groupHeader = group.querySelector(
      ".collection-highlight-group__header"
    );

    const cards = group.querySelectorAll(
      ".collection-item"
    );

    /* =====================================
       CARDS (INDEPENDENTE DO SCRUB)
    ===================================== */

    const cardsAnimation = gsap.fromTo(
      cards,
      {
        opacity: 0,
        x: 100,
        scale: 0.96,
        filter: "blur(16px)",
      },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        filter: "blur(0px)",

        stagger: 0.04,
        duration: 0.2,
        ease: "power3.out",

        scrollTrigger: {
          trigger: group,
          start: "top 75%",
          end: "bottom 30%",
          toggleActions: "play reverse play reverse",
        },
      }
    );

    animations.push(cardsAnimation);

    /* =====================================
       HEADER DA CATEGORIA
    ===================================== */

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: group,
        start: "top 85%",
        end: "bottom 25%",
        scrub: 1,
      },
    });

    tl.fromTo(
      groupHeader,
      {
        opacity: 0,
        y: 80,
        scale: 0.94,
        filter: "blur(24px)",
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        ease: "none",
        duration: 0.15,
      }
    );

    /* SEGURA VISÍVEL */

    tl.to(groupHeader, {
      opacity: 1,
      duration: 0.35,
      ease: "none",
    });

    /* SAÍDA */

    tl.to(
      groupHeader,
      {
        opacity: 0,
        y: -80,
        scale: 0.97,
        filter: "blur(24px)",
        ease: "none",
        duration: 0.35,
      },
      ">-0.1"
    );

    animations.push(tl);
  });

  return () => {
    animations.forEach((animation) => {
      animation.kill();
    });
  };
}

export function animateFilterChange() {
  const items = document.querySelectorAll(".collection-item");

  gsap.fromTo(
    items,
    {
      opacity: 0,
      x: 40,
      scale: 0.96,
      filter: "blur(10px)",
    },
    {
      opacity: 1,
      x: 0,
      scale: 1,
      filter: "blur(0px)",
      stagger: 0.04,
      duration: 0.6,
      ease: "power3.out",
    }
  );
}