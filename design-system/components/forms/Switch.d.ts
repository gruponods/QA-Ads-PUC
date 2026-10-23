import * as React from 'react';

export interface SwitchProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'onChange'> {
  /** Optional label to the right of the track. */
  label?: React.ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
}

/** On/off toggle — 40×24 pill track, blue when on, flat white knob. */
export function Switch(props: SwitchProps): JSX.Element;
