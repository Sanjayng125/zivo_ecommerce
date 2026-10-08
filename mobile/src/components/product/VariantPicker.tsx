import { ColorsType } from "@/constants/colors";
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
              <Text style={isUnavailable && styles.disabledText}>{option}</Text>
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
      gap: 8,
      marginVertical: 8,
    },
    label: {
      color: colors.text,
      fontSize: 14,
      fontWeight: "700",
    },
    selected: {
      color: colors.text,
      fontSize: 14,
      fontWeight: "700",
    },
    options: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    option: {
      backgroundColor: colors.surface,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 6,
      color: colors.textSecondary,
      fontSize: 14,
      fontWeight: "700",
    },
    bold: {
      color: colors.text,
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
