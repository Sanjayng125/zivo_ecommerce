import { ColorsType } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useColors } from "@/hooks/useColors";
import { useStyles } from "@/hooks/useStyles";
import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface SettingsRowProps {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  value?: string;
  onPress?: () => void;
  destructive?: boolean;
  hideChevron?: boolean;
  right?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
}

export default function SettingsRow({
  label,
  icon,
  value,
  onPress,
  destructive = false,
  hideChevron = false,
  right,
  disabled = false,
  loading = false,
}: SettingsRowProps) {
  const colors = useColors();
  const styles = useStyles(getStyles);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      disabled={!onPress || disabled || loading}
    >
      {icon && (
        <View style={styles.iconContainer}>
          <Ionicons
            name={icon}
            size={20}
            color={destructive ? colors.error : colors.text}
          />
        </View>
      )}

      <Text
        style={[styles.label, destructive && { color: colors.error }]}
        numberOfLines={1}
      >
        {label}
      </Text>

      <View style={styles.right}>
        {right ? (
          right
        ) : value ? (
          <Text style={styles.value} numberOfLines={1}>
            {value}
          </Text>
        ) : null}
        {!hideChevron && onPress && !loading && (
          <Ionicons
            name="chevron-forward"
            size={18}
            color={colors.textSecondary}
          />
        )}
        {loading && (
          <ActivityIndicator size="small" color={colors.textSecondary} />
        )}
      </View>
    </Pressable>
  );
}

const getStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      backgroundColor: colors.surface,
      minHeight: 52,
    },
    pressed: {
      opacity: 0.7,
    },
    iconContainer: {
      width: 34,
      height: 34,
      borderRadius: radius.sm,
      backgroundColor: colors.badgeBg,
      alignItems: "center",
      justifyContent: "center",
    },
    label: {
      flex: 1,
      fontSize: typography.body.fontSize,
      fontWeight: typography.body.fontWeight,
      color: colors.text,
    },
    right: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
    },
    value: {
      fontSize: typography.caption.fontSize,
      color: colors.textSecondary,
      maxWidth: 140,
    },
  });
