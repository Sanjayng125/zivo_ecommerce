import { ColorsType } from "@/constants/colors";
import { useColors } from "@/hooks/useColors";
import { useStyles } from "@/hooks/useStyles";
import { useState } from "react";
import { StyleSheet, TextInput, TextInputProps } from "react-native";

interface TextFieldProps extends TextInputProps {
  textArea?: boolean;
}

export default function TextField(props: TextFieldProps) {
  const colors = useColors();
  const [isFocused, setIsFocused] = useState(false);

  const styles = useStyles(getStyles);

  return (
    <TextInput
      {...props}
      style={[
        styles.input,
        isFocused && styles.inputFocused,
        props.style,
        props.textArea && styles.textArea,
      ]}
      multiline={props.textArea}
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
    textArea: {
      height: 100,
      textAlignVertical: "top",
    },
    inputFocused: {
      borderColor: colors.inputBorderFocused,
      backgroundColor: colors.background,
    },
  });
