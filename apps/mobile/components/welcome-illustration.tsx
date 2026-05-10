import * as React from 'react';
import Svg, { Path, Circle, Line, G } from 'react-native-svg';

interface Props {
  size?: number;
  primary?: string;
  secondary?: string;
  accent?: string;
}

/**
 * Ilustracion minimalista de acompanamiento: un faro con rayos suaves
 * y olas calmas debajo. Simboliza guia, esperanza y calma.
 *
 * Trazo fino (1.5), no figurativo, paleta del producto.
 * Sin animaciones para que se sienta sereno.
 */
export function WelcomeIllustration({
  size = 220,
  primary = '#3B6EA8',
  secondary = '#7BA888',
  accent = '#E8B96A',
}: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200" fill="none">
      {/* Rayos de luz (suaves, dispersos) */}
      <G opacity="0.55">
        <Line
          x1="100"
          y1="18"
          x2="100"
          y2="36"
          stroke={primary}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <Line
          x1="62"
          y1="48"
          x2="76"
          y2="58"
          stroke={primary}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <Line
          x1="138"
          y1="48"
          x2="124"
          y2="58"
          stroke={primary}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <Line
          x1="36"
          y1="75"
          x2="54"
          y2="75"
          stroke={primary}
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.7"
        />
        <Line
          x1="164"
          y1="75"
          x2="146"
          y2="75"
          stroke={primary}
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.7"
        />
      </G>

      {/* Linterna (donde vive la luz) */}
      <Path
        d="M88 60 L88 80 Q88 88 95 88 L105 88 Q112 88 112 80 L112 60 Q112 52 105 52 L95 52 Q88 52 88 60 Z"
        stroke={primary}
        strokeWidth="1.5"
        fill="none"
        strokeLinejoin="round"
      />
      <Circle cx="100" cy="70" r="4.5" fill={accent} />

      {/* Cornisa */}
      <Path
        d="M84 88 L116 88"
        stroke={primary}
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Torre del faro */}
      <Path
        d="M86 90 L82 145 L118 145 L114 90 Z"
        stroke={primary}
        strokeWidth="1.5"
        fill="none"
        strokeLinejoin="round"
      />
      <Line
        x1="84"
        y1="108"
        x2="116"
        y2="108"
        stroke={primary}
        strokeWidth="1"
        opacity="0.4"
      />
      <Line
        x1="83"
        y1="127"
        x2="117"
        y2="127"
        stroke={primary}
        strokeWidth="1"
        opacity="0.4"
      />

      {/* Base / pequena isla */}
      <Path
        d="M70 152 Q100 146 130 152 L130 162 L70 162 Z"
        stroke={primary}
        strokeWidth="1.5"
        fill="none"
        strokeLinejoin="round"
      />

      {/* Olas (calma, no tormenta) */}
      <Path
        d="M22 174 Q42 168 62 174 T102 174 T142 174 T182 174"
        stroke={secondary}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.75"
      />
      <Path
        d="M30 187 Q52 181 74 187 T118 187 T162 187 T188 187"
        stroke={secondary}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
    </Svg>
  );
}
