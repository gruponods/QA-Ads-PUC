import * as React from 'react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  /** Helper text under the field. */
  hint?: string;
  /** Error message — turns the border muted red and replaces the hint. */
  error?: string;
  /** Leading Tabler icon name (e.g. "search", "mail"). */
  icon?: string;
  /** sm 36px · md 44px · lg 52px. Default md. */
  size?: 'sm' | 'md' | 'lg';
  /** Style for the outer wrapper (use for width). */
  style?: React.CSSProperties;
  /** Style for the inner <input>. */
  inputStyle?: React.CSSProperties;
}

/** Text field: 12px radius, hairline border, blue border on focus (no ring, no shadow). */
export function Input(props: InputProps): JSX.Element;
