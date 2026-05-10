import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

type Phase = 'inhala' | 'mantén' | 'exhala';

interface Props {
  size?: number;
  /** Patrón 4-7-8 por defecto (ACT / Andrew Weil). */
  inhaleSec?: number;
  holdSec?: number;
  exhaleSec?: number;
  onPhase?: (p: Phase) => void;
  running?: boolean;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export function BreathingCircle({
  size = 240,
  inhaleSec = 4,
  holdSec = 7,
  exhaleSec = 8,
  onPhase,
  running = true,
}: Props) {
  const scale = useSharedValue(0.7);
  const opacity = useSharedValue(0.7);
  const [phase, setPhase] = React.useState<Phase>('inhala');

  const setPhaseSafe = React.useCallback(
    (p: Phase) => {
      setPhase(p);
      onPhase?.(p);
    },
    [onPhase]
  );

  React.useEffect(() => {
    if (!running) return;
    let cancelled = false;

    const cycle = () => {
      if (cancelled) return;
      runOnJS(setPhaseSafe)('inhala');
      scale.value = withTiming(
        1,
        { duration: inhaleSec * 1000, easing: Easing.inOut(Easing.quad) },
        () => {
          if (cancelled) return;
          runOnJS(setPhaseSafe)('mantén');
          scale.value = withTiming(
            1,
            { duration: holdSec * 1000, easing: Easing.linear },
            () => {
              if (cancelled) return;
              runOnJS(setPhaseSafe)('exhala');
              scale.value = withTiming(
                0.7,
                { duration: exhaleSec * 1000, easing: Easing.inOut(Easing.quad) },
                () => {
                  if (!cancelled) runOnJS(cycle)();
                }
              );
            }
          );
        }
      );
      opacity.value = withTiming(1, { duration: inhaleSec * 1000 });
    };
    cycle();
    return () => {
      cancelled = true;
    };
  }, [running, inhaleSec, holdSec, exhaleSec, scale, opacity, setPhaseSafe]);

  const innerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            borderRadius: size / 2,
            backgroundColor: 'rgba(217,119,87,0.10)',
          },
        ]}
      />
      <AnimatedView
        style={[
          {
            width: size * 0.7,
            height: size * 0.7,
            borderRadius: (size * 0.7) / 2,
            backgroundColor: '#D97757',
            alignItems: 'center',
            justifyContent: 'center',
          },
          innerStyle,
        ]}
      >
        <Text
          style={{
            color: 'rgba(255,255,255,0.95)',
            fontSize: 14,
            letterSpacing: 0.6,
          }}
        >
          {phase}
        </Text>
      </AnimatedView>
    </View>
  );
}
