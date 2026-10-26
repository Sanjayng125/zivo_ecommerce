import { ColorsType } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useCart } from "@/hooks/useCart";
import { useColors } from "@/hooks/useColors";
import { useStyles } from "@/hooks/useStyles";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import ShowDefaultAddress from "../address/ShowDefaultAddress";

export default function Header() {
  const colors = useColors();
  const styles = useStyles(getStyles);

  const { cartCount } = useCart();

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.brand}>
          <Image
            accessibilityLabel="Zivo logo"
            source={require("@/assets/images/logo.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>Zivo</Text>
        </View>

        <Pressable
          accessibilityLabel={`Shopping cart, ${cartCount} items`}
          accessibilityRole="button"
          onPress={() => router.push("/(tabs)/cart")}
          style={({ pressed }) => [
            styles.cartButton,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons name="cart-outline" size={24} color={colors.text} />
          {cartCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {cartCount > 9 ? "9+" : cartCount}
              </Text>
            </View>
          )}
        </Pressable>
      </View>

      <ShowDefaultAddress />
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
      gap: spacing.lg,
    },
    topContainer: {
      flex: 1,
      gap: spacing.xl,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    brand: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      backgroundColor: colors.surface,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radius.lg,
    },
    logo: {
      width: 44,
      height: 44,
    },
    title: {
      color: colors.text,
      fontSize: typography.title.fontSize,
      fontWeight: typography.title.fontWeight,
    },
    cartButton: {
      width: 46,
      height: 46,
      borderRadius: radius.full,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    badge: {
      position: "absolute",
      top: -3,
      right: -4,
      minWidth: 20,
      height: 20,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: radius.full,
      backgroundColor: colors.btnSecondaryBg,
      borderWidth: 1,
      borderColor: colors.border,
    },
    badgeText: {
      color: colors.btnSecondaryText,
      fontSize: typography.caption.fontSize,
      fontWeight: typography.caption.fontWeight,
    },
    pressed: {
      opacity: 0.7,
    },
  });
