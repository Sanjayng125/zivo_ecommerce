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
  TextStyle,
  ViewStyle,
} from "react-native";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "destructive"
  | "ghost";
type ButtonSize = "xs" | "sm" | "md" | "lg";

type ButtonProps = {
  title?: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
  leftIcon?: ReactNode;
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
  textStyle,
  accessibilityLabel,
  leftIcon,
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
    xs: styles.sizeXs,
    sm: styles.sizeSm,
    md: styles.sizeMd,
    lg: styles.sizeLg,
  };

  const sizeTextStyles: Record<ButtonSize, object> = {
    xs: styles.textXs,
    sm: styles.textSm,
    md: styles.textMd,
    lg: styles.textLg,
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
      accessibilityLabel={accessibilityLabel ?? title}
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
          {leftIcon && leftIcon}
          {title != null && (
            <Text
              style={[
                styles.textBase,
                textVariants[variant],
                sizeTextStyles[size],
                textStyle,
              ]}
            >
              {title}
            </Text>
          )}
          {rightIcon && rightIcon}
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
      gap: spacing.sm,
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
      flexDirection: "row",
      gap: spacing.sm,
    },
    sizeXs: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      gap: spacing.xs,
    },
    sizeSm: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      gap: spacing.xs,
    },
    sizeMd: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
    },
    sizeLg: {
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.lg,
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
    textBase: {
      fontWeight: typography.heading.fontWeight,
    },
    textXs: {
      fontSize: typography.small.fontSize,
    },
    textSm: {
      fontSize: typography.caption.fontSize,
    },
    textMd: {
      fontSize: typography.body.fontSize,
    },
    textLg: {
      fontSize: typography.heading.fontSize,
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
