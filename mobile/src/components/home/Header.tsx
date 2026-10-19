import { ColorsType } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useColors } from "@/hooks/useColors";
import { useStyles } from "@/hooks/useStyles";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { Address } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AddressListModal from "../address/AddressListModal";

export default function Header() {
  const { token } = useAuthStore();
  const [defaultAddress, setDefaultAddress] = useState<string | null>(null);
  const colors = useColors();
  const cartCount = useCartStore((state) => state.items.length);
  const styles = useStyles(getStyles);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState<boolean>(false);

  const { data: addresses } = useQuery({
    queryKey: ["address"],
    queryFn: async () => {
      const res = await authApi.get("/addresses");
      return res.data?.addresses ?? [];
    },
    enabled: !!token,
  });

  useEffect(() => {
    if (!addresses) return;

    const defaultAddress = addresses.find(
      (address: Address) => address.is_default,
    );
    if (!defaultAddress) return;

    const da = `${defaultAddress.line1}, ${defaultAddress.city}, ${defaultAddress.state}, ${defaultAddress.pincode}`;
    setDefaultAddress(da);
  }, [addresses]);

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

      <View style={styles.addressContainer}>
        {defaultAddress && (
          <Ionicons name="location" size={18} color={colors.text} />
        )}
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => setIsAddressModalOpen(true)}
        >
          <Text style={styles.addressText}>
            {defaultAddress ?? "Add a delivery address"}
          </Text>
        </TouchableOpacity>
      </View>
      <AddressListModal
        isOpen={isAddressModalOpen}
        onCloseModal={() => setIsAddressModalOpen(false)}
        addresses={addresses}
      />
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
    addressContainer: {
      backgroundColor: colors.surface,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: spacing.xs,
      marginRight: "auto",
      borderRadius: radius.sm,
    },
    addressText: {
      color: colors.textSecondary,
      fontSize: typography.caption.fontSize,
      fontWeight: typography.heading.fontWeight,
      textDecorationLine: "underline",
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
      backgroundColor: colors.btnPrimaryBg,
    },
    badgeText: {
      color: colors.btnPrimaryText,
      fontSize: typography.caption.fontSize,
      fontWeight: typography.caption.fontWeight,
    },
    pressed: {
      opacity: 0.7,
    },
  });
