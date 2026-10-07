declare module "matter-js" {
  const Matter: {
    Engine: {
      create: () => { world: unknown; gravity: { y: number } };
      clear: (engine: unknown) => void;
    };
    Runner: { create: () => unknown; run: (runner: unknown, engine: unknown) => void; stop: (runner: unknown) => void };
    Bodies: {
      rectangle: (
        x: number,
        y: number,
        w: number,
        h: number,
        options?: Record<string, unknown>,
      ) => { position: { x: number; y: number }; angle: number };
    };
    Composite: { add: (world: unknown, body: unknown) => void };
    Mouse: { create: (element: HTMLElement) => unknown };
    MouseConstraint: { create: (engine: unknown, options: Record<string, unknown>) => unknown };
  };
  export default Matter;
}
