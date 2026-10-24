import { spacing } from "@/constants/spacing";
import { useColors } from "@/hooks/useColors";
import { StyleProp, View, ViewStyle } from "react-native";

interface HorizontalSeparatorProps {
  color?: string;
  backgroundColor?: string;
  height?: number;
  style?: StyleProp<ViewStyle>;
}

export default function HorizontalSeparator({
  color,
  backgroundColor = "transparent",
  height = 1,
  style,
}: HorizontalSeparatorProps) {
  const colors = useColors();

  return (
    <View
      style={[
        {
          backgroundColor: backgroundColor,
          paddingVertical: spacing.md,
        },
        style,
      ]}
    >
      <View
        style={{
          backgroundColor: color ?? colors.border,
          height,
        }}
      />
    </View>
  );
}
