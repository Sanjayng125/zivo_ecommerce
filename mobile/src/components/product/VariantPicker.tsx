import { ColorsType } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useStyles } from "@/hooks/useStyles";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface VariantPickerProps {
  label: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  unavailable?: string[];
}

export default function VariantPicker({
  label,
  options,
  selected,
  onSelect,
  unavailable,
}: VariantPickerProps) {
  const styles = useStyles(getStyles);

  if (options.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}: {selected}
      </Text>

      <View style={styles.options}>
        {options.map((option) => {
          const isUnavailable = unavailable?.includes(option) ?? false;

          return (
            <Pressable
              key={option}
              style={[
                styles.option,
                selected === option && styles.bold,
                isUnavailable && styles.disabled,
              ]}
              onPress={() => onSelect(option)}
              disabled={isUnavailable}
            >
              <Text
                style={[
                  styles.optionText,
                  isUnavailable && styles.disabledText,
                ]}
              >
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const getStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      gap: spacing.sm,
      marginVertical: spacing.sm,
    },
    label: {
      color: colors.text,
      fontSize: typography.caption.fontSize,
      fontWeight: typography.heading.fontWeight,
    },
    selected: {
      color: colors.text,
      fontSize: typography.caption.fontSize,
      fontWeight: typography.heading.fontWeight,
    },
    options: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },
    option: {
      backgroundColor: colors.surface,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.sm,
      color: colors.textSecondary,
      fontSize: typography.caption.fontSize,
      fontWeight: typography.heading.fontWeight,
    },
    optionText: {
      color: colors.text,
    },
    bold: {
      borderColor: colors.text,
    },
    disabled: {
      opacity: 0.5,
    },
    disabledText: {
      color: colors.textSecondary,
      textDecorationLine: "line-through",
    },
  });
