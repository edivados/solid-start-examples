import { JSX, createEffect, createMemo, createSignal } from "solid-js";

type DrawInstruction = {
  moveTo: { x: number, y: number },
  lineTo: { x: number, y: number },
  strokeStyle: string,
  lineWidth: number,
  lineCap: CanvasLineCap,
}

type CanvasOptions = {
  color?: string,
  onDraw: (instruction: DrawInstruction) => void
}

type CanvasReturn = [
  (props: JSX.CanvasHTMLAttributes<HTMLCanvasElement>) => JSX.Element,
  {
    colors: string[],
    color: string,
    setColor: (value: string) => void,
    randomColor: () => string,
    draw: (instruction: DrawInstruction) => void
  }
]

export default function (options: CanvasOptions): CanvasReturn {
  const [canvas, setCanvas] = createSignal<HTMLCanvasElement>();
  const context2D = createMemo(() => canvas()?.getContext("2d"));

  const colors = ["red", "blue", "green"];
  let color: string = options.color || randomColor();

  function randomColor() {
    return colors[Math.floor(Math.random() * 3)];
  }

  function setColor(value: string) {
    color = value;
  }

  function onDraw(instruction: DrawInstruction) {
    if (!context2D()) return;
    context2D()!.beginPath();
    context2D()!.moveTo(instruction.moveTo.x, instruction.moveTo.y);
    context2D()!.lineTo(instruction.lineTo.x, instruction.lineTo.y);
    context2D()!.strokeStyle = instruction.strokeStyle;
    context2D()!.lineWidth = instruction.lineWidth;
    context2D()!.lineCap = instruction.lineCap;
    context2D()!.stroke();
  }

  function onMouseMove(event: MouseEvent) {
    if (event.buttons) {
      const instruction = {
        moveTo: { x: event.offsetX, y: event.offsetY },
        lineTo: { x: event.offsetX, y: event.offsetY },
        strokeStyle: color,
        lineWidth: 5,
        lineCap: "round",
      } satisfies DrawInstruction;
      onDraw(instruction);
      options.onDraw(instruction);
    }
  }

  createEffect(() => {
    canvas()?.addEventListener("mousemove", onMouseMove);
  });

  return [
    (props) => <canvas {...props} ref={setCanvas} />, 
    {
      colors,
      get color() { return color },
      setColor,
      randomColor,
      draw: onDraw
    }
  ];
}
