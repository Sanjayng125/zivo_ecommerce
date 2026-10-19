import { ColorsType } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useColors } from "@/hooks/useColors";
import { useStyles } from "@/hooks/useStyles";
import { ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "destructive"
  | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  rightIcon?: ReactNode;
};

export function AppButton({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = "primary",
  size = "md",
  fullWidth = false,
  style,
  rightIcon,
}: ButtonProps) {
  const colors = useColors();
  const styles = useStyles(getStyles);

  const buttonVariants: Record<ButtonVariant, object[]> = {
    primary: [styles.base],
    secondary: [styles.base, styles.secondary],
    outline: [styles.base, styles.outline],
    destructive: [styles.base, styles.destructive],
    ghost: [styles.ghost],
  };

  const textVariants: Record<ButtonVariant, object> = {
    primary: styles.textPrimary,
    secondary: styles.textSecondary,
    outline: styles.textOutline,
    destructive: styles.textPrimary,
    ghost: styles.textGhost,
  };

  const sizeStyles: Record<ButtonSize, object> = {
    sm: styles.sizeSm,
    md: styles.sizeMd,
    lg: styles.sizeLg,
  };

  const spinnerColor =
    variant === "primary" || variant === "destructive"
      ? colors.btnPrimaryText
      : colors.text;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      style={({ pressed }) => [
        ...buttonVariants[variant],
        sizeStyles[size],
        fullWidth && styles.fullWidth,
        pressed && styles.pressed,
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={spinnerColor} />
      ) : (
        <>
          <Text style={[styles.text, textVariants[variant]]}>{title}</Text>
          {rightIcon && <View>{rightIcon}</View>}
        </>
      )}
    </Pressable>
  );
}

const getStyles = (colors: ColorsType) =>
  StyleSheet.create({
    base: {
      alignItems: "center",
      justifyContent: "center",
      borderRadius: radius.md,
      backgroundColor: colors.btnPrimaryBg,
      flexDirection: "row",
    },
    secondary: {
      backgroundColor: colors.btnSecondaryBg,
    },
    outline: {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: colors.btnPrimaryBg,
    },
    destructive: {
      backgroundColor: colors.error,
    },
    ghost: {
      backgroundColor: "transparent",
      alignItems: "center",
      justifyContent: "center",
    },
    sizeSm: {
      minHeight: 38,
      paddingHorizontal: spacing.md,
    },
    sizeMd: {
      minHeight: 46,
      paddingHorizontal: spacing.lg,
    },
    sizeLg: {
      minHeight: 52,
      paddingHorizontal: spacing.xl,
    },
    fullWidth: {
      width: "100%",
    },
    pressed: {
      opacity: 0.85,
    },
    disabled: {
      opacity: 0.5,
    },
    text: {
      fontSize: spacing.lg,
      fontWeight: typography.heading.fontWeight,
    },
    textPrimary: {
      color: colors.btnPrimaryText,
    },
    textSecondary: {
      color: colors.btnSecondaryText,
    },
    textOutline: {
      color: colors.btnPrimaryBg,
    },
    textGhost: {
      color: colors.text,
    },
  });
