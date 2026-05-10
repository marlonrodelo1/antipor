import * as React from 'react';
import { icons, type LucideProps } from 'lucide-react-native';

export type IconName = keyof typeof icons;

interface Props extends Omit<LucideProps, 'name'> {
  name: IconName;
}

/**
 * Wrapper sobre lucide-react-native con stroke 1.5 por defecto.
 * Único punto de uso de iconos en la app — nada de emojis.
 */
export function Icon({ name, size = 24, strokeWidth = 1.5, color, ...rest }: Props) {
  const Cmp = icons[name];
  if (!Cmp) {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.warn(`[Icon] nombre desconocido: ${String(name)}`);
    }
    return null;
  }
  return <Cmp size={size} strokeWidth={strokeWidth} color={color} {...rest} />;
}
