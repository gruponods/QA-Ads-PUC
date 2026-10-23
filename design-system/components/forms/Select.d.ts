import * as React from 'react';

export interface SelectOption { value: string; label: string; }

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  hint?: string;
  error?: string;
  /** Options as strings or { value, label }. */
  options: (SelectOption | string)[];
  /** Adds an empty first option with this text. */
  placeholder?: string;
  /** sm 36px · md 44px · lg 52px. Default md. */
  size?: 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
}

/** Native select styled to match Input (hairline, 12px radius, chevron). */
export function Select(props: SelectProps): JSX.Element;
