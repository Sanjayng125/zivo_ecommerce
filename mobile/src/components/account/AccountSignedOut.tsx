import { ColorsType } from "@/constants/colors";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useColors } from "@/hooks/useColors";
import { useStyles } from "@/hooks/useStyles";
import { useThemeStore } from "@/store/uiStore";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Switch, Text, View } from "react-native";
import { AppButton } from "../ui/AppButton";
import SettingsRow from "./SettingsRow";

export default function AccountSignedOut() {
  const { toggleTheme, theme } = useThemeStore();
  const colors = useColors();
  const styles = useStyles(getStyles);

  const isDarkMode = theme === "dark";

  return (
    <View>
      <View style={styles.actionContainer}>
        <Text style={styles.signInText}>
          Looks like you're signed out. Please sign-in to continue.
        </Text>
        <MaterialIcons name="login" size={200} color={colors.textSecondary} />
        <AppButton
          title="Sign-In"
          onPress={() => router.push("/(auth)/sign-in")}
        />
      </View>

      <SettingsRow
        label="Dark Mode"
        icon="moon-outline"
        hideChevron
        right={<Switch value={isDarkMode} onValueChange={toggleTheme} />}
      />
    </View>
  );
}

const getStyles = (colors: ColorsType) =>
  StyleSheet.create({
    actionContainer: {
      alignItems: "center",
      gap: spacing.lg,
      marginVertical: spacing.xl,
    },
    signInText: {
      color: colors.textSecondary,
      fontSize: typography.body.fontSize,
      fontWeight: typography.heading.fontWeight,
      paddingHorizontal: spacing.lg,
    },
  });
