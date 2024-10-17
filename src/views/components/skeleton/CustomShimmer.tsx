import React from 'react';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder'
import { LinearGradient } from 'expo-linear-gradient';


type CustomShimmerProps = {
  width?: number;
  height?: number;
  shimmerColors?: string[];
  style?: object;
  borderRadius?: number;
  isCircle?: boolean;
  visible?: boolean;
};

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

export default function CustomShimmer ({
  width = 100,
  height = 100,
  shimmerColors = ['#ebebeb', '#D9D9D9', '#ebebeb'],
  style,
  borderRadius = 10,
  isCircle = false,
}:CustomShimmerProps) {
  return (
    <ShimmerPlaceholder
      shimmerColors={shimmerColors}
      width={width}
      height={height}
      style={[
        { borderRadius: isCircle ? width / 2 : borderRadius },
        style,
      ]}
      />
  );
};
