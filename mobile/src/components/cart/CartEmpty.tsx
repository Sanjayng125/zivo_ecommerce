import { ColorsType } from "@/constants/colors";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useColors } from "@/hooks/useColors";
import { useStyles } from "@/hooks/useStyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { AppButton } from "../ui/AppButton";

export default function CartEmpty() {
  const colors = useColors();
  const styles = useStyles(getStyles);

  return (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons
        name="cart-arrow-down"
        size={200}
        color={colors.textSecondary}
      />
      <Text style={styles.emptyText}>Your cart is empty</Text>
      <Text style={styles.emptyText}>
        Explore products and add items to checkout
      </Text>
      <AppButton title="Explore" onPress={() => router.push("/(tabs)")} />
    </View>
  );
}

const getStyles = (colors: ColorsType) =>
  StyleSheet.create({
    emptyContainer: {
      flexGrow: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.md,
      marginTop: spacing.xl,
    },
    emptyText: {
      fontSize: typography.body.fontSize,
      fontWeight: typography.heading.fontWeight,
      color: colors.textSecondary,
      textAlign: "center",
    },
  });
