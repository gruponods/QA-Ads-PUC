import * as React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Tabler icon name — rendered in a soft-blue rounded chip at the top. */
  icon?: string;
  /** Custom node in the icon chip instead of `icon`. */
  iconNode?: React.ReactNode;
  /** Small uppercase label above the title. */
  eyebrow?: string;
  title?: React.ReactNode;
  /** Microcopy / body. */
  children?: React.ReactNode;
  /** Node pinned at the bottom (e.g. a link or Tag). */
  footer?: React.ReactNode;
  /** CSS padding. Default "28px". */
  padding?: string;
  /** Highlight the border on hover. Default false. */
  interactive?: boolean;
  /** Content alignment. Default "left". */
  align?: 'left' | 'center';
}

/** Rounded (16px) hairline-bordered card. Never uses a shadow. */
export function Card(props: CardProps): JSX.Element;
