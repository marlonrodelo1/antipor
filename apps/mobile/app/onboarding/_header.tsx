import * as React from 'react';
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Icon } from '../../components/icon';

interface Props {
  step: number;
  total?: number;
}

export function OBHeader({ step, total = 7 }: Props) {
  return (
    <View className="flex-row items-center gap-4 px-5 pt-2">
      <Pressable
        onPress={() => router.back()}
        className="h-9 w-9 items-center justify-center rounded-full border border-hairline bg-surface"
      >
        <Icon name="ChevronLeft" size={18} color="#3F4854" />
      </Pressable>
      <View className="h-1 flex-1 overflow-hidden rounded-full bg-hairline">
        <View
          className="h-full rounded-full bg-primary"
          style={{ width: `${(step / total) * 100}%` }}
        />
      </View>
      <Text className="min-w-[36px] text-xs tabular-nums text-ink-3">
        {step}/{total}
      </Text>
    </View>
  );
}
