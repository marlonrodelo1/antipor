import * as React from 'react';
import { View } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

interface Props {
  days: number;
  size?: number;
}

/**
 * Planta orgánica que crece con el streak. SIN número grande.
 * El crecimiento es la métrica visible.
 *
 * Etapas (por días):
 *  0     → tierra + brote diminuto
 *  1-3   → tallito
 *  4-7   → 1 hoja
 *  8-14  → 2 hojas
 *  15-29 → planta completa
 *  30+   → planta + flor (acento ámbar)
 */
export function StreakPlant({ days, size = 180 }: Props) {
  const stage = computeStage(days);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'flex-end' }}>
      <Svg width={size} height={size} viewBox="0 0 200 200">
        <Defs>
          <LinearGradient id="leaf" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#9DC0A6" />
            <Stop offset="1" stopColor="#7BA888" />
          </LinearGradient>
          <LinearGradient id="soil" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#A88A6F" />
            <Stop offset="1" stopColor="#7A604A" />
          </LinearGradient>
        </Defs>

        {/* tierra */}
        <Path d="M40 178 Q100 168 160 178 L160 192 Q100 196 40 192 Z" fill="url(#soil)" opacity={0.85} />

        {stage >= 1 && (
          // tallo base
          <Path
            d={`M100 178 Q98 ${178 - 22 * stageHeight(stage)} 100 ${178 - 30 * stageHeight(stage)}`}
            stroke="#7BA888"
            strokeWidth={3}
            strokeLinecap="round"
            fill="none"
          />
        )}

        {stage >= 2 && (
          // hoja izquierda
          <Path
            d="M100 142 Q70 130 62 110 Q86 110 100 132 Z"
            fill="url(#leaf)"
          />
        )}

        {stage >= 3 && (
          // hoja derecha
          <Path
            d="M100 130 Q132 120 142 96 Q116 100 100 122 Z"
            fill="url(#leaf)"
          />
        )}

        {stage >= 4 && (
          // brote superior
          <>
            <Path
              d={`M100 ${178 - 30 * stageHeight(stage)} Q98 ${178 - 50 * stageHeight(stage)} 100 ${178 - 60 * stageHeight(stage)}`}
              stroke="#7BA888"
              strokeWidth={3}
              strokeLinecap="round"
              fill="none"
            />
            <Path
              d="M100 102 Q86 92 88 78 Q102 84 100 100 Z"
              fill="url(#leaf)"
            />
          </>
        )}

        {stage >= 5 && (
          // flor (acento ámbar / cálido)
          <>
            <Circle cx="100" cy="74" r="10" fill="#E8B96A" />
            <Circle cx="100" cy="74" r="4" fill="#D97757" />
          </>
        )}

        {stage === 0 && (
          // brote diminuto
          <Circle cx="100" cy="174" r="3" fill="#7BA888" />
        )}
      </Svg>
    </View>
  );
}

function computeStage(days: number): 0 | 1 | 2 | 3 | 4 | 5 {
  if (days <= 0) return 0;
  if (days <= 3) return 1;
  if (days <= 7) return 2;
  if (days <= 14) return 3;
  if (days <= 29) return 4;
  return 5;
}

function stageHeight(stage: number): number {
  // 0..1 — escala vertical relativa de la planta
  return Math.min(1, 0.4 + stage * 0.15);
}
