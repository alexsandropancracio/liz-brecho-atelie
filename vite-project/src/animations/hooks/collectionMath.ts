/* =======================================================
   VISIBLE CARDS
======================================================= */

export function getVisibleCards(
  container: HTMLDivElement | null
) {
  if (!container) return 1;

  const firstCard =
    container.querySelector<HTMLElement>(".collection-item");

  if (!firstCard) return 1;

  const containerWidth = container.clientWidth;

  const cardWidth = firstCard.offsetWidth;

  const styles = window.getComputedStyle(container);

  const gap = parseFloat(styles.columnGap || styles.gap || "0");

  const totalCardWidth = cardWidth + gap;

  return Math.max(
    1,
    Math.floor((containerWidth + gap) / totalCardWidth)
  );
}

/* =======================================================
   TOTAL GROUPS
======================================================= */

export function getTotalGroups(
  totalCards: number,
  visibleCards: number
) {
  return Math.max(
    1,
    Math.ceil(totalCards / visibleCards)
  );
}