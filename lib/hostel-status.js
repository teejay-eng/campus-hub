export function getHostelAvailability(availableSpaces, capacity) {
  if (availableSpaces <= 0) {
    return { label: "FULL", tone: "danger" };
  }
  const ratio = availableSpaces / capacity;
  if (ratio <= 0.2) {
    return { label: "LIMITED SPACE", tone: "warning" };
  }
  return { label: "AVAILABLE", tone: "success" };
}
