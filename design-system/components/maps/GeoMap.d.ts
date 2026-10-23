import * as React from 'react';

export interface GeoMapCategory {
  key: string;
  label: string;
  /** solid · diagonal · dots · cross · horizontal · tint. Default solid. */
  pattern?: 'solid' | 'diagonal' | 'dots' | 'cross' | 'horizontal' | 'tint';
}

export interface GeoMapProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Framing. Default "americas". */
  region?: 'americas' | 'north' | 'central' | 'latam' | 'south';
  /** Values keyed by ISO 3166-1 numeric id as a 3-digit string ("032" = Argentina). Numbers for scale mode, category keys for category mode. */
  data?: Record<string, number | string>;
  /** scale = 5-step blue ramp by value · category = blue patterns per category. Default scale. */
  mode?: 'scale' | 'category';
  /** Category definitions for mode="category". */
  categories?: GeoMapCategory[];
  /** Upper bounds of the first 4 buckets (scale mode). Default: 20/40/60/80% of max. */
  steps?: number[];
  /** Draw country names where they fit. Default true. */
  labels?: boolean;
  /** Label font size in screen px (stays constant as the map scales). Default 12. */
  labelSize?: number;
  /** Format a value for the tooltip. Default es-AR number. */
  valueFormat?: (v: number) => string;
  /** Unit text after the value in the tooltip, e.g. "alumnos". */
  valueLabel?: string;
  /** Bold label at the start of the legend. */
  legendTitle?: string;
  /** Show legend. Default true. */
  legend?: boolean;
  /** Outlined (selected) country id. */
  selected?: string;
  /** Click handler; enables pointer cursor on countries in the Americas. */
  onSelect?: (id: string) => void;
  /** Override / add Spanish names by id. */
  names?: Record<string, string>;
}

/**
 * Map of the Americas from real Natural Earth country boundaries (d3-geo).
 * Page must load the pinned d3@7.9.0 and topojson-client@3.1.0 script tags.
 */
export function GeoMap(props: GeoMapProps): JSX.Element;
