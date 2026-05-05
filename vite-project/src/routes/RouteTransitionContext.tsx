import { createContext, useContext, useState } from "react";

type Direction = "left" | "right";

type RouteTransitionContextType = {
  direction: Direction;
  shouldAnimate: boolean;
  startTransition: (direction: Direction) => void;
  resetTransition: () => void;
};

const RouteTransitionContext = createContext<RouteTransitionContextType | null>(
  null
);

export function RouteTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [direction, setDirection] = useState<Direction>("right");
  const [shouldAnimate, setShouldAnimate] = useState(false);

  function startTransition(nextDirection: Direction) {
    setDirection(nextDirection);
    setShouldAnimate(true);
  }

  function resetTransition() {
    setShouldAnimate(false);
  }

  return (
    <RouteTransitionContext.Provider
      value={{ direction, shouldAnimate, startTransition, resetTransition }}
    >
      {children}
    </RouteTransitionContext.Provider>
  );
}

export function useRouteTransition() {
  const context = useContext(RouteTransitionContext);

  if (!context) {
    throw new Error(
      "useRouteTransition must be used inside RouteTransitionProvider"
    );
  }

  return context;
}