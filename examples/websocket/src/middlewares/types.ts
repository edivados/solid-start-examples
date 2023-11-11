export type DrawInstruction = {
  moveTo: { x: number, y: number },
  lineTo: { x: number, y: number },
  strokeStyle: string,
  lineWidth: number,
  lineCap: CanvasLineCap,
}

export type DrawMessage = {
  type: "draw",
  instruction: DrawInstruction
}

export type CountMessage = {
  type: "count",
  value: number
}

export type Messages = DrawMessage | CountMessage;
