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

// 🔥 Highlight sem movimento vertical (evita diagonal com transição de página)
export function animateHighlightChange(container: HTMLElement) {
  const items = container.querySelectorAll(".collection-item");

  gsap.fromTo(
    items,
    {
      opacity: 0,
      x: -18,
      y: 0,
      filter: "blur(6px)",
    },
    {
      opacity: 1,
      x: 0,
      y: 0,
      filter: "blur(0px)",
      duration: 0.65,
      stagger: 0.05,
      ease: "power3.out",
    }
  );
}