export function snapToGrid(x: number, y: number): [number, number] {
  const snappedX = Math.round(x / 140) * 140;
  const snappedY = Math.round(y / 102) * 102;
  return [snappedX, snappedY];
}
