export type CollectionNavigationState = {
  visibleCards: number;
  totalGroups: number;
  activeGroup: number;
};

export type CategoryScrollData = {
  container: HTMLDivElement | null;
};

export type NavigationMap = Record<
  string,
  CollectionNavigationState
>;