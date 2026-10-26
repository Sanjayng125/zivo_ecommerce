import { ColorsType } from "@/constants/colors";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useColors } from "@/hooks/useColors";
import { useStyles } from "@/hooks/useStyles";
import { useWishlist } from "@/hooks/useWishlist";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { AppButton } from "../ui/AppButton";

export default function WishlistHeader() {
  const { data: wishlistItems } = useWishlist();

  const colors = useColors();
  const styles = useStyles(getStyles);

  return (
    <View style={styles.header}>
      <View style={styles.headerTitleContainer}>
        <AppButton
          leftIcon={
            <Ionicons
              name="arrow-back"
              size={24}
              color={colors.btnSecondaryText}
            />
          }
          onPress={() => router.back()}
          style={{ paddingHorizontal: 0, paddingVertical: 0 }}
          size="sm"
          variant="ghost"
        />
        <Text style={styles.headerTitle}>My Wishlist</Text>
      </View>
      {wishlistItems.length > 0 && (
        <Text style={styles.headerCount}>
          {wishlistItems.length} item{wishlistItems.length > 1 ? "s" : ""}
        </Text>
      )}
    </View>
  );
}

const getStyles = (colors: ColorsType) =>
  StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: spacing.lg,
    },
    headerTitleContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      marginLeft: spacing.sm,
    },
    headerTitle: {
      fontSize: typography.title.fontSize,
      fontWeight: typography.heading.fontWeight,
      color: colors.text,
    },
    headerCount: {
      fontSize: typography.body.fontSize,
      fontWeight: typography.body.fontWeight,
      color: colors.textSecondary,
    },
  });
