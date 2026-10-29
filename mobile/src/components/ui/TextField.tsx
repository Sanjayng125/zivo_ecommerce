import { ColorsType } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useColors } from "@/hooks/useColors";
import { useStyles } from "@/hooks/useStyles";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";
import { AppButton } from "./AppButton";

interface TextFieldProps extends TextInputProps {
  textArea?: boolean;
}

export default function TextField(props: TextFieldProps) {
  const colors = useColors();
  const [isFocused, setIsFocused] = useState(false);
  const [secureText, setSecureText] = useState(props?.secureTextEntry ?? false);

  const styles = useStyles(getStyles);

  return (
    <View style={styles.container}>
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
        secureTextEntry={secureText}
        autoCapitalize={
          props.autoCapitalize || (props.secureTextEntry ? "none" : undefined)
        }
      />
      {props?.secureTextEntry && (
        <AppButton
          leftIcon={
            <Ionicons
              name={secureText ? "eye-off-outline" : "eye-outline"}
              size={22}
              color={colors.text}
            />
          }
          onPress={() => setSecureText(!secureText)}
          size="sm"
          variant="ghost"
          style={styles.secureTextButton}
        />
      )}
    </View>
  );
}

const getStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      position: "relative",
      flex: 1,
    },
    input: {
      borderRadius: radius.sm,
      backgroundColor: colors.surface,
      color: colors.inputText,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      fontSize: typography.body.fontSize,
    },
    textArea: {
      height: 100,
      textAlignVertical: "top",
    },
    inputFocused: {
      borderColor: colors.inputBorderFocused,
      backgroundColor: colors.background,
    },
    secureTextButton: {
      position: "absolute",
      top: 0,
      bottom: 0,
      right: 0,
      paddingVertical: 0,
      paddingRight: spacing.md,
      justifyContent: "center",
    },
  });
