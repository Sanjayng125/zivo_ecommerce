import { useColors } from "@/hooks/useColors";
import { StyleProp, View, ViewStyle } from "react-native";

interface HorizontalSeparatorProps {
  color?: string;
  height?: number;
  marginVertical?: number;
  style?: StyleProp<ViewStyle>;
}

export default function HorizontalSeparator({
  color,
  height = 1,
  marginVertical = 10,
  style,
}: HorizontalSeparatorProps) {
  const colors = useColors();

  return (
    <View
      style={[
        {
          backgroundColor: color ?? colors.border,
          height,
          marginVertical: marginVertical,
        },
        style,
      ]}
    />
  );
}
