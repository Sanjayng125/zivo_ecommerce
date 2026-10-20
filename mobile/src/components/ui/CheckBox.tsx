import { ColorsType } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useColors } from "@/hooks/useColors";
import { useStyles } from "@/hooks/useStyles";
import { Feather } from "@expo/vector-icons";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function Checkbox({
  checked,
  onChange,
  label,
  disabled = false,
  style,
}: CheckboxProps) {
  const colors = useColors();
  const styles = useStyles(getStyles);

  return (
    <Pressable
      onPress={() => onChange(!checked)}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      style={({ pressed }) => [
        styles.container,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <View style={[styles.box, checked && styles.checkedBox]}>
        {checked && (
          <Feather name="check" size={15} color={colors.btnPrimaryText} />
        )}
      </View>

      {label && <Text style={styles.label}>{label}</Text>}
    </Pressable>
  );
}

const getStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      alignSelf: "flex-start",
    },
    box: {
      width: 24,
      height: 24,
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: radius.sm,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.surface,
    },
    checkedBox: {
      backgroundColor: colors.btnPrimaryBg,
    },
    label: {
      fontSize: typography.caption.fontSize,
      color: colors.text,
    },
    pressed: {
      opacity: 0.7,
    },
    disabled: {
      opacity: 0.45,
    },
  });
