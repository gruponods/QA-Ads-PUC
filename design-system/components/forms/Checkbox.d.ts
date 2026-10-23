import * as React from 'react';

export interface CheckboxProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'onChange'> {
  label?: React.ReactNode;
  /** Secondary line under the label. */
  description?: React.ReactNode;
  /** Controlled state. Omit to use defaultChecked. */
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
}

/** 20px rounded checkbox — blue fill with white check when on. */
export function Checkbox(props: CheckboxProps): JSX.Element;
