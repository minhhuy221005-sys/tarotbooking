/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FACEBOOK_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module 'canvas-confetti' {
  export type Options = {
    angle?: number;
    spread?: number;
    startVelocity?: number;
    decay?: number;
    gravity?: number;
    drift?: number;
    ticks?: number;
    origin?: {
      x?: number;
      y?: number;
    };
    colors?: string[];
    shapes?: string[];
    scalar?: number;
    zIndex?: number;
    disableForReducedMotion?: boolean;
    particleCount?: number;
  };

  export default function confetti(options?: Options): Promise<null>;
}
