import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { useRouteTransition } from "../../routes/RouteTransitionContext";
import {
  pageTransitionConfig,
  pageTransitionVariants,
} from "../../animations/pageTransitions";

type PageRouteWrapperProps = {
  children: ReactNode;
};

export function PageRouteWrapper({ children }: PageRouteWrapperProps) {
  const { direction, shouldAnimate, resetTransition } = useRouteTransition();

  return (
    <motion.div
      custom={{ direction, shouldAnimate }}
      variants={pageTransitionVariants}
      initial={shouldAnimate ? "initial" : false}
      animate="animate"
      exit="exit"
      transition={pageTransitionConfig}
      onAnimationComplete={() => {
        if (shouldAnimate) resetTransition();
      }}
      style={{
        position: "absolute",
        width: "100%",
        minHeight: "100vh",
        willChange: "transform, opacity, filter, clip-path",
      }}
    >
      {children}
    </motion.div>
  );
}