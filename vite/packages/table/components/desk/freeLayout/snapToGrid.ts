export function snapToGrid(x: number, y: number): [number, number] {
  const snappedX = Math.round(x / (140 + 20)) * (140 + 20);
  const snappedY = Math.round(y / (102 + 20)) * (102 + 20);
  return [snappedX, snappedY];
}
