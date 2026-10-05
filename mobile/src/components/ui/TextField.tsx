import { ColorsType } from "@/constants/colors";
import { useColors } from "@/hooks/useColors";
import { useMemo, useState } from "react";
import { StyleSheet, TextInput, TextInputProps } from "react-native";

export default function TextField(props: TextInputProps) {
  const colors = useColors();
  const [isFocused, setIsFocused] = useState(false);

  const styles = useMemo(() => getStyles(colors), [colors]);

  return (
    <TextInput
      {...props}
      style={[styles.input, isFocused && styles.inputFocused, props.style]}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      placeholderTextColor={colors.inputPlaceholder}
    />
  );
}

const getStyles = (colors: ColorsType) =>
  StyleSheet.create({
    input: {
      height: 50,
      borderRadius: 10,
      backgroundColor: colors.surface,
      color: colors.inputText,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: colors.border,
      fontSize: 16,
    },
    inputFocused: {
      borderColor: colors.inputBorderFocused,
      backgroundColor: colors.background,
    },
  });
