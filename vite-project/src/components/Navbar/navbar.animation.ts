import { gsap } from "../../animations/gsap";

export function animateNavbar(container: HTMLElement) {
  const left = container.querySelector(".nav-left");
  const logo = container.querySelector(".nav-logo");
  const right = container.querySelector(".nav-right");

  if (!left || !logo || !right) return;

  gsap.set([container, left.children, logo, right.children], {
    opacity: 1,
    y: 0,
  });

  const tl = gsap.timeline();

  tl.from(container, {
    opacity: 0,
    y: -40,
    duration: 0.8,
    ease: "power2.out",
  })
    .from(
      left.children,
      {
        opacity: 0,
        y: -20,
        stagger: 0.08,
        duration: 0.5,
      },
      "-=0.4"
    )
    .from(
      logo,
      {
        opacity: 0,
        scale: 0.95,
        duration: 0.5,
      },
      "-=0.4"
    )
    .from(
      right.children,
      {
        opacity: 0,
        y: -20,
        stagger: 0.08,
        duration: 0.5,
      },
      "-=0.4"
    );
}

export function animateMobileMenuOpen(
  overlay: HTMLElement,
  links: HTMLElement[],
  button: HTMLElement
) {
  gsap.killTweensOf([overlay, links, button]);

  gsap.to(button, {
    rotate: 90,
    scale: 1.1,
    duration: 0.4,
    ease: "power2.out",
  });

  gsap.fromTo(
    overlay,
    {
      autoAlpha: 0,
      clipPath: "inset(0% 0% 100% 0%)",
      pointerEvents: "none",
    },
    {
      autoAlpha: 1,
      clipPath: "inset(0% 0% 0% 0%)",
      pointerEvents: "auto",
      duration: 0.7,
      ease: "power4.out",
    }
  );

  gsap.fromTo(
    links,
    {
      opacity: 0,
      y: 40,
      scale: 0.95,
      filter: "blur(8px)",
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.out",
      delay: 0.2,
    }
  );
}

export function animateMobileMenuClose(
  overlay: HTMLElement,
  links: HTMLElement[],
  button: HTMLElement
) {
  gsap.killTweensOf([overlay, links, button]);

  gsap.to(button, {
    rotate: 0,
    scale: 1,
    duration: 0.35,
    ease: "power2.out",
  });

  gsap.to(links, {
    opacity: 0,
    y: 20,
    scale: 0.97,
    filter: "blur(6px)",
    duration: 0.3,
    stagger: 0.05,
    ease: "power2.in",
  });

  gsap.to(overlay, {
    autoAlpha: 0,
    clipPath: "inset(0% 0% 100% 0%)",
    pointerEvents: "none",
    duration: 0.6,
    ease: "power4.inOut",
    delay: 0.1,
  });
}