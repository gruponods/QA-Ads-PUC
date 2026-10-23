import * as React from 'react';

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  /** Visual style. Default "outline". "soft"=light-blue chip, "solid"=blue fill. */
  variant?: 'outline' | 'soft' | 'solid' | 'neutral';
  /** Optional Tabler icon name (no `ti-` prefix) shown before the label. */
  icon?: string;
}

/**
 * Pill tag / chip: always fully rounded, uppercase micro-label. Use "solid"
 * sparingly (it is a blue fill — keep total blue under ~15% of a slide).
 */
export function Tag(props: TagProps): JSX.Element;
