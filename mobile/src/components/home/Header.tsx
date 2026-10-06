import { ColorsType } from "@/constants/colors";
import { useColors } from "@/hooks/useColors";
import { useCartStore } from "@/store/cartStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function Header() {
  const colors = useColors();
  const cartCount = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0),
  );
  const styles = useMemo(() => getStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
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
          <Ionicons name="cart-outline" size={23} color={colors.text} />
          {cartCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {cartCount > 99 ? "99+" : cartCount}
              </Text>
            </View>
          )}
        </Pressable>
      </View>

      <Pressable
        accessibilityLabel="Search products"
        accessibilityRole="button"
        onPress={() => router.push("/(tabs)/explore")}
        style={({ pressed }) => [
          styles.searchButton,
          pressed && styles.pressed,
        ]}
      >
        <Ionicons name="search-outline" size={20} color={colors.secondary} />
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
      gap: 18,
      backgroundColor: colors.background,
    },
    topRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    brand: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    logo: {
      width: 38,
      height: 38,
    },
    title: {
      color: colors.text,
      fontSize: 24,
      fontWeight: "700",
    },
    cartButton: {
      width: 46,
      height: 46,
      borderRadius: 23,
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
      minWidth: 18,
      height: 18,
      paddingHorizontal: 4,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 9,
      backgroundColor: colors.error,
    },
    badgeText: {
      color: "#FFFFFF",
      fontSize: 10,
      fontWeight: "700",
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
      color: colors.subtext,
      fontSize: 14,
    },
    pressed: {
      opacity: 0.7,
    },
  });
