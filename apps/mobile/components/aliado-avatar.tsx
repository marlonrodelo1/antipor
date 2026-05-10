import * as React from 'react';
import { View } from 'react-native';
import Svg, {
  Defs,
  RadialGradient,
  Stop,
  Path,
  Circle,
} from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';

const AnimatedView = Animated.createAnimatedComponent(View);

export type AliadoState = 'reposo' | 'escuchando' | 'hablando';
export type AliadoTone = 'cool' | 'warm';

interface Props {
  size?: number;
  state?: AliadoState;
  tone?: AliadoTone;
}

/**
 * Avatar de Aliado. Forma orgánica abstracta tipo gota / hoja.
 * NUNCA una cara humana — decisión de diseño no negociable.
 *
 * 3 estados:
 *  - reposo: respiración lenta (escala suave).
 *  - escuchando: pulso atento (más rápido).
 *  - hablando: oscilación + halo activo.
 */
export function AliadoAvatar({ size = 96, state = 'reposo', tone = 'warm' }: Props) {
  const scale = useSharedValue(1);
  const halo = useSharedValue(0.6);

  React.useEffect(() => {
    const cfg = (() => {
      switch (state) {
        case 'escuchando':
          return { duration: 2200, peak: 1.06, halo: 0.85 };
        case 'hablando':
          return { duration: 700, peak: 1.04, halo: 1.0 };
        case 'reposo':
        default:
          return { duration: 4000, peak: 1.03, halo: 0.7 };
      }
    })();

    scale.value = withRepeat(
      withSequence(
        withTiming(cfg.peak, { duration: cfg.duration / 2, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: cfg.duration / 2, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
    halo.value = withRepeat(
      withSequence(
        withTiming(cfg.halo, { duration: cfg.duration / 2 }),
        withTiming(cfg.halo * 0.7, { duration: cfg.duration / 2 })
      ),
      -1,
      true
    );
  }, [state, scale, halo]);

  const bodyStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const haloStyle = useAnimatedStyle(() => ({ opacity: halo.value }));

  const palette =
    tone === 'warm'
      ? { a: '#F2D7B0', b: '#D97757', halo: 'rgba(217,119,87,0.25)' }
      : { a: '#A8C5E5', b: '#3B6EA8', halo: 'rgba(59,110,168,0.22)' };

  const w = size;
  const h = size;

  return (
    <View style={{ width: w, height: h, alignItems: 'center', justifyContent: 'center' }}>
      <AnimatedView
        style={[
          {
            position: 'absolute',
            width: w * 1.4,
            height: h * 1.4,
            borderRadius: w,
            backgroundColor: palette.halo,
          },
          haloStyle,
        ]}
      />
      <AnimatedView style={bodyStyle}>
        <Svg width={w} height={h} viewBox="0 0 100 100">
          <Defs>
            <RadialGradient id="grad" cx="35%" cy="30%" r="80%">
              <Stop offset="0%" stopColor={palette.a} />
              <Stop offset="100%" stopColor={palette.b} />
            </RadialGradient>
          </Defs>
          {/* Forma de gota / hoja, asimétrica, sin rasgos humanos */}
          <Path
            d="M50 8 C72 12 86 30 86 52 C86 74 70 92 50 92 C30 92 14 74 14 52 C14 32 28 14 50 8 Z"
            fill="url(#grad)"
          />
          {/* Highlight orgánico */}
          <Circle cx="38" cy="34" r="10" fill="rgba(255,255,255,0.35)" />
        </Svg>
      </AnimatedView>
    </View>
  );
}
