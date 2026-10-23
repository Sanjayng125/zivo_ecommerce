import ShowDefaultAddress from "@/components/address/ShowDefaultAddress";
import CartItem from "@/components/cart/CartItem";
import { AppButton } from "@/components/ui/AppButton";
import HorizontalSeparator from "@/components/ui/HorizontalSeparator";
import { ColorsType } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useCart } from "@/hooks/useCart";
import { useColors } from "@/hooks/useColors";
import { useStyles } from "@/hooks/useStyles";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { CartItem as CartItemType } from "@/types";
import { formatPrice } from "@/utils";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Cart() {
  const { token } = useAuthStore();
  const { items, setItems } = useCart();

  const colors = useColors();
  const styles = useStyles(getStyles);

  const { data, isLoading, error, isRefetching, refetch } = useQuery<
    CartItemType[]
  >({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await authApi.get("/cart");

      return res.data?.cart_items ?? [];
    },
    enabled: !!token,
  });

  useEffect(() => {
    if (data) setItems(data ?? []);
  }, [data]);

  const handleRefresh = () => {
    if (token) refetch();
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]} edges={["top"]}>
        <ActivityIndicator size="large" color={colors.text} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, styles.center]} edges={["top"]}>
        <Text style={styles.errorText}>Couldn't load cart.</Text>
        <Pressable style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const subTotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const shipping = subTotal <= 50000 ? 4000 : 0;
  const total = subTotal + shipping;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {!token ? (
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
      ) : (
        items.length > 0 && (
          <View style={styles.actionContainer}>
            <ShowDefaultAddress />
          </View>
        )
      )}
      <FlatList
        data={items}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={handleRefresh} />
        }
        renderItem={({ item }) => <CartItem item={item} />}
        ItemSeparatorComponent={
          <HorizontalSeparator style={{ marginVertical: 0 }} />
        }
        ListEmptyComponent={
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
        }
        ListFooterComponent={
          items?.length > 0 ? (
            <View style={styles.footer}>
              <View style={styles.summaryContainer}>
                <Text style={styles.summaryTitle}>Order Summary</Text>
                <View style={styles.summarySection}>
                  <Text style={styles.summaryText}>Subtotal</Text>
                  <Text style={styles.summaryValue}>
                    {formatPrice(subTotal)}
                  </Text>
                </View>
                <View style={styles.summarySection}>
                  <Text style={styles.summaryText}>Shipping</Text>
                  <Text style={styles.summaryValue}>
                    {shipping > 0 ? formatPrice(shipping) : "Free"}
                  </Text>
                </View>
                <View style={styles.summarySection}>
                  <Text style={styles.summaryText}>Total</Text>
                  <Text style={styles.summaryValue}>{formatPrice(total)}</Text>
                </View>
              </View>
              <AppButton
                title="Checkout"
                onPress={() =>
                  router.push(token ? "/checkout/address" : "/(auth)/sign-in")
                }
                fullWidth
                style={{ marginTop: spacing.sm }}
              />
              <View style={styles.paymentGatewayContainer}>
                <Image
                  source={require("@/assets/images/razorpay-logo.png")}
                  style={styles.paymentGatewayImage}
                  resizeMode="contain"
                />
              </View>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const getStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    contentContainer: {
      flexGrow: 1,
      paddingBottom: spacing.lg,
    },
    center: {
      justifyContent: "center",
      alignItems: "center",
      gap: spacing.lg,
    },
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
    errorText: {
      fontSize: typography.body.fontSize,
      color: colors.error,
      textAlign: "center",
    },
    retryButton: {
      backgroundColor: colors.btnPrimaryBg,
      borderRadius: radius.sm,
      paddingHorizontal: spacing.xxl,
      paddingVertical: spacing.md,
    },
    retryButtonText: {
      color: colors.btnPrimaryText,
      fontSize: typography.body.fontSize,
      fontWeight: typography.heading.fontWeight,
    },
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
      marginVertical: spacing.xl,
    },
    signInText: {
      color: colors.textSecondary,
      fontSize: typography.body.fontSize,
      fontWeight: typography.heading.fontWeight,
    },
    footer: {
      flex: 1,
      marginTop: spacing.xl,
      justifyContent: "center",
      alignItems: "center",
      gap: spacing.sm,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      backgroundColor: colors.surface,
    },
    summaryContainer: {
      width: "100%",
      marginTop: spacing.xl,
      justifyContent: "space-between",
      gap: spacing.sm,
      backgroundColor: colors.background,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radius.sm,
    },
    summaryTitle: {
      color: colors.text,
      marginBottom: spacing.sm,
      fontSize: typography.heading.fontSize,
      fontWeight: typography.heading.fontWeight,
    },
    summarySection: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing.sm,
    },
    summaryText: {
      color: colors.text,
      fontSize: typography.body.fontSize,
      fontWeight: typography.heading.fontWeight,
    },
    summaryValue: {
      color: colors.textSecondary,
      fontSize: typography.body.fontSize,
      fontWeight: typography.heading.fontWeight,
    },
    paymentGatewayContainer: {
      width: "100%",
      alignItems: "center",
      marginVertical: spacing.xl,
    },
    paymentGatewayImage: {
      width: 140,
      height: 30,
      backgroundColor: "#FFFFFF",
    },
  });
