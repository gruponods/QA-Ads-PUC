import * as React from 'react';

export interface DotGlobeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Max diameter in px (shrinks to container). Default 420. */
  size?: number;
  /** [lon, lat] points drawn as blue dots with a soft pulse. Default: NODS cities in the Americas. */
  markers?: [number, number][];
  /** Resting view center [lon, lat]. Default [-66, -8] (South + Central America). */
  center?: [number, number];
  /** Sway amplitude in degrees of longitude (it sways, it does not spin). Default 26. */
  sway?: number;
  /** Speed multiplier. Default 1. */
  speed?: number;
  /** Dot grid spacing in degrees (smaller = denser). Default 2.4. */
  dotStep?: number;
  /** Base dot radius in px. Default 1.25. */
  dotSize?: number;
  /** Hairline sphere outline. Default true. */
  outline?: boolean;
}

/** Calm dotted globe from real land geometry; depth-faded dots, pulsing blue markers; theme-aware canvas. */
export function DotGlobe(props: DotGlobeProps): JSX.Element;
