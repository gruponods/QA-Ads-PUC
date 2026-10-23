import * as React from 'react';

export interface CategoryChipProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  /** Category color 1–6: blue, cyan, violet, pink, green, orange. Keep one tone per category across the product. */
  tone?: 1 | 2 | 3 | 4 | 5 | 6;
  /** soft (tinted pill, default) · outline (hairline pill + color dot). */
  variant?: 'soft' | 'outline';
  /** Optional Tabler icon (replaces the dot in outline). */
  icon?: string;
  /** Count shown after the label (useful in filter bars). */
  count?: number;
  /** Filter-chip mode: pressed state when onClick is set. */
  selected?: boolean;
  onClick?: () => void;
}

/** Muted categorical chip for subjects/areas/types. Not for status (use StatusDot) or data (use ThresholdValue). */
export function CategoryChip(props: CategoryChipProps): JSX.Element;
