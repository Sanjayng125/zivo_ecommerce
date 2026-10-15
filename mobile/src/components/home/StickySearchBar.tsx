import { ColorsType } from "@/constants/colors";
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
          size={20}
          color={colors.btnSecondaryText}
        />
        <Text style={styles.searchText}>Search products</Text>
        <Ionicons name="options-outline" size={20} color={colors.text} />
      </Pressable>
    </View>
  );
}

const getStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 18,
      backgroundColor: colors.background,
    },
    searchButton: {
      minHeight: 50,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingHorizontal: 15,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    searchText: {
      flex: 1,
      color: colors.textSecondary,
      fontSize: 14,
    },
    pressed: {
      opacity: 0.7,
    },
  });
