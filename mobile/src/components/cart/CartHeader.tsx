import { ColorsType } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useCart } from "@/hooks/useCart";
import { useColors } from "@/hooks/useColors";
import { useStyles } from "@/hooks/useStyles";
import { ApiError, authApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { router } from "expo-router";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { toast } from "sonner-native";
import ShowDefaultAddress from "../address/ShowDefaultAddress";
import { AppButton } from "../ui/AppButton";
import HorizontalSeparator from "../ui/HorizontalSeparator";

export default function CartHeader() {
  const { token } = useAuthStore();
  const { items, clearCart } = useCart();
  const queryClient = useQueryClient();

  const colors = useColors();
  const styles = useStyles(getStyles);

  const { mutate: clearCartMutation, isPending: isClearingCart } = useMutation({
    mutationFn: async () => {
      const res = await authApi.delete("/cart");

      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message ?? "Cart cleared successfully");
      clearCart();
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (err: AxiosError<ApiError>) => {
      const message = err.response?.data?.message ?? "Something went wrong";
      toast.error(message);
    },
  });

  const handleClearCart = () => {
    Alert.alert("Clear Cart", "Are you sure you want to clear your cart?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Clear",
        onPress: () => {
          if (!token) {
            clearCart();
          } else {
            clearCartMutation();
          }
        },
        style: "destructive",
      },
    ]);
  };

  if (!token)
    return (
      <View style={styles.actionContainer}>
        <Text style={styles.signInText}>Sign in to continue shopping</Text>
        <TouchableOpacity
          onPress={() => router.push("/(auth)/sign-in")}
          activeOpacity={0.6}
        >
          <Text style={[styles.signInText, { color: colors.linkText }]}>
            Sign in
          </Text>
        </TouchableOpacity>
      </View>
    );

  if (items.length === 0) return null;

  return (
    <View>
      <View style={styles.actionContainer}>
        <ShowDefaultAddress />
      </View>
      <View style={styles.cartTopContainer}>
        <Text style={styles.itemCountText}>
          {`${items.length > 9 ? "9+" : items.length}`} item
          {`${items.length > 1 ? "s" : ""}`}
        </Text>
        <AppButton
          title="Clear Cart"
          onPress={handleClearCart}
          variant="ghost"
          style={{ paddingHorizontal: 0 }}
          textStyle={{ color: colors.warning }}
          loading={isClearingCart}
        />
      </View>
      <HorizontalSeparator
        backgroundColor={colors.surface}
        style={{ paddingHorizontal: spacing.md, paddingTop: 0 }}
      />
    </View>
  );
}

const getStyles = (colors: ColorsType) =>
  StyleSheet.create({
    actionContainer: {
      backgroundColor: colors.surface,
      borderRadius: radius.sm,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: spacing.xs,
      marginHorizontal: "auto",
      marginTop: spacing.md,
    },
    cartTopContainer: {
      marginTop: spacing.md,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: spacing.lg,
      backgroundColor: colors.surface,
    },
    signInText: {
      color: colors.textSecondary,
      fontSize: typography.body.fontSize,
      fontWeight: typography.heading.fontWeight,
    },
    itemCountText: {
      color: colors.textSecondary,
      fontSize: typography.body.fontSize,
      fontWeight: typography.heading.fontWeight,
    },
  });
