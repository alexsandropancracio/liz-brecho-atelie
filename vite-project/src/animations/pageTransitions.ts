import type { Transition, Variants } from "framer-motion";

type Direction = "left" | "right";

type CustomTransition = {
  direction: Direction;
  shouldAnimate: boolean;
};

const getInitialX = (direction: Direction) => {
  return direction === "right" ? "-12%" : "12%";
};

const getExitX = (direction: Direction) => {
  return direction === "right" ? "12%" : "-12%";
};

export const pageTransitionVariants: Variants = {
  initial: ({ direction, shouldAnimate }: CustomTransition) => ({
    x: shouldAnimate ? getInitialX(direction) : "0%",
    opacity: shouldAnimate ? 0 : 1,
    filter: shouldAnimate ? "blur(14px)" : "blur(0px)",
  }),

  animate: {
    x: "0%",
    opacity: 1,
    filter: "blur(0px)",
  },

  exit: ({ direction, shouldAnimate }: CustomTransition) => ({
    x: shouldAnimate ? getExitX(direction) : "0%",
    opacity: shouldAnimate ? 0 : 1,
    filter: shouldAnimate ? "blur(14px)" : "blur(0px)",
  }),
};

export const pageTransitionConfig: Transition = {
  duration: 1.05,
  ease: [0.83, 0, 0.17, 1],
};