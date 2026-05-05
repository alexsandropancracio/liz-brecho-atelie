import { useEffect, useRef } from "react";
import { gsap } from "../gsap";

type GsapCallback = (el: HTMLDivElement) => void;

export const useGsap = (callback?: GsapCallback) => {
  const el = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!el.current) return;

    const ctx = gsap.context(() => {
      callback?.(el.current!);
    }, el);

    return () => {
      ctx.revert();
    };
  }, [callback]);

  return el;
};