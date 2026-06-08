import { useLayoutEffect } from "react";

import { ScrollSmoother } from "../../animations/gsap";

export function useScrollSmoother() {
  useLayoutEffect(() => {
    const isDesktop = window.matchMedia(
      "(min-width: 1024px)"
    ).matches;

    if (!isDesktop) return;

    const existing = ScrollSmoother.get();

    if (existing) {
      existing.kill();
    }

    const smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",

      smooth: 1.4,

      effects: true,

      normalizeScroll: true,
    });

    return () => {
      smoother.kill();
    };
  }, []);
}