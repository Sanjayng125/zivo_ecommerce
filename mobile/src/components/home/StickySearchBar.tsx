import { ColorsType } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useColors } from "@/hooks/useColors";
import { useStyles } from "@/hooks/useStyles";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function StickySearchBar() {
  const colors = useColors();
  const styles = useStyles(getStyles);

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityLabel="Search products"
        accessibilityRole="button"
        onPress={() => router.push("/(tabs)/explore")}
        style={({ pressed }) => [
          styles.searchButton,
          pressed && styles.pressed,
        ]}
      >
        <Ionicons
          name="search-outline"
          size={22}
          color={colors.btnSecondaryText}
        />
        <Text style={styles.searchText}>Search products</Text>
        <Ionicons name="options-outline" size={22} color={colors.text} />
      </Pressable>
    </View>
  );
}

const getStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: spacing.xl,
      paddingTop: spacing.md,
      paddingBottom: spacing.xl,
      backgroundColor: colors.primary,
      borderBottomLeftRadius: radius.xxl,
      borderBottomRightRadius: radius.xxl,
      position: "relative",
      marginBottom: spacing.xl,
    },
    searchButton: {
      minHeight: 50,
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: radius.xl,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    searchText: {
      flex: 1,
      color: colors.textSecondary,
      fontSize: typography.body.fontSize,
    },
    pressed: {
      opacity: 0.7,
    },
  });
