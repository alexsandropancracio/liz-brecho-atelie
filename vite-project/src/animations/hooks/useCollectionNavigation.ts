
import { useCallback, useEffect, useRef, useState } from "react";

import {
  getVisibleCards,
  getTotalGroups,
} from "./collectionMath";

export type CollectionNavigationState = {
  visibleCards: number;
  totalGroups: number;
  activeGroup: number;
};

type NavigationMap = Record<string, CollectionNavigationState>;

function getCardStep(container: HTMLDivElement): number {
  const firstCard = container.querySelector<HTMLElement>(".collection-item");

  if (!firstCard) return 1;

  const styles = window.getComputedStyle(container);
  const gap = parseFloat(styles.columnGap || styles.gap || "0");

  return firstCard.offsetWidth + gap;
}

function getActiveGroup(
  container: HTMLDivElement,
  visibleCards: number,
  totalGroups: number
): number {
  if (totalGroups <= 1) return 0;

  const maxScroll = container.scrollWidth - container.clientWidth;

  if (maxScroll <= 0) return 0;

  const pageWidth = getCardStep(container) * visibleCards;

  if (pageWidth <= 0) return 0;

  // Encontra o grupo cujo ponto de destino está mais próximo
  // da posição atual, inclusive quando o último grupo é parcial.
  let closestGroup = 0;
  let smallestDistance = Infinity;

  for (let group = 0; group < totalGroups; group++) {
    const targetPosition = Math.min(group * pageWidth, maxScroll);
    const distance = Math.abs(container.scrollLeft - targetPosition);

    if (distance < smallestDistance) {
      smallestDistance = distance;
      closestGroup = group;
    }
  }

  return closestGroup;
}

export function useCollectionNavigation() {
  const categoryScrollRefs = useRef<
    Record<string, HTMLDivElement | null>
  >({});

  const callbackRefs = useRef<
    Record<string, (element: HTMLDivElement | null) => void>
  >({});

  const totalCardsByCategory = useRef<Record<string, number>>({});

  const [navigation, setNavigation] = useState<NavigationMap>({});

  const registerContainer = useCallback(
    (
      category: string,
      container: HTMLDivElement | null,
      totalCards: number
    ) => {
      categoryScrollRefs.current[category] = container;
      totalCardsByCategory.current[category] = totalCards;

      if (!container) return;

      const visibleCards = getVisibleCards(container);
      const totalGroups = getTotalGroups(totalCards, visibleCards);
      const activeGroup = getActiveGroup(
        container,
        visibleCards,
        totalGroups
      );

      setNavigation((previous) => {
        const current = previous[category];

        if (
          current &&
          current.visibleCards === visibleCards &&
          current.totalGroups === totalGroups &&
          current.activeGroup === activeGroup
        ) {
          return previous;
        }

        return {
          ...previous,
          [category]: {
            visibleCards,
            totalGroups,
            activeGroup,
          },
        };
      });
    },
    []
  );

  const getContainerRef = useCallback(
    (category: string, totalCards: number) => {
      totalCardsByCategory.current[category] = totalCards;

      const existingCallback = callbackRefs.current[category];

      if (existingCallback) return existingCallback;

      const callback = (element: HTMLDivElement | null) => {
        registerContainer(
          category,
          element,
          totalCardsByCategory.current[category] ?? 0
        );
      };

      callbackRefs.current[category] = callback;

      return callback;
    },
    [registerContainer]
  );

  // Desliza até o grupo escolhido.
  const scrollToGroup = useCallback(
    (category: string, groupIndex: number) => {
      const container = categoryScrollRefs.current[category];
      const currentNavigation = navigation[category];

      if (!container || !currentNavigation) return;

      const { visibleCards, totalGroups } = currentNavigation;

      if (groupIndex < 0 || groupIndex >= totalGroups) return;

      const pageWidth = getCardStep(container) * visibleCards;
      const maxScroll = container.scrollWidth - container.clientWidth;
      const targetPosition = Math.min(
        groupIndex * pageWidth,
        maxScroll
      );

      container.scrollTo({
        left: targetPosition,
        behavior: "smooth",
      });
    },
    [navigation]
  );

  // Atualiza o número ativo durante o arraste ou scroll manual.
  const updateActiveGroup = useCallback((category: string) => {
    const container = categoryScrollRefs.current[category];

    if (!container) return;

    const totalCards = totalCardsByCategory.current[category] ?? 0;
    const visibleCards = getVisibleCards(container);
    const totalGroups = getTotalGroups(totalCards, visibleCards);

    const activeGroup = getActiveGroup(
      container,
      visibleCards,
      totalGroups
    );

    setNavigation((previous) => {
      const current = previous[category];

      if (
        current &&
        current.visibleCards === visibleCards &&
        current.totalGroups === totalGroups &&
        current.activeGroup === activeGroup
      ) {
        return previous;
      }

      return {
        ...previous,
        [category]: {
          visibleCards,
          totalGroups,
          activeGroup,
        },
      };
    });
  }, []);

  // Recalcula os grupos quando a largura da janela muda.
  const refreshNavigation = useCallback(() => {
    Object.entries(categoryScrollRefs.current).forEach(
      ([category, container]) => {
        if (!container) return;

        registerContainer(
          category,
          container,
          totalCardsByCategory.current[category] ?? 0
        );
      }
    );
  }, [registerContainer]);

  useEffect(() => {
    window.addEventListener("resize", refreshNavigation);

    return () => {
      window.removeEventListener("resize", refreshNavigation);
    };
  }, [refreshNavigation]);

  return {
    navigation,
    getContainerRef,
    scrollToGroup,
    updateActiveGroup,
  };
}